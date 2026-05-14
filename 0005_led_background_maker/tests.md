---
iteration_id: 0005_led_background_maker
iteration_number: 0005
spec_source: 0005_led_background_maker.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0005 — 8K LED Background Maker

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0005_led_background_maker.md` (spec) · `0005_led_background_maker.html` (prototype) · `0005_led_background_maker.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What to build
- [ ] Visual reference (canonical)
- [ ] Stack & conventions — 100% free V1 stack (locked 2026-05-08)
- [ ] Palette source — Reception palette only (locked 2026-05-08)
- [ ] Background colors auto-derive from the locked event palette
- [ ] Routes
- [ ] Data model
- [ ] `led_background_configs` — couple's saved configurations
- [ ] `led_background_renders` — completed and in-progress renders
- [ ] `config_json` schema (per template)
- [ ] The 10 templates
- [ ] Render pipeline (Renderforest-class quality)
- [ ] Step 1: Couple submits config
- [ ] Step 2: Remotion render
- [ ] Step 3: Multi-resolution outputs
- [ ] Step 4: Notification
- [ ] Step 5: Optional Drive delivery
- [ ] Page composition (desktop)
- [ ] Page composition (mobile)
- [ ] Pricing — per render, by resolution + add-ons (locked 2026-05-08)
- [ ] Custom resolution
- [ ] Live playback URL — free with every render
- [ ] Functional scope
- [ ] Must work end-to-end
- [ ] Offline safety — venue has no internet (locked 2026-05-08)

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** Random/rotating photo behavior is live-feed-only. A pre-rendered MP4 cannot dynamically change content during playback.
- [ ] **AC-02.** Couples who want true random rotation must use the live feed mode and accept the internet dependency.
- [ ] **AC-03.** Other surfaces (the Hero Monogram, the QR Code Widget, future widgets) may pick from any palette per their own product logic — but the LED Background Maker is locked to Reception.
- [ ] **AC-04.** - Field group: Background — palette swatches auto-derived from the locked event palette (per iteration 0004), plus a "Custom" picker.
- [ ] **AC-05.** Margin analysis at locked prices: ₱25–60 cost per render at Cloudflare Container pricing → ~90% gross margin across all SKUs.
- [ ] **AC-06.** Once playback starts, zero internet is required for the next 5 hours.
- [ ] **AC-07.** --- ### New features locked 2026-05-08 Photo Pool background blend (+₱149 add-on). Couples have a Photo Pool — an event-scoped library of photos uploaded throughout planning (engagement shoot, save-the-dates, pre-wedding bash).
- [ ] **AC-08.** 0002qrinvitationsystem/0002qrinvitationsystem.md — palette finalization gate (LED Background Maker reads from the same locked palette).

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| 1080p HD | ₱249 | 1920 × 1080, H.264, 10-min master loop (~1.1 GB) | ~12 min |
| 4K UHD | ₱399 | 3840 × 2160, H.264, 10-min master loop (~3.4 GB) | ~18 min |
| 8K cinematic | ₱99 | 7680 × 4320, H.264, 10-min master loop (~5.6 GB) | ~25 min |
| **Custom resolution** | ₱899 | Couple-specified pixel dimensions to fit their LED wall | ~10–15 min |
| **Photo Pool blend** | +₱1,999 | Couple's photos at 30% opacity blended into the background. Live link mode (auto-refresh every 6 hours with fresh random selection) or static mode (locked at render time). Premium pricing reflects R2 photo storage, additional server-side compositing pass, and the auto-rebuild pipeline for live link mode. |
| **Ultrawide aspect (>21:9)** | +₱1,499 | Premium add-on for panoramic / curved / non-standard LED walls. Bespoke render setup, manual quality review by Setnayan Staff, longer render time. |
| **Live Playback URL** | +₱99 | Hosted streaming URL (HLS + direct MP4) at `setnayan.com/led/{event-slug}/r/{render_id}.mp4`. Optional convenience for venues with stable internet who want to stream instead of file-transfer. **The MP4 file download is always included with every render (free)** as the offline-safe primary delivery; this add-on adds the hosted streaming layer for venues that prefer URL-based playback. |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `led_background_configs`
- [ ] `led_background_renders`

## Test scenarios

### Positive (happy path)

- [ ] User performs the primary intended flow end-to-end with valid inputs. Result: success state visible in UI; DB rows created; observability events emitted.
- [ ] Repeat the flow with a second user/event to confirm scoping (no cross-tenant data leakage).

### Negative (rejected inputs)

- [ ] Submit each form with required field missing → server rejects with the documented error message; no DB write.
- [ ] Submit each form with malformed input (wrong type, out-of-range, oversized) → server rejects; no DB write.
- [ ] Attempt the flow without authentication → 401.
- [ ] Attempt the flow as the wrong role → 403; no row leak.

### Edge cases

- [ ] Slow network (throttle to 4G) — UI still responds within performance budgets.
- [ ] Offline at the moment of submission — queued write, replayed on reconnect (where iteration spec calls for offline support).
- [ ] Concurrent updates by two browser tabs — last-write-wins or optimistic-lock per spec.
- [ ] Boundary values: empty collections, single-item collections, max-size collections, items at exact field-length limits.
- [ ] Time-zone correctness: dates near midnight PHT vs UTC.

### RLS / authorization

- [ ] Row-level security policies match the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md` for every table this iteration touches.
- [ ] Cross-event isolation: a user in event A cannot read/write event B's data.
- [ ] Admin actions are gated where the iteration spec requires two-admin approval (per § 9.1).

## Performance + accessibility budgets

- [ ] Initial paint < 1.5s on throttled 4G (per `0019` comms perf discipline checklist).
- [ ] Interaction-to-next-paint < 200ms for primary actions.
- [ ] All interactive elements keyboard-navigable.
- [ ] Color contrast ≥ 4.5:1 for body text, 3:1 for UI elements (WCAG AA).
- [ ] Mobile thumb-zone targets ≥ 44pt × 44pt.
- [ ] No PII in client-side logs (RA 10173).

## Test data fixtures

Sample data lives in `fixtures.json` co-located in this folder (create alongside this file). Tests should reference it by key, not hardcode values, so prototype, tests, and dev seed share one source of truth.

```json
{
  "// example": "see fixtures.json"
}
```

## CI signal

Before this iteration's PR can merge:

- [ ] All acceptance criteria checkboxes ticked.
- [ ] Coverage report shows ≥ 80% line coverage on new code paths.
- [ ] No new Sentry errors of severity ≥ warning in CI smoke run.
- [ ] PostHog events fire for every spec-required telemetry point.
- [ ] Observability runbook entry (per iteration 0035) updated if alerts changed.

