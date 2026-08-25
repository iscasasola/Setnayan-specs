# Blur reaches the public page — parts 2 and 3 · SCHEDULED 2026-08-25

**Why this file exists.** W6 was asked to "find out what is left [of blur] and
either schedule it or close it." It is **not closeable**: part 1 shipped
deliberately INERT, and the change that alters what a person actually sees has
not been made. This is the scope, measured.

---

## What already ships (PR #4760, merged — do NOT rebuild any of it)

- `generateSafeDerivatives` writes three **blurred** AVIF copies in the exact
  sizes public pages read (`safe_display_r2_key` 1280 · `safe_tile_r2_key` 640 ·
  `safe_thumb_r2_key` 320), fired straight after the wall bake.
- `papic_capture_needs_blur(p_event_id, p_source_table, p_source_id)` — **verified
  live in production by the object** — is the single definition of "does this need
  blurring?", replacing two inline copies. FaceBlock is **event-wide**; withdrawn
  consent is **per-photo**. Both shapes are pinned by test; folding them together
  is the likeliest wrong simplification.

## What is genuinely NOT built — measured on `origin/main` a8f8601

- **`papic_capture_needs_blur` has ZERO callers in application code.** The SQL
  function is the rule and nothing in the app ever asks it.
- **One reader of the safe copies exists** — `app/[slug]/_components/editorial/
  consent-veto.ts`. Every other public read still serves `display_r2_key` /
  `tile_r2_key` / `thumb_r2_key`: the UNBLURRED web copies.

⇒ Against the owner's ruling of 2026-08-17 — *"blur on the venue wall, the public
event page, and the shared pool other guests browse"* — **only the venue wall is
honoured today.**

## Why nothing is on fire, stated as arithmetic and not as optimism

Queried production 2026-08-25:

| | |
|---|---|
| `papic_photos` | **14** |
| rows where `papic_capture_needs_blur(...)` is true | **0** |
| rows carrying a `safe_display_r2_key` | **0** |

No capture in production needs a blur, so no unblurred face is being served
today. **That is the window this should be built in, not a reason to defer it.**

## Part 2 — the public read paths serve the safe copy, or withhold

PR #4760's own body names it. One resolver, consulted by every public read:
given a capture, either hand back the safe derivative, or **withhold the frame**.
Never fall back to the unblurred copy.

🔑 Follow `lib/papic-gallery.ts`'s existing rule rather than inventing one: *"a
public frame is ALWAYS a metadata-stripped display/thumb derivative — NEVER the
geo-bearing original. A frame with no such derivative is SKIPPED."* Withholding
is already the established behaviour for a missing derivative.

⚠ **Fail CLOSED.** A read error about whether a capture needs blurring must
withhold, not serve. This repo has paid twice for the opposite (a rejected query
returning an absence that reads as "nothing to hide").

## Part 3 — three surfaces that bypass the shared resolver

The shared pool, the memories wall, and a guest's own "photos of you" each read
independently today. Route them through the part-2 resolver rather than letting
each grow its own check.

🔑 **Checking a column in three places is three chances to forget, and the next
surface makes four.** The photo wall has already cost this product exactly that:
three guest surfaces each asked SKU-ownership and nothing else.

## Traps carried forward from part 1

- **Never a CSS/overlay blur.** It ships the real photo to the device and is two
  taps from being switched off. `lib/face-blur.ts` blurs *"into the pixels, never
  CSS"*, and every other blur in the product is decoration.
- **Never a presigned URL baked into a crawler-visible page** — it expires and
  the frame breaks later with nothing to blame.
- **The two blur reasons keep different shapes** (event-wide vs per-photo), and
  the FaceBlock half filters `deleted_at` while the withdrawal half deliberately
  does not. Both pinned; do not "tidy" either into the other.

## Owner call, flagged not decided

Whether a withheld frame leaves a visible gap or is silently absent from a public
gallery. Silence is the safer default and is what a missing derivative already
does — but it changes what a couple sees of their own album on a public page.
