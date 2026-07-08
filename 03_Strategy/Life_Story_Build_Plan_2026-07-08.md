# Life Story — Build Plan (Phase 1 · own-events · ship-live)

> Execution plan for the "living memorial of your celebrations."
> Dated 2026-07-08 · siblings: `Life_Story_Strategy_2026-07-08.md` (the why) · `People_Graph_and_Lifelong_Identity_2026-07-04.md` (the spine).
> Status: **PR-0 (schema) MERGED — #2888.** Lanes 1–5 below are the remaining build.

---

## 0. Locked context (do not re-litigate)

| Lock | Decision |
|---|---|
| Framing | **Alive, never death** (owner-locked 2026-07-08: *"make it while they're alive"*). No countdowns, no deathbed copy, ends pointing forward. |
| Phase-1 scope | **Own events only** (host/couple-member events). The perspective-shift lives **within one event** (many cameras at one wedding). Cross-event = Phase 1.5, counsel-gated, untouched. |
| Schema | `people.in_memoriam` + `papic_photos.captured_by_person_id` (+ backfill) — **shipped, #2888**. `pinned_at` deferred to v1.1 (pin weight = 0 until then). |
| Placement | Dedicated route `/dashboard/life-story` + "Play your Life Story" card on account home + Memories Hub link. |
| Ethics | Opt-in ✦ only, never a surprise; author-about-never-impersonate; no grief monetization; no face-derived attribution. |
| Naming | This feature = **Life Story** (`lib/life-story-*`). The existing counsel-gated `person_story_items` surface keeps its "Your Story" name and stays flag-off — no collision. |

**Rollout flag:** ship everything behind a NEW env flag `NEXT_PUBLIC_LIFE_STORY` (default off; helper `lifeStoryEnabled()` in `lib/life-story-flag.ts`). Distinct from the counsel-gated `NEXT_PUBLIC_PERSON_LIFE_STORIES` — this one is a *rollout* switch the owner flips after preview QA, not a legal gate. Lets every lane merge continuously to `main` with zero user exposure.

---

## 1. Architecture — one engine, three renderings

```
                    ┌─ lib/life-story-significance.ts   (pure · tested · tunable)
 Supabase (RLS) ──► │  lib/life-story-moment-graph.ts   (server aggregation · cached per request)
                    └─ lib/life-story-beats.ts          (pure beat compiler · tested)
                                   │
             ┌─────────────────────┼──────────────────────┐
        Scroll reel           The flash              [Phase 2: the film]
   (client island, lazy)  (GSAP timeline island)   (Remotion/FFmpeg — seam only)
```

Server components fetch + score; client islands only animate. Signed R2 URLs are minted **only for surfaced media** (flash ≤ 12 items; reel paginated), never for the whole graph.

### Data contracts (`lib/life-story-types.ts`)

```ts
type MomentPerson = { personId: string; displayName: string; inMemoriam: boolean; recurrence: number };
type CapturedBy   = { kind: 'self' | 'papic_seat' | 'guest'; personId: string | null; displayName: string | null };
type Moment = {
  id: string;                              // source row id
  eventId: string; eventName: string; eventType: string; eventDate: string;
  media: { sourceTable: 'papic_photos' | 'papic_guest_captures'; sourceId: string;
           type: 'photo' | 'clip'; r2Key: string };   // signed lazily, downstream
  capturedAt: string;
  capturedBy: CapturedBy;
  peoplePresent: MomentPerson[];           // from photo_tags → guests → people
  coverage: number;                        // distinct capturers in this moment's ±window
  clusterId: string | null;                // burst-dedup (same capturer, ≤20s)
};
type ScoredMoment = Moment & { significance: number };
type MomentGraph  = { moments: ScoredMoment[]; people: MomentPerson[]; events: {...}[] };
```

---

## 2. Lane map — 5 PRs after the merged schema

```
PR-0 schema ✅ #2888
   ├─ PR-1  lib: significance + beat compiler + tests        (pure — no DB, no UI)   ─┐
   ├─ PR-2  lib: moment-graph builder + fixtures + flag      (DB reads, RLS client)  ─┤ parallel
   │                                                                                  │
   ├─ PR-3  UI: scroll reel + route + home entry + ✦ opt-in  (needs PR-2)            ─┐
   ├─ PR-4  UI: the flash (GSAP)                             (needs PR-1 + PR-2)     ─┤ parallel
   └─ PR-5  instrumentation + perf/a11y audit + flag flip    (needs PR-3 + PR-4)
```

Each PR: own worktree off `origin/main`, `changelog.d/` fragment, `gh pr merge --auto --merge`, typecheck + `test:unit` green before opening. PR-1 and PR-2 start **now** in parallel; PR-3 and PR-4 in parallel after their deps merge.

---

## 3. PR-1 — the significance engine + beat compiler (pure logic)

**Files:** `lib/life-story-significance.ts`, `lib/life-story-beats.ts`, `lib/life-story-types.ts`, `+ .test.ts` each (node:test via `pnpm test:unit`).

### `scoreMoment(m, ctx, W = DEFAULT_WEIGHTS): number` — weights as named consts

| Signal | Weight | Research anchor |
|---|---|---|
| `memoriam` — any ✦ person present | **.28** | Held-beat design; dominant by intent |
| `recurrence` — mean cross-event recurrence of people present (÷6 cap) | **.24** | "Who kept showing up" — relational memory |
| `people` — count present (÷8 cap) | **.18** | Social salience |
| `eventType` — kasal 1.0 · binyag .86 · debut .82 · anniversary .6 · … | **.16** | Cultural life script / reminiscence bump |
| `coverage` — distinct capturers (÷5 cap) | **.08** | Multi-perspective richness |
| `pin` — reserved, returns 0 in v1 | **.06** | User agency (v1.1 column) |
| `bump` — **bounded +.05 bonus** when user `birth_date` known AND age-at-event ∈ [10,30] | bonus | Reminiscence bump + golden-20s (degrades silently when birth date absent) |

Deterministic (stable tie-break on `capturedAt` then `id`), pure, no `Date.now()`. Every weight exported for tuning; tests pin the *ordering behavior*, not exact floats.

### `compileBeats(graph, opts): Beat[]` — the flash's script, as a pure function

Ordered output, **≤ 8 beats total** (bounded-arc evidence, strategy §1):
1. `face_open` — highest-recurrence person (partner→parent→top-recurrence fallback per relationship data availability; v1 = top recurrence).
2. 3–5 × `moment` — top-scored, burst-deduped, ≥2 distinct events represented when available.
3. `perspective` — highest-scored moment where `capturedBy.personId` ≠ user and ≠ null ("this is how {name} saw that day"). Omitted gracefully if only one camera exists.
4. `memoriam_hold` — top-scored ✦ moment, **only if** an `in_memoriam` person appears in the graph (the flag itself is the opt-in). Longest dwell. Omitted otherwise — never synthesized.
5. `present_forward` — always last: newest moment + "keep giving it days worth remembering" → CTA into event creation. **Never omitted.**

**Test matrix (node:test):** ordering determinism · memoriam dominance and omission-when-unflagged · perspective beat requires ≥2 capturers · ≤8 beats at any graph size · ends on `present_forward` always · empty/1-moment graphs degrade to a valid short arc · bump bonus applies only in-window and only with birth date.

---

## 4. PR-2 — the MomentGraph builder + fixtures + flag

**Files:** `lib/life-story-flag.ts`, `lib/life-story-moment-graph.ts` (+ `.test.ts` for the pure transforms), `lib/life-story-fixtures.ts`.

**Query plan** (RLS `createClient`, all reads within existing policies — the user is couple/member on their own events):
1. `event_members` → user's event ids (+ `events` meta: name, type, date, hero URL).
2. `papic_photos` (visible, `hidden_at IS NULL`) + `papic_guest_captures` for those events.
3. `photo_tags` for those media → `guests` → `people` (name, `in_memoriam`) = people-present.
4. capturedBy: `papic_photos.captured_by_person_id` (1 hop, from #2888); guest captures via `guest_id → guests.person_id` (already 1 hop, no schema needed).
5. Pure transforms (unit-tested): burst-clustering (same capturer ≤20s → one moment, best frame kept), recurrence map (person → distinct-event count), coverage windows (±90s distinct capturers), then `scoreMoment` over the lot.

**Caching:** wrap in React `cache()` per request; the route segment sets `revalidate = 300`. Phase-1 volumes (one user's own events) don't justify a materialized table — leave a comment-seam for `person_story_items`-backed assembly at Phase 1.5.

**Sparse-data dignity:** an event with zero captures contributes one low-weight "chapter card" moment from `events.landing_page_hero_image_url` when present — a 1-event user with no Papic still gets a non-empty, non-sad experience.

**Fixtures:** `lifeStoryFixtureGraph(events: number)` mirroring the prototype's cast — dev/preview only (`NODE_ENV !== 'production'` + `?fixtures=1`), never in prod paths.

---

## 5. PR-3 — scroll reel, route, home entry, ✦ opt-in

**Files:** `app/dashboard/(account)/life-story/page.tsx` (server), `_components/life-story/scroll-reel.tsx` + `reel-tile.tsx` (client), home-card patch in account `page.tsx`, Memories-Hub link, `people` page: "Remembered ✦" toggle + server action (`markPersonInMemoriam` — only for people the user created/claimed, per existing `people` RLS; confirm dialog with feather-quiet copy, fully reversible).

- Default order **by significance**, toggle **by time**; weight-bar on each tile; capturedBy chip (⌾ your phone / ◐ {name}); ✦ flag on memoriam tiles.
- Media: `loading="lazy"`, paginated 24/page, signed URLs batched per page; clips reuse the `living-moments.tsx` playback registry (≤3 concurrent, 1 audible).
- **Single-event-redirect caveat:** the home card only renders on the account hub, which 1-event couples bypass — so PR-3 also adds the Life Story entry to the Memories Hub (`/dashboard/library`), reachable by everyone. (Adding an in-event entry point is a v1.1 call for the owner.)
- Whole surface renders only when `lifeStoryEnabled()`.

## 6. PR-4 — the flash

**Files:** `_components/life-story/flash.tsx`, `use-flash-timeline.ts`, `flash.css` (feature-scoped dark "Night" palette — the app's paper tokens stay untouched).

- Consumes `compileBeats()` output; GSAP timeline via the repo's `useGSAP` pattern; **cross-dissolves + eased Ken Burns only — no strobe, no high-frequency luminance change** (photosensitive-safety, non-negotiable).
- Dwell ∝ significance (2.6s floor → 6s memoriam hold); progress hairline; beat badges ("Through someone else's eyes", "The ones we hold").
- **Safety contract (each item is a test/QA checkbox):** `prefers-reduced-motion` → static contact-sheet with the same beats + a one-line why; any pointer/key input cancels instantly; explicit Stop button; Escape stops; keyboard operable start-to-end; focus visible; chrome recedes but Stop never hides; media preloads exactly one beat ahead; no layout shift mid-play.
- Ends on `present_forward` → routes to event creation. Copy never names death.

## 7. PR-5 — instrumentation, perf, flip

- PostHog (existing 0035 stack, no PII — ids only): `life_story_flash_started/completed/cancelled`, `life_story_perspective_beat_viewed`, `life_story_reel_order_toggled`, `life_story_memoriam_marked`. These are strategy §9's metrics (flash completion, perspective reach, ✦ adoption).
- Perf audit: route LCP < 2.5s on preview, flash steady-state ≤ 1 decoded video + 2 images in memory, Lighthouse budget respected (CI already enforces).
- A11y/safety audit against §6's checklist; then owner QA on Vercel preview with fixtures → owner sets `NEXT_PUBLIC_LIFE_STORY=1` in Vercel → live.

---

## 8. Definition of done (Phase 1)

- [ ] All 5 PRs merged; `test:unit` covers significance + beats + graph transforms
- [ ] Flash: opens on a face → weighted moments → perspective beat → (opt-in ✦ hold) → ends forward; ≤8 beats
- [ ] Safety contract fully checked (reduced-motion, cancel, stop, keyboard, no-strobe)
- [ ] Works at 1 event (sparse dignity) and 12 events (perf) via fixtures
- [ ] Real-data path proven on preview with an internal account
- [ ] Zero surfaces reachable with flag off; counsel-gated `person_story_items` untouched
- [ ] Changelog fragments per PR; STATUS refresh after flag flip (own commit)

## 9. Risks → mitigations

| Risk | Mitigation |
|---|---|
| Thin capturedBy on old media (unclaimed seats → NULL) | Chip degrades to "a Papic camera"; perspective beat requires a *named* non-self capturer, else gracefully omitted |
| Empty graphs feel like a rebuke | Sparse-dignity chapter cards + welcome copy pointing to Papic |
| GSAP timeline jank on low-end phones | Dissolve-only fallback below `deviceMemory < 4`; preload discipline; test on throttled preview |
| Scope creep into cross-event | Hard rule: Phase 1 reads only `event_members`-scoped events; any `person_story_items` read is a PR-blocker |
| ✦ misuse (marking living people) | Reversible, self-scoped (only people you created/claimed), quiet copy, no public surface |

## 10. Explicit non-goals (Phase 1)

Cross-event assembly (1.5, counsel) · the exportable film + music (2) · shared/couple reels · pins UI (v1.1) · minors/guardian flows · any AI voice or persona of any person.
