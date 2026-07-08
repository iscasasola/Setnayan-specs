# Kwento Decorator — Instagram-style stickers/effects on a photo · Build Plan

> **Date:** 2026-07-08 · **Owner decisions:** "Thank You" (retired) reframed → this is **Kwento** ("this is ideally kwento"); decorated photos **persist to the couple's gallery** ("Persist as a Kwento → couple's gallery"). **FREE + client-side (₱0).**

Kwento today = the **words layer** (text ≤50/≤280 chars anchored to a capture, `photo_messages` via `submit_photo_message`). This adds the **decoration layer**: a guest layers **stickers + text + a filter** on their photo, Instagram-Stories-style, and it saves into the couple's gallery.

## The clean part: persistence is already built
The decorated image reuses the proven guest-capture pipeline — **no new server plumbing**:
- POST the exported JPEG to **`/api/papic/guest-capture`** (the shipped route): R2 upload → `papic_record_guest_capture` RPC (quota-gated) → **NSFW screen** (corpus hard constraint, on by default) → FaceBlock bake → wall ingest → **Google Drive sync** → returns `captureId`.
- The decorated photo becomes a **first-class guest capture** in the couple's gallery, moderation-gated. A Kwento **text** can then anchor to that `captureId` via `/api/papic/kwento` (the existing "author sheet anchors on it" flow).

## The real build: the client-side editor (`KwentoDecorator`)
Pure client-side, ₱0. Design to minimize blind-build risk:
- **Fixed-size stage** (e.g. the photo's native box) so DOM overlay coords == canvas export coords (no fragile coordinate mapping).
- **Photo** rendered with a CSS **filter** — reuse the 5 shipped looks from `lib/papic-photo-styles.ts` (`cssPreviewFilter`: ORIG/RETRO/MONO/CINE/LOMO) for the "effects."
- **Draggable overlays** as absolutely-positioned DOM elements (robust vs. canvas drag): **emoji stickers** (a starter palette) + **text** (add / drag / resize / colour).
- **Export:** composite to a canvas once on Save — draw image (with `ctx.filter`) + each overlay at its stage position → `toBlob('image/jpeg')` → POST to `/api/papic/guest-capture`.

## Auth wrinkle to resolve in slice 1
`/api/papic/guest-capture` uses the **`setnayan_guest_session` cookie**; the decorator's natural home `/papic/me/[token]` is **qr_token-scoped**. Slice-1 task: confirm whether that page has a session (the capture handoff at `/papic/seat/[token]` does) — if not, either (a) place the "Decorate" entry on the session-backed capture surface, or (b) add a token-scoped upload route mirroring guest-capture's core. **(a) is preferred** — no new route.

## Slices
1. **Editor + persist** — ✅ **BUILT · PR #2892 (HELD for visual review, no auto-merge).** `/papic/decorate` + `KwentoDecorator` (photo · 5 filters · emoji stickers · draggable text) → on-device canvas bake → upload via the existing guest-capture route → moderation-gated gallery capture. Entry link on `/papic/me/[token]`. Decorates a device-selected photo (no CORS taint); fractional overlay coords. tsc-clean. *Awaiting owner preview review before merge.*
2. **Kwento text on the decorated photo** — chain the existing `/api/papic/kwento` author sheet on the returned `captureId` (words + decoration together).
3. **Polish** — bigger sticker set, more text styles, undo, per-couple sticker themes (mood-board palette).

## Locks honored
NSFW screen stays on (via the reused route) · client-side render (₱0) · moderation-gated before the couple sees it · RA 10173 consent rides the capture route's existing opt-in.
