# HANDOFF → Onboarding session · add a "Your Love Story" stage

**From:** the wedding-website / editorial design session (2026-06-07)
**To:** the session currently handling wedding onboarding (`apps/web/app/onboarding/wedding/`, setnayan-platform)
**Ask:** add ONE new stage — **"Your Love Story"** — to the wedding onboarding. It's a small, self-contained, skippable stage that powers three downstream features. This doc gives you the *where*, the *how*, and the *why (which features benefit)*.

> You own the onboarding flow + are mid-redesign (adaptive staged · `Onboarding_Wedding_Adaptive_Redesign_2026-06-07.md`). Please integrate this as a **stage in your new structure** — the literal current-flow line edits below are a reference/fallback, not a mandate. Keep our intent (placement, skippable, what it writes) and adapt the mechanics to your design.

---

## 1. WHICH features benefit — "told once, used three ways"
The couple tells their story **once**, at setup, and it immediately + later powers:

1. **RSVP website "Our Love Story" section** — renders live on the invitation, pre-wedding (immediate payoff).
2. **Pakanta custom song (0036)** — the story is the **lyric source**. At the end of the stage, fire a soft, skippable **upsell**: *"Hear your story as a song?"* If taken, only the music prefs are asked (genre/voice/must-includes) — the narrative is already in. The resulting song also becomes the page's looping background music (`events.site_bg_music_source='pakanta'`).
3. **Post-wedding Editorial** — the auto-written newspaper recap uses this as its **spine**; the post-event interview pre-fills from it and never re-asks it.

*(Optional bonus: the `tone` could also nudge style/vendor "vibe" matching if useful — your call.)*

UX reference prototypes (open in a browser):
- Love-story screens incl. the Pakanta upsell → `Editorial_Storyline_Prototype_2026-06-07.html`
- Where it sits in the flow + the skip-or-continue checkpoint → `Onboarding_Storyline_Placement_2026-06-07.html`
- Full canonical spec → `Wedding_Website_Lifecycle_Spec_2026-06-07.md` §6.5–6.7

---

## 2. WHERE it goes
- **Placement:** after the practical wedding basics (names · date · region · pax · budget), **before the style/picker stage**. (In today's `SCREEN_SEQUENCE`, that's right after `'budget'` / before `'picker'`.)
- **Tier:** **RECOMMENDED + SKIPPABLE** — *not* the essential floor. The event must already be committed before this stage so **Skip is safe and resumable** (commit-then-patch). If skipped, surface it on the dashboard "finish setting up" card and re-nudge before the couple shares their website / when they buy Pakanta.
- **Golden rules:** one screen, **no scroll** (~665px body), brand mark visible, minimal words, **viewzone (top) / tapzone (bottom)** split, a Skip path. (It can be a single screen — see the prototype — or a tiny 2–3 sub-step if your design prefers.)

---

## 3. WHAT it collects → DB (schema already shipped)
| Field (UI) | Column on `public.events` | Type |
|---|---|---|
| How we met · The proposal · Milestones[] | `love_story` | JSONB `{how_we_met, proposal, milestones:[{year,title,note}]}` |
| A note to guests (optional) | `special_message` | TEXT |
| Tone (warm / playful / formal) | `editorial_tone` | TEXT (check warm/playful/formal) |

**Schema dependency:** these columns ship in **PR #1060** (`setnayan-platform`, migration `20260910000000_wedding_website_lifecycle_foundation.sql`) — **open, NOT yet applied to prod.** Coordinate: merge + `supabase db push` PR #1060 (or have the website session apply it) **before** the onboarding commit writes these, or the write will fail. Minimum gate for the stage: `how_we_met` + `proposal` + `editorial_tone` present (note + milestones optional).

---

## 4. HOW — technical insertion map
> Line numbers are **current origin/main** (worktree `website-foundation`). Verify against your working copy — they'll shift with your redesign.

**A. Screen registry** — `apps/web/app/onboarding/wedding/types.ts` (`SCREEN_SEQUENCE`, ~L324–342): insert `'love_story'` after `'budget'`. Bump the screen-count constant (`PHASE_SCREENS`, `onboarding-shell.tsx` ~L72) and all downstream step-index literals by 1.

**B. State** — `types.ts` `OnboardingState` (~after `budgetAmount`, L128) + `EMPTY_ONBOARDING_STATE`:
```ts
loveStory: { how_we_met: string; proposal: string; milestones: Array<{ year: number; title: string; note: string }> } | null;
specialMessage: string;
editorialTone: 'warm' | 'playful' | 'formal' | null;
// EMPTY_ONBOARDING_STATE: loveStory: null, specialMessage: '', editorialTone: null,
```

**C. Render** — `onboarding-shell.tsx`: add a `<section className="screen ...">` with `viewzone` (eyebrow + h1 + sub + optional hero) and `tapzone` (two textareas → `how_we_met`/`proposal`, tone chips → `editorialTone`), binding via `patch({...})`. Copy the existing role/kind screen pattern (~L2250–2275). See `Editorial_Storyline_Prototype_2026-06-07.html` for the exact UX.

**D. Nav / gates** — `onboarding-shell.tsx`:
- `NEXT_LABEL` (~L77): add `'Continue'` at the new index.
- `CAN_SKIP` (~L82): add **`true`** at the new index. ⚠ **This is a correction** — make it **skippable** (recommended stage), per our design. (An earlier auto-map suggested `false`/required — do NOT make it required.)
- `canContinue` switch (~L1803): add a case requiring `how_we_met` + `proposal` + `editorialTone` (only matters when they Continue rather than Skip).

**E. Commit / persistence** — `apps/web/app/onboarding/wedding/actions.ts`:
- `OnboardingCommitPayload` (~L210–289): add `loveStory`, `specialMessage`, `editorialTone`.
- `events` INSERT (~L361–414, after `music_playlist_seed`):
```ts
love_story: payload.loveStory ?? null,
special_message: payload.specialMessage?.trim() || null,
editorial_tone: payload.editorialTone,
```
- `buildCommitPayload()` (~L1982–2038): pass `loveStory`, `specialMessage`, `editorialTone` from state.
- The commit is single-end + all-or-nothing today; wrap the love-story write best-effort like the other optional blocks so a failure is non-fatal.

---

## 5. Risks / gotchas
- **Index shift:** inserting a screen shifts every downstream step index — update `NEXT_LABEL`, `CAN_SKIP`, the `canContinue` switch, and any hardcoded `step === N && authed`-style literals. (Or, in your redesign, model stages so indices aren't positional.)
- **Skippable, not required** (see 4D correction).
- **Migration must land first** (see §3).
- **No Zod gate today** — server action trusts the client `canContinue`; mirror the requirement if you add validation.
- Keep the **Pakanta upsell** at the *end* of the stage, always with a "Maybe later."

---

## 6. Coordination
- Schema/columns: website session owns **PR #1060** — ping to merge/apply before wiring the commit.
- Questions on intent/UX: see the three reference files above (all in the spec corpus root).
- Once landed, also fold a one-liner into `Onboarding_Wedding_Adaptive_Redesign_2026-06-07.md` so the stage list stays canonical.
