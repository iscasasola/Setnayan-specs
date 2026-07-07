# Event Lifecycle Menu — Phase-Aware Navigation

**Design spec · 2026-06-16 · FINAL (consolidated after the multi-agent grounding study).**

> This doc states the **final plan** only. The original draft + the study's recommend→verify trail are preserved in `DECISION_LOG.md` (2026-06-16) — not duplicated here.
> Scope: this is the **MENU** (the navigation), not a rebuild of the app. Screens stay; the **nav becomes phase-aware** and surfaces only what matters in each phase.

---

## 1. Thesis

**Setnayan's menu follows the wedding's life.** Same bottom-nav shell; the tabs swap by phase. Each phase surfaces only what matters then — the prior phase's info recedes (planning is irrelevant on the day; day-of tools are irrelevant after). On the day, the menu *becomes* the Day-of experience ("the new Setnayan"). Ties to the **Living Memories** pillar: planning was scaffolding; what you keep is the moments + memories.

## 2. Phases & gate (the correctness spine)

| Phase | Trigger | Menu becomes |
|---|---|---|
| **Plan** | before the event window | the planning menu (today's nav) |
| **Day-of** | `isEventDayActive` (live ‖ post) **and not cleared** | the day-of command center (full takeover) |
| **Wrap-up** | day-of active **and** within `post` | a close-out checklist (a *state*, see below) |
| **After** | `events.cleared_at` is set (or auto-cleared) | Review · Editorial · Galleries |

**The gate is `isEventDayActive`, NOT `isInDayOfWindow`.** `getDayOfPhase` is midnight-anchored, so a normal 4pm–10pm reception runs at ~T+16h–T+22h → which the helper returns as **`post`, not `live`**. Gating on the bare "live" window would make the Day-of menu **vanish during the actual reception**. So: take over on `isEventDayActive` (live ‖ post).

**Wrap-up is a `cleared_at` STATE, not a time window.** The `post` window has to serve *both* the evening reception (still Day-of) *and* the next-morning wrap-up — a clock can't tell them apart, the cleared flag can. Resolved logic: `inactive`/`pre` → **Plan** · (`live`‖`post`) & not cleared → **Day-of** · cleared → **After**.

## 3. PLAN phase

Menu: **Home · Guests · Explore · Studio · Design · Budget** (today's nav). The Guests tab runs the journey (shipped, PR #1507): **Build → Invite → Confirm → Seat → [Day-of, greyed preview]**.
- **Build** — make the guest list + group it (sides / families / circles).
- **Invite** — ONE link for everyone; a guest opens it, completes their details, auto-matches to the list (or requests to be added).
- **Confirm** — approve a guest → they receive their personal QR.
- **Seat** — auto-seated to start; drag to re-route.
- **Day-of** — greyed preview of the next phase, not a planning stage.

Menu disappearance is **phase-level, not stage-level**: within Plan nothing vanishes (guest work is non-linear); the whole Plan menu steps aside when Day-of arrives.

## 4. DAY-OF phase — "the new Setnayan"

The menu **fully takes over**. **5 tabs: Now · Check-in · Seats · Services · Schedule.**
- **Slot 1 = Now** — the home root, which already *becomes* the live what's-happening view (`DayOfModeGrid`). The **Planning escape lives OUTSIDE the bar** (a top-bar link / day-of-banner affordance) — do NOT add a second Home/Planning tab pointing at the same `base` route (active-state collision).
- **Check-in** — the arrivals desk (`/guests/checkin`): scan/search → table + party + live headcount. Couple **or** delegated coordinator.
- **Seats** — find any guest's seat.
- **Services (LAUNCH)** — a **unified launch hub** gathering the owned services with a day-of verb: Panood → "Go live", Live Wall → "Open the wall", Papic → "Hand out seats", each ownership-gated, with an upsell state when unowned. *This hub is genuine new assembly* — the individual surfaces exist (`/live`, panood, papic) but the unified destination does not, and Panood "Go live" / Papic setup-seats are still stubs.
- **Schedule** — the run-of-show.
- **Broadcast** + **Get help** live in the `DayOfModeGrid` (command-center cards), not as nav tabs.

**Get help (same-day support):** **escalation leads** — an always-visible "Escalate to coordinator + Setnayan support" CTA (routes to the existing help inbox), because in-app chat is async (one message, then blocked until a non-free vendor accepts; no SMS in V1). The filtered-vendor shortlist is a *secondary* "fire a flare": query vendors `public_visibility='verified'` **and** `tier_state != 'free'` **and** `same_day_available=TRUE`, distance via `haversineKm` from the venue anchor; when the venue lat/long is null (common for off-platform venues) **fall back to a city/region list — never empty**. V1 = filter + escalation only; real same-day *booking* → V1.5, gated on opt-in density.

## 5. WRAP-UP / CLEARANCE — the gate into After

`post` window after the event, until cleared. Gates After:
1. **Clearance checklist** — stop the livestream · freeze the photo wall into the recap · close check-in (reflects teardown of the §4 launch surfaces). Anything still live is flagged.
2. **"Close out the day"** confirmation (couple **or** coordinator) → writes `events.cleared_at`.
3. **Auto-clear** at T+24h **enforced read-side** (the phase reads `cleared_at IS NOT NULL OR now() >= event_date + 24h`), with the existing force-majeure lazy on-pageview sweep as a convenience only — never the source of truth (no cron).
4. Only once cleared → the menu becomes **After**.

Symmetry: what you **launch** in Day-of is what you **finalize** here.

## 6. AFTER phase — memories

Menu: **Review · Editorial · Galleries.** The dashboard stays alive; **planning is demoted to a "Planning (reference)" escape, never deleted** (late deliverables + disputes still need it).
- **Editorial** — the living recap (Auto-Recap #1448 + Editorial / Living Memories).
- **Galleries** — download the collected photos, shown **"collecting → ready"** as deliveries land over days. ⚠ **Defined as "per-Papic-source," not "per-vendor"** until attribution exists (see §9.7) — `papic_photos` links to a Papic *seat*, not a vendor, and 0009 photo-delivery is event-level. Add seat→vendor attribution + hook delivery to mark-complete to get true per-vendor galleries.
- **Review** — a **per-vendor checklist**, gated by the completion handshake.

### 6.1 The completion handshake (the net-new core)

1. The **vendor marks the service complete** — a **new vendor-dashboard action** (today the *couple* flips `delivered`; there is **no vendor mark-complete action** — this inversion is the single biggest build delta). RLS-gated via `marketplace_vendor_id ∈ current_vendor_profile_ids()` (the FK already exists — no new FK). **Off-platform vendors** (`marketplace_vendor_id` null) have no writer → the couple's confirm + the M-day default carry the handshake.
2. The **couple confirms received** ("I got everything").
3. → that vendor's **review unlocks** + its galleries release.

**Gates (read-side, no cron):** review unlocks when `customer_confirmed_received_at IS NOT NULL` **OR** (`service_marked_complete_at IS NOT NULL` AND `now() >= service_marked_complete_at + 7 days` AND `completion_status <> 'disputed'`) **OR** legacy `status IN ('delivered','complete')` (backfill). The same migration **must fix the pre-existing non-vendor-scoped bug** by correlating the gate to the vendor being reviewed (`ev.marketplace_vendor_id = vendor_reviews.vendor_profile_id`) — today any one delivered vendor unlocks reviews for *all*.

- **Anti-gaming (vendor side):** auto-complete **N = 30 days** post-event (admin-configurable, read-side backstop) so a vendor can't dodge a review by never completing.
- **Anti-deadlock (customer side):** auto-confirm **M = 7 days** after the vendor's mark-complete so a silent couple doesn't trap a deserved review.
- **Escape valve:** a **non-delivery dispute** (a new flag type — `force_majeure_flags` has none today) sets `completion_status='disputed'` and freezes both the M-day clock and the sweep. This is **mandatory with the handshake**, not a later add — without it the auto-confirm can paper over a real non-delivery.
- **Admin force-complete** is the human backstop (needs a new `/admin` completion surface).

### 6.2 Two distinct gates
- **Event-level clearance** (§5) → lets the menu **enter** After.
- **Per-vendor completion** (§6.1) → unlocks **each** vendor's review + galleries independently.

### 6.3 Recommend your vendors — the couple's Recommended list (post-wedding)

Alongside the per-vendor review, the After phase **asks the couple to recommend their vendors** → builds the couple's **Recommended list**. The couple **picks which** vendors (per-vendor opt-in, not all-or-nothing; reversible), with an optional one-line endorsement. A recommendation is **separate from the review** (a review can be a fair 3★; a recommendation is an explicit, opt-in "I'd recommend them").

**Anti-fake guardrail — a recommendation is valid only when ALL hold** (a higher bar than a review, because a recommendation publicly *boosts* the vendor):
1. **A real inquiry existed** for that vendor + service — created **within the vendor's acceptable booking timeline / availability** for that service category on the event date (a booking the vendor could genuinely have accepted; not a fabricated link).
2. **The inquiry ran the full lifecycle to completion** (§6.1 handshake: inquiry → … → vendor mark-complete → couple confirm).
3. **Photo evidence of the service at the event exists** — actual photos documenting *that vendor's* service at *this* event (vendor- and/or couple-supplied, attributed to the vendor).
4. **Cross-service consistency** — if the event includes other services, the evidence photos must **match across services** (same event reality: event-window `captured_at` · venue geo · overlapping faces/guests). One vendor's evidence can't be fabricated in isolation — it has to cohere with the rest of the documented event.

*Feasibility:* layers 1–2 are automatable today (inquiry + schedule-pool availability + the completion handshake). Layers 3–4 depend on the **photo→vendor attribution** (the same gap as per-vendor galleries, §9.7) **plus a cross-service photo-consistency check** (metadata / geo / per-event face overlap). V1 = automated signals **+ an admin-review backstop** for flagged mismatches — don't block every recommendation on perfect automated matching. Reviews keep the lighter completion-only gate (§6.1); recommendations require this full stack.

**Where it surfaces:**
- **Couple's Editorial page** — a "vendors we loved" block shown to **guests + visitors** (guests = future couples → the organic **referral loop**).
- **Favorites for ALL hosts of the event** — each host / co-host of the event gets the recommended vendors **auto-saved to their favorites (the Explore shortlist)**, so when a host later plans their own event the vendors are already there. Private, per-host; reuses the shortlist.
- **Vendor marketplace profile** — a "**recommended by N couples**" trust signal (aggregate; named only with consent) — stronger than a star average because every recommendation is proof-backed.
- **Marketplace ranking + Setnayan recommendations (0038)** + a **vendor-dashboard badge**.
- **Admin** — owns the cross-match backstop + the zero-tolerance fake-event enforcement.

## 7. Actors & connections

- **Couple** — plan → operate + launch the day → confirm-received + review + download after → "Move to memories" (soft-archive) when done.
- **Coordinator (delegated)** — operate Day-of + run clearance. ⚠ `COORDINATOR_AREAS` has **no** `day_of`/`clearance`/`broadcast`/`services` grant today (only check-in works, via a dedicated RLS policy) — either add delegated areas or hard-code `couple‖coordinator` gates on close-out + launch, and write down which.
- **Vendor** — configure (Plan) → crew works the day (event QR / Papic, *not* a menu) → **mark complete** (After) → receive review. Their only lifecycle touchpoints are mark-complete + the **same-day-available** opt-in; the vendor dashboard is a separate shell and is **not** phase-aware.
- **Admin** — force-complete + completion/dispute oversight (new surface) + the fake-review guardrail.
- **Guest** — lives on their own landing page, **not** this menu. Day-of companion (0031). ⚠ The "guest After surface" + "guest-level review" promised earlier are **dropped from this menu's scope** (no guest-review model exists in code; the landing-page connection is undefined — spec separately if wanted).

## 8. Net-new vs. reuse (final)

**Net-new:** vendor **mark-service-complete** action · customer **confirm-received** action + "awaiting completion" UI · event-level **`cleared_at`** clearance + close-out checklist · **non-delivery dispute** flag type · vendor **`same_day_available`** flag + toggle · read-side **auto-complete-N (30d)** + **admin force-complete** surface · the unified **Services launch hub** · **Get-help** card · **After nav roster** (`buildAfterNavTabs`) · per-source **galleries "collecting→ready"** surface · "**Move to memories**" archive action + is-primary handoff · couple **Recommended list** (per-vendor opt-in endorsement) + its **anti-fake validation stack** (inquiry-within-availability check · photo→vendor evidence attribution · cross-service photo-consistency check with admin backstop) + its surfaces (Editorial "vendors we loved" block · **auto-favorite to all event hosts' shortlist** · marketplace "recommended by N couples" signal · vendor badge).

**Reuse:** `lib/day-of-mode.ts` phase helpers (`getDayOfPhase`, `isEventDayActive`) · `DayOfModeGrid` · `/live` · seating · check-in desk (#1271/#1278) · Auto-Recap (#1448) · Editorial · marketplace + `haversineKm` · vendor↔couple chat · `emitNotification` · admin Help inbox · the `events.archived` flag (exists; zero writers today).

## 9. Resolved decisions (studied — pending owner sign-off)

Admin-configurable values per the locked config-is-admin-managed rule.
1. **N = 30 days** vendor auto-complete (global, admin-set).
2. **Confirm-received = hybrid** soft block, **M = 7 days** auto-confirm, non-delivery dispute freezes the clock.
3. **Day-of = 5 tabs** (Now · Check-in · Seats · Services · Schedule); slot-1 = Now; Planning escape outside the bar; Broadcast + Get-help in the grid.
4. **Get help = filter + escalation in V1** (escalation leads); real booking → V1.5.
5. **After = living-memories dashboard + soft-archive-later** (3-layer: phase-flip not archival → planning demoted to reference → couple "Move to memories" writes the dormant `events.archived` + is-primary handoff; account stays a multi-event portfolio).
6. **Per-vendor galleries** start as **per-Papic-source** until seat→vendor attribution lands.
7. **Coordinator day-of permissions** — to be decided as delegated-areas vs hard-coded gate (see §7) when PR3 lands.
8. **Recommend-your-vendors (Recommended list)** — opt-in per vendor (couple picks which), separate from the review. **Anti-fake stack:** real inquiry within the vendor's acceptable availability → completed to completion → photo evidence of the service → cross-service photo consistency (auto signals + admin backstop). Surfaces: couple Editorial "vendors we loved" · **auto-favorited to all event hosts' shortlist** · marketplace "recommended by N couples" signal (§6.3).

## 10. Build order (validated, dependency-correct)

| PR | Step | Depends on | Risk |
|---|---|---|---|
| **PR1** | **Phase-aware menu swap (Plan ↔ Day-of).** `buildDayOfNavTabs()` in the **same** `customer-bottom-nav.tsx` (lint guard forbids a fork); thread `eventDate`→phase from the layout. **Gate on `isEventDayActive`, slot-1 = Now, Planning escape outside the bar.** | — | low |
| **PR2** | **Day-of contents** — the unified **Services launch hub** (ownership-gated, upsell when unowned) + **Get-help** & **Broadcast** cards in `DayOfModeGrid`. *Real assembly, not gathering.* | PR1 | med |
| **PR3** | **Clearance gate** — `events.cleared_at` (+`cleared_by_user_id`); derived **`after`** phase; `/clearance` checklist + "Close out the day" (couple‖coordinator); read-side T+24h auto-clear. | PR1, PR2 | med |
| **PR4** | **After menu + completion handshake** — vendor mark-complete, couple confirm, the M=7d hybrid review-gate rewrite **that also fixes the global-unlock bug**, the non-delivery dispute, `buildAfterNavTabs`, per-source galleries, read-side N=30d + admin force-complete. | PR1, PR3 | **high** |
| **PR5** | **Same-day "Get help"** — `same_day_available` flag + toggle; filtered query (verified + non-free + same-day + distance, null-anchor→city) + escalation CTA. | PR1, PR2 | low |
| **PR6** | **Recommend-your-vendors (Recommended list)** — per-vendor opt-in in the After Review flow (couple picks which); `vendor_recommendations` table; **anti-fake stack** (inquiry-within-availability + completion + photo→vendor evidence + cross-service photo-consistency w/ admin backstop); surfaces = Editorial "vendors we loved" + **auto-favorite to all event hosts' shortlist** + marketplace "recommended by N couples" + vendor badge. | PR4 (completion gate) · **photo→vendor attribution (§9.7)** · couple Editorial page + Explore shortlist (shipped) | med |

**Notes:** PR4 must follow PR3 (After can only be *entered* once clearance flips the phase). **PR5 only needs PR1+PR2 — parallelizable with PR3/PR4.** PR6 rides PR4's completion gate (you can only recommend a completed vendor) and the already-shipped couple Editorial page. Within PR4 the **vendor-scoped review correlation** and the **non-delivery dispute** are mandatory, not deferrable.

### Build status — SHIPPED 2026-06-16 (PR1 → PR6, all merged to prod)

| PR | State | Repo PR |
|---|---|---|
| PR1 — phase-aware menu swap (Plan↔Day-of) | ✅ merged | earlier |
| PR2 — Day-of contents (Services launch hub + grid cards) | ✅ merged | earlier |
| PR3 — Clearance gate (`events.cleared_at` + `after` phase + `/clearance`) | ✅ merged | earlier |
| PR4 — completion handshake (PR4a migration `20270101000000` + PR4b handshake UI) | ✅ merged | #1537 + 4a |
| PR4c — After menu roster (`buildAfterNavTabs`) + per-source Galleries hub (`/galleries`) | ✅ merged | #1552 |
| PR5 — same-day Get-help (`vendor_profiles.same_day_available` `20270104000000` + shortlist + escalation) | ✅ merged | #1556 |
| PR6 — Recommend-your-vendors (`vendor_recommendations` `20270105000000` + completion-gated recommend UI + "recommended by N couples") | ✅ merged | #1559 |

**Shipped anti-fake (PR6):** layers 1+2 (real inquiry + completion) enforced in the recommend-INSERT RLS (same completion OR-chain as the review).

**Follow-ups SHIPPED 2026-06-16 (post-PR6):**
| Surface | State | Repo PR |
|---|---|---|
| Admin **force-complete / uphold-non-delivery** backstop (`/admin/completions` + `event_vendors.completion_resolved_at` migration `20270106000000`) | ✅ merged | #1563 |
| Editorial "**vendors we loved**" block (`fetchEventRecommendations` + public `[slug]` editorial section + dashboard toggle; adversarially reviewed, no blocker/high) | ✅ merged | #1565 |

⚠ **Editorial block — owner sign-off pending (hybrid-anonymity):** the block names `business_name` + links with NO tier gate (spec §6.3-faithful — the couple explicitly, publicly endorses a vendor they hired), so a free-tier *verified* vendor's name shows on the public editorial. Mild tension with "free+verified names masked until first chat." Shipped spec-faithful; tier-gate is a 2-line change if owner prefers.

**Deferred net-new (still open, §8):** "**Move to memories**" archive (`events.archived` writer) · **photo→vendor attribution** (the one infra unlock for per-vendor galleries + recommend layers 3-4 + the **auto-favorite-to-hosts** surface, which also needs a per-user saved-vendors store).

## 11. Guardrails — do NOT revert these (or you reintroduce a verified bug)

1. Gate Day-of on **`isEventDayActive`** (live‖post) — `isInDayOfWindow` drops the evening reception.
2. **Wrap-up is a `cleared_at` state**, not a time window.
3. The handshake's anchor is the **vendor's mark-complete** (new action) — not the couple's `delivered` flip.
4. The review-gate rewrite **must add vendor correlation** — else one delivered vendor unlocks all reviews.
5. The **non-delivery dispute** ships **with** the M-day auto-confirm — it's the only escape valve.
6. All time-flips are **read-side** (`now() >= deadline`) — no cron; the lazy sweep is convenience only.
7. **No new FK needed** for vendor writes (`marketplace_vendor_id` + `current_vendor_profile_ids()` already exist) — don't block on it.
8. **Per-vendor galleries** need a photo→vendor join that doesn't exist — keep it per-Papic-source until added.

---

*Lineage: owner design session 2026-06-16 (guests sub-nav → journey → phase-aware menu) + the 2026-06-16 multi-agent grounding study (19 agents). Journey nav shipped PR #1505 → #1507. Full original-vs-final trail in DECISION_LOG.md (2026-06-16); summary memory `project_setnayan_event_lifecycle_menu`.*
