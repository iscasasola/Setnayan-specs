# Setnayan Premium-UI Standard (2026-06-25)

> **Status: owner-adopted 2026-06-25.** This is the binding design doctrine for every
> Setnayan surface. When a generic skill's defaults disagree with this file, this file wins.
> Cross-ref: [[project_setnayan_palette]] · [[project_setnayan_v2_1_canonical]] ·
> [[project_setnayan_responsive_ruleset]] · `DECISION_LOG.md` 2026-06-25.

## 0. Why this exists

The owner adopted four external design skills as the standard toolchain. They are not
interchangeable and they don't all agree with each other. This file orders them into one
pipeline so every session codes to the same brief instead of re-litigating taste.

## 1. The governance stack (highest authority wins on conflict)

```
CONSTITUTION   Setnayan locks — always win, never overridden by any skill:
               · Clean Editorial palette = the --m-* tokens in apps/web/app/globals.css
                 (ONLY palette; skills' example palettes are ignored)
               · CLAUDE-CODE-BRIEF-v2.1 wins on any conflict
               · bottom-nav canonical (UNBREAKABLE) · ≤5 pill-tab nav IA · Notion-style "More"
               · onboarding no-scroll ≈665px · instant, NO preloader
               · mobile-first / responsive ruleset (2026-06-21)
─────────────────────────────────────────────────────────────────────────────
TASTE          frontend-design (Anthropic)  →  "is this good?"
GOVERNOR       restraint · anti-template · spend boldness in ONE place ·
               two-pass plan→critique GATE · active-voice copy · quality floor.
               GOVERNS the two layers below — if premium-frontend-ui says "more"
               and frontend-design says "restrain", frontend-design wins.
─────────────────────────────────────────────────────────────────────────────
AMBITION       premium-frontend-ui (awesome-copilot)  →  "how high is the bar?"
CEILING        award-level vocabulary · cinematic pacing · scroll narrative ·
               glassmorphism. Supplies craft; disciplined by the governor above.
─────────────────────────────────────────────────────────────────────────────
MOTION         gsap-skills (greensock, 8 skills)  →  "build it how?"
ENGINE         ALL motion is implemented in GSAP: useGSAP (React/SSR-safe),
               gsap.context() cleanup, ScrollTrigger, SplitText, gsap.utils.
               core·timeline·scrolltrigger·plugins·utils·react·performance·frameworks
```

**Retired:** `premium-web-animation` (StringTune-derived, no-GSAP CSS-var engine) is
**archived** as of 2026-06-25 (`~/.claude/_archived_skills/`). It is a *different* motion
architecture; running it alongside GSAP would mean two competing engines. gsap-skills
supersedes it (official, comprehensive, React/Next-native). Its taste patterns are covered
by `frontend-design` + GSAP `SplitText`.

## 2. The doctrine in one sentence

**GSAP gives the power → premium-frontend-ui gives the vocabulary → frontend-design spends
it in ONE orchestrated signature moment per surface, on the `--m-*` palette, never scattered.**

frontend-design's "don't over-animate, it reads as AI-generated" and premium-frontend-ui's
"award-level motion" are not a contradiction once ordered: build the capability, raise the
bar, then *restrain* it to a single intentional moment.

## 3. Mandatory gate — two-pass before ANY new/redesigned surface

Per `frontend-design`, before writing component code:
1. **Pass 1 — compact design plan:** colors (from `--m-*`), display/body type pairing, layout,
   and the ONE signature element/moment. ASCII wireframe encouraged.
2. **Pass 2 — self-critique:** does any part read as a generic AI default? Revise it.
   Then build to the revised plan exactly.

No skipping straight to code. This applies to marketing, landing, and app surfaces alike.

## 4. Per-surface adaptation table

Premium techniques are *adapted*, never applied raw, on locked app surfaces.

| Technique | Marketing (0015) | Landing / reveals (0002, STD) | App dashboards |
|---|---|---|---|
| Cinematic tone + `--m-*` palette | ✅ full | ✅ full | ✅ tone only |
| `clamp()` fluid type · transform/opacity-only · `prefers-reduced-motion` | ✅ | ✅ | ✅ everywhere |
| SplitText / staggered entrances | ✅ hero | ✅ hero | ⚠ subtle card/list only — **never delay the ≈665px fold** |
| Lenis/ScrollTrigger smooth-scroll + pin/parallax | ✅ | ✅ hero | 🚫 no scroll-hijack on task surfaces |
| Magnetic / custom cursor | ✅ desktop only | desktop only | 🚫 touch + fights bottom-nav thumb zone |
| Preloader / entry sequence | ✅ lightweight | — | 🚫 onboarding = instant, no preloader |
| Sticky mega-menu | ✅ header | — | 🚫 bottom-nav canonical + ≤5 tabs win |
| Glassmorphism / backdrop blur | ✅ | ✅ | ⚠ sparingly (mobile perf), within palette |
| Brutalist grids / cyber-neon / extreme mono | 🚫 off-brand | 🚫 | 🚫 |

## 5. Two standing rules baked in

- **Signature + type pairing beat the palette for distinction.** `frontend-design` warns
  against the "warm cream + serif" AI-default cluster — and our locked Clean Editorial palette
  (Alabaster cream + Champagne-Gold + editorial type) sits *near* it. The palette is locked, so
  we avoid looking generic-AI-wedding by nailing a **deliberate display/body type pairing** and
  a **distinctive signature element** per surface — not by leaning on the palette.
- **GSAP performance defaults are non-negotiable:** animate only `transform`/`opacity`,
  `will-change` strategically, always honor `prefers-reduced-motion`, clean up with
  `gsap.context()` / `useGSAP` on unmount (SSR-safe in Next).

## 6. Pilot

First application: the public marketing site (`setnayan.com` / iteration 0015). The hero is
already the "one bold moment" (admin scroll-scrub video); the premium pass elevates the
supporting `FeaturesNarrative` to match. Tracked separately in the repo PR + DECISION_LOG.
