# Onboarding · "Your Dream Team" Chapter — Porting Spec

**Date:** 2026-06-08
**Author:** Claude (architect pass)
**Status:** Implementation-ready spec. NO app code written yet.
**Blast radius:** HIGH — this chapter feeds vendor-matching (`getOnboardingVendorCounts` / `sendTopInquiries`), the reception-venue `find` search, and the one-shot DB commit (`commitOnboardingWedding`). Any regression in the `picks` / `prefs` model silently corrupts what is written to `events.style_preferences` + `event_vendors`.

## 0. Sources of truth

| Side | File | Key anchors |
|---|---|---|
| Prototype (design) | `Onboarding_Wedding_Adaptive_Flow_2026-06-07.html` | `buildSequence()` @ L2097 · `ALL` catalog @ L2082 · `state` seed @ L2026-2040 · refine engine @ L2290-2310 + L4087-4140 · `BASIC` @ L3728 · `EXTRAS_TAXONOMY` @ L3745 · `REFINEMENTS` @ L3964 · `aiAnswer` @ L3720 · `togglePick` @ L3914 · `pickRType` @ L3607 · `buildVenues` @ L3616 · `ceremonyVenueOptions` @ L3950 |
| Production (target) | `apps/web/app/onboarding/wedding/_components/onboarding-shell.tsx` | `FLOW_IDS` @ L92 · `buildSequence` @ L97 · `NEXT_LABEL_BY_ID` @ L108 · `CAN_SKIP_BY_ID` @ L123 · `PICK_GROUPS` @ L280 · `PICK_INFO` @ L292 · `prefQueueFrom` @ L351 · `StyleSubStepper` @ L514 · `go()` @ L1638 · `find` effect @ L1679 · match effect @ L1710 · `pickChip` @ L1740 · `patchPrefs` @ L1869 · `toggleShortlist` @ L1876 · `buildCommitPayload` @ L2417 · `picker` render @ L3393 · `prefs` render @ L3428 · `find` render @ L3507 |
| Types | `apps/web/app/onboarding/wedding/types.ts` | `OnboardingState` @ L51 · `picks` @ L140 · `prefs` @ L156 · `OnboardingPrefs` @ L316 · `EMPTY_ONBOARDING_STATE` @ L363 · `FLOW_TOTAL` @ L344 |
| Commit | `apps/web/app/onboarding/wedding/actions.ts` | `OnboardingCommitPayload` @ L217 · `commitOnboardingWedding` @ L309 · `style_preferences` insert @ L428-437 · shortlist → `event_vendors` @ L518-557 · `CATEGORY_MAP` @ L174 |

**Source-of-truth rule (per `CLAUDE.md` 2026-06-07):** the shipped code in the worktree wins over the prototype where they conflict. The prototype is the **design intent**; production's `find`+commit contract is the **safety contract**. Where the prototype invents a richer model (`basicPicks`/`enhancePicks`/`refinements`/`ai`), this spec defines a BRIDGE that preserves the production contract byte-for-byte.

---

## 1. The mental model — what the chapter is, both sides

The "Your Dream Team" chapter is the stretch of onboarding where the couple says **which services they want** and **what kind of each**, gated behind an **AI offer**. It directly determines:
- `state.picks` → `events.style_preferences.interested_categories` (L435 actions) → drives `getOnboardingVendorCounts` (L1713) + the recommended in-app services seed (`recommendedInappFor`, L1731).
- `state.prefs.*` → `events.style_preferences` blob (L428-437) + `events.music_playlist_seed` + `events.mood_feel_key` + the `find` reception search (`receptionSettings: state.prefs.reception`, L1689).
- `state.shortlist` → `event_vendors` 'considering' (L518-557 actions).

### Prototype model (richer)
| Concept | Prototype field | Meaning |
|---|---|---|
| AI gate answer | `state.ai` (`null`/`true`/`false`) | If `true`, the picks+refine screens show. If `false`, jump straight to Stage 4 offer. |
| Basic services | `state.basicPicks: string[]` | The 4 must-haves: `ceremony_venue`, `catering`, `coordinator`, `photo_video` (`BASIC` @ L3728). |
| Extra services | `state.enhancePicks: string[]` | The full 10-parent → ~53-leaf taxonomy MINUS the 4 basics (`EXTRAS_TAXONOMY` @ L3745, flattened to `ENHANCE` @ L3814). |
| Per-leaf refinements | `state.refinements: Record<leafKey, string[]>` | "What kind of X?" multi-select per picked leaf that has a `REFINEMENTS` entry (@ L3964). |
| Reception setting | `state.receptionTypes: string[]` | `s1type` photo-cards (`pickRType` @ L3607). Drives `buildVenues` hero photo only. |
| Reception shortlist | `state.shortlistVenues: string[]` | `s1search` tapped venue names (demo data). |

### Production model (live contract)
| Concept | Production field | Meaning |
|---|---|---|
| (no AI gate) | — | Every couple sees `picker` → `prefs` → `find` unconditionally. |
| All picks (basic+extra merged) | `state.picks: string[]` | One flat array of category keys from `PICK_GROUPS` (@ L280). Includes `reception`, `ceremony`, `coordinator`, `catering`, `photo_video` AND all extras in ONE list. |
| Per-dimension style | `state.prefs: OnboardingPrefs` (@ L316) | 10 typed fields: `reception[]`, `ceremony`, `cuisine[]`, `serviceStyle`, `dietary[]`, `pvLook[]`, `pvNeed`, `pvIncluded[]`, `music[]`, `feel`. Driven by `StyleSubStepper` over a fixed 6-dim `prefQueueFrom` queue (reception/ceremony/catering/photo_video/music/palette). |
| Reception shortlist | `state.shortlist: ShortlistVenue[]` | Real marketplace venues (`{vendorId, name}`). |

**Key structural difference:** production has ONE `picks` array + a FIXED 6-dimension prefs sub-stepper. The prototype splits picks into TWO buckets (basics + extras), gates them behind `ai`, and runs TWO per-leaf refine passes whose options come from a per-leaf `REFINEMENTS` map (~40 leaves, not 6 fixed dimensions). The prototype's refine model is a strict SUPERSET of production's prefs model.

---

## 2. Screen-by-screen map

Notation: **NEW id** = the production `FLOW_IDS` string id to add. "Replaces/augments" names the existing production screen it sits relative to. Prototype `data-stage` is design-only; production uses `data-stage` for the chrome progress bar.

| # | Prototype screen | NEW prod id | Replaces / augments | Markup intent | State reads | State writes | CTA label | Skippable |
|---|---|---|---|---|---|---|---|---|
| 1 | `s1edu` (L1636) | `team_intro` | NEW — inserted after `budget`, before today's `picker` | Education slide: "reception is home base, everything matched to who can reach it." Pure copy, no inputs. | — | — | `Continue` | No |
| 2 | `s1type` (L1649) | `reception_setting` | **Replaces** the `reception` dimension currently inside `StyleSubStepper` (`prefs.reception`) — promotes it to a standalone photo-card screen | 6 photo-cards (ballroom/garden/beach/rustic/rooftop/heritage), multi-select. **Maps to production `RECEPTION_SETTINGS` keys** (`setting_ballroom`…), NOT the prototype's bare `ballroom`/`garden` slugs. | `state.prefs.reception` | `state.prefs.reception` (multi) | `Continue` | No (drives `find` + `venue_setting`) |
| 3 | `s1search` (L1668) | `find` | **Is** today's `find` (L3507) — reuses it verbatim | Real reception-venue search, tap to shortlist, BYO sheet, "hidden — can't host you" note. ALREADY SHIPPED. | `state.prefs.reception`, kind/faith/region/pax/date | `state.shortlist`, `state.byoVendors` | `Continue` | Yes (existing) |
| 4 | `s1payoff` (L1684) | `team_payoff` | NEW — inserted after `find`, before the AI gate | Stats payoff: "out of N venues we found you M / hours saved / on shortlist." Factual counts derived from `venues` + `shortlist`. NO login (owner stripped it 2026-06-07). | `venues.length`, `state.shortlist.length` | — | `Continue` | No |
| 5 | `aigate` (L1704) | `aigate` | NEW — inserted after `team_payoff` | The AI offer. Proof line tied to the couple's own payoff. Two in-screen CTAs ("Yes — match the rest" / "No thanks"). `data-nocta` (own button row, no chrome Continue). | payoff counts | `state.ai` (true/false) | (in-screen) | No (gate) |
| 6 | `s2pick` (L1727) | `team_basics` | NEW — only when `state.ai===true` | Pax-style: maximized hero photo of focused service (top) + 4 basic services as a multi-select carousel (bottom). The 4 basics. | `state.picks` (basics subset) | `state.picks` (adds basics) | `Continue` | No when shown |
| 7 | `refine_basic` (L1749) | `refine_basic` | NEW — only when `state.ai===true`, re-entered N times | Uniform refine sub-stepper over the picked basics that have a `REFINEMENTS` entry. "X of N · {service}" + photo-card multi-select. | `state.picks`, `state.refinements` | `state.refinements[leaf]` | `Next service` / `Continue` | Yes (passes through if queue empty) |
| 8 | `s3pick` (L1769) | `team_extras` | NEW — only when `state.ai===true` | Expandable parent→tiles browser of the FULL taxonomy minus the 4 basics. Tap a parent to expand its tile carousel; multi-select tiles. | `state.picks` (extras subset) | `state.picks` (adds extras) | `Continue` | Yes |
| 9 | `refine` (L1784) | `refine_extras` | NEW — only when `state.ai===true`, re-entered N times | Same uniform refine sub-stepper, over the CHOSEN extras that have a `REFINEMENTS` entry. | `state.picks`, `state.refinements` | `state.refinements[leaf]` | `Next service` / `Continue` | Yes |

**Screens NOT in this chapter (downstream, unchanged):** `s4ai`/`s4bundle`/`s4boost`/`s5paywall` in the prototype map onto production's existing `plan`/`services`/`services_summary` — OUT OF SCOPE for this port. This spec stops at `refine_extras` and feeds the existing `plan` screen.

**Screens RETIRED from production by this port:**
- The `picker` screen (L3393) — its single flat photo-card grid is replaced by the `team_basics` + `team_extras` two-screen split (basics carousel + expandable extras browser). `pickChip` (L1740) is reused unchanged; only the rendering surface changes.
- The `reception` dimension inside `StyleSubStepper` (L568-575) is promoted to the standalone `reception_setting` screen (#2 above). The `StyleSubStepper` itself is **fully retired** (see §6 risk R4 + §5 PR-3) — its remaining dimensions (ceremony/catering/photo_video/music/palette) are subsumed by the per-leaf `refine_*` passes once the bridge maps refinements → `prefs`.

---

## 3. The data-model BRIDGE (safety-critical)

> The single rule that keeps the live flow alive: **`state.picks`, `state.prefs`, `state.shortlist`, and the entire `buildCommitPayload` contract (L2417) MUST keep their current shape and meaning.** New fields are ADDITIVE. The commit (`actions.ts`) and the `find` search read ONLY the existing fields; the new fields are persisted in an additive JSONB slot.

### 3.1 `state.picks` ← derived union of basics + extras
The prototype's two buckets collapse back into ONE `picks` array. Two options:

- **Option A (recommended) — keep `state.picks` as the single source of truth; drop the two-bucket split.** The `team_basics` carousel and `team_extras` browser both call the EXISTING `pickChip(cat)` (L1740) which toggles `state.picks`. "Basics" vs "extras" becomes a RENDER-TIME partition, not a state split:
  ```ts
  const BASIC_CATS = ['ceremony','catering','coordinator','photo_video'] as const;
  // team_basics renders BASIC_CATS; team_extras renders every PICK_GROUPS leaf NOT in BASIC_CATS
  // (and not 'reception' — that's captured on reception_setting). picks stays flat.
  ```
  **Why A:** zero new pick state, `getOnboardingVendorCounts` (L1713) + `recommendedInappFor` (L1731) + `interested_categories` (L435) all keep reading `state.picks` untouched. The two-screen UX is purely a presentation re-skin of the existing flat model.

- **Option B (rejected) — add `basicPicks`/`enhancePicks` and derive `picks = unique([...basicPicks, ...enhancePicks])` in `buildCommitPayload`.** Adds two redundant arrays + a derive step + a resume-migration. More surface for drift. Only choose B if the refine-queue ordering MUST distinguish bucket membership (it does not — see §4).

> ⚠ **Category-key reconciliation (load-bearing — surface to owner).** The prototype's `BASIC` keys are `ceremony_venue` / `photo_video` (L3728); production's `PICK_GROUPS` keys are `ceremony` / `photo_video` (L281, L286) — and production has BOTH `reception` and `ceremony` as separate picks (L281), plus a `coordinator` (L282). The prototype folds reception into the venue flow (`s1search`) and lists `ceremony_venue` as a basic. **The port MUST use production's keys** (`ceremony`, `photo_video`, `coordinator`, `catering`) so `CATEGORY_MAP` (actions L174: `reception→reception_venue`, `ceremony→ceremony_venue`) and the auto-inquire loop keep resolving. The prototype's `ceremony_venue` key is renamed to `ceremony` on the way in.

### 3.2 `state.refinements` ← NEW additive field (the only new pick-state)
The per-leaf "what kind?" answers have NO home in today's `OnboardingPrefs` (which is a fixed 10-key interface, L316). Add ONE additive field:

```ts
// types.ts — OnboardingState, after `prefs` (L156)
/**
 * Per-leaf refinement picks (the "what kind of {service}?" passes · Dream Team chapter).
 * leafKey → selected option labels (multi). leafKey is a PICK_GROUPS category key
 * ('ceremony','catering','live_band',…). Additive: the commit folds this into
 * events.style_preferences.refinements (JSONB) for DISPLAY + future vendor-match;
 * the bridge ALSO projects the 5 production-known leaves back onto prefs (§3.3) so
 * the find search + recap keep working unchanged. Empty default = no refinements.
 */
refinements: Record<string, string[]>;
```
`EMPTY_ONBOARDING_STATE.refinements = {}` (types.ts L363 block).

### 3.3 BRIDGE projection: `refinements` → `prefs` (keeps `find` + recap + commit alive)
Five prototype refine leaves map 1:1 onto existing `OnboardingPrefs` fields. The commit + `find` + the congrats recap read `prefs`, NOT `refinements`, so the port MUST project these back. Define ONE pure projector, applied in `patchRefine` (the new toggle handler) AND idempotently in `buildCommitPayload`:

| Prototype refine leaf (`REFINEMENTS` key) | Options example | Projects onto `prefs` field | Mapping note |
|---|---|---|---|
| `ceremony_venue` (→ `ceremony` key) | Church/Garden/Beach/Civil (faith-adaptive, `ceremonyVenueOptions` L3950) | `prefs.ceremony` (single) | Prototype labels → production `ceremony_*` keys via `ceremonyOptsFor` (L397). Single-pick: take last. |
| `catering` | Filipino/Spanish/Italian/Asian/… (L3978) | `prefs.cuisine` (multi) | Label → `cuisine_*` key via `CUISINE_OPTS` (L409). Halal/Vegetarian → also push `prefs.dietary` (`halal`). |
| `photo_video` | True-to-color/Light & airy/Cinematic/Editorial (L3986) | `prefs.pvLook` (multi) | Label → `pv_*` key via `PV_LOOKS` (L411). |
| (music leaves: `live_band`/`dj`/`choir`/`wedding_singer`/`performers`) | genre/repertoire options | `prefs.music` is the SONG seed, NOT genre — **do NOT project music genre onto `prefs.music`** | Keep music-genre refinements in `refinements` only; `prefs.music` stays the Song Bank picks (L334, `syncEventSongPicks` L501). Surface to owner: prototype has no Song Bank step; the SongBankStep stays a SEPARATE concern (see §6 R6). |
| (palette/feel) | — | `prefs.feel` | NOT a refine leaf in the prototype. `feel` is captured on the retired `palette` dimension; see §5 PR-3 for where `feel` is re-captured. |

The other ~35 `REFINEMENTS` leaves (florist arrangement, dj genre, cake style, …) have NO `prefs` field — they live ONLY in `refinements` JSONB. That is correct and lossless: they were never captured by production before, so nothing downstream depends on them yet.

```ts
// projectRefinementsToPrefs(refinements, faith) → Partial<OnboardingPrefs>
//   ceremony → prefs.ceremony (last pick, mapped to ceremony_* key)
//   catering → prefs.cuisine (mapped), + dietary['halal'] if Halal chosen
//   photo_video → prefs.pvLook (mapped)
// Applied: (a) live in patchRefine so the recap/find update as they pick;
//          (b) defensively in buildCommitPayload so a resumed draft is consistent.
```

### 3.4 `state.ai` ← NEW additive field
```ts
// types.ts — OnboardingState
/** AI-gate answer (Dream Team chapter). null = not yet asked; true = "match the rest"
 *  (picks/refine screens shown); false = "browse on my own" (skip to the plan/offer).
 *  Drives buildSequence membership. Persisted so a resumed draft restores the fork. */
ai: boolean | null;
```
`EMPTY_ONBOARDING_STATE.ai = null`. **Default when null = treat as `false`** in `buildSequence` (do NOT show the team_basics/refine screens until the couple explicitly taps Yes on `aigate`) — see §4.

### 3.5 `state.receptionTypes` — NOT added
The prototype's `receptionTypes` (`pickRType`) only drives the `s1search` hero photo. Production already has `prefs.reception` doing exactly this (`find` reads it L1689, hero at StyleSubStepper L682-686). **Do NOT add `receptionTypes`** — fold `s1type` (`reception_setting`) directly onto `prefs.reception`. One field, no duplication.

### 3.6 Commit persistence — additive JSONB only, NO migration
`events.style_preferences` is already a free-form JSONB blob written from a spread (`actions.ts` L428: `...(payload.stylePreferences ?? {})`). Add `refinements` (and optionally `ai`) to the payload + blob:

```ts
// actions.ts OnboardingCommitPayload (L217 block) — add:
refinements?: Record<string, string[]>;
// actions.ts insert (L428-437) — add inside style_preferences:
refinements: payload.refinements ?? {},
// onboarding-shell buildCommitPayload (L2417) — add:
refinements: s.refinements,
// AND ensure stylePreferences carries the PROJECTED prefs so ceremony/cuisine/pvLook persist:
stylePreferences: { ...s.prefs, ...projectRefinementsToPrefs(s.refinements, s.faith) } as Record<string, unknown>,
```
**No DB migration required.** `style_preferences` accepts arbitrary keys; `interested_categories` (L435) keeps reading `payload.picks`. The projected `prefs` already flow through `stylePreferences` (L2461) — projecting before the spread keeps `find`/recap/commit identical.

### 3.7 Resume / draft compatibility
`loadDraft` does a shallow `Object.assign`. A pre-port draft lacks `ai`/`refinements`. Backfill on load (mirror the love-story backfill pattern at prototype L2042 / production's draft hydration):
```ts
if (typeof draft.ai === 'undefined') draft.ai = null;
if (!draft.refinements || typeof draft.refinements !== 'object') draft.refinements = {};
```
A resumed pre-port draft simply behaves as "AI not yet asked" → safe.

---

## 4. The AI-gate fork in `buildSequence`

Today (L97):
```ts
function buildSequence(kind, authed, loveSkipped): ScreenId[] {
  return FLOW_IDS.filter((id) =>
    !(id === 'faith' && kind === 'civil') &&
    !(id === 'account' && authed) &&
    !(loveSkipped && LOVE_SKIPPABLE.has(id)));
}
```

Ported — add an `ai` parameter and a `TEAM_AI_ONLY` set:
```ts
const TEAM_AI_ONLY: ReadonlySet<ScreenId> =
  new Set(['team_basics','refine_basic','team_extras','refine_extras']);

function buildSequence(kind, authed, loveSkipped, ai): ScreenId[] {
  const aiOn = ai === true;          // null OR false → fork OFF (default = off)
  return FLOW_IDS.filter((id) =>
    !(id === 'faith' && kind === 'civil') &&
    !(id === 'account' && authed) &&
    !(loveSkipped && LOVE_SKIPPABLE.has(id)) &&
    !(!aiOn && TEAM_AI_ONLY.has(id)));  // AI screens only when ai===true
}
```

New `FLOW_IDS` (L92), Dream Team chapter inserted after `budget`, before `account`:
```
...'budget',
'team_intro','reception_setting','find','team_payoff','aigate',
'team_basics','refine_basic','team_extras','refine_extras',
'account','congrats','plan',...
```
Notes:
- `find` MOVES earlier — it now sits inside the chapter (after `reception_setting`), matching the prototype's `s1search` position. Its render block + effects are unchanged; only its index moves. The `find` effect (L1679) gates on `activeId === 'find'` so it still fires correctly. **Verify the match effect (L1710) `seq.indexOf(activeId) < seq.indexOf('congrats')` still computes ≥0** — both ids stay in the seq, so OK.
- `account` now follows the AI screens (matches prototype: account defers to settlement). If owner wants account BEFORE the AI screens (to capture the email earlier), that's a one-line reorder — flag for owner.

**Composition with existing forks (all independent boolean filters, order-agnostic):**
| Couple | `kind` | `authed` | `loveSkipped` | `ai` | Chapter screens shown |
|---|---|---|---|---|---|
| Religious, anon, told story, AI=Yes | religious | false | false | true | all 9 |
| Civil, anon, skipped story, AI=No | civil | false | true | false | `team_intro`→`reception_setting`→`find`→`team_payoff`→`aigate` only (no basics/refine) |
| Signed-in, AI=Yes | any | true | false | true | all 9; `account` dropped |
| AI not yet answered (`null`) | any | any | any | null | `aigate` shows, basics/refine hidden until they tap Yes |

`aiAnswer(yes)` handler (prototype L3720) ports to:
```ts
const aiAnswer = (yes: boolean) => {
  setState((s) => ({ ...s, ai: yes }));
  go(1);   // buildSequence re-derives with ai set → Yes lands on team_basics, No lands on account/plan
};
```
Because `aigate` is `data-nocta`, add it to the chrome-CTA hide set (mirror `LOVE_NOCTA`, L129): `const AIGATE_NOCTA = new Set(['aigate'])` and OR it into the CTA-hidden condition at L3807.

---

## 5. The two-pass refine engine (React port)

The prototype runs the refine screen as a **mini-stepper INSIDE a single screen slot**: `refineQueue` holds the leaves to refine, `refinePos` is the cursor, `refineScope` is which pass ('basic'|'extras'). The screen is re-entered N times before nav leaves it (prototype `go()` L2293-2310).

### 5.1 React state (mirror the existing `prefIdx` sub-stepper pattern, L1461)
```ts
const [refineIdx, setRefineIdx] = useState(0);   // cursor within the active pass's queue
// the active pass's queue is DERIVED, not stored, from picks ∩ keys(REFINEMENTS):
const refineBasicQueue = useMemo(
  () => REFINE_BASIC_ORDER.filter((k) => state.picks.includes(k) && k in REFINEMENTS),
  [state.picks]);
const refineExtrasQueue = useMemo(
  () => REFINE_EXTRAS_ORDER.filter((k) => state.picks.includes(k) && k in REFINEMENTS),
  [state.picks]);
```
- `REFINE_BASIC_ORDER` = canonical BASIC order `['ceremony','catering','coordinator','photo_video']` (prototype `BASIC` order L3728, NOT pick order — owner FIX1/FIX2 L4081).
- `REFINE_EXTRAS_ORDER` = the flat taxonomy order from `PICK_GROUPS` (matches prototype `ENHANCE` flat order L3814), deduped.
- A pass with an empty derived queue is **skipped entirely** (the navigator steps past it — §5.3). This mirrors prototype `buildRefineQueue` returning `[]` → nav skips (L2304/2307).

### 5.2 `go()` extension (the re-entry loop)
Extend the existing `go()` (L1638) — it already special-cases the `prefs` sub-stepper. Add the same shape for `refine_basic` / `refine_extras`:
```ts
const REFINE_SCREENS = new Set<ScreenId>(['refine_basic','refine_extras']);
const queueFor = (id) => id==='refine_basic' ? refineBasicQueue : refineExtrasQueue;

// inside go(d), BEFORE the generic step:
if (REFINE_SCREENS.has(activeId)) {
  const q = queueFor(activeId);
  const ni = refineIdx + d;
  if (ni >= 0 && ni < q.length) { setRefineIdx(ni); return; }   // walk within the pass
  // at an edge → fall through to leave the refine screen
}
// after the generic setState step, when ENTERING a refine screen forward:
//   if its derived queue is empty → step once more (skip the empty pass);
//   else setRefineIdx(0) (forward) / setRefineIdx(q.length-1) (backward).
```
**Edge handling (port of prototype L2304-2307):**
- Entering FORWARD with empty queue → advance one more index (skip the pass).
- Entering BACKWARD with empty queue → retreat one more index.
- Entering FORWARD non-empty → `refineIdx = 0`.
- Entering BACKWARD non-empty → `refineIdx = queue.length - 1`.

Implement the skip-empty by computing the queue for the *target* id inside the same `setState` updater (queues are pure functions of `state.picks`, available synchronously).

### 5.3 The UNIFORM refinement template (explicit owner ask: "same template for all")
Every refine screen — both passes, every leaf — renders IDENTICALLY (prototype `renderRefine` L4101, owner note L4106). The taxonomy data supplies only **label / options / photos**; the layout/question is fixed:

```
[ "X of N · {leaf label}"  +  progress dots ]          ← prefprog (refineIdx+1 of queue.length)
eyebrow: "Refine your essentials" | "Refine the extras you love"
         + a "Only if it has refinements" cond tag
h1:  "What kind of {leaf.label.toLowerCase()}?"        ← uniform question stem
sub: "Pick the ones that feel like you — we'll match the rest."   ← uniform sub
[ horizontal photo-card carousel, ONE card per option ]          ← .pgrid.car, multi-select
micro hint: "✦ Tap all that fit — this sharpens your matches."
CTA: "Next service"  (refineIdx < queue.length-1)  |  "Continue"  (last)
```
A single `<RefineStep pass="basic"|"extras" />` component renders BOTH passes (only the eyebrow + which queue differs). The "uniform template" is enforced by having exactly ONE render path; the per-leaf differences come only from the data object:

```ts
type RefineDef = {
  label: string;                          // "Catering"
  options: string[];                      // ['Filipino','Spanish',…]
  dynamic?: (faith, kind) => string[];    // ceremony is faith-adaptive (ceremonyVenueOptions L3950)
  photos?: Record<string,string>;         // option label → asset key (admin-uploadable)
  emoji?: Record<string,string>;
};
const REFINEMENTS: Record<string, RefineDef> = { /* ported verbatim from prototype L3964-4035 */ };
```
- **Ceremony is faith-adaptive:** `ceremony` leaf uses `dynamic` = a port of `ceremonyVenueOptions` (L3950). Production already has the twin `ceremonyOptsFor` (L397) + `WORSHIP_OPT` (L380) + `UNIVERSAL_CEREMONY_OPTS` (L391) — REUSE those; do not re-port. The refine option labels for `ceremony` come from `ceremonyOptsFor(faith)` so they match the existing `prefs.ceremony` keys (critical for the §3.3 projection).
- **Photo fallback chain** (prototype `defaultRefineImg` L4056): curated `photos[opt]` → leaf hero (`PICKER_ASSET(leaf)`) → one generic. Port as `refineOptionPhoto(leaf, opt)`.
- **Toggle handler** `patchRefine(leaf, opt)` (port of `toggleRefine` L4135) writes `state.refinements[leaf]` AND calls the §3.3 projection to keep `prefs` consistent live.

### 5.4 Progress counter
`"Service {refineIdx+1} of {queue.length} · {leaf.label}"` + `queue.length` dots, first `refineIdx+1` lit (prototype L4130-4132). The basics counter and extras counter are independent (each over its own derived queue).

---

## 6. SAFE incremental decomposition (4 PRs)

Ordered lowest-blast-radius first. **Each PR keeps `find` + the DB commit working** and is independently shippable + reversible. The bridge fields (`ai`, `refinements`) land additively in PR-1 so later PRs never touch the type/commit contract again.

### PR-1 — Additive scaffolding (ZERO behavior change)
- **Scope:** Add `ai: boolean|null` + `refinements: Record<string,string[]>` to `OnboardingState` + `EMPTY_ONBOARDING_STATE`. Add `refinements?` to `OnboardingCommitPayload`. Persist `refinements` into `style_preferences` JSONB + carry `projectRefinementsToPrefs` (defined but, with empty `refinements`, a no-op). Add the draft backfill (§3.7). NO new screens, NO `FLOW_IDS` change.
- **Files:** `types.ts`, `actions.ts`, `onboarding-shell.tsx` (buildCommitPayload only).
- **Bridge state at this increment:** `ai` always null, `refinements` always `{}` → projector returns `{}` → commit byte-identical to today. The live flow is unchanged.
- **QA:** `pnpm typecheck` + `pnpm build` green. Browser: full walk welcome→summary, confirm commit succeeds, `events.style_preferences` row has `refinements: {}` and `interested_categories` unchanged. Resume an old draft → no crash. Grep: `grep -n "refinements" actions.ts onboarding-shell.tsx types.ts` confirms additive only.

### PR-2 — The intro / payoff / AI-gate shell (chapter chrome, NO picks split yet)
- **Scope:** Add `team_intro`, `team_payoff`, `aigate` to `FLOW_IDS` (inserting `find` into its new chapter position; keep today's `picker`+`prefs` screens IMMEDIATELY after `aigate` for now, GATED to show only when `ai===true`, else fall through to `account`). Add the `ai` param + `TEAM_AI_ONLY` filter to `buildSequence` (gating the *existing* `picker`+`prefs` ids in this interim). Wire `aiAnswer`, the payoff stats (from `venues`+`shortlist`), the `aigate` no-CTA. Promote `reception_setting` as a standalone screen writing `prefs.reception` (the StyleSubStepper still owns the other dimensions for now).
- **Files:** `onboarding-shell.tsx` (FLOW_IDS, buildSequence, 3 render blocks, go/CTA wiring), maybe a CSS file for the payoff statstrip.
- **Bridge state:** `picks`/`prefs`/`shortlist` UNCHANGED. The AI gate now forks the EXISTING picker+prefs (a couple who taps "No" skips straight to the offer; "Yes" sees today's picker+prefs). `refinements` still empty.
- **QA:** typecheck + build. Browser: AI=Yes path shows picker+prefs; AI=No path skips them and lands on plan/account with `picks=[]` (commit must still succeed with empty picks — verify `getOnboardingVendorCounts` tolerates `[]`, L1713). Confirm `find` still searches (it moved index but effect gates on id). Covert grep (§6.5): the new `team_*`/`aigate` copy is service/vendor-shaped — NEVER love/song/editorial. `grep -niE "song|lyric|editorial|pakanta" ` over the new blocks returns nothing in covert love screens.

### PR-3 — Basics + extras two-screen picker (replaces `picker`)
- **Scope:** Replace the single `picker` screen with `team_basics` (4-card pax-style carousel) + `team_extras` (expandable parent→tiles browser). Both call the EXISTING `pickChip` (Option A bridge §3.1) → `state.picks` stays flat. Retire the `picker` id from `FLOW_IDS`. **Retire `StyleSubStepper`** and the `prefs` screen id; move `feel` (palette) capture either into `reception_setting`'s footer or a tiny standalone `mood` screen (owner choice — flag it), so `prefs.feel` + `prefs.music` (Song Bank) are still captured. (Music/Song Bank: keep `SongBankStep` reachable — simplest is a dedicated `songs` screen retained from today's `music` dimension; surface to owner since the prototype has no song step.)
- **Files:** `onboarding-shell.tsx` (FLOW_IDS, 2 new render blocks, retire picker+StyleSubStepper render), `PICK_GROUPS`/`BASIC_CATS` constants.
- **Bridge state:** `picks` still the single flat source; `find` reads `prefs.reception` (now from `reception_setting`, PR-2) + the recap reads `picks` — both intact. `prefs.cuisine`/`ceremony`/`pvLook` are NOT yet captured here (they come in PR-4 via refinements projection) — so for one PR they're empty unless the retained `songs`/`mood` screens cover `music`/`feel`. **This is the one increment to watch:** confirm `find` doesn't depend on `prefs.cuisine`/`pvLook` (it doesn't — L1689 reads only `prefs.reception`).
- **QA:** typecheck + build. Browser: pick basics + extras, confirm `state.picks` (devtools/localStorage) = the union, commit writes the same `interested_categories`. Confirm `recommendedInappFor(picks)` seeds services (L1731). Covert grep on `team_extras` tile copy — vendor categories only.

### PR-4 — The two-pass refine engine (the new capture)
- **Scope:** Add `refine_basic` + `refine_extras` screens + the `RefineStep` component + `REFINEMENTS` map (ported verbatim) + the `go()` re-entry loop (§5.2) + `refineIdx` state + the derived queues + `patchRefine` + the §3.3 `projectRefinementsToPrefs`. Gate both under `ai===true` via `TEAM_AI_ONLY`.
- **Files:** `onboarding-shell.tsx` (FLOW_IDS final form, buildSequence already has the filter, go(), 2 render blocks, REFINEMENTS const, patchRefine), reuse existing `ceremonyOptsFor`/`WORSHIP_OPT`.
- **Bridge state:** FULLY live. `refinements` now populated; the projector writes `prefs.ceremony`/`cuisine`/`pvLook` (+dietary halal) live so the recap + commit reflect them. `picks` + `shortlist` unchanged. `style_preferences.refinements` carries the full ~40-leaf detail.
- **QA:** typecheck + build. Browser: AI=Yes, pick 2 basics with refinements + 3 extras with refinements → walk both passes, confirm "X of N" counts only refinable picks, empty passes skip silently, back/forward lands on the right cursor. Pick a leaf with NO refinement → no screen. Confirm commit: `style_preferences.refinements` has the leaf→options map AND `prefs.ceremony`/`cuisine`/`pvLook` are projected. Confirm faith-adaptive ceremony options match the couple's faith (Catholic→Church/Chapel; Muslim→Mosque). Covert grep over every new `refine_*` block — "what kind of X" service copy only, never love/song/pricing.

### 6.5 Covert-copy QA rule (applies to every PR)
The love stage is COVERT (story-shaped only; never names song/editorial/Pakanta — see `onboarding-shell.tsx` L91, L2262). The Dream Team chapter is the INVERSE concern: its copy is openly vendor/service-shaped, but the port must not let **service/pricing/song copy leak INTO the love screens' covert copy**, and must not let **love/editorial copy leak into the team screens**. Per-PR grep gate:
```bash
# 1. love screens stay covert (no service/price/song leak):
grep -nE "₱|vendor|caterer|photographer|Pakanta|playlist" onboarding-shell.tsx \
  | grep -iE "love_|story|spark|proposal|milestone"        # must be empty
# 2. every new team/refine/aigate screen id is service-shaped (sanity scan):
grep -nE "(team_|aigate|refine_|reception_setting)" onboarding-shell.tsx
```
Each screen id must be "story-shaped" only for the love stage; team screen ids are service-shaped (`team_basics`, `refine_extras`) — that's correct and expected.

---

## 7. Risk register

| # | Risk | Where it breaks | Likelihood | Mitigation |
|---|---|---|---|---|
| R1 | **Picks model corruption** — splitting into basicPicks/enhancePicks desyncs from `interested_categories`. | `actions.ts` L435 + `getOnboardingVendorCounts` L1713. | Med | Use Option A (§3.1): keep ONE flat `state.picks`, partition at render. No new pick arrays → impossible to desync. |
| R2 | **Category-key mismatch** — prototype `ceremony_venue`/`photo_video` vs production `ceremony`/`photo_video`, missing `reception`/`coordinator`. | `CATEGORY_MAP` (actions L174) fails to resolve → auto-inquire + venue_setting silently drop. | High | §3.1 reconciliation table: port renames `ceremony_venue→ceremony`; basics list uses production keys; `reception` stays the `find`/`reception_setting` concern, never a basic card. Assert in a unit/dev check that every `BASIC_CATS` + `REFINE_*_ORDER` key exists in `PICK_GROUPS`/`CATEGORY_MAP`. |
| R3 | **Commit contract drift** — adding `refinements` perturbs the `style_preferences` insert. | `actions.ts` L428-437. | Low | Additive JSONB spread only; `interested_categories` keeps reading `payload.picks`. PR-1 lands the field with empty data → proves zero-diff before any UI uses it. No migration. |
| R4 | **`StyleSubStepper` removal loses `cuisine`/`ceremony`/`pvLook`/`music`/`feel` capture.** | `find` (reception only — safe), but recap (L2232-2252) + `mood_feel_key`/`music_playlist_seed` commit (L2442-2443) read `prefs.*`. | High | The §3.3 projection re-captures `ceremony`/`cuisine`/`pvLook` from refinements (PR-4). `music` (Song Bank) + `feel` (palette) have NO refine equivalent → **retain a `songs` + a `mood`/palette screen** (PR-3) so `prefs.music`/`prefs.feel` stay populated. Surface to owner: prototype omits both — confirm they're kept. |
| R5 | **`find` search regression** — `find` moves earlier in the sequence + `prefs.reception` now comes from `reception_setting` not StyleSubStepper. | `find` effect L1679 (reads `state.prefs.reception` L1689). | Med | `reception_setting` writes the SAME `prefs.reception` field via `patchPrefs`. `find` effect gates on `activeId==='find'` (index-independent). PR-2 QA explicitly re-walks `find` after the move. The match effect's `seq.indexOf` math (L1711) stays valid (both ids in seq). |
| R6 | **Music genre vs Song Bank collision** — projecting `live_band`/`dj` genre refinements onto `prefs.music` would clobber the Song Bank seed. | `syncEventSongPicks` (actions L501) expects "Title\|Artist" labels, not genres. | Med | §3.3: music-genre refinements stay in `refinements` JSONB ONLY; never projected onto `prefs.music`. Keep Song Bank a separate retained screen. |
| R7 | **AI=No empty-picks commit** — a couple who declines AI commits with `picks=[]`. | `getOnboardingVendorCounts([])` L1713, `recommendedInappFor([])` L1731. | Med | Confirm both tolerate `[]` (counts returns null → card hidden, which is the intended "no matches" path L1704). Add a test walk for the AI=No path in PR-2. The `find`/`reception_setting` still run for AI=No (they're before the gate), so a venue shortlist still seeds `event_vendors`. |
| R8 | **Refine queue desync on back-nav** — `refineIdx` cursor lands wrong when a pass's queue changed because the couple edited picks. | `go()` re-entry L5.2. | Low | Queues are DERIVED from `state.picks` (memoized), recomputed on entry; cursor is clamped to `[0, queue.length-1]` and reset on each fresh entry (forward→0, backward→last). Never persist `refineIdx` across the chapter. |
| R9 | **`data-stage` progress bar** — new screens need stage numbers or the progress bar jumps. | Chrome progress indicator. | Low | Assign `data-stage` per the prototype STAGES map (L2064): team_intro/reception_setting/find/team_payoff=stage "venue", aigate="Setnayan AI", team_basics/refine_basic=stage "Essentials", team_extras/refine_extras="The extras". Update `FLOW_TOTAL` (types L344) for the new screen count. |
| R10 | **Draft resume across the deploy** — a couple mid-flow on the old `picker`/`prefs` resumes into the new chapter. | `loadDraft` / step index. | Med | §3.7 backfill defaults `ai=null`/`refinements={}`. Since `step` is an index into a CHANGED sequence, clamp `step` on load and, if the restored `activeId` is a retired id (`picker`/`prefs`), bounce to the nearest surviving id (`team_basics`). Add this remap in the resume guard (near L1546). |

---

## 8. Open questions for owner sign-off

1. **Account screen position** — prototype defers `account` to AFTER the AI screens (settlement). Production currently has it at index 11 (after prefs). Keep deferred, or capture email before the basics picker? (One-line reorder.)
2. **Song Bank + palette retention** — the prototype has NO song-picking or palette/feel step, yet production commits `music_playlist_seed` + `mood_feel_key`. Confirm we RETAIN a `songs` screen + a `mood` screen (recommended) so those columns stay populated. (R4/R6.)
3. **`coordinator` as a basic** — prototype added Coordinator to the 4 basics (L3726). Production lists `coordinator` under "Planning" in `PICK_GROUPS` (L282). Confirm it renders on `team_basics` (it has no `prefs` field, only a `coordination_scope` refinement — fine).
4. **Per-item à-la-carte pricing** is OUT OF SCOPE here (Stage 4 offer = existing `plan`/`services`). This spec stops at `refine_extras`.

---

## 9. Acceptance — the chapter is correctly ported when

- `pnpm typecheck` + `pnpm build` green on each PR.
- AI=Yes full walk writes: `style_preferences.interested_categories` = the flat union of basics+extras picks; `style_preferences.refinements` = the per-leaf option map; `prefs.ceremony`/`cuisine`/`pvLook` projected from refinements; `prefs.reception` from `reception_setting`; `prefs.music`/`feel` from the retained song/mood screens; `shortlist` → `event_vendors` 'considering'.
- AI=No walk skips basics/refine, still runs `find`, commits with `picks=[]` cleanly.
- Both refine passes count only refinable picks, skip empty passes, and re-enter per queued leaf with a uniform template.
- No covert leak either direction (§6.5 grep gates clean).
- A pre-port draft resumes without crash (retired-id bounce + field backfill).
