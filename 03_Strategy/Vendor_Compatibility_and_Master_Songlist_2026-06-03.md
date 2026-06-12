# Vendor Compatibility Scoring + Master Song List — Design Lock (2026-06-03)

> Owner-locked 2026-06-03. Extends [Vendor_Match_Personalization_2026-06-01.md](Vendor_Match_Personalization_2026-06-01.md) (the 3-layer hard-filter / preference-sort / expand model) by making **Layer B numeric** — a real compatibility **score**, with the music signal powered by a **vendor-built master song list**. Owning iterations: 0006 (vendors) · 0044/0045 (per-category schemas + product catalogs) · 0016/0021 (onboarding + couple dashboard) · 0023 (admin).

## The concept (owner's words)

> *"the bands/singers/orchestra will place the songs they have. and that will be compiled as our master song list."*
> *"we check which band/orchestra has those [the couple's chosen songs] on their songlist. finding them will just put them as a higher compatibility but we will never limit the other vendors. we will still promote them but for the other services with below 90% compatibility, we will already notify that these are the next best options."*

So: vendors contribute the songs they perform → those compile into **one shared master catalogue** → the couple picks from the same catalogue → **compatibility = how much of the couple's list a vendor actually plays.** Matches float up; nobody is hidden; below the threshold is labeled **"next best options."**

## Why this is new (status before this lock)

There is **no compatibility score today.** Vendor ranking = a filter + 3-key sort (`ad_rank → review_count → avg_rating_overall`) in `fetchWizardVendorRecommendations` (`apps/web/lib/wizard-recommendations.ts`). What exists:

- **Reviews** — fully built (5-axis capture, `vendor_review_stats` matview) but only the **overall mean + count** feed ranking (the 4 sub-axes are unused).
- **Binary ceremony/venue fit** — `computeCompatibilityIssue` (iteration 0043) is a yes/no type-fit gate + an optional `?match=` marketplace toggle. Not a score.
- **`event_vendor_preferences`** — foundation table with **zero matcher-readers**; onboarding style prefs go to a display-only `events.style_preferences` blob (Phase A2 deferred).
- **`music_playlist_seed`** (the onboarding top-100 picker) — **display-only**; never reaches matching.
- **Vendor song data** — only counts/genres (`song_catalog_count`, `repertoire_size`, `repertoire_genres`, `accepts_song_requests`). **No song titles anywhere** → song-overlap is impossible until the master list exists.

So "we built compatibility with the reviews" is **half-true**: reviews + a reputation sort shipped; the preference-driven *score* the owner is picturing was scaffolded (empty tables + a design doc) and never activated.

## 1 · The master song list subsystem

| Piece | What it is |
|---|---|
| **Master catalogue** | One canonical record per song (`title` + `artist`), **deduped** on a normalized key (`lower(trim(title)) + '|' + lower(trim(artist))`). The shared vocabulary that makes overlap computable. |
| **Compiled from vendors** | A band/singer/orchestra/DJ adds the songs they perform in their dashboard "Your repertoire" surface. New songs **join the master** (after dedup); existing songs **link** to the master record. |
| **Seed** | The catalogue is **seeded from the existing curated `MUSIC100`** (top-100 Filipino-wedding songs, `apps/web/.../onboarding-shell.tsx`) so day-one matching + the couple picker aren't empty. Vendors grow it from there. |
| **Couple picks reference the master** | The onboarding music picker's selectable songs are a **curated top-50 slice of the master** (flagged `is_curated_pick`, no-scroll); picks store **master song IDs**, and a couple's free-typed song dedups into the master too. So couple-picks and vendor-repertoire share identity. |
| **Hygiene** | Auto-compile with dedup on add, **plus a light admin "merge duplicates / remove junk" tool** (0023) — vendor-typed entries will collide ("Perfect" / "Perfect - Ed Sheeran"). |

**Note — no conflict with the owned-AI-music rule.** That rule governs **Setnayan-rendered video** (we can't be the direct infringer). A vendor's *live-performance repertoire* (a band playing covers at the reception) is a different thing — real song titles are correct here.

### Data model (new)

```
songs(song_id PK, title, artist, normalized_key UNIQUE, source{seed|vendor|couple|admin},
      is_curated_pick bool, genre_tags text[]?, created_at)             -- RLS: public read; insert via flow
vendor_songs(vendor_profile_id, song_id, PK(vendor_profile_id, song_id)) -- RLS: vendor manages own; public read
event_song_picks(event_id, song_id, source, PK(event_id, song_id))       -- couple's wanted songs (from onboarding + later edits)
```

Existing `events.music_playlist_seed` (display string[]) is superseded by `event_song_picks` (id-referenced) for matching; the picker writes both during transition. RLS at `CREATE TABLE` time per the canonical patterns.

## 2 · The compatibility score

A per-couple × per-vendor score **0–100%** — it **sorts and labels, never excludes.**

- **Hard-fit (gate, not %):** serves region · available on date · fits pax capacity · ceremony/venue-type compatible. *(Already exists as filters / `computeCompatibilityIssue`.)* A hard-fit **fail** doesn't hide a vendor — it caps them into **"Next best / Expand,"** with the reason shown ("may not be free on your date").
- **Preference match (the weighted core):**
  - **Music vendors** (`live_band · choir · orchestra · wedding_singer · dj · soloist_musician`): **song overlap** = `|couple picks ∩ vendor repertoire| / |couple picks|`. The headline signal.
  - **Other categories:** style-facet overlap — cuisine · photo-video look · mood/feel/aesthetic · dietary/religion — between `event_vendor_preferences` (couple) and the vendor's facet tags (`vendor_service_attributes` / 0044 facets).
- **Reputation:** review mean + count, **now including the 4 unused sub-axes** (communication / quality / value / on-time), normalized.

**Honesty rule (owner principle — no fabrication):** the compatibility **%** is *fit + reputation only*. **Paid boost / favorites / Setnayan-first sort WITHIN a band but never inflate the %** — a vendor can't buy a fake "94% match."

**Default weights (owner-tunable):** preference-match **60%** · reputation **30%** · hard-fit bonus **10%**. *(Owner to confirm/tune — no weights are load-bearing until signed off.)*

**Threshold (owner-tunable, default 90%):**
- **≥ 90% → "Best matches for your wedding"**
- **< 90% → "Next best options"** (shown, labeled, never hidden)

Single source of truth: extend `fetchWizardVendorRecommendations` to **emit the score + the top match reasons**, so every surface (onboarding find-vendor, `/vendors` marketplace, the Plan+Budget accordion, Setnayan AI picks) inherits it.

## 3 · Card rendering (replaces fabricated social-proof)

The prototype's *"👀 3 couples also eyeing Dec 18"* is **fabricated FOMO** (hardcoded demo) — it violates the no-fabrication rule that already drove the congrats screen to real counts. **Replace that card slot with the real compatibility cue:**

- **Best match (≥90%):** `Best match · serves your garden setting · plays 8 of your 10 songs` — the actual reasons. This also subsumes the dropped find-vendor merchandising (the "In your range" badge + "Matches: X" chips are the same reasons).
- **Next best (<90%):** `Next best · in your budget · garden-ready` — honest about why it's slightly off.

**Real demand can come later, but only when true** — once shortlist/inquiry counts exist, a card may honestly say *"★ 2 couples shortlisted them for December."* Never fabricated.

## 4 · The data dependency (why the score "lights up" gradually)

Vendor facet tags + song lists are **near-empty in production today** (the reason Phase A2 was deferred). The score is correct from day one but only **visibly differentiates as vendors carry data** — the demo-vendor seeding work (2026-06-03 PRs) is what begins filling it. Graceful-degrade: a vendor with no repertoire/facets still appears (reputation + hard-fit only), never blocked.

## 5 · Build sequence (PRs)

1. **Foundation schema** — `songs` + `vendor_songs` + `event_song_picks` (+ RLS + seed from `MUSIC100`). *(owner pushes the migration)*
2. **Vendor "Your repertoire" capture** — music-category vendors search/add songs (dedup into master). Backfills `song_catalog_count`.
3. **Couple picker → master** — onboarding music picker references master song IDs; writes `event_song_picks`; "add more" searches the full master.
4. **Compatibility score** — in `fetchWizardVendorRecommendations`: song overlap + style facets + reputation → 0–100% + top reasons. Boost sorts within band.
5. **90% split + card rendering** — "Best matches / Next best options" grouping + the compatibility cue on cards (onboarding find-vendor + marketplace). Retires the fabricated social-proof.
6. **Admin dedup/merge tool** (0023) — merge near-duplicate songs, remove junk.

## 6 · Owner-set knobs (not invented — confirm before they go load-bearing)

- The **threshold** (default 90%).
- The **signal weights** (default 60/30/10).
- Whether the onboarding picker stays a **curated top-50** or opens the full master immediately.
- Whether **non-music** style-facet matching ships in this pass or follows once 0044 vendor facets are populated.

## Cross-references

- [Vendor_Match_Personalization_2026-06-01.md](Vendor_Match_Personalization_2026-06-01.md) — the 3-layer model this makes numeric.
- `apps/web/lib/wizard-recommendations.ts` — the single ranking source of truth to extend.
- `supabase/migrations/20260522030000_iteration_0044_music_category_rich_schemas.sql` — the music schema (counts/genres today; the song-list field is the gap this fills; the "tag ≥20 songs … see 0045 product catalog" hint points here).
- `supabase/migrations/20260721000000_event_vendor_preferences.sql` — the scaffolded couple-pref table to finally wire as a score reader.
- Onboarding `MUSIC100` + `music_playlist_seed` — the seed + the couple-side picks.
- Reviews: `supabase/migrations/20260514100000_vendor_reviews.sql` + `vendor_review_stats` matview — the reputation factor (now using all 5 axes).

---

## 7 · Master Menu List + Food Planner — the catering parallel (owner-locked 2026-06-03)

> Owner: *"food planner is like the songlists but for caterers."* The §1–§3 master-song-list → couple-picks → overlap-score machinery is **reused verbatim for food.** Caterers contribute the dishes they cook → one shared **master menu catalogue** → the couple's **Food Planner** picks the dishes + dietary needs they want → catering compatibility = **menu overlap.** Same rules: matches float up, nobody is hidden, below-threshold = "next best options."

### 7.1 · The subsystem (mirrors §1)

| Piece | Food version |
|---|---|
| **Master catalogue** | One canonical record per dish (`name` + optional `cuisine`), deduped on a normalized key — the shared vocabulary that makes menu overlap computable. |
| **Compiled from vendors** | A caterer / food-stall / mobile-bar vendor adds the dishes they serve in their dashboard "Your menu" surface. New dishes join the master (after dedup); existing dishes link. |
| **Seed** | Seeded from a curated PH-wedding-staples list (lechon · kare-kare · pancit · adobo · …) so day-one matching + the couple picker aren't empty. |
| **Couple picks reference the master** | The Food Planner's selectable dishes are a curated slice of the master; picks store master dish IDs; a couple's free-typed dish dedups into the master too. |
| **Dietary layer** | The Food Planner also carries the couple's **dietary / allergy / halal** needs — reusing the faith pre-locks from onboarding (Muslim → halal · INC → alcohol-free). These are **hard-fit facets**, not overlap %. |

### 7.2 · Data model (new · mirrors §1)

```
dishes(dish_id PK, name, cuisine?, normalized_key UNIQUE, source{seed|vendor|couple|admin},
       is_curated_pick bool, diet_tags text[]?, created_at)              -- RLS: public read; insert via flow
vendor_dishes(vendor_profile_id, dish_id, PK(vendor_profile_id, dish_id))  -- RLS: vendor manages own; public read
event_dish_picks(event_id, dish_id, source, PK(event_id, dish_id))        -- couple's wanted dishes (Food Planner)
```

### 7.3 · Compatibility (extends §2)

For catering categories (`catering · food_stall · mobile_bar · cake_desserts` where applicable), the **preference-match core** = `|couple dish picks ∩ vendor menu| / |couple dish picks|` — the food analogue of song overlap. Dietary/halal mismatches are a **hard-fit cap** (→ "next best," reason shown: *"doesn't offer halal"*), never a hidden vendor. Reputation + boost-within-band rules unchanged. Same single source of truth (`fetchWizardVendorRecommendations`).

### 7.4 · The two couple-facing **free** tools (savings-model names)

The couple-side pickers that feed this score are the named **free** planning tools in [Time_and_Money_Saved_Model_2026-06-01.md](Time_and_Money_Saved_Model_2026-06-01.md) §H:

| Free tool | Writes | Hands to | Savings value |
|---|---|---|---|
| **Songlist Maker** | `event_song_picks` | DJ / band / choir | ₱999 · 3h |
| **Food Planner** | `event_dish_picks` | caterer | ₱999 · 4h |

Both are *preference sheets* — the couple builds each once, every matched vendor reads the same structured list (no re-explaining over chat). Free; the vendor-side paid **Professional Catering** constraint-solver and any AI menu tooling stay separate.

### 7.5 · Build sequence (mirrors §5)

Same 6 PR-steps as the song subsystem, parameterized by `(songs↔dishes · vendor_songs↔vendor_dishes · event_song_picks↔event_dish_picks)` — schema, picker, overlap score, 90% split, admin dedup/merge tool are all the same shapes. Ship food **after** songs proves the pattern (owner: songs first).
