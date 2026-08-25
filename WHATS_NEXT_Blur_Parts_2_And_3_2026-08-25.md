# Blur — RE-MEASURED 2026-08-25 (second pass). Much smaller than this file first said.

> 🛑 **THIS FILE'S FIRST REVISION WAS WRONG IN ITS HEADLINE AND IS CORRECTED IN
> PLACE.** It said *"only the venue wall is honoured today"* and scoped two
> multi-surface parts from that. Re-measured against `origin/main` **4fdc3ac49**
> and the live production database: **all three surfaces in the owner's
> 2026-08-17 ruling blur today.** What is left is ONE pipeline, not everything.
>
> 🔑 **WHY IT WAS WRONG, AND IT IS THE FAILURE THIS REPO KEEPS PAYING FOR.** The
> first pass anchored on `a8f8601` and searched ONE SPELLING of "the blurred
> copy" — the `safe_*_r2_key` columns. The venue-wall blur has always been
> `wall_safe_r2_key`, a *second* spelling, and the readers reach it through
> `getWallSnapshot()` rather than by naming a column at all. A search that can
> only match one spelling is not a survey. The anchor was **57 commits stale on
> the same day it was written.**

---

## Measured state — `origin/main` 4fdc3ac49, 2026-08-25

**The blurred copy has EIGHT reader call sites, not one.** All resolve
`wall_safe_r2_key` through the shared `getWallSnapshot()` in `lib/live-wall.ts`:

| # | call site | audience |
|---|---|---|
| 1 | `app/wall/[eventId]/page.tsx:58` | venue projection |
| 2 | `app/api/wall/[eventId]/feed/route.ts:33` | projector feed |
| 3 | `app/[slug]/_lib/loaders.ts:772` | **public** event hub |
| 4 | `app/[slug]/hub/page.tsx:428` | **public** live hub |
| 5 | `app/[slug]/live-wall/route.ts:52` | **public** JSON feed |
| 6 | `app/tour/gallery/page.tsx:110` | **public** tour |
| 7 | `lib/auto-recap.ts:196` | recap |
| 8 | `lib/chapter-picture.ts:94` | **public** profile chapters |

Plus two direct readers the first pass also missed
(`app/dashboard/[eventId]/live/page.tsx`, `…/studio/papic/_components/live-wall-card.tsx`).

**And a public surface now serves a blurred STAND-IN where it used to serve
nothing** — `app/[slug]/_components/editorial/consent-veto.ts` substitutes
`COALESCE(safe_display_r2_key, wall_safe_r2_key)` for a vetoed capture instead
of dropping it, honouring the owner's *"blurs and KEEPS, not hides"* ruling.

### The owner's three surfaces are all honoured

| surface | blurs? | landed |
|---|---|---|
| venue wall | ✅ | 2026-08-24 |
| public event page | ✅ | 2026-08-18 (`consent-veto.ts`) |
| shared pool | ✅ | 2026-08-24 (`20271160706865_the_pool_blurs_and_keeps.sql`) |

⚠ **"`papic_capture_needs_blur` has ZERO callers" was true only of TypeScript.**
It has **SQL** callers — `guest_pool_gallery` and both wall functions ask it.
The rule is consulted; it is not an orphan. Do not rebuild it.

## Production, re-queried 2026-08-25

| | |
|---|---|
| `papic_photos` · `papic_guest_captures` | **14** · **0** |
| guests with `faceblock_enabled` | **0** |
| guests with `photo_consent = FALSE` | **0** |
| captures where `papic_capture_needs_blur(...)` is true | **0** |

**Nothing is on fire and nothing is exposed today.** The gap below is latent —
it needs one FaceBlock guest or one withdrawal to become real.

---

## 🔴 THE ONE THING GENUINELY LEFT — the guest tagged-photo pipeline

Four guest-facing reads resolve the **UNBLURRED** `display_r2_key` /
`thumb_r2_key` (and one the full-res ORIGINAL), gated only on
`moderation_state = 'clean'`. None asks `papic_capture_needs_blur`:

- `lib/guest-live-gallery.ts` — "photos of you, so far" on the day-of page
- `lib/guest-stories.ts` — the free guest reel
- `app/papic/me/[token]/photo/route.ts` — **serves `r2_object_key`, the full-res
  original**, EXIF-stripped on the fly. The geo is stripped; the faces are not.
- `app/papic/me/[token]/download/route.ts` — same pipeline

🚨 **AND THE GATE THEY ALL LEAN ON CANNOT FIRE. `consent_withheld` and
`faceblock_withheld` HAVE NO WRITER ANYWHERE** — not in a migration, not in app
code. Measured: `nsfw_blocked` has two writers (`lib/nsfw-screen.ts`), the two
privacy states have **zero**, and production has **0 rows** in either. So the
strict `moderation_state = 'clean'` allowlist these modules trust — and whose
docblocks say it means *"FaceBlock not withheld"* — **works for NSFW and is
inert for both privacy reasons.** A FaceBlock capture stays `'clean'` and is
served unblurred.

🔑 **A gate with no handle, in a new costume: a filter-only enum value.** The
column permits the state, four modules filter on it, and nothing can ever set
it. Same family as the phantom column · enum value · RPC argument · missing
grant — **refused-or-inert, never thrown; the only symptom is an absence.**

### Scope — this is a short slice, not a session

Route these four through the existing rule. `papic_captures_needing_blur(event,
table, ids[])` already exists for exactly this list shape. Then decide the
`moderation_state` question: either give the two privacy states a writer, or
delete them and let the blur predicate be the single answer. **Do not do both**
— two rules for one promise is the defect the pool migration was written to
remove.

⚠ **Fail CLOSED.** A read error about whether a capture needs blurring must
withhold, not serve.

⛔ **Do NOT rebuild:** the eight wall readers, the pool RPC, the editorial
consent veto, `generateSafeDerivatives`, or `papic_capture_needs_blur`.

## Traps carried forward (all still true)

- **Never a CSS/overlay blur.** It ships the real photo to the device.
  `lib/face-blur.ts` blurs *"into the pixels, never CSS"*.
- **Never a presigned URL baked into a crawler-visible page** — it expires.
- **The two blur reasons keep different shapes** (FaceBlock event-wide vs
  withdrawal per-photo). Both pinned by test; do not tidy either into the other.
- **A clip needing a blur is DROPPED** — no video blur exists. Keep that.

## Owner call, flagged not decided

Whether a withheld frame leaves a visible gap or is silently absent from a
public gallery. Silence is the safer default and is what a missing derivative
already does.
