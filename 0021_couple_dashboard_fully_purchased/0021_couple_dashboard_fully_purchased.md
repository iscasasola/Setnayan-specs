# 0021 — Couple Dashboard, Fully-Purchased State

> **Purpose.** Visualize what a couple's event dashboard looks like 14 days before their wedding with **every paid Setnayan SKU active**. Pure preview — no new product surface is proposed; this validates that the 0000 app shell + every iteration that contributes to the dashboard renders cleanly in the maximal-purchase state.
>
> **Status:** drafted 2026-05-11
> **Companions:** `0021_couple_dashboard_fully_purchased.html` · `0021_couple_dashboard_fully_purchased.docx`

---

## 1. The scenario

Aira Reyes & Boy Delos Santos. Wedding date **November 15, 2026 at Tagaytay Highlands**. Today is **November 1, 2026** — T-14 days. They've already bought everything Setnayan sells.

### Active Setnayan apparatus

| SKU | Quantity | PHP | Status |
|---|---|---|---|
| Papic · 5 seats | 1 | ₱2,500 | Active — 5 of 5 claimed |
| Pro Camera Bridge | 2 grants | ₱3,000 | Active — 2 of 2 bound (Papic Seat #2 · Live Stream Cam #2) |
| Live Stream · Base | 1 | ₱2,500 | Active — broadcaster set |
| Live Stream · +1 Camera add-on | 2 | ₱2,000 | 5 camera slots total |
| Live Stream · +1 Hour add-on | 3 | ₱3,000 | 6 hours of stream capacity |
| Custom Monogram Pack | 1 | ₱2,000 | Active — event-wide flag ON |
| Broadcast Style Pack | 1 | ₱3,000 | Active — 4 modes available |
| LED Background | 1 | ₱599 | Rendering — USB ships T-7 |
| Invitation Widgets Pro Bundle | 1 | ₱200 | Active — all 3 widgets upgraded |
| AI Video Highlight (60s) | 1 | ₱2,000 | Queued — renders post-event |
| AI Edited Highlight (3-min) | 1 | ₱3,499 | Queued — renders post-event (repriced 2026-05-16 from ₱4,999) |
| Template Add-ons | 4 | ₱800 | 4 of 14 unlocked premade templates |
| **Total platform spend** | | **₱26,599** | |

### State around the wedding

- **8 vendors booked** — photographer, video, catering, HMUA, florals, lights & sound, mobile bar, coordinator
- **200 guests invited** — 156 RSVP'd attending, 21 declined, 23 still pending
- **76 guest face enrollments** complete (RSVP profile photos + portal uploads)
- **Mood Board** — palettes locked for all roles + venue
- **Seating Chart** — published, 12 tables, all 12 table QR tokens minted, print pack ready
- **Schedule** — 47 day-of timeline items + 14 upcoming vendor meetings in the next 14 days
- **Budget** — ₱712,400 vendor commitments + ₱26,599 Setnayan = **₱738,999 total**. ₱428,200 already paid. ₱310,799 remaining across 16 milestones (mostly final balances due T-7 to T-3)

This is what we want to render.

---

## 2. The 8 surfaces

The dashboard is event-scoped at `setnayan.com/dashboard/[event_id]/...`. Eight surfaces, all clickable in the prototype:

| # | Surface | URL section | What it shows |
|---|---|---|---|
| 1 | **Overview** (home) | `/` (event root) | Stage indicator, "what's next" cards, active apparatus, **QR codes & print packs**, **Planning artifacts**, activity feed |
| 2 | **Guest List** | `/guests` | 200 invitees as one continuous list with expandable group headers (Table / Role / Side / Custom). Mobile uses a bottom-sheet filter & sort popup. |
| 3 | **Vendors** | `/vendors` | 8 booked vendors. **Mobile uses a tap-to-expand card pattern** — see 2.2b below. Desktop shows the full card inline. |
| 4 | **Schedule** | `/schedule` | Day-of timeline + vendor meetings, .ics export |
| 5 | **Add-ons** | `/add-ons` | Every purchased apparatus with active status, deep-link to management |
| 6 | **Seat Plan** | `/seating` | Published seating chart canvas + 12 table QRs + Print Pack download (12 MB PDF). **Desktop: tables show every chair with profile photo or side-coded initials (per 0008 chair-circle interaction rule).** Mobile: tables only — chairs are too dense to render usefully on a phone screen. Tap a table on mobile → bottom sheet shows that table's guests as a list. |
| 7 | **Landing Page** | `/invitation` | Couple's public landing page editor with widget toggles, theme settings, live preview, page-view analytics |
| 8 | **QR Hub** | `/qr-codes` | All 5 QR sets consolidated · TTL rules visible per set · re-mint / re-issue actions · Print Pack regen |
| 9 | **Gallery** | `/gallery` | All event media in 5 sections — Papic photos, Panood broadcast recording, Patiktok guest reels, Video Messages from the voice/video guestbook, AI Highlights (60s + 3-min). Pre-event = placeholder explainers; post-event = live media library with 7-day couple-review gate before guest unlock. |

Mobile uses the 4-tab bottom-nav from 0000 (Guests / Vendors / Schedule / Services). Surfaces 1 (Overview), 6 (Seat Plan), 7 (Landing Page), 8 (QR Hub), 9 (Gallery) are reached via Home cards or the **dashboard home icon** (see 2.0a below).

### 2.0a Home layout · Guided mode default · DIY toggle

Home is the daily-driver. Couples spend more time here than anywhere else. The layout is intentionally **calmer than a dashboard** — closer to a friend giving you the day's checklist than an analytics screen.

**Top-to-bottom order** (updated 2026-05-20 · three-bucket guide model — see CLAUDE.md decision log "Home is the guide" row):

1. **Warm welcome row.** "Good morning, Aira" + date + "14 days until you marry Boy in Tagaytay" in italic Cormorant. Right-side: **Mode toggle pill** — `✦ Concierge · DIY` (label updated 2026-05-16; replaces "Guided" per the Setnayan Concierge rebrand).
2. **Stage strip.** 6-stage lifecycle bar with the current stage highlighted. Labels under each pip. No "stage banner" wall block — just the strip.
3. **Hero · NEXT UP card.** ONE highlight pulled from the top of the **NOW / THIS WEEK** bucket (see #4) — the most imminent thing the couple needs to do/attend. Default fallback when that bucket is empty: tomorrow's calendar item. Single CTA button + a soft "view full schedule" link. Gradient-accent background distinguishes it from everything else.
4. **Guide buckets · NEW · locked 2026-05-20.** The active home guide rendered as three tactical buckets — the truth-telling layer that surfaces to **all couples (DIY and Concierge)** because hard floors are facts, not personalized service:
   - **NOW / THIS WEEK** — every step whose `latest_by_days_before_wedding` floor is approaching OR whose earliest-comfortable-start window has already passed. In compressed-timeline scenarios (couple is 6 months out instead of 12) this bucket front-loads aggressively — most steps pile here, NOT paced evenly across remaining months. Examples for a 6-mo-out couple: *start church paperwork · apply for marriage license · send save-the-dates · book photographer / coordinator · finalize venue if not yet locked.* Card surface: title, one-line context, latest-by date, primary CTA, optional "why this matters" tooltip.
   - **COMING WEEKS** — steps whose earliest-comfortable-start is still ahead but before the near-wedding window. Examples: *finalize guest list · lock mood board + outfits · send formal invites.*
   - **NEAR WEDDING** — steps whose floor sits intentionally close to the wedding date regardless of how compressed the couple is. These stay put. Examples: *RSVP deadline (T-30d) · final fittings (T-14d) · caterer final headcount (T-14d) · day-of timeline confirm (T-7d).*

   **Source data** lives in iteration 0016 § 1 "Latest-by floors per category" — 18 vendor categories + 12 hard-floor sub-tasks (pre-Cana, marriage license, CENOMAR, save-the-date, etc.), each with a `latest_by_days_before_wedding` value. Bucket assignment is computed per page load: `computed_deadline = wedding_date - latest_by`, then `today` vs the comfortable-start window determines which bucket the step renders in. No cron — refreshed on Home view (per PR #47 cron lock).
5. **Done · NEW · locked 2026-05-20.** Completed steps sink to this section at the bottom, rendered dim with checkmark + month completed. They never disappear — couples value seeing progress. If a couple manually un-completes a step (per 2.0b's undo affordance), it bubbles back to its appropriate bucket. Empty in early-planning state; grows as the wedding approaches.
6. **Your wedding journey · step N of 9.** The high-level Setnayan Concierge lifecycle overview (see 2.0b). Steps 1–6 collapsed and dim if completed. Step 7 (current) expanded with mini-checklist + CTA. Steps 8–9 dim placeholders ahead. This block is the *lifecycle overview* (where am I in the 9-stage arc); the **guide buckets in #4 above are the tactical "what do I do this week" layer.** Both visible by design — buckets answer "what now," journey answers "where am I in the bigger story."
7. **Continue planning · 8-tile navigation grid.** All 9 surfaces accessible from one grid: Guests · Vendors · Schedule · Services · Seat Plan · Landing Page · QR Hub · Gallery. Each tile shows a one-line metric ("156 ✓ · 23 pending").
8. **Recent activity.** Compact dashed-divider list. 4-5 most recent events.
9. **Setnayan Pay info card.** Small, one-line — opt-in convenience reminder, not a sales pitch.

**Removed from V1 Home** (moved to their proper tabs):
- Full "Active Setnayan apparatus" detail cards → Services tab
- "Add more to your event" upsell catalog → Services tab
- "Vendor pulse" ring row → Vendors tab
- "Vendor readiness" 6-row table → Vendors tab
- QR codes 4-tile section → QR Hub surface
- Planning artifacts 3-card section → represented in the new navigation grid
- "What's next" 3-card row → consolidated into the Concierge journey current-step block + the NEXT UP hero

The result is a Home that scans in seconds — hero · buckets · grid — with the journey overview and Done section as supporting context. The detail still exists; it just lives where it belongs.

### 2.0b Setnayan Concierge · the 9-step journey (simplified 2026-05-17 to single-SKU + 3-day trial)

**Access model updated 2026-05-17.** The 9-step Setnayan Concierge journey is an **optional paid SKU** — single tier `concierge_complete` at ₱4,999 / 12 months — with a **card-less 3-day free trial** (one per account, not per event). The 2026-05-16 ₱2,499 Essentials tier was retired same-week per the second 2026-05-17 decision-log row; the 7-day per-event preview was replaced by the 3-day account-level trial in the same lock. Defined canonically in iteration 0016 § 0. **DIY mode is the free default** for every event; Concierge is the upgrade.

A wedding journey is a **9-step checklist** that maps to the 6 lifecycle stages:

| # | Step | Maps to stage | When |
|---|---|---|---|
| 1 | Set your date + venue | Discovery → Planning | Months 1–2 |
| 2 | Build your guest list | Planning | Month 2–3 |
| 3 | Send invitations | Planning → Confirmation | Month 4–5 |
| 4 | Book your core vendors | Confirmation | Months 4–8 |
| 5 | Plan your reception look | Confirmation → Final Prep | Months 7–10 |
| 6 | Set up Setnayan capture | Final Prep | Months 8–11 |
| 7 | Final-week confirmations | Final Prep | Last 2 weeks |
| 8 | Event day | Event Day | The day |
| 9 | Post-event | Wrap | Days 1–30 after |

### Four dashboard surface variants (plus enforcement overlay)

The dashboard Home renders one of four event-state variants based on `events.concierge_status`, with an additional enforcement-state overlay that modifies the upgrade banner copy when `users.concierge_enforcement_level != 'none'`. Schema lives in iteration 0016 § 0; column rename history: `guided_planner_status` (2026-05-14) → `concierge_status` (2026-05-16) · enum value `'preview'` → `'trial'` (2026-05-17 · 3-day trial replaces 7-day preview · one trial per account, not per event).

**(A) DIY mode** (`concierge_status = 'diy'` · default for every new event):
- 10-tile grid + activity feed (no journey checklist)
- **Upgrade banner pinned at the top** of the Home surface — single-SKU offer + 3-day-trial entry (the trial CTA hides when `users.concierge_trial_used_at IS NOT NULL` OR `users.concierge_enforcement_level IN ('trial_banned', 'full_banned')`):
  ```
  ┌─────────────────────────────────────────────────────────────┐
  │ ✨ Activate Setnayan Concierge — your wedding-planning      │
  │    assistant. 5× cheaper than a human coordinator.          │
  │                                                              │
  │    Setnayan Concierge · ₱4,999 / 12 months                  │
  │    ₱13.69 / day. Honeymoon planning included.               │
  │                                                              │
  │    [Continue with Concierge]   [Try 3 days free]   [✕]      │
  └─────────────────────────────────────────────────────────────┘
  ```
- Couples can dismiss the banner (state stored in `users.dashboard_dismissed_banners`); reappears every 14 days OR when wedding date < T-90 days OR after every checkout
- All 10 dashboard tiles fully functional — no feature gating on tools themselves
- Each step links to the relevant surface(s) for couples who want to manually use the navigation
- The "Try 3 days free" CTA calls `start_concierge_trial(event_id)` → similarity check + account-level cap check → on pass flips status to `'trial'` (variant B); if abuse-flagged shows the under-review modal instead

**(B) Trial Concierge** (`concierge_status = 'trial'` · 3-day card-less taste of full Concierge features):
- Full Concierge feature surface enabled for 3 days — 9-step journey checklist, daily nudges, priority vendor matching, honeymoon planning tile
- **Trial-countdown banner pinned at the top** of the Home surface:
  ```
  ┌─────────────────────────────────────────────────────────────┐
  │ ✦ Trial · X days left                                       │
  │ Continue with Setnayan Concierge — ₱4,999 / 12 months       │
  │                                                              │
  │    [Buy Setnayan Concierge]                                 │
  └─────────────────────────────────────────────────────────────┘
  ```
- 9-step journey rendered identically to (C) Active
- No payment-pending state on the trial itself — couples are NOT charged at any point during the 3 days
- At T+3, daily cron flips status to `'expired'` (variant D) regardless of whether the couple has bought
- Account-level cap means a couple who used their trial on Event A cannot get another trial by creating Event B on the same account

**(C) Active Concierge** (`concierge_status = 'active'` · paid):
- 9-step journey checklist surfaced prominently on Home with the per-step states:
  - Completed: dim with checkmark + month it was completed
  - Current: highlighted with accent gradient + mini-todo list + CTA
  - Future: dim placeholder with the date it'll activate
- Each step links to the relevant surface(s) so couples can dive in without hunting
- Days-remaining strip in the header reads "Setnayan Concierge active · X weeks remaining" with [Extend] CTA — X reflects the **wedding-anchored** `concierge_expires_at` (per iteration 0016 § 0 formula: `LEAST(wedding+30d, activated+24mo)`, min `activated+12mo`)
- When `concierge_expires_at - NOW() < 14 days` → renewal nudge banner appears
- Full feature set: daily nudges, priority vendor matching, honeymoon-planning tile (no Essentials-vs-Complete differentiation — single SKU as of 2026-05-17)
- **Long-engagement advisory** — if `events.concierge_long_engagement_advised_at IS NULL` AND `events.wedding_date > concierge_activated_at + INTERVAL '24 months'`, a one-time inline advisory renders below the days-remaining strip with the "renew closer to your wedding" copy + a [Got it] dismiss action that stamps `concierge_long_engagement_advised_at`. Fires when wedding_date is first set (typically via Concierge Step 1 OR Profile) — the dashboard surfaces it on next page load rather than as a hard modal interrupt.

**(D) Expired Concierge** (`concierge_status = 'expired'`):
- 9-step journey **still visible but greyed-out** (so couples can see progress they made + entice re-purchase)
- Reactivation banner: "Reactivate Setnayan Concierge — ₱4,999 / 12 months"
- All 10 dashboard tiles remain fully functional (same as DIY — no tool gating, just no active assistant layer)
- The 3-day trial is NOT offered again from this state (one trial per account · `users.concierge_trial_used_at` is set on first trial)

### Enforcement-state overlay (NEW 2026-05-17)

When `users.concierge_enforcement_level != 'none'`, the upgrade banner above is replaced or augmented per the tier:

| Enforcement level | Banner treatment |
|---|---|
| `'none'` (default) | Standard upgrade banner per variants A/B/C/D above |
| `'warning'` | Standard banner + small inline notice: *"Heads-up: your account was flagged once for review. The trial remains available; further flags may limit access."* (audit-only) |
| `'trial_banned'` | Upgrade banner shows only the [Continue with Concierge] CTA (trial CTA hidden). Inline notice: *"3-day trial unavailable on this account. Purchase to access Setnayan Concierge."* + [Why? Appeal ticket →] link to 0029 help center |
| `'full_banned'` | Upgrade banner replaced entirely with: *"Setnayan Concierge unavailable on this account. Contact support if you believe this is in error."* + [Open appeal ticket →] CTA to 0029. Couple can still use DIY mode normally; all 10 dashboard tiles remain functional |

The overlay applies whether the event is in DIY (A), Active (C), or Expired (D). It does NOT apply to events in Trial (B) — those are already mid-trial so enforcement state doesn't change the in-trial experience until trial expiry.

### Schema

```sql
-- Defined canonically in iteration 0016 § 0; restated here for clarity:
ALTER TABLE events
  ADD COLUMN concierge_status TEXT
    NOT NULL DEFAULT 'diy'
    CHECK (concierge_status IN ('diy', 'trial', 'active', 'expired')),
  ADD COLUMN concierge_tier TEXT
    CHECK (concierge_tier IN ('complete')),               -- Essentials retired 2026-05-17; enum kept for forward-compat
  ADD COLUMN concierge_expires_at TIMESTAMPTZ;
-- events.concierge_preview_used_at RETIRED 2026-05-17 — replaced by users.concierge_trial_used_at (account-level cap)

ALTER TABLE users
  ADD COLUMN concierge_trial_used_at        TIMESTAMPTZ,                                                                  -- one trial per account
  ADD COLUMN concierge_abuse_strike_count   INT NOT NULL DEFAULT 0,
  ADD COLUMN concierge_enforcement_level    TEXT NOT NULL DEFAULT 'none'
                                            CHECK (concierge_enforcement_level IN ('none', 'warning', 'trial_banned', 'full_banned'));
-- See iteration 0016 § 0 for the full users-table schema (5 additional enforcement-audit columns) + the concierge_abuse_flags table.

-- 9-step journey state (kept as before — auto-populated whether DIY or paid,
-- but rendered prominently ONLY in Preview/Active/Expired modes; DIY couples see grid only):
CREATE TABLE event_journey_steps (
  event_id   UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  step_id    SMALLINT NOT NULL CHECK (step_id BETWEEN 1 AND 9),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (event_id, step_id)
);
```

The 9 rows are seeded when the event is created — even for DIY couples — so that decisions persist across mode flips. If a DIY couple completes Step 1 (sets date + venue) and then activates Concierge later, the journey reflects the work already done. Steps auto-complete based on real platform actions (e.g., Step 3 marks complete when invitations have been sent + at least 1 RSVP recorded; Step 4 marks complete when ≥3 vendors are in Accepted or Active stage; etc.). Couples can also manually mark a step done or undo it.

**Note on the prior `users.planner_mode` column:** the 2026-05-14 lock superseded the original "guided is default + opt-out to DIY" model. The state moved from `users.planner_mode` (account-level) to `events.guided_planner_status` (event-level), and the 2026-05-16 repricing renamed `guided_planner_status` → `concierge_status` (plus the enum widening for the new `'preview'` state and the tier value swap to `'essentials' | 'complete'`). If `users.planner_mode` or any `guided_planner_*` columns still exist in the live schema, they are now ignored / pending the rename migration described in iteration 0016 § 0 Migration note.

---

### 2.0b' Wizard surfaces (locked 2026-05-18 cross-ref to 0016 §§ 0b/0c/0d)

The 9-step journey above (§ 2.0b) is the static spine. **2026-05-18 adds the active wizard layer** that conducts the planning in real-time — turning the 9-step checklist from "what you should do" into "what's next for you specifically." Wizard surfaces appear when `events.concierge_status IN ('active','trial')`; DIY home stays marketplace-forward.

The wizard's full architecture, schema, and behavior is locked in 0016 §§ 0b-0e. This section describes how the wizard surfaces render on 0021 Home.

#### Wizard home variants (one codebase, conditional layer)

Both DIY and Concierge couples see the same Home layout (§ 2.0a) — same routes, same artifact tiles, same data substrate. The difference is what occupies the top half of the screen:

**DIY home (concierge_status = 'diy' or 'expired'):**
- Warm welcome row + Stage strip + NEXT UP hero (unchanged)
- 9-step journey block remains, but Steps are self-driven (no active nudges)
- **Marketplace-forward block** above the navigation grid: vendor search bar + recommended categories ("Browse photographers · Search venues in NCR · Find your caterer")
- 3 free brain questions remaining indicator
- Subtle "Upgrade to Concierge for active help (₱2,499 or free with any Pro Weekly vendor)" CTA at the bottom of the page — never persistent banner pressure

**Concierge home (concierge_status = 'active' or 'trial'):**
- Warm welcome row + Stage strip + NEXT UP hero (unchanged)
- **Next Actions strip** replaces the marketplace-forward block — see § 2.0b'.1 below
- **Concierge Plan tile** in the navigation grid — see § 2.0b'.2 below
- 9-step journey block remains but each step now surfaces its active sub-tasks (per the canonical wedding timeline in [`04_Planning_Timelines.md`](../02_Specifications/18_Concierge_Brain/04_Planning_Timelines.md))
- "Your coordinator did X" stream visible if a coordinator is delegated to this event — see § 2.0b'.3 below
- No quota indicator (unlimited brain Q&A)

#### 2.0b'.1 Next Actions strip

A 3-tier scrollable card row at the top of Concierge home, sourced from `getNextActions(event_id)`. Cards refresh on every page load (no separate cron per PR #47 cron lock).

```
┌──────────────────────────────────────────────────────────────┐
│ 🔴 OVERDUE        🟡 THIS WEEK      🔵 NEXT PRIORITIES        │
│ ─────────────     ─────────────     ─────────────             │
│ • ₱25K deposit    • Tasting Fri 3pm • Browse 6 venues in NCR  │
│   due 2d ago      • Stylist quote   • Lock your reception     │
│   [Pay now]         expires Sat       venue first             │
│ • Photographer    • Florist meeting  [See venues]             │
│   meeting was       Sat 10am                                  │
│   yesterday       [Add to cal]                                │
│   [Mark done]                                                 │
└──────────────────────────────────────────────────────────────┘
```

**Source tables** (the strip aggregates these — no new tables): `event_vendors`, `vendor_meetings`, `payment_milestones` (0007), `event_journey_steps` (0016), `event_guests` (0001), `mood_board_palettes` (0010), `seat_plan_status` (0008), and the canonical wedding timeline applied against `events.wedding_date`.

**Empty-state copy** (per the "no dev text post-launch" rule in 2026-05-18 fifth decision-log row): when all three tiers are empty (a calm planning week), the strip shows a single line — *"You're caught up. Setnayan Concierge will surface what's next as your wedding gets closer."* No banner, no upsell, no nag.

#### 2.0b'.2 Concierge Plan tile (in the navigation grid)

The "Continue planning" tile grid gains one new tile when Concierge is active:

```
┌────────────────────┐
│ ✦ Your Plan        │
│                    │
│ Tier 3 · 150 guests│
│ NCR · Catholic     │
│ Feb 14, 2027       │
│                    │
│ Generated 6 days ago│
└────────────────────┘
```

Click → opens the **personalized plan document** (per 0016 § 0b plan generation). This is the take-away artifact generated at intake — couple can re-read anytime. Static after generation; regenerates only when an anchor fact changes (date moves >3 months, guest count ±50, etc.).

**Important:** the plan tile survives downgrade. If the couple drops to DIY, the tile remains as a read-only document. Plan never deletes (per 0016 § 0b data permanence subsection — "data is never deleted, period").

#### 2.0b'.3 Coordinator activity stream (when a coordinator is delegated)

When a coordinator is booked AND delegate-access is granted (per 0016 § 0d), Home gets a new collapsible section below the Next Actions strip:

```
This week your coordinator Anna handled:
  ✓ Confirmed ₱25,000 deposit received by Caterer Y · Wed 11am
  ✓ Rescheduled Photographer X tasting to Saturday · Wed 2pm
  ✓ Shared your mood-board palette with Florist Z · Thu 9am
  ✓ Replied to Florist Z's quote question · Thu 9am

  See all actions →
```

Sourced from `event_action_log WHERE performed_by_role = 'coordinator' AND event_id = ? ORDER BY performed_at DESC LIMIT 5`. Click "See all actions" → opens a chronological full-history view of every coordinator action on this event.

Builds trust + transparency. Couples see their coordinator-fee being spent on real work. Coordinator can't ghost the couple — every action is logged with timestamp.

#### 2.0b'.4 Smart intake on upgrade (DIY → Concierge)

When a DIY couple upgrades to Concierge (via direct ₱2,499 purchase OR via booking a Pro Weekly vendor), the wizard pre-fills intake forms from existing event data and only asks the **missing pieces**:

| Field | If already in event data | If missing |
|---|---|---|
| Wedding date | Pre-fill from `events.wedding_date` | Required |
| Region | Pre-fill from `events.region` | Required |
| Guest count | Pre-fill from count of `event_guests` rows | Optional — wizard estimates |
| Religious tradition | NOT typically in event data | **Required — must ask** |
| Foundation state | NOT in event data | **Required — must ask** |
| Working-budget tier | Sometimes in event data | Optional — wizard infers |

Upgrade intake reduces to ~2-3 questions instead of 5 for couples who've been on DIY for weeks. Wizard activates immediately after submission.

#### 2.0b'.5 Trial-end conversion (per 0016 § 0 trial logic + brand-truth framing)

If the couple is on trial (T+0 through T+3) and approaching expiry, Home shows a contextual banner:

- **T+0 trial start** — Welcome modal: *"Your trial just started — here's everything Concierge does for the next 3 days. Plan stays saved forever."*
- **T+1 / T+2** — Persistent in-app banner: *"X days left in your trial."*
- **T+2 morning** — Modal: *"1 day left — want to keep going?"* with primary CTA *"Keep Concierge — ₱2,499"* + secondary *"Continue with DIY"*.
- **T+3 expiry** — Final modal then `concierge_status` flips to `expired` on the cron sweep; couple wakes to DIY UI + a *"You can come back anytime — your plan stays right here"* card.

Trial-end CTA copy focuses on the value of the active helper. **Never threatens data loss** — per the "data permanence is a brand truth" subsection in 0016 § 0b, nothing is deleted on downgrade. The trial-end prompt sells the wizard, not data survival.

### 2.0c Profile avatar = dashboard home shortcut

The couple's **profile avatar in the upper-right** of every app bar is the always-visible "jump to dashboard" affordance. Clicking it returns to the Overview / Home surface from anywhere in the app. A soft accent ring around the avatar signals it's interactive.

Desktop: 30px round avatar with initials (e.g., "AB" for Aira & Boy) — shown as a profile photo once the couple uploads one (face-enrollment image doubles as their profile photo).

Mobile: 22px round avatar with the same initials/photo.

The avatar is the profile picture by convention; tapping it doubles as both "this is me" identity and "take me home." No separate dashboard icon needed — keeps the chrome clean and matches the native-app pattern most couples already know.

---

## 2.1 QR token rules — per QR type (locked)

Rules are applied **per QR code, not blanket**. Each QR type has its own profile.

| QR set | TTL | No-password? | Regen cost | Time-locked usage | How-to video on activation | Pre-event connection |
|---|---|---|---|---|---|---|
| **Event Join QR** | event_date + 90 days | yes | free | — | — | — |
| **Table QRs** | event_date + 30 days | yes | free (re-publish idempotent) | — | — | — |
| **Personal guest QRs** | event_date + 90 days | yes | free | — | — | — |
| **Papic seat claim QR** | one-shot · consumed on claim | **yes** | **₱500 per regen** | **Nov 15 capture window** | **yes** | **yes** |
| **Patiktok access QR** | one-shot per guest · consumed on claim | **yes** | **₱500 per regen** | — (post-event 90 days) | **yes** | **yes** |
| **Panood broadcaster QR** | one-shot · consumed on claim | (not specified) | (not specified) | **6 hrs of purchased stream capacity** | **yes** | **yes** |

**Rules explained:**

- **No password.** For QR-based services, the QR itself IS the credential. No additional password gate.
- **Regen cost.** ₱500 per regeneration (proposed). Covers lost phone / lost place card / accidental QR leak. Revokes prior token.
- **Time-locked usage.** Service is accessible from the dashboard anytime, but actual usage is bounded to a specific window. Papic capture is the wedding day. Panood usage is bounded by the hours purchased (Aira & Boy have 6 hrs).
- **How-to video on activation.** When a QR is scanned for the first time, a short tutorial video plays explaining how to use that service. Video is per-QR (Papic operator sees Papic instructions; Patiktok guest sees Patiktok instructions; Panood broadcaster sees broadcaster console).
- **Pre-event connection.** Devices can pair / register before the actual time window opens. Status displays as "Connected · waiting for [window]." When the window opens, devices auto-activate.

**Two more rules baked in.** (a) No cross-event reuse: every token carries `event_id`; tokens from another wedding are rejected. (b) Print Pack regeneration: re-minting any printable QR auto-regenerates the Print Pack PDF; old PDF downloads still resolve but flag as "outdated."

---

## 2.2 Naming — Papic · Patiktok · Panood (the media trio)

Setnayan's media services use Filipino-coined names:

| Name | What it does | Locked behaviors |
|---|---|---|
| **Papic** | Native paparazzi capture (Papic = paparazzi) | Seat claim QRs, no password, ₱500 regen, capture-window time-lock, how-to video, pre-event connection |
| **Panood** | Live broadcast (Panood = "to watch") | Broadcaster QR, time-locked to purchased hours, how-to video, pre-event connection |
| **Patiktok** | Guest reel builder (Patiktok = tiktok-style reels) | Per-guest access QRs, no password, ₱500 regen, how-to video, pre-event connection |

---

## 2.2a Guest List · spreadsheet bulk-edit mode (locked)

The Guest List surface offers three view modes on desktop:

| Mode | Best for | Notes |
|---|---|---|
| **List · Card** | Reviewing seating, scanning RSVPs | Default. Continuous list, expandable group headers. |
| **List · Spreadsheet** | Bulk entry, paste from clipboard, batch updates | Google Sheets-style table. Live-synced via Supabase Realtime. Coordinator can co-edit. Cursor presence shown per editor. |
| **Seat plan view** | Visual seat-by-seat editing | Renders the seating chart canvas (see Seat Plan surface). |

**Synced co-editing.** Both couple and coordinator (when granted thread access per 0019) can edit the spreadsheet simultaneously. Each editor's active cell highlights in their assigned color (couple = accent, coordinator = groom blue). Last-write-wins per cell; conflicts surface a tiny "X edited this 2s ago" inline hint. No locking.

**CSV / Google Sheets bridge.** For couples who'd rather work outside the app: export the full list as CSV, edit in Google Sheets or Excel, import back. Setnayan matches existing rows by guest_id; re-imports update without duplicating. New rows flag as "pending review" before going live, preventing accidental garbage data. Paste-from-clipboard also accepts TSV directly.

**Mobile note.** Spreadsheet view is desktop-only. On mobile, the "Bulk edit" CTA points to: "Open this on your laptop or import a CSV from your phone." Mobile users do bulk entry via the CSV import flow, then refine on the spreadsheet on a larger screen.

---

## 2.3a Per-vendor 6-stage readiness tracker (locked)

Every booked vendor exposes a 6-stage progress bar. The vendor self-updates from their own dashboard; the couple and the coordinator have read-only view. State changes log to `vendor_stage_log` with `(vendor_id, event_id, from_stage, to_stage, actor_id, transitioned_at)`.

| # | Stage | Meaning | Typical timing |
|---|---|---|---|
| 1 | **Planning Locked** | Contract signed, milestones agreed, scope frozen | Weeks/months pre-event |
| 2 | **Preparing Materials** | Sourcing, prep, kit assembly | T-30 to T-3 |
| 3 | **Ready to Deploy** | Materials packed, team scheduled, ready to leave | T-1 to event morning |
| 4 | **Arrived On-Site** | Team checked in at venue | Event day |
| 5 | **Installing** | Actively setting up | Event day |
| 6 | **Ready for Event** | Setup complete, waiting for first guests | Event day, pre-guest-arrival |

**Where it's surfaced:**
- **Home (Overview)** — aggregate readiness summary: how many vendors at each stage (e.g., "5/8 at stage 2"). Updates in real time.
- **Vendors tab** — each vendor card shows the 6-pip strip + current stage label + last updated timestamp.
- **Coordinator** — sees the same data through their per-thread access (per 0019 spec) when granted by the couple.

**Why stages, not just payment.** Pre-event, the couple cares about money. Approaching the event, they care about readiness. Stage tracking is the readiness signal. The mobile design enforces this — on mobile the Vendors view leads with stages, not payments (see 2.3b).

---

## 2.3b Mobile vital-info rule (locked)

On mobile, every surface shows only the **currently-vital** information for the lifecycle stage.

| Lifecycle stage | What's vital on mobile | What's hidden on mobile |
|---|---|---|
| Discovery / Planning | Vendor name, category, payment progress | Stage tracker (vendors haven't started) |
| Confirmation / Final Prep | **Stage tracker · readiness focus** | Payment details (move to Budget surface) |
| Event Day | Stage tracker · live updates | Everything else |
| Wrap | Gallery state · download counts | Stage tracker (all done) |

Aira & Boy are in Final Prep (T-14). Mobile Vendors view shows: vendor name + category + **6-pip stage bar + current stage label**. Payment info is one tap away in Budget surface, not on the vendor list.

Desktop carries fuller detail (stage + payment + meetings + chat) because the larger viewport supports it; mobile triages aggressively.

---

## 2.3c Vendor ingress / egress (locked)

Vendors don't just have a "service window." On event day each vendor has:

- **Ingress** — when they arrive on-site and start set-up. Begins hours before the service window for installer-heavy vendors (florals, lighting, catering).
- **Service window** — when their service is actually live to guests.
- **Egress** — when they tear down and leave. Often runs past midnight for sound/lights/catering crews.

Aira & Boy's ingress/egress table (modeled in the Schedule surface) shows total on-site time per vendor — useful for venue load-in coordination, vendor parking allocation, and crew-meal headcount. Coordinator surfaces this prominently; couple sees it as reference.

**Schema.** `vendor_event_window(vendor_booking_id, ingress_at, service_start_at, service_end_at, egress_at)`. Per-event so vendors with multiple wedding dates carry independent windows.

---

## 2.3d Extend-hours / extend-units for time-locked services (locked)

Couples can buy more capacity for time-locked services **continuously and at any time** — not just at initial purchase:

| Service | Extension SKU | Unit price | Notes |
|---|---|---|---|
| **Papic** | + Seat (₱500) · + Extra Day (₱500) | per unit | Day-extension widens the capture window beyond Nov 15 (rehearsal-dinner shoots, post-wedding brunch) |
| **Panood** | + 1 Hour (₱1,000) · + 1 Camera (₱1,000) | per unit | Already in V1 spec; surface the buy-more button on the active service card |
| **Patiktok** | + Extend reel window (₱500) · + Template (₱200 each) | per unit | Default reel window is event_date + 90 days; extension pushes the deadline back 30 days |
| **AI Highlight** | + Another render (₱2,000 / 60s or ₱5,000 / 3 min) | per unit | Multi-purchase by spec |
| **Pro Camera Bridge** | + Grant (₱1,500) | per unit | Adds another bound DSLR slot |

Surfaced in two places: the Active services section on Home (per-card "Extend" CTAs) AND a dedicated "Upgrades available" section on the Services catalog. Same apply-then-pay flow as the original purchase.

---

## 2.3e "Upgrade to ___" prompts (locked)

For couples who haven't bought the highest tier of a tiered service, the Services catalog surfaces the next tier with an Upgrade CTA. Examples (when applicable):

- **Papic 3-seat purchased** → "Upgrade to 5-seat · +₱1,000" / "Upgrade to 8-seat · +₱2,500"
- **AI Video Highlight (60s) purchased** → "Upgrade to AI Edited Highlight (3 min) · +₱3,000"
- **Pro Bundle purchased** (top widget tier) → no upgrade; show "Already at top tier"
- **No Live Stream purchased** → "Add Panood Base · ₱2,500"

Future SKUs that don't yet exist in V1 (Photo Book printing, photojournalism, etc.) show as "Notify me" coming-soon cards in the same upgrade list.

In Aira & Boy's case the prototype displays the upgrade catalog regardless — even though they have every base SKU, multi-purchasable extensions (more seats, more hours, more grants) always show as upgrade paths.

---

## 2.4 Deferred — built into the Vendor iteration (0022)

The following four mechanisms surface but are not yet built in this couple-facing prototype. They land in iteration 0022 (the vendor dashboard prototype):

### 2.4a Vendor Pro · weekly subscription (not per-event)

Vendor accounts are free during launch (per the locked 0015 memory). Post-launch, vendors who want Pro features (in-app scheduler, multi-service calendars, in-app payments + QR retrieval) subscribe **by the week, not per event**.

- A photographer running 10 weddings in one week pays for **one week of Pro** — covers all 10 events.
- Subscription auto-renews weekly; vendor can pause anytime; charged weeks include unlimited events.
- Photography teams, stylists, ateliers, planners, and any other vendor type can subscribe under the same Pro tier.
- Free vendors (non-Pro) retain basic visibility on the marketplace + chat with couples + accept bookings — but skip the Pro scheduler / multi-service calendar / QR-per-guest retrieval features.

### 2.4b One calendar per service for multi-service vendors

A vendor offering, e.g., "Wedding Documentary," "Prenup Shoot," and "Engagement Session" gets **three separate calendars** — one per service — plus a unified master view. Each service-calendar shows that service's bookings, blocks, and lead-time requirements. Premium-tier feature; non-Pro vendors get a single combined calendar.

### 2.4c In-app crew & teams — fixed rates with deductions

When Setnayan provides crew/personnel through the app (operators-for-hire, second photographers, on-call broadcasters, etc.), pricing follows a fixed-rate structure:

- **Per-project rate** — fixed amount the couple pays for the crew member
- **Per-extension rate** — fixed hourly rate for extending the engagement
- **Tax %** — withholding tax deducted from the crew member's share (PH BIR rules)
- **In-app service % ** — Setnayan's cut, deducted from the gross
- **Crew net payout** — what the crew member actually receives, calculated as `gross − tax − in_app_fee`

Schema: `crew_member(rate_per_project_php, rate_per_extension_hour_php, tax_pct, in_app_fee_pct, active)`.

### 2.4d QR-as-a-service for vendor types beyond V1

Photography teams, stylists, ateliers, florists, and any vendor needing per-guest QR retrieval (e.g., florist wanting to scan-and-deliver each guest's table bouquet) can opt into using Setnayan's QR infrastructure. They apply via the vendor dashboard; the corresponding Pro fee covers their use. Each scanned QR lookup runs through Setnayan's auth and event-scoping rules — no cross-event reuse.

---

## 2.2b Mobile Vendor Card pattern (locked)

**Collapsed card** (default state in the Vendors list):

- Photo on the left · 72×72 square · vendor cover image
- Three rows beside the photo:
  - **Category** (DM Mono small caps, accent color — e.g., PHOTOGRAPHY · DOCUMENTARY)
  - **Vendor name** (bold body)
  - **Contact person** (regular, ink-soft)
- A small "**Date: (task)**" pill **below the photo** — the next appointment / scheduled task with this vendor (e.g., NOV 10 · Walkthrough)
- Chevron `▾` on the right hinting at tap-to-expand

**Expanded card** (tap to open inline):

- Same header row at the top
- **Progress bar** — the 6-stage vendor readiness tracker, with current stage label + last-updated timestamp
- **Payment bar** — visual percent bar with amounts (₱X / ₱Y · N% paid · status)
- **Four action buttons** in a single row:
  - `📞 CALL` — dials vendor's mobile number
  - `💬 CHAT` — opens the chat thread (per 0019)
  - `📹 MEET` — starts/joins a video meeting (Daily.co)
  - `👁 VIEW` — opens the dedicated Vendor Profile screen

The card is the touch-zone for the whole interaction. Only one card expanded at a time on mobile.

## 2.2c Vendor Profile screen (opened by tap VIEW)

A dedicated detail screen for one vendor. Five blocks stacked:

1. **Hero** — large round vendor photo, category eyebrow, vendor name (display font), contact person, certified / years badges
2. **Communication row** — 3 buttons: CALL · CHAT · MEET
3. **Documents &amp; payment row** — 3 buttons:
   - `📄 View contract` — opens the signed PDF
   - `📎 View files · N` — opens the thread file shelf
   - `💰 Make payment` — shown only when balance &gt; 0 · displays due date + amount · routes to next-milestone payment flow
4. **Package carousel** — every package this vendor is providing for this event, side-by-side swipeable.
   - Each package card shows: package eyebrow (PACKAGE N · TYPE), package name (display font), and a **tappable price button** that reveals the inclusions list
   - Multi-service vendors (e.g., a photographer providing Wedding Day + Prenup) show multiple cards · carousel dots indicate position
5. **Booking history / activity log** — append-only timeline of every action on this vendor relationship:
   - `BOOKED` · initial booking + package + amount
   - `REVISION` · scope changes
   - `PAID` · each milestone payment with date + amount
   - `ADDED` · additional packages or inclusions
   - `UPDATE` · stage transitions (vendor self-reported)
   - `SCHEDULED` · meetings + on-site activities
   - `DUE` · upcoming payments / deadlines

Schema-wise, the activity log reads from `event_activity_log WHERE vendor_id = $1 ORDER BY created_at` — same audit log we use everywhere else, filtered to this vendor.

---

### Refund / dispute menu on the vendor detail view (locked 2026-05-12)

When a customer opens a booked vendor's detail page, the "..." menu at the top-right contains (in addition to existing options):

- **Request a refund** → opens a modal:
  - Reason picker (Vendor didn't deliver / Quality issue / Force majeure event / Mutual cancellation / Other)
  - Free-form description (required, min 50 chars)
  - Evidence upload (optional photos / files)
  - Refund amount requested (defaults to amount paid; customer can specify partial)
  - Submit → creates a row in `dispute_resolutions` (see 0023 schema) with `cause = 'refund_request'`, `status = 'pending_mediation'`
  - Notifies vendor immediately (in-app + email via 0028) — vendor has 48 hours to respond before escalating to Disputes Handler
- **Open a dispute** → similar modal but with `cause = 'general_dispute'` (used for non-refund disputes like contract terms, vendor behavior, etc.)
- **Flag force majeure** → opens the dedicated force-majeure flow specced in 0019 § Force majeure flag flow — handles natural disaster / illness / venue cancellation reschedule paths via a 4-option mediation modal (Reschedule / Partial refund / Full refund / Switch vendor), with 7-day auto-escalation to the Disputes Handler if no agreement is reached
- **Mediation history** → if there's an open or resolved dispute, opens the chat thread that Setnayan's Disputes Handler joined

Mobile parity: same menu, condensed via the existing `...` overflow pattern.

---

### Exclusive offer row on customer's vendor detail (locked 2026-05-12)

Mirror the marketing-site exclusive-offer surface (0015) on the customer's vendor detail card inside their dashboard. When the customer has selected a vendor and is reviewing the bundle, the exclusive offer appears prominently as a tinted row inside the service detail card. Already-booked customers see "✓ Setnayan Exclusive applied" badge.

---

## 2.2d Review-visibility rule (locked)

Reviews behave differently in different contexts. The rule is **when the review serves a decision**, show it. **When it serves no decision**, hide it.

| Surface / context | Reviews visible? | Why |
|---|---|---|
| **Marketplace · Discovery (pre-book)** | ✅ Yes — couples need them to evaluate | Reviews help the couple decide which vendor to book. Show ratings, distribution, sample reviews, "all reviews →" |
| **Booked vendor · planning stage** (Discovery → Final Prep) | ❌ **No** — hide both reviews and review prompts | Couple has already committed. Showing past reviews now adds anxiety without serving a decision. Showing future-review prompts is premature. |
| **Booked vendor · Wrap stage** (event_date &lt; today) | ✅ Yes — both reviews and "leave a review" prompt | Couple is now the reviewer. They see Mariposa&apos;s existing reviews + their own "Review your wedding vendors" prompt. |
| **Vendor side · 0022** | Always visible | Vendors see their own rating + recent reviews on their dashboard regardless of any single event&apos;s stage. |
| **Admin side · 0023** | Always visible | Admin sees all reviews for moderation purposes. |

**Implementation:**

```sql
SELECT * FROM vendor_reviews
WHERE vendor_id = $1
  AND (
    $context = 'marketplace_discovery'        -- always show on marketplace
    OR $context = 'vendor_dashboard'          -- vendors always see their own
    OR $context = 'admin'                     -- admin always sees
    OR ($context = 'booked_vendor_view' AND $event_stage = 'wrap')
  )
```

In Aira &amp; Boy's current state (T-14, Final Prep), the Vendor Profile screen shows NO reviews and NO review-request prompt for Mariposa Bloom. They&apos;ll automatically appear on Nov 16 (event_date + 1 day) when the event flips to Wrap stage and the cron sends the review request.

The same rule applies to all 8 of their vendors: review surfaces stay quiet during planning, then activate together post-event.

### 2.2d.i Self-review block (locked 2026-05-15)

The visibility rule above governs **who can SEE reviews**. A separate rule governs **who can WRITE a review** — vendors (or their team members or their related accounts) cannot review their own services. Closes the fake-review fraud vector that opens up when a customer becomes a vendor and keeps their customer account (see CLAUDE.md decision log 2026-05-15 + iteration 0006 § "Dual-role customer ↔ vendor — review gate").

| Reviewer ↔ vendor relationship | "Leave a review" CTA | Why |
|---|---|---|
| Reviewer = vendor's `owner_user_id` | **Disabled** with hint *"You can't review your own services"* | Owner cannot self-review their own catalog. |
| Reviewer ∈ `vendor_service_agents.member_id` | **Disabled** (same hint) | Team members cannot review the vendor they work for. |
| Reviewer shares payment method / device / household with vendor owner | **Disabled** (same hint) + **Appeal** sub-link to 0023 Help inbox | Catches the vendor-creates-customer-alt fraud pattern. Filipino households legitimately share GCash / devices / addresses, so the appeal path lets admins override-publish coincidental matches (single-admin authority). |
| Reviewer has no related-account match | **Enabled** at Wrap stage per § 2.2d above | Standard flow. |

**Implementation.** Enforced at three layers (schema CHECK + trigger / API `403 SELF_REVIEW_BLOCKED` / UI disabled CTA) — see iteration 0006 Reviews schema for the SQL.

In Aira & Boy's current state, the gate is invisible — neither is a vendor's owner or team member, and the related-account signals don't match Mariposa Bloom's owner. The disabled-CTA path only lights up when a Setnayan customer is ALSO operating a vendor account on the same platform.

---

## 2.3 The Services vs Home rule (locked)

- **Services tab** is the **catalog**. It's where couples **avail of new services** (browse + apply). Each SKU shows price, status (Active / Available to apply), and the appropriate CTA.
- **Home (Overview)** is where **availed products live**. Every active service shows up here in full detail — grouped by category (Capture & broadcast / Branding & styling / AI & physical / Patiktok & templates).

In the prototype, Aira & Boy have availed of everything, so every Services tile shows "Active · Manage" and the full detail lives at the top of Home.

---

## 3. Overview surface — the "everything is humming" view

This is the most opinionated screen in the dashboard. It's the daily-driver — the couple lands here when they open Setnayan, and it tells them, in order of importance:

### 3.1 Lifecycle stage banner

A single horizontal strip across the top showing the 6 wedding stages (see 0022 spec for full definition). Current stage **highlighted in accent**: **Final Prep** (T-30 to T-1). Days remaining: **14**.

### 3.2 "What's next" cards (3 cards)

Algorithmically surfaced based on what's not yet done + what's deadline-imminent. For Aira & Boy at T-14, the three cards are:

1. **Send reminders to 23 pending RSVPs** — opens Guest List filtered to pending. (CTA: "Send reminder email")
2. **Confirm Mariposa Bloom payment milestone #3 (₱30,000 balance) — due Nov 8** — opens Budget. (CTA: "Mark as paid")
3. **LED Background USB ships in 7 days — confirm venue contact** — opens Services > LED. (CTA: "Add venue tech contact")

These cards are dynamic — they shift as items complete.

### 3.3 Active apparatus summary

A compact strip of 5 tiles representing every active Setnayan apparatus, with a status microcopy on each. Clicking a tile deep-links into its management surface.

- **Papic** — "5 seats · all claimed · 76 face vectors cached"
- **Live Stream** — "5 cams · 6 hrs · style pack ON"
- **Branding** — "Monogram active · A & B"
- **LED** — "Rendering · USB ships T-7"
- **AI Highlights** — "Queued · 60s + 3-min"

A small "₱26,599 in Setnayan apparatus" total appears below the strip.

### 3.4 Vendor pulse

8 booked-vendor avatars across one row, each with a tiny progress ring showing % of milestones paid. Click any avatar → vendor detail.

### 3.5 Recent activity feed

The last 8 entries from `event_activity_log` for this event. Examples:

- "Mariposa Bloom confirmed prenup date · 2 hr ago"
- "Lia Pascual claimed Papic seat #4 · 6 hr ago"
- "Ramon Cruz RSVP'd attending · yesterday"
- "Live Stream broadcaster invitation sent · yesterday"

This is the couple's audit trail — exposed in a friendly format.

### 3.6 Quick actions row

Six pill buttons at the bottom: "Send a reminder," "Add a guest," "Add a vendor," "Open chat," "Download print pack," "View Live Stream embed."

---

## 4. Per-tab content (fully-loaded state)

### 4.1 Guest List

Three filter chips at the top: **Attending (156)** · **Declined (21)** · **Pending (23)**. Search box. Below, a 3-column-ish list (chair avatar, name + role, RSVP state) ordered by table assignment. Profile-photo avatars where face enrollment is done; initials-with-side-tint where not.

Bulk actions row: select N guests → "Send reminder," "Add to table," "Export contact list."

### 4.2 Vendors

8 vendor cards, each showing: business name, service category, next meeting datetime, milestone progress bar (e.g., "₱55K of ₱85K paid · 65%"), unread chat count badge. Open chat shortcut on each card.

Below: vendor coverage status — checkmarks for the 28 canonical wedding services that are filled; greyed for the ones marked "not needed"; warning amber for any canonical that's empty AND marked needed.

### 4.3 Schedule

Day-of timeline (Nov 15) at the top: 47 items from prenup-day breakfast through post-reception, color-coded by phase. Calendar export button.

Below: upcoming meetings (T-14 to T-1) — a vertical list of 14 vendor meetings with date, vendor, mode (in-person/video), and quick-join link.

### 4.4 Add-ons

Active apparatus grid (12 tiles, all green-dot active). Below: spend summary breakdown by category (Capture & Broadcast / Branding & Styling / AI & Physical / Widgets). "Buy more" CTA for any apparatus that's multi-purchasable (Pro Camera Bridge grants, Template Add-ons, AI Highlights, +1 Camera, +1 Hour).

---

## 5. Visual hierarchy

The Overview is information-dense but follows the established Setnayan voice: **luxurious, modern, restrained**. Cream surfaces, ink type, accent terracotta for active states + CTAs, status colors (green/amber/red) used sparingly. Cormorant Garamond italic for display headings ("Final Prep · 14 days to go"); Manrope for body; DM Mono for system metadata.

Mobile views collapse the apparatus strip to a horizontal scroll, stack the "what's next" cards vertically, and use thumb-zone-friendly tap targets per the existing memory rule.

---

## 6. What this prototype is NOT

- Not a new feature spec — every element here renders data already produced by iterations 0000–0019.
- Not a redesign of any existing tab — Guest List, Vendors, Schedule, Services keep their established layouts; this prototype just shows them populated.
- Not a proposal for new SKUs — uses only the locked V1 SKU list.

---

## 8. Navigation entry points for V1 features (locked 2026-05-12)

Iterations 0024–0035 were drafted after the dashboard's 9 surfaces were locked. This table closes the gap — every feature has one canonical entry point inside the couple dashboard so nothing is orphaned.

| Feature | Iteration | UI entry point |
|---|---|---|
| Profile & account settings | 0025 | Top-right profile avatar → dropdown → "Settings" |
| Email notification preferences | 0028 | Settings → "Notifications" tab |
| Help & FAQ | 0029 | Top-right profile avatar → dropdown → "Help" · also a `?` icon in every surface header |
| Replay guided tour | 0030 | Settings → "Tour" tab → "Replay first-time tour" button |
| Day-of guest mode | 0031 | Automatically activates T-1hr on the personal landing page; couple sees a "Live event mode" indicator on the dashboard Home and on the QR Hub surface |
| Save-the-Date Maker | 0024 | Services launcher grid card · also linked from the Schedule surface when within 90 days of the event date |
| Contracts | 0032 | Each Vendor card has a "Contract" button when a contract exists in the thread; opens contract viewer in modal |
| Tax receipts | 0026 | Settings → "Payment Methods & Receipts" tab → "Download official receipts" button |
| Sign out | — | Top-right profile avatar → dropdown → "Sign out" |

**Canonical profile-avatar dropdown layout.** The top-right avatar opens a single consistent menu across all three V1 dashboards (couple · vendor · admin): **Settings · Notifications · Help · Tour replay · Sign out**. Couple-specific affordances surface inside Settings tabs (Payment Methods & Receipts, Privacy & Data) rather than as separate top-level menu items, so the menu stays short and the pattern recognizable when a user with multiple roles switches views.

---

## 9. Event lifecycle — delete vs. add (locked 2026-05-20 · supersedes 2026-05-15)

**Self-serve event deletion is gated on zero confirmed-vendor commitments.** The user-facing app exposes a "Delete event" action that follows the same gate as the date-edit flow in § 10.1: confirmed/paid bookings count, in-active-mediation bookings count, cart/draft items do NOT count, cancelled/refunded do NOT count. If the count is zero, the couple can delete the event from the user-facing app (after a typed-confirmation modal — events are still long-lived planning artifacts and the friction guard protects against misclicks). If the count is ≥1, the destructive action is disabled with copy *"Contact support to discuss deletion — N confirmed vendor commitments are attached to this event,"* routing to the same admin escalation path (0023 Delete action, PR #9). **Supersedes the 2026-05-15 "no self-serve event deletion" lock** — the owner directive on 2026-05-20 restored the self-serve path for vendor-less events while keeping the admin-mediated path for events with real commitments.

**Two natural framings, one gate.** The owner described the rule in two ways during the 2026-05-20 lock session — both refer to the same zero-active-commitments check above, just observed at different points in the event lifecycle:
- *"No vendors yet on this event"* — the early-stage framing. A couple has just created the event and hasn't booked anyone yet; the delete affordance lets them undo without escalation.
- *"No more vendors active on that account"* — the wind-down framing. A couple's vendors have all backed out, been cancelled, or finished delivering. With nothing currently active, the event can be cleaned up self-serve.

Both framings resolve to the same SQL count: `bookings.status IN ('confirmed', 'paid', 'in_active_mediation')` filtered to the event. The copy in the disabled-state CTA should reference "active vendor commitments" rather than a more specific term so it reads naturally in either lifecycle position.

The gate is symmetric with § 10.1 by design: a couple who has never booked, or whose vendors have all backed out, gets a clean exit; once even one vendor is committed, removal becomes a multi-party conversation.

**Adding events is supported.** Couples create additional events via the event switcher's `+ Add event` row (0000 § event switcher, chrome confirmed wired on `origin/main` per CLAUDE.md decision-log row 443). V1 still restricts the event-type picker to **Wedding only**; the other five tiles (baptism · debut · birthday · anniversary · religious_event) stay visible with a "Coming soon" badge until iteration 0041 (Multi-Event Vendor Catalog) ships in V1.5. Multi-event creation is core to the "Filipino-first life-events platform" positioning — the same household plans wedding → baptism → anniversary on a single account.

**Where to surface the delete affordance.** Cluster it with other event-scoped destructive actions: Profile Settings → Privacy & Data (per 0025), the event switcher's monogram menu (per 0000), and the event-home overflow. Always render the affordance — the friction wraps around it, the same way date-edit always renders but gates on confirmed-vendor count. The affordance should NOT appear on vendor or admin role-routed dashboards. Vendor-relationship removal, guest removal, and per-service cancellation are unrelated and remain in their respective iterations (0006, 0001, 0034) — those are event-scoped operations, not event-deleting ones.

**Cross-rule interactions.** The 0025 § Account-deletion exception list still blocks account-delete whenever the user has any active event (different rule, different surface). A user who wants to close their account must first delete each of their vendor-less events through the new self-serve path; events with confirmed vendor commitments still need to go through support, which means account-delete is still effectively support-mediated for any user with a real booking history.

---

## 10. Date change with booked vendors (locked 2026-05-17)

Couples can edit their event date at any time, but the friction scales with how many confirmed vendors are attached. The rule keys off **current confirmed-vendor count**, not history — a couple who has never booked, or whose vendors have all backed out, gets a clean date-edit path. Once even one vendor is confirmed, date changes become a multi-party negotiation with vendor consent, mandatory reason capture, and admin mediation as the escalation tier.

*Additionally subject to per-vendor acceptance cutoffs (§ 13) — if any confirmed vendor is past their date-change cutoff at the current proximity to event, the standard flow described below is blocked entirely and admin override is the only forward path.*

### 10.1 Confirmation gate · triggered only when ≥1 confirmed vendor

The date-edit affordance always renders; the friction wraps around it. On tap, the dashboard counts confirmed vendors by status:

| Booking status | Counts toward gate? | Reason |
|---|---|---|
| Confirmed / paid | ✅ Yes | Real commitment on both sides |
| In cart / draft | ❌ No | No commitment yet — couple is still shopping |
| In active mediation | ✅ Yes | Booking has NOT yet been released; vendor still expects this date |
| Cancelled / refunded | ❌ No | Relationship is closed |

**If the count is zero,** the date picker opens immediately. No warning, no reason field — free planning state.

**If the count is ≥1,** a confirmation modal blocks the change:

> You have **N confirmed vendors** for **{current_date}**. Changing the date requires each of them to confirm the new schedule.
>
> **Affected:** {first 2–3 vendor names}, +{remaining} more
>
> If a vendor can't accommodate the new date, your booking with them moves to chat negotiation.
>
> **Why are you changing the date?** [text field, required, min 30 chars]
>
> [Keep current date] [Continue]

Tone is informative, not alarmist — couples reaching this modal are usually already stressed (venue flooded, family conflict, force majeure, work transfer). The reason field is required because every change involving booked vendors must have a documented motivation — vendors receive it in their schedule-change notification (so they understand the ask before deciding), and admin reviews patterns if a dispute later escalates.

### 10.2 Schedule check + customer-facing result

On Continue, the system queries each confirmed vendor's calendar against the proposed new date. Two outcomes:

- **All vendors available** → *"Your schedule change is available for all vendors. Waiting for their confirmation."*
- **Partial conflict** → *"Your schedule change is available for X vendors but conflicts for Y vendors. We cannot apply this change until all vendors accept."*

In both cases the event date is **not yet changed**. The original date holds. The proposed change sits in a pending state until every affected vendor has either accepted or rejected. The couple's dashboard surfaces a banner during this state: *"Date change pending vendor confirmation · N of M responded."*

### 10.3 Pending-state freeze

While the date change is pending:

- **Original date holds** on the couple's dashboard, in vendor calendars, and on the public landing page (0021 § 7 Landing Page)
- **No further date attempts** — couple cannot stack a second proposed change; the action is disabled with hint *"Resolve the current pending change first"*
- **Payments paused** for affected bookings (no new milestone charges fire during the window — 0034 honors this freeze flag)
- **Vendor slot frozen** — vendors cannot release the original slot to another booking until the negotiation resolves; both original and proposed dates are held

This prevents either party from moving the goalposts mid-negotiation.

### 10.4 Vendor response window · auto-resolve on timeout

Each notified vendor has **48 hours** to respond (V1 default; configurable per vendor at onboarding, 24–72 hr range). Their dashboard surfaces an action card with the new date + couple's reason + Accept / Decline buttons + a soft "Open chat to discuss" link.

| Vendor action | Result |
|---|---|
| Accept | Moves to "accepted" sub-state; change applies only when ALL affected vendors have accepted |
| Decline | Booking enters chat negotiation (§ 10.5) — change does NOT auto-fail |
| No response past 48 hr | Auto-escalates to admin mediation tier (§ 10.6) |
| Couple cancels the request | All sub-states clear; event reverts to original date; no penalty |

### 10.5 Chat negotiation · decline path

When a vendor declines, the existing customer↔vendor chat thread (per the customer-initiates-chat rule — couples open threads, vendors only reply) gains a **structured action card** so the negotiation produces real state transitions rather than free-text agreements that the system can't parse:

| Action card | Who can trigger | What it does |
|---|---|---|
| Propose alternate date | Either side | Embedded date picker; counterpart sees a card with Accept / Decline buttons |
| Accept this date | Either side | Single-tap commit; transitions the booking's date if the other side has also accepted |
| Cancel this booking | Couple only | Drops this vendor from the event; refund routes through § 2.2 Refund / dispute menu |
| Escalate to support | Either side | Opens an admin mediation ticket (§ 10.6) |

The structured-card requirement is **load-bearing**. Agreements made in prose are invisible to the state machine, so the booking would sit frozen indefinitely. Action cards convert verbal agreement into a real status transition. Iteration 0019 must support interactive action cards as a first-class message type — this is a hard dependency for the date-change flow shipping.

**Couple-side timeout:** if the couple ghosts an active chat negotiation for **72 hours** (no message and no card interaction), the change request auto-cancels and the event reverts to the original date. The vendor receives a notification that the negotiation closed without resolution.

### 10.6 Admin mediation tier · escalation

Chat negotiation escalates to admin mediation when:

- Either side clicks **Escalate to support** in the chat action card
- The 48-hour vendor response window expires without a response
- The 72-hour couple-side chat timeout fires

A ticket opens in the admin console (0023). Setnayan's Disputes Handler joins the thread — same pattern as the force-majeure flow in 0019 + the refund/dispute menu in § 2.2. The mediator selects from a fixed outcome enum (no free-text resolutions, because every outcome maps to a concrete state transition):

| Mediation outcome | State transition |
|---|---|
| Vendor reconsiders → accept new date | Booking date updates; pending state clears; payments resume |
| Couple stays on original date | Pending state clears; original date holds; no refund; no penalty |
| Vendor swap | Setnayan helps source an alternate vendor; this booking enters cancellation refund flow per § 2.2 |
| Full refund + cancellation | This vendor only; other bookings unaffected; refund routes through 0034 |
| Reschedule-fee compromise | Vendor accepts new date with a documented fee per their contract; couple pays via 0034 |

Every outcome logs to `dispute_resolutions` (0023 schema) with the cause `cause = 'date_change_dispute'` and the chosen outcome enum.

### 10.7 Race condition · vendor back-out during negotiation

A confirmed vendor can independently back out (cancel their booking) while a date-change negotiation is in flight. Two cases:

- **Departure drops confirmed-vendor count to zero** → the in-flight negotiation **auto-resolves**. The date change applies immediately; no further confirmation needed from the now-empty vendor list. The couple sees a passive notification: *"All remaining vendors backed out — your date change has been applied."*
- **Departure drops count but stays ≥1** → negotiation continues with the remaining vendors only; the departed vendor's slot releases independently. The couple's pending-state banner updates to reflect the new vendor count.

### 10.8 "Door reopened" banner

When the confirmed-vendor count transitions from ≥1 → 0 for any reason (last vendor backs out, all bookings released, every booking ends in cancellation outcome from mediation), the couple's dashboard surfaces a passive banner on Home:

> All vendors have been released — you can now change your event date freely.

Banner placement: directly below the NEXT UP hero card on Home (per § 2.0a). Dismisses on first date-edit attempt OR after 14 days. Without this affordance, couples may not realize the gate has lifted — many continue planning around the old date long after the constraint dissolved.

### 10.9 Reschedule-fee policy · admin-managed per-vendor

Vendor contracts commonly include reschedule fees scaled to event proximity (typical: no fee 60+ days out, 50% inside 30 days, 100% inside 14 days). Vendors capture their reschedule policy at onboarding (0006 § Vendor onboarding); the policy surfaces to the couple inside the § 10.1 confirmation modal **when at least one affected vendor has a non-zero fee at the current proximity to the event**:

> ⚠ Some of your vendors charge a reschedule fee at this proximity to your wedding:
> · Casa Manila Catering — ₱15,000 (50% inside 30 days)
> · Bloomwood Florals — ₱5,000 (flat fee inside 14 days)
>
> Fees apply only if the vendor accepts the new date. You'll see the final amount before confirming.

V1 leaves fee enforcement as a **manual mediator action** — the mediator references the vendor's stated policy when negotiating outcomes in § 10.6 and applies the fee via the existing 0034 milestone-payment flow. Automated fee debits land in iteration 0034 Phase 2.

### 10.10 Max date changes per event lifecycle

Hard cap: **2 successful date changes** per event. Attempts beyond the cap are gated behind admin override — couple files a request via 0029 help center, admin reviews and approves on a case-by-case basis. Cancelled or reverted requests don't count toward the cap; only changes that actually applied. Prevents thrash and protects vendor goodwill on the platform.

---

## 11. Venue change with booked vendors (locked 2026-05-17)

Venue changes follow the **same multi-party state machine as § 10 Date change** — gate triggered by ≥1 confirmed vendor, required reason, pending-state freeze, 48 hr vendor response window, 72 hr couple chat timeout, chat negotiation with structured action cards, admin mediation tier, door-reopened banner, 2-changes cap. Two material differences capture the venue-specific logic below; everything else is identical to § 10 and is not re-stated.

*Additionally subject to per-vendor acceptance cutoffs (§ 13) — if any confirmed vendor is past their venue-change cutoff at the current proximity to event, the standard flow described below is blocked entirely and admin override is the only forward path.*

### 11.1 Coverage check (replaces schedule check)

Where § 10 polls each vendor's calendar for date availability, § 11 polls each vendor's **service capability for the new venue**. The check considers:

- **Service-area radius** — does the new venue fall within the vendor's stated service radius (set at onboarding per 0006)?
- **Permits / licensing** — does the vendor hold the permits/licenses required by the new venue's municipality? Catering and mobile bar are the common gotchas (LGU food-and-beverage permits don't always cross municipal lines).
- **Equipment compatibility** — can the vendor's equipment service the new venue? Lights & sound rigging, live stream camera mounts, broadcast power requirements all care about the venue's physical layout and electrical infrastructure.
- **Venue house rules** — some venues forbid outside vendors of specific categories (in-house catering only, in-house florals only). The new venue's vendor-allowlist is consulted; if the booked vendor isn't on it, the check returns conflict.

Customer-facing result strings parallel § 10.2:

- **All vendors can service the new venue** → *"Your venue change is available for all vendors. Waiting for their confirmation."*
- **Partial conflict** → *"Your venue change is available for X vendors but is in conflict for Y vendors. We cannot apply this change until all vendors accept."*

### 11.2 Auto-accept policy · short-distance moves bypass the gate

Vendors set a **service-area auto-accept radius** at onboarding (0006) — e.g., *"auto-accept any venue within 50 km of my home base."* When the new venue falls inside the radius AND every other coverage-check dimension passes, the booking transitions automatically without firing the vendor confirmation card.

The couple still sees the proposed-change modal and supplies a reason; the schedule check still runs; vendors still receive an in-app + email notification of the venue change. They just don't have to actively accept — silence equals consent inside the auto-accept envelope.

This cuts negotiation volume materially for the common case (e.g., changing from one Tagaytay venue to another). Vendors who prefer explicit confirmation set the radius to 0 km and get the standard card on every venue change.

### 11.3 Relocation fee policy (replaces reschedule fee)

Vendors with travel-dependent cost structures (catering, lights & sound, live stream, mobile bar) capture a **relocation-fee policy** at onboarding instead of a reschedule-fee policy. Examples:

- *"Free within 30 km; ₱5,000 per additional 10 km."*
- *"Free within Metro Manila; ₱15,000 flat for Tagaytay; case-by-case beyond."*
- *"₱8,000 equipment transport fee for any venue change inside T-30 days."*

The fee surfaces in the § 11 confirmation modal when at least one affected vendor has a non-zero relocation fee for the proposed venue. Same admin-mediator-applies-it pattern as § 10.9; auto-debit lands in 0034 Phase 2.

### 11.4 Mediation outcomes (parallel to § 10.6)

The admin mediator selects from the same fixed enum as § 10 with venue-specific labels:

| Mediation outcome | State transition |
|---|---|
| Vendor reconsiders → service new venue | Booking venue updates; pending state clears; payments resume |
| Couple stays at original venue | Pending state clears; original venue holds; no refund; no penalty |
| Vendor swap | Setnayan helps source an alternate vendor; this booking enters cancellation refund flow per § 2.2 |
| Full refund + cancellation | This vendor only; other bookings unaffected; refund routes through 0034 |
| Relocation-fee compromise | Vendor accepts new venue with a documented fee per their policy; couple pays via 0034 |

### 11.5 Public landing page (0021 § 7 surface) holds during pending state

Venue is one of the three top-of-page facts on the couple's public landing page (date + venue + couple name). During a pending venue change, the landing page **continues to show the original venue** — same freeze rule as the date change in § 10.3. Guests should not see a venue change before vendors have confirmed it.

When the change applies, the landing page updates server-side and any guests who've already RSVP'd receive a notification email per 0028.

---

## 12. Guest count change · monotonic ratchet (locked 2026-05-17)

Guest count is a numeric attribute that **only ratchets upward** once vendors have committed to a number. The state machine borrows the chat/mediation/admin scaffold from § 10 but with a fundamentally different shape: decreases are blocked outright at the UI layer (no negotiation), and only **guest-count-dependent vendors** are affected (subset of all vendors).

*Additionally subject to per-vendor acceptance cutoffs (§ 13) — if any confirmed guest-count-dependent vendor is past their guest-count cutoff at the current proximity to event, the standard increase flow described below is blocked entirely and admin override is the only forward path.*

### 12.1 Which vendors are guest-count-dependent

A per-vendor flag (`is_guest_count_dependent`, captured at vendor onboarding per 0006) marks whether the vendor plans against the guest count. V1 defaults:

| Vendor category | Default flag | Why |
|---|---|---|
| Catering | TRUE | Ingredients, plates, crew rostered per head |
| Florals | TRUE | Centerpieces + bouquets scale with table count |
| Mobile bar | TRUE | Inventory + bartender count scales with head count |
| Lights & sound | TRUE | Rigging coverage scales with guest area / floor plan |
| Name cards / favors / printable invites | TRUE | Per-guest items |
| Photography | FALSE | One team covers any headcount within reasonable bounds |
| Videography | FALSE | Same as photography |
| HMUA | FALSE | Bridal-party-only scope; independent of guest count |
| Planner / coordinator | FALSE | Capacity scales by event complexity, not headcount |
| Broadcast (Panood / live stream) | FALSE | Cameras + hours purchased separately |

Vendors can override the default at onboarding (e.g., a florist who works pinpoint-arrangements regardless of guest count flips the flag to FALSE; a planner who charges per-head flips it to TRUE).

Only dependent vendors receive the confirmation card on a guest-count change. Independent vendors are notified passively (in-app + email) but their booking is unaffected.

### 12.2 The ratchet rule

The **planning guest count** is monotonic upward per event:

- Floor = MAX(all confirmed counts ever in this event's history)
- The minus stepper on the guest-count field is **disabled** when count equals current floor; hint reads *"Cannot decrease below confirmed floor — vendors have already committed to N guests"*
- Increases require vendor confirmation (state machine per § 12.4)
- Decreases require admin override (§ 12.7)

The planning count is **distinct from**:

- **Invited count** — how many invitations were sent (managed in Guest List, no impact on vendors)
- **RSVP count** — how many guests confirmed attendance (managed automatically as RSVPs flow in)
- **Actual attendance** — day-of headcount (recorded post-event for reporting)

Vendors plan against the planning count. RSVPs may come in lower; the couple still pays for the committed count because vendors have already committed inventory + crew at that level.

### 12.3 Confirmation gate (only on increase)

When the couple raises the count and ≥1 dependent vendor is confirmed, a modal blocks the change:

> You're changing the guest count from **200** to **220**. This requires each guest-count-dependent vendor to confirm they can scale up.
>
> **Per-vendor cost impact:**
> · Casa Manila Catering — +20 plates × ₱1,200 = **+₱24,000**
> · Bloomwood Florals — +2 tables × ₱5,500 = **+₱11,000**
> · Lumiere Lights & Sound — flat (capacity ceiling not reached)
>
> **Total cost increase:** ₱35,000
>
> Once vendors confirm, this count becomes your new floor — you can increase further later, but **you won't be able to decrease back below 220**.
>
> **Why are you changing the count?** [text field, required, min 30 chars]
>
> [Keep current count] [Continue]

Per-head pricing is captured at vendor booking (0006); the modal surfaces a real-time delta calculation before the couple commits.

### 12.4 Capacity check (replaces schedule / coverage check)

The system checks each dependent vendor's **headcount capacity at the current proximity to the event**:

- Vendor's stated maximum capacity for this service tier
- Lead-time-adjusted capacity (vendors often have lower max capacity inside T-14 days because crew can't be rostered fast)
- Currently allocated capacity (vendor may have other bookings competing for crew/inventory)

Result strings parallel § 10.2 / § 11.1:

- **All vendors can scale up** → *"Your guest count change is available for all vendors. Waiting for their confirmation."*
- **Partial conflict** → *"Your guest count change is available for X vendors but exceeds capacity for Y vendors. We cannot apply this change until all vendors accept."*

### 12.5 Vendor response window + chat negotiation

Identical to § 10.4–10.5 with capacity-specific outcomes. Vendor accepts → commits to the new count + new price. Vendor declines → chat negotiation with structured cards (Propose alternate count / Accept this count / Cancel booking / Escalate to support). 48 hr / 72 hr timeouts as before.

### 12.6 Ratchet enforcement on vendor back-out

When a dependent vendor backs out independently (cancellation), their commitment to the current floor dissolves — but **the floor itself doesn't reset**. Remaining dependent vendors still plan at the higher count, so the couple cannot decrease.

If a *new* vendor joins later, their starting commitment is the current floor (or higher, never lower). Vendors who cannot meet the current floor at onboarding aren't bookable — the catalog gates them out for this event.

### 12.7 Decrease override · admin-mediated

Couples experiencing genuine catastrophic cancellation (force majeure, mass family withdrawal, venue capacity reduction by force) can request a floor reduction via 0029 help center. The admin mediator then negotiates with each affected vendor case-by-case:

- Vendor accepts the reduction (often with a partial refund of pre-purchased inventory) → floor lowers for that vendor's commitment
- Vendor declines → couple still pays the higher amount, but vendor receives a "couple requested reduction; vendor declined" note in the event log (useful for review-time context)

The floor is **per-vendor in the override path**, not event-wide — because vendors negotiate individually based on their inventory commitment. This is the only path through which the floor can move downward; it does not surface in the couple's UI as a self-serve affordance.

### 12.8 Seating chart side-effects

When a guest-count change applies, downstream surfaces auto-update:

- **Seating chart (0008)** — adds tables to absorb the new count, using the current per-table capacity (8 / 10 / 12 depending on configuration); couple can manually re-arrange
- **Print pack** — flagged "outdated" until couple re-publishes (table QRs may have new positions)
- **Name cards / favors** — quantity field on the printable-invites vendor's order line auto-updates
- **Catering vendor's plate count** — `vendor_event_window` ↦ `confirmed_guest_count` column updates on vendor accept

These are passive side-effects (no additional confirmation needed) because the vendor side already accepted the new count.

### 12.9 Audit + ratchet history

Every confirmed count change writes a row to `event_guest_count_log(event_id, old_count, new_count, reason, requested_at, applied_at, change_type ∈ {'increase','decrease_override'})`. Surfaces in:

- Admin console (0023) — for mediator context when reviewing a dispute or override
- Couple's audit feed (0021 § 3.5 Recent activity) — *"Guest count increased from 200 to 220 · vendors confirmed"*
- Vendor dashboard (0022) — *"Couple increased guest count for [event] to 220 · you accepted"*

---

## 13. Per-vendor change-acceptance cutoffs (locked 2026-05-17)

The state machines in § 10 / § 11 / § 12 govern *whether* a confirmed vendor agrees to a proposed change. § 13 governs *whether the couple can even initiate* such a change at the current proximity to event. Each vendor declares — at onboarding — how close to the event they're willing to accept changes to date, venue, and guest count. Once any confirmed vendor passes their stated cutoff for a given change type, the standard flow is blocked outright for that event; the only forward path is admin override.

Applies uniformly to all three change types (date, venue, guest count). Applies only to vendor bookings — Setnayan platform SKUs (Papic, Panood, Patiktok, LED, AI Highlights, etc.) have their own pre-event activation / rendering / fulfillment windows handled separately.

### 13.1 The three cutoff fields

Captured on the vendor record at onboarding (0006). Snapshotted to the booking at confirmation time (§ 13.5).

| Field | Meaning | NULL means |
|---|---|---|
| `date_change_cutoff_days_before_event` | Last day before event date this vendor accepts a **date** change. | Vendor refuses date changes entirely (extremely rare; not seeded by default) |
| `venue_change_cutoff_days_before_event` | Last day this vendor accepts a **venue** change. | Vendor refuses venue changes entirely |
| `guest_count_change_cutoff_days_before_event` | Last day this vendor accepts a **guest count** change. | Vendor is not guest-count-dependent (per § 12.1); the field is N/A |

Cutoff windows are **inclusive of the day itself** — e.g., a cutoff of T-30 means the change can be initiated up to and including the calendar day 30 days before the event. Day T-29 is past cutoff. Day-end is the cliff (Asia/Manila timezone).

### 13.2 V1 default values by vendor category

Pre-filled on vendor account creation (0006) so vendors don't need to configure manually. Vendors can edit any value at any time, subject to the retroactivity rule (§ 13.5).

| Vendor category | Date | Venue | Guest count | Notes |
|---|---|---|---|---|
| Catering | 30 | 21 | 14 | Ingredient sourcing + crew rostering lead time |
| Florals | 21 | 14 | 10 | Flower wholesaler lead time + table-count locking |
| Mobile bar | 21 | 14 | 7 | Inventory + bartender rostering |
| Lights & sound | 14 | 21 | 7 | Rigging crew + equipment dispatch (venue more lead-time sensitive than date) |
| Name cards / favors / print | 21 | 14 | 10 | Print runs lock once started |
| Photography | 7 | 3 | NULL | Pair of photographers can adapt close-to-event |
| Videography | 7 | 3 | NULL | Same |
| HMUA | 7 | 3 | NULL | Bridal-party-only scope independent of headcount |
| Planner / coordinator | 7 | 3 | 7 | Coordinator helps execute changes; their own cutoff is short |
| Live stream / broadcast | 3 | 3 | NULL | Equipment-only; can pivot close to event |

These are **starter values** — owner should review and adjust based on real vendor feedback during V1 onboarding. Vendors retain final say.

### 13.3 Pre-flight check on every change attempt

Runs immediately when the couple taps any of: edit-date affordance, edit-venue affordance, increment-guest-count stepper. The check evaluates each confirmed vendor (per § 10.1 / § 11.1 / § 12.3 status counting) against their snapshotted cutoff for the corresponding change type.

| Result | Behavior |
|---|---|
| All affected vendors are within their acceptance window | Standard flow proceeds — confirmation modal → schedule/coverage/capacity check → vendor cards |
| One or more affected vendors are past their cutoff | Standard flow is **blocked**; the past-cutoff modal fires (§ 13.4) |

### 13.4 Past-cutoff modal copy

Replaces the standard confirmation modal entirely. No reason field, no Continue button, no vendor cards.

> {Date / Venue / Guest count} changes are no longer accepted by some of your vendors at this proximity to your wedding.
>
> **Blocking vendors:**
> · Casa Manila Catering — accepts date changes up to **Oct 16, 2026** (T-30 days). Today is **Oct 25, 2026**.
> · Bloomwood Florals — accepts date changes up to **Oct 23, 2026** (T-23 days).
>
> If you have a genuine emergency (force majeure, family crisis, venue collapse), you can request an admin override and we'll reach out to each vendor individually.
>
> [Close]   [Request admin override →]

The "Request admin override" CTA routes to 0029 help center with the form pre-populated (change type, affected vendors, current proximity). Couple supplies the reason there; admin mediator picks it up (§ 13.6).

### 13.5 Retroactivity rule · snapshotting at booking confirmation

When a vendor's booking is confirmed, the **then-current values** of all three cutoff fields are snapshotted to `vendor_event_window.effective_date_cutoff` / `effective_venue_cutoff` / `effective_guest_count_cutoff` for that specific event. These snapshotted values are what § 13.3 checks against — NOT the live vendor record.

Why: without snapshotting, a vendor who senses friction with a couple could shorten their cutoff to 90 days the moment they expected a reschedule request, instantly blocking the couple. The snapshot rule means the contract terms in effect when the couple chose this vendor are the binding ones for this event.

Vendor edits to the live record apply to **future bookings only**. The vendor's own dashboard (0022) shows both the live values and a per-event snapshot table when applicable — they need to know what they've committed to for in-flight events.

### 13.6 In-flight protection

Changes that were **initiated before the cutoff date and are currently pending** (in vendor confirmation, in chat negotiation, or in admin mediation) continue to run to completion even if the cutoff falls during the negotiation window. Cutoffs apply only to NEW attempts.

Example: couple submits a guest count change on Oct 14 (T-32, well before catering's T-14 guest count cutoff). Negotiation drags on; by Oct 30 (T-16) the couple has not received vendor confirmation. Even though the catering cutoff (T-14, falling on Nov 1) is now within 2 days, the in-flight request remains valid and the vendor can still respond. The cutoff is for INITIATION, not for resolution.

This prevents the system from auto-failing valid changes just because a vendor took a long time to respond.

### 13.7 Admin override path

Only forward path when one or more vendors are past cutoff. Flow:

1. Couple files a request via 0029 help center → form captures change type, affected vendors, proposed new value, reason (free text, min 100 chars), evidence upload (optional)
2. Admin mediator reviews the case
3. Mediator reaches out to each past-cutoff vendor individually (in-app message, email, or phone, mediator's discretion)
4. **Vendor agrees** → mediator applies the change via the 0023 admin console (bypasses cutoff for this case only)
5. **Vendor declines** → couple's only remaining option is to cancel that vendor's booking (refund flow per § 2.2) and find a replacement vendor

Override actions log to `dispute_resolutions` with `cause = 'past_cutoff_override'`, the original cutoff value, the proximity at which the override applied, and the mediator's notes. Useful for refining V1 defaults — if a category consistently grants overrides, the seed value is too conservative.

### 13.8 Vendor-side surfacing (forward dep on 0022)

Vendor dashboard (0022) needs:

- **Settings → Change Acceptance Policy** — three fields with the live defaults; vendor can edit; tooltip explains the snapshot rule so vendors understand edits don't affect in-flight events
- **Per-event snapshot table** — for each currently-confirmed booking, the snapshotted cutoff values are shown read-only. Lets the vendor see exactly what they've committed to for each event.

V1 spec — landing in 0022. § 13 here defines the data model and the couple-side behavior; the vendor surfaces are forward-dep on 0022.

---

## 7. Companions

- `0021_couple_dashboard_fully_purchased.html` — interactive 5-surface walkthrough with web + mobile parity.
- `0021_couple_dashboard_fully_purchased.docx` — stakeholder mirror.

---

## V1.2 Amendment — Multi-Moderator + Multi-Payer (added 2026-05-19)

Per [0048 Multi-Moderator Event Access](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md) and [0049 Multi-Payer Cart](../0049_multi_payer_cart/0049_multi_payer_cart.md), the couple dashboard becomes **role-aware** in V1.2. The "fully-purchased state" preview retains its current shape but every surface now renders per the viewer's `event_moderators.role_subtype`.

### Header changes

A new role badge appears at the top of every dashboard surface: **"Viewing as Bride"** / **"Viewing as Parent of Bride"** / **"Viewing as Maid of Honor"** etc. Tap → switch between roles if user has multiple roles on the same event (rare but possible per [0048 § Edge cases](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md)).

### Visibility-aware rendering

Every panel respects `event_moderators.permissions_json` + row-level `private_to_role[]` / `hidden_from_role[]` / `surprise_for_role` tags from [0048](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md). Specific impacts:

- **Guest list panel** — Maid of Honor / Family Helpers see only their assigned side; couple + parents see all.
- **Budget panel** — hidden items show as "Reserved — Bride's items ₱X" (aggregate preserved, line items hidden) for the surprise-target role; full breakdown for non-hidden viewers.
- **Vendors panel** — vendor chat threads tagged `private_to_role` filter per viewer; bridal_gown thread auto-hides from groom.
- **Cart panel** — per-role attribution display per [0049 § Cart view per role](../0049_multi_payer_cart/0049_multi_payer_cart.md). Current viewer's items separated from "Other moderators' items (FYI)".
- **Calendar / Schedule panel** — hidden events show sanitized title ("Personal Appointment") in the hidden-from role's view; time block preserved.
- **Day-of timeline** — visibility flags respected; surprise items (e.g., first-dance custom song) hidden from designated `surprise_for_role` until day-of.

### New surface: `/dashboard/{eventId}/moderators`

Per [0048 § UX surfaces](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md). Lists all moderators with role, status, permissions summary. CTA: "+ Invite moderator". Visible to couple + moderators with `can_add_moderators=TRUE` permission.

### Forward-compat note

V1.2 amendments don't change V1.1 behavior for solo-couple events (events with only `bride` + `groom` in `event_moderators`). Backfill migration ensures every existing event auto-creates `bride` + `groom` moderator rows.
