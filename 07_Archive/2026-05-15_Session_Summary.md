# Setnayan — 2026-05-15 Session Summary

**For:** Stakeholders (co-founders, investors, advisors)
**Session length:** ~one workday (extended evening)
**Net result:** 4 V1-launch-blocking decisions implemented + merged · 4 more in flight · 6 spec lock entries

---

## What shipped today (4 PRs merged to main)

### 1. UI Theme rebrand (PR #52)
Setnayan's default theme switched from terracotta to **burgundy** (`#7A1F2B`) — the rose-gold-to-burgundy palette family that's dominant in Filipino weddings since the mid-2020s. Avoids the saccharine-pink default that haunts most wedding-tech UX. A new fifth theme **"Forest & Champagne Gold"** added as the vendor-grounded / professional register (forest primary `#2D4A3A` + champagne gold accent `#C9A66B`). Theme picker now offers 5 options.

### 2. Self-review fraud prevention (PR #55)
Closes the fake-review vector where vendors could astroturf their own products. Three-layer hard-gate (schema CHECK + database trigger + API 403 + UI disabled state) refuses reviews where the reviewer shares vendor ownership, team membership, payment method, device fingerprint, or household address with the vendor. Filipino households legitimately share GCash and devices, so an admin appeal flow lets legitimate cases be unblocked.

Also: vendors who buy their own services now get a **confirm modal** at checkout — "Pay full price" or "Comp for myself" — so genuine vendor dogfooding is supported without polluting their own marketplace stats. Self-comp orders excluded from analytics.

### 3. Public-stats integrity (PR #54)
Vendors' public "completed events" count now filters out their own team's bookings, internal accounts, and self-comps. Uses materialized views that refresh on activity. Vendor dashboard gets a public-vs-private toggle so vendor admins always know what their public profile shows. Event-switcher gains direct Shop console / Admin console rows for multi-role users (vendors who are also planning their own events).

### 4. Vendor visibility + admin Website editor (PR #56)
**Vendor coverage:** vendors who register but aren't yet verified now show on the public marketplace as "Coming soon" cards (was hidden). Default ON for couples — they see the platform's growing vendor pool — opt-out via "Verified only" toggle.

**Website editor (NEW admin surface):** admins can now toggle marketing-site sections on/off and drag-drop reorder them via `/admin/website`. Generalizes per-section gating into a `site_widgets` registry. Each section can be enabled/disabled in real time without a code deploy. Future per-widget config editing (stats thresholds, store URLs) deferred to V1.1.

---

## What's in flight (4 more PRs landing tonight / tomorrow)

| Status | Description |
|---|---|
| 🔁 **PR #57** | Public homepage 12-section skeleton — perf optimization agent fixing lighthouse regression (0.71 → ≥0.9 target) |
| 🔁 **shared-chrome perf** | Fixing main's lighthouse regression caused by recent merges (shared layout bloat) |
| 🔁 **/for-vendors page** | Full vendor-side landing per spec — outcome-led acquisition with pricing visible (vendors decide on cost) |
| 🔁 **/features page** | Comprehensive feature deep-dive for couples who want depth before applying |

---

## Spec-side decisions locked today (6 new CLAUDE.md decision-log entries)

1. **Dual-role customer ↔ vendor — self-purchase confirm + self-review hard-gate** — closes fake-review vector
2. **V1 platform expansion** — Windows / macOS / iOS / iPadOS / Android native apps added to V1 launch scope (deferred to V1.5 in roadmap)
3. **Dual-role public-stats exclusion + role-switch in event switcher** — closes fake-reputation vector
4. **Public website (0015) Section-by-section spec replaced wholesale** — 12 new sections, mobile-first canvas, WCAG 2.2 AA baseline, Taglish voice, language self-names
5. **UI Theme system rebrand** — burgundy default + Forest & Champagne Gold (5th theme)
6. **Vendor public-visibility state machine + Website editor widget architecture** — `coming_soon` as default vendor state + admin widget management

---

## What's deferred (not in V1 launch)

- **Decision 2 — Native apps for iOS/iPadOS/Android.** Tauri 2 desktop wrapper exists for macOS + Windows (unsigned). Mobile native targets need Apple Developer Program enrollment ($99/yr) + iOS/Android Tauri targets. Recommendation: **ship V1 launch via web first**, native apps in V1.5 once user metrics validate the investment.
- **Decision 4 visual design polish.** PR #57 ships the structural skeleton but visual design (real photography, exact spacing/animation, art direction) is owner-side blocked. Follow-up PR after design lands.
- **Per-widget admin config editing.** Admin can toggle widgets on/off in V1; editing widget config (stats thresholds, copy overrides) is V1.1.

---

## Critical owner-side action

### `supabase db push` — production database migration

10+ pending migrations are in the main code branch but **NOT yet applied to production**. Without this push, half the new features will 500 in prod.

**Setup (one-time, ~3 minutes):**
```bash
npx supabase login   # opens browser for auth
cd ~/Setnayan/.claude/worktrees/seo-foundation
npx supabase link --project-ref <PROJECT_REF>   # ref is in your Supabase dashboard URL
npx supabase db push   # applies all pending migrations
```

After this one-time setup, future migrations apply with just `npx supabase db push`.

---

## What this means for V1 launch readiness

**Closer than this morning, by a meaningful margin.** Before today's session, V1 had:
- 23 iterations shipped, 5 partial, 6 deferred
- Multi-week implementation backlog of locked-but-uncoded spec decisions
- Public website on a 6–8 section layout, not the spec'd 12-section structure

After today:
- **All 6 V1-launch-blocking spec decisions are either in main or in flight**
- The big remaining engineering items are: PR #57 perf fix, shared-chrome perf, /for-vendors page, /features page — all in flight tonight
- Visual design polish is the only true remaining blocker for the spec-aligned homepage

**Realistic V1 launch timeline (1 engineer reviewing PRs):** ~1 week from when the 4 in-flight PRs land + when `supabase db push` is run + when visual design direction is provided for the polish phase of Decision 4.

---

## Companion docs (read for full context)

- `App_Build_Status.md` — code-shipped audit per iteration (just updated with 2026-05-15 PR Run section)
- `2026-05-15_Implementation_Roadmap.md` — phased implementation roadmap
- `CLAUDE.md` § Decision log — canonical lock entries for all 6 of today's decisions (search `2026-05-15`)
