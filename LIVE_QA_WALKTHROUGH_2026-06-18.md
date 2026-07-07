# Live QA Walkthrough — Customer Journey (Account Creation → Editorial)
Date: 2026-06-18 · Driver: Claude (Chrome MCP) · Verify: prod DB queries

## Demo identities
- **Couple:** Andrea Lim (bride) & Paolo Garcia (groom) — email + password set live by owner
- **Vendor:** (demo vendor created mid-run) — email + password set live by owner
- **Admin:** owner account iscasasolaii@gmail.com (internal/admin)

## Legend
✅ pass · ⚠️ partial / wrong data · ⛔ broken · ⬜ not yet run

---

## Phase 1 — Account creation
| # | Button / field | Expected data | Result | Notes |
|---|---|---|---|---|

## Phase 2 — Onboarding commit
| # | Button / field | Expected data | Result | Notes |
|---|---|---|---|---|

## Phase 3 — Guests
| # | Button | Expected data | Result | Notes |
|---|---|---|---|---|

## Phase 4 — Vendor connection (customer ↔ vendor)
| # | Button | Expected data | Result | Notes |
|---|---|---|---|---|

## Phase 5 — Budget / Seating / Studio
| # | Button | Expected data | Result | Notes |
|---|---|---|---|---|

## Phase 6 — Admin connection (customer ↔ admin)
| # | Button | Expected data | Result | Notes |
|---|---|---|---|---|

## Phase 7 — Website / Editorial ending
| # | Button | Expected data | Result | Notes |
|---|---|---|---|---|

---

## Bugs found (fix queue)

### Findings (live)
- **#1 stale copy ⚠️** — Onboarding date step ("When's the big day?") shows note: "See all 5 layers … with **Setnayan Concierge** →". "Concierge" is retired → should read "Setnayan AI". Public-copy bug. (route: /onboarding/wedding, date screen)
- **PASS** — Role select → warm affirmation interstitial works.
- **PASS** — Faith select (Catholic) works; header preview live-tracks Page·Religious·Catholic·200 guests.
- **PASS** — Names + monogram gate: Continue stays locked until 4 names entered AND monogram finalized ("Use this monogram" → "✓ Monogram set"). Correct.
- **PASS** — Date select: Dec 19 2026 captured in UI ("184 days"), Continue enables. (commit-to-DB check pending)
- **#2 copy bug ⚠️** — Love-story composer (onboarding "See our story") stitches person/casing awkwardly: "Andrea barely got the words out; Paolo i forgot every word I had practiced and just said yes" — mixes 3rd/1st person + lowercase "i". (route: /onboarding/wedding, story reveal)
- **PASS (notable)** — Love story 4-part flow auto-builds a timeline (2018 met → 2021 almost → 2024 proposal → 2026 we do) AND composes a full narrative with monogram + "December 2026". Strong continuity.
- **CONFIRMED via oracle** — events.event_date is hardcoded NULL at commit (onboarding actions.ts:336). date_mode/date_candidates stored, but event_date NULL → editorial public go-live (date-gated) never auto-fires. BLOCKER.
- **CONFIRMED via oracle** — non-Catholic religious faith silently downgrades to ceremony_type='catholic' at commit (ALLOWED_CEREMONIES gate, actions.ts:290). Only 'catholic' is an active committed type.
- **CONFIRMED via oracle** — email signup path bounces to /login?ready=<email> instead of resuming onboarding (actions.ts:223-249). OAuth doesn't. Friction/broken.
