# Guest Legibility Floor — standing design rule (2026-06-20)

> **The bar every guest-facing surface must clear.** Born from the veil-reveal fix
> (owner 2026-06-20 "the text at the bottom should be visible so old people can
> understand the app"). One label was 9px cream-on-cream on a light veil — invisible
> to an older guest. This doc exists so we stop fixing that one symptom at a time.
>
> Scope: **guest-facing** surfaces only (people who never installed or onboarded).
> Couple/vendor/admin dashboards have their own, gentler bar — those users are
> motivated and repeat-visit. **Guests get one shot, cold.**

---

## 0. The persona — the "Lola Remedios test"

Design every guest surface for **Lola Remedios, 72**: first time, no onboarding,
on her *own* phone, one hand, bright sunlight or a dim reception hall, weak venue
wifi, arriving via a QR code or a link with exactly one job in mind. She never
installed anything.

**The bar:** she can complete the surface's one job, cold, with nobody explaining
it. If she passes, everyone passes. This is the worst-case usability context in the
whole product — harder than any dashboard.

---

## 1. The line: *atmosphere* vs *a job to be done*

The brand language is premium-minimal (small, wide-tracked mono, low-contrast cream).
That aesthetic is **inherently low-legibility** — so we do NOT make everything big and
plain (that would wreck the brand). We split by intent:

| Class | Example | Who leads |
|---|---|---|
| **Atmosphere** | the veil drifting, petals, the hero scrub, ambient motion | Aesthetics. Beautiful can be subtle. |
| **A job the guest must do** | the veil's swipe-hint, RSVP yes/no, find-my-seat, "see my photos", a button, an error | **Legibility wins, every time.** |

**The test for any element:** *is this a job the guest must complete?* If yes → it
must clear the floors below, even if that means it's less subtle than the brand
default. If it's pure atmosphere → aesthetics may lead, but it still must not
*block* a job.

---

## 2. The floors (non-negotiable on job elements)

1. **Type size.** Primary instruction/CTA ≥ **16px**; supporting line ≥ **14px**.
   No 9–11px on anything a guest must read to act.
2. **Contrast is guaranteed, never assumed.** Wherever **user-chosen colors**
   (couple veil color, palette-from-moodboard, admin theme) sit behind text, the
   system **guarantees** contrast — a soft scrim pill or auto-contrast text — so
   customization can *never* make a job element illegible. (This was the veil's
   actual root cause: cream text + couple's light veil = cream-on-cream.) Target
   WCAG AA (4.5:1 body, 3:1 large).
3. **Tap targets ≥ 44×44px** (≥48 preferred) with real spacing. Older hands, one
   thumb.
4. **Readable in sun and dark.** Don't rely on a faint shadow over an unknown
   background. Scrim / solid chip when the background is dynamic.

---

## 3. Interaction rules

5. **A gesture is never the only way.** Swipe / pinch / double-tap / scrub are
   *invisible affordances* — elders never discover them. Every gesture ships with
   **(a)** a visible, plain-language instruction and **(b)** a tap-only fallback.
   *(The veil is the reference pattern: swipe **or** double-tap **or** the
   now-legible hint.)*
6. **One screen, one job.** Guest surfaces are single-purpose and big. No nesting,
   no dashboards. "Find your seat" → type name → giant table number. Done.
7. **Zero-install, zero-login wherever possible.** Elders won't make accounts.
   QR/link → content instantly. Keep guest flows account-optional (RSVP, gallery,
   seat finder).

---

## 4. Language

8. **Plain words, no jargon, sentence case.** "Lift the veil" ✅. "RSVP / scan /
   tag / reel / scrub / claim" ❌ without a plain framing. Say what it does.
9. **Tagalog / Cebuano for guest micro-copy** is the highest-leverage elder fix we
   are NOT doing yet. Older PH guests read TL/CEB far more comfortably than EN.
   (Help Center staying EN-only in V1 is fine — *guest button labels* are a
   different, cheaper, higher-impact thing. Roadmap item, not a V1 blocker.)

---

## 5. The surface map (everything this rule governs)

The rule is only real if it covers every door a guest enters:

| # | Surface | Where (origin/main) | Status |
|---|---|---|---|
| 1 | Save-the-Date reveal (veil + rigid openings + film) | `apps/web/app/[slug]/_components/reveal/*`, `save-the-date-film.tsx` | veil hint fixed #1872; rest unaudited |
| 2 | RSVP page | `apps/web/app/[slug]/…` (RSVP path) | unaudited |
| 3 | Day-of guest (live-event mode) | iteration 0031 surfaces | unaudited |
| 4 | Seat-finding (scan → name → table number) | seat-finder surface | unaudited |
| 5 | Papic guest gallery + personal reel builder | guest gallery / reel builder | unaudited |
| 6 | QR claim / join flows | event join token / claim / OTP | unaudited |
| 7 | Email notifications (guests live in email) | iteration 0028 templates | unaudited |

---

## 6. How it's enforced

Mirror how nav/bottom-nav rules are already enforced (guardrail + audit), not vibes:

- **Code guardrail** — a contrast / min-size lint scoped to guest surfaces, so a
  9px cream label can't ship again. The contrast-guarantee (rule #2) is its heart.
  *(Candidate sibling to the existing nav-icon / bottom-nav lint guards.)*
- **Standing rule** — this doc is the bar PRs are checked against.
- **"Lola walkthrough" audit** — periodic pass over all 7 surfaces against §2–§4.
  First pass: 2026-06-20 (see companion findings doc).

---

## 7. PR checklist (paste into guest-surface PRs)

- [ ] Job elements ≥16px primary / ≥14px secondary
- [ ] Text over any user-chosen color has a guaranteed-contrast treatment (scrim / auto-contrast)
- [ ] Tap targets ≥44px
- [ ] Every gesture has a visible instruction **and** a tap-only fallback
- [ ] One screen = one job; no login required to act
- [ ] Copy is plain sentence-case English, no jargon

---

*Owner-driven, 2026-06-20. Logged in `DECISION_LOG.md`. Companion: `Guest_Legibility_Audit_2026-06-20.md` (findings).*
