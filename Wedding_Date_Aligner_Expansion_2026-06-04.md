# Wedding Date Aligner — multi-objective expansion (DRAFT for Cowork · 2026-06-04)

**Status:** DRAFT · proposal — **not owner-locked.** Author: Claude Code session 2026-06-04.
**Action:** review + fold into the canonical [Schedule_Matrix_and_Date_Finder_2026-06-02.md](Schedule_Matrix_and_Date_Finder_2026-06-02.md) via Cowork (proposed new sections §12–§17). **§F cultural-depth decision RESOLVED 2026-06-04 (soft-caution).** Still open: the crewed-services day-capacity question (§B2) + the owner-to-set values (lead-time curves, mode weights, traffic/typhoon tables).
**Parent:** [Schedule_Matrix_and_Date_Finder_2026-06-02.md](Schedule_Matrix_and_Date_Finder_2026-06-02.md) — extends its ranker (§5) without changing §4/§5a/§6/§7/§8.
**Owns / touches:** 0021 (couple dashboard · Find-your-date + Home nudge), 0006 (vendor calendar/capacity/serves-area), 0016/0043 (onboarding date + style capture), 0023 (admin reference tables + trend analytics), 0028 (email).
**Scope:** **V1.x post-pilot** (matches parent §11). Design capture only — no code/migration ships with this. The deterministic dimensions (§E) are deliverable day-one; the data-dependent ones light up as supply/volume grow.

---

## The one-line idea

> The parent ranks candidate dates on **one** objective — vendor availability (covered → top-picks-kept → earliest). This expansion makes the ranker **multi-objective**: the couple chooses *what to optimize for* — and adds **"Least stressful"** as the flagship mode, composing couple-readiness, prep-time, and **guest travel-stress** into one honest score.

The wedding date stays an **output** (parent's core principle). We're widening *what makes a date good* from "are my vendors free" to "are my vendors free **and** can we realistically pull it off **and** is it gentle on our guests."

## Glossary additions (so this reads in Cowork)

- **Optimization mode** — what the couple asks the ranker to prioritize: *Most vendors kept* (today's default) · *Least stressful* · *Soonest* · *Best cultural meaning*. Same candidate dates, re-ranked.
- **Feasibility / readiness** — can the wedding actually be pulled off by a given date, given what's still unbooked and how grand the plan is.
- **Style-scaled lead time** — how much runway the wedding *needs*, scaled by its size/grandeur. A 50-pax civil ceremony needs less than a 400-pax luxury wedding.
- **Travel-stress** — how hard a date is on guests getting *to* the venue: traffic-by-day, holiday road exodus, distance for out-of-town/abroad guests, weather.
- **Deterministic dimension** — scoreable from reference tables + the couple's own inputs, **no marketplace volume required** (works at cold-start). The opposite is a **data-dependent** dimension (needs many real weddings before it means anything).

---

## §A. The reframe — single-objective → multi-objective ranker

Today (parent §5, shipped) a date's score is one ordered key:

```
covered-count → top-picks-kept → earliest
```

Proposed: the ranker computes **per-dimension sub-scores** for each candidate date, then combines them under the **selected mode's weighting**. Availability stays the spine (a date the venue can't host is still disqualified per §5a — reception is ground 0); the new dimensions *re-order the viable set*.

```
viable dates (reception free · §5a)
   → score each on: availability · feasibility · cultural · travel-stress · seasonality
   → weight by selected MODE
   → ranked list + per-date "why" + the trade-off vs the next-best
```

Non-negotiable carried from parent: the couple **never reads a raw grid** — they read a ranked list with a one-line reason and the explicit trade-off ("Dec 14 is one vendor-swap but a Sunday — lighter traffic for your out-of-town guests").

---

## §B. The five new scoring dimensions

Each dimension below lists: *what it measures · its inputs · whether it's deterministic (cold-start-safe) · what already exists in code.*

### D1 — Feasibility / readiness  *(owner's point #3)*
**Measures:** can this wedding realistically be done by date X? An *earlier* date scores **lower** when too much is unbooked or unfunded for the time left.
**Inputs:** categories still unlocked vs. their required lead time (D2); statutory windows already modeled in code (`lib/upcoming-items.ts`: PSA/CENOMAR −180d, marriage license −120d, Pre-Cana −60d); payment runway vs. the budget ledger (0007).
**Deterministic:** ✅ yes.
**Exists:** the lead-time constants (`PLAN_GROUPS.monthsBefore`) and statutory windows exist; **nothing yet penalizes a date for being infeasible.** Net-new.

### D2 — Style-scaled lead time  *(owner's point #5)*
**Measures:** how much runway the wedding *needs* — and therefore how close is "too close." Guests and suppliers both need more time for a grand plan than a simple one.
**Inputs:** pax (captured), budget tier, concept/grandeur (mood board / chosen concept), category count. Produces a **required-lead-time curve** that feeds D1: simple ≈ 3 mo, grand/luxury ≈ 12 mo+ (curve values **owner-to-set** — never invent).
**Deterministic:** ✅ yes.
**Exists:** `PLAN_GROUPS.monthsBefore` is a *flat* per-category lead time; it does **not** scale by grandeur. Net-new.

### D3 — Booking velocity  *(owner's point #9)*
**Measures:** is this couple deciding fast or slow? Feeds two things: urgency framing ("you're moving quickly — these dates are still wide open") and feasibility (a slow decider + a near date → nudge a later date).
**Inputs:** `event_vendors` status-transition timestamps (considering → shortlisted → deposit_paid), event-creation date, candidate-date stability.
**Deterministic:** ✅ for the couple's *own* velocity (no other couples needed). Comparison-to-cohort is data-dependent.
**Exists:** the status/timestamp data exists; no velocity signal computed. Net-new.

### D4 — PH seasonality & calendar  *(owner's point #6 additions)*
**Measures:** weather/typhoon risk against the **venue setting**, holiday surge, and OFW-homecoming windows.
**Inputs:** an admin-curated **typhoon-season calendar** × the reception's indoor/outdoor/garden/beach setting; **Holy Week** (moveable) blackout; **Christmas/New Year** + long-weekend windows (OFW relatives home → attendance ↑, but airfare/venue surge + booked-out); school calendar.
**Deterministic:** ✅ yes (reference tables, not statistics).
**Exists:** `auspicious-date.ts` only *reframes* these positively (e.g. "rain is prosperity"); it never **scores** weather against the venue. Net-new as a score.

### D5 — Guest travel-stress  *(this session's addition)*
**Measures:** how hard a date is on guests getting to the venue. The "least stressful day" intuition, made concrete.
**Inputs / sub-signals:**
- **Traffic by day-of-week** — Metro-Manila-style: Friday-evening rush is worst (payday Fridays 15th/30th worse still), Sunday lightest. **Region-aware** (NCR severe; provincial venues differ).
- **Start-time guidance** — *the owner said "time," not just date.* A 2 pm start beats the evening rush on the **same** date → the Aligner surfaces a recommended start-time per date, not only the date.
- **Holiday road-exodus, direction-aware** — before long weekends the metro *empties* onto NLEX/SLEX. Venue **in-province** → guests already heading that way (good); venue **in-city** → highways clog (mixed).
- **Out-of-town / abroad travel buffer** — many far/flying guests → weight long-weekend-adjacent dates up (one less leave day, cheaper airfare off-peak).
- **Weather × travel compounding** — typhoon season doesn't only risk an outdoor venue; it floods roads and cancels flights. D4 and D5 multiply.
**Deterministic:** ✅ yes — traffic patterns + holiday calendar are reference tables, available at cold-start.
**Exists:** `auspicious-date.ts` *mentions* travel in positive copy ("a long weekend means guests have time to travel"); never scored. Net-new.

> **Existing dimension, now selectable as a mode:** *Cultural meaning* — the full `auspicious-date.ts` engine (numerology · Western zodiac · Chinese year · lunar phase · ceremony overlays) already exists and becomes the **"Best cultural meaning"** mode. (Its depth + the avoidance question are in §F.)

---

## §B2. Additional factors — hard disqualifiers vs. soft re-rankers

A second wave (session 2026-06-04). They split by *how* they act on a date — keep them apart so a hard blocker is never silently outranked by a nice-to-have.

**Hard disqualifiers** — remove a date from the viable set (behave like the reception ground-0 gate, parent §5a):
- **Liquor-ban / election dates** — a reception with no alcohol served. *Advisory-hard:* flag + explain, never a silent delete (window is COMELEC-resolution-dependent — see §J).
- **Permit lead-time floors** — pyro / LGU / noise / road-closure permits set the *earliest feasible* date.
- **Couple's own hard window** — visa / petition / OFW-leave / relocation deadlines (via the `meaningfulDates: avoid` model).
- **Venue's own rules** — blackout dates, peak-date minimum-pax, day-before/after events compressing load-in.

*(Liturgical/cultural restrictions are NOT hard disqualifiers — per the §F soft-caution decision they down-rank as cautions; see the Cultural-cautions line below.)*

**Soft re-rankers** — adjust score within the viable set (like D1–D5):
- *Money:* per-date vendor price differential (off-peak saves across the shortlist — **couple-first, never steer to our margin**); PH cashflow timing (13th-month / bonus / remittance alignment).
- *Guests:* calendar-clash (other weddings in their circle, big public events, school calendar); overnight accommodation availability + rates; heat/comfort for elderly + kids (Apr–May outdoor).
- *Quality & timing:* golden-hour / sunset clock by date (outdoor photo + program pacing, pairs with D5 start-time); vendor quality-by-load (off-peak = full attention).
- *Couple's life:* honeymoon alignment (leave + destination season); couple priority weighting (tunes the §D mode) + tie-break transparency.
- *Cultural cautions (§F soft-caution · owner 2026-06-04):* Ghost Month, Sukob, Catholic Lent/Advent, Ramadan — surface an honest *"here's why many avoid it; you can still choose it"* note and gently lower rank; **never disqualify.**

> **Open question (not a factor — flag for owner):** Setnayan's own **crewed** services (Papic / Panood) use finite real crews on a day. Is the locked "in-app services are always-on" rule truly unbounded, or do crewed SKUs need a per-day capacity? Settle before the Aligner implies Setnayan is free on any date.

---

## §C. The flagship — "Least stressful" composite mode

The payoff of D1–D5: a single mode that optimizes for the couple's and guests' *lived experience* over raw optimization — directly serving the owner's north-star principle (*best UX is the deciding question*).

**Least-stressful score = weighted blend of:**
- **Couple readiness** (D1) — not a frantic timeline.
- **Enough prep time for the plan's grandeur** (D2) — suppliers + couple aren't rushed.
- **Guest travel ease** (D5) — gentle traffic, travel buffer, good start-time.
- **Calm weather window** (D4) — away from typhoon-peak for the venue setting.

Surfaced honestly, with the trade-off always visible:

```
RANK BY: ( Most vendors kept )  ( ★ Least stressful )  ( Soonest )  ( Best cultural meaning )

★ Dec 14 (Sun)  Lightest traffic · all 8 categories covered · 7 months runway
                Start ~2 PM to beat the evening rush.            → least stressful
  Dec 12 (Sat)  Keeps every top pick, but Sat-evening city traffic is heavy for
                your out-of-town guests · same 7-month runway
  Nov 8  (Sat)  Soonest — but only 4 months for a 300-pax plan · 2 vendors unbooked
                → feels rushed
```

Weights are **admin-tunable** (§J), never hardcoded magic numbers.

---

## §D. Optimization modes — the UX

- **Mode selector** at the top of `/find-date` (the Wedding Date Aligner). Default stays **"Most vendors kept"** (parent's shipped behavior — no regression).
- **Per-date "why"** — one line of plain reasoning + the explicit trade-off vs. the next-best date. (Carries the parent's "never a raw grid" rule.)
- **Start-time guidance** per date (D5) — the date *and* the gentlest time on it.
- **Pin a non-negotiable** (parent §5) composes with modes — pin the photographer, then rank the *remaining* viable dates by Least-stressful.
- **Pre-date-lock Home nudge** — see §H.

---

## §E. Cold-start honesty (which dimensions work *now*)

Critical, because the marketplace is **founder-only today** (one published vendor) — the statistical layers have almost no data to run on.

| Dimension | Cold-start? | Why |
|---|---|---|
| Availability (parent §5) | ✅ works | runs on the few real calendars; 3-state honesty covers gaps |
| D1 Feasibility | ✅ works | reference tables + the couple's own plan |
| D2 Style lead-time | ✅ works | curve + the couple's pax/budget/concept |
| D4 Seasonality | ✅ works | admin calendars, not statistics |
| D5 Travel-stress | ✅ works | traffic + holiday tables, not statistics |
| Cultural meaning | ✅ works | pure compute (`auspicious-date.ts`) |
| D3 Velocity (own) | ✅ works | the couple's own timestamps |
| D3 Velocity (vs cohort) | ⏳ needs volume | needs many couples |
| Eyeing density (parent §7) | ⏳ needs volume | needs overlapping real demand |
| Best-selling concepts (#10) | ⏳ needs volume | admin trend analytics first, couple-facing later |

**Near-term build = the deterministic stack.** The data-dependent layers (#8 weddings-per-day density, cohort velocity, #10 trends) are **compute-on-read as data accrues — no cron** (honors the cron-free principle + parent §7's synchronous, no-cron rule). Present every score with its **confidence**, degrading to "here's what we know" when thin — same honesty posture as the 3-state availability model.

---

## §F. Cultural depth — RESOLVED: soft-caution tier (owner-decided 2026-06-04)

`auspicious-date.ts` is **deliberately positive-only** — it is forbidden from ever calling a date "bad" and always reframes (typhoon → "prosperity," the 13th → "a modern favorite"). But the owner's point #4 ("there are *rules*, specially for Chinese couples, Filipinos as well") describes **avoidance** — and real practice *is* avoidance:

- **Chinese:** 擇日 date-selection uses the couple's *bazi* (birth dates) → compatible vs. **clash (沖)** days; avoids the **Ghost Month** (7th lunar month). Today's engine only knows **year-of-the-X** (approximate, Jan-1 boundary) — far shallower.
- **Filipino:** **Sukob** (siblings shouldn't marry the same year; no wedding right after a family death) — currently only a positive *reframe*, not an input.
- **Other faiths:** Muslim (avoid Ramadan for the walima timing), etc. — shallow via ceremony overlays.

**You can't have "follow the rules" and "never say a date is bad" at once.** Three options:

1. **Keep positive-only** — culturally safe, but can't truly steer (status quo).
2. **Add a "soft-caution" tier (recommended)** — honest, non-prescriptive: *"Many Chinese families avoid the 7th lunar month — here's why. You can still choose it."* Never blocks; informs. Fits the brand's editorial restraint.
3. **Full avoidance engine** — bazi clash-days, Ghost-Month, Sukob as hard inputs. Most powerful, heaviest to build + verify, and risks telling a couple their date is "unlucky."

**→ RESOLVED 2026-06-04 (owner): option #2 — the soft-caution tier.** Cultural/religious avoidances (Ghost Month, Sukob, Lent/Advent, Ramadan) surface as **honest cautions that can gently lower a date's rank but never disqualify** — *"here's why many avoid it; you can still choose it."* The positive-only reframes stay as the default warmth; the caution is a new opt-in layer on top. Three consequences:
- (a) the §B2 **liturgical-restriction flag is a soft caution, not a hard disqualifier**;
- (b) the §J.1 **cultural-avoidance vocabulary table is confirmed needed**;
- (c) **bazi clash-day depth (#3 / per-couple birth-chart) stays out of scope** — cautions key off Ghost Month / Sukob / liturgical season, not birth-chart computation.

---

## §G. Three-actor surfaces (the architect view)

**Customer**
- `/find-date` mode selector + per-date "why" + start-time guidance + pin-a-must-have.
- Home **pre-date-lock nudge** (§H).
- Optional, **aggregate** input: "Are many guests coming from out of town / abroad?" (feeds D5; see §I).

**Vendor**
- Calendar + `daily_booking_capacity` feed availability (parent §10, unchanged).
- **Serves-area / location** feeds D5 distance (the distance-anchor already shipped, PR #786).
- *(Optional, later)* vendor marks **peak/premium dates** → informs D4 surge framing.

**Admin** *(0023 — the new governance surface this expansion creates)*
- Curates the **reference tables** (§J): traffic-severity-by-region, holiday calendar, typhoon-season calendar, style→lead-time curve, cultural-avoidance vocab (§F soft-caution), mode weights.
- **Trend analytics** (owner's #10) — best-selling concepts/designs: an admin *insight* surface first; a couple-facing recommendation only once it's real.
- Tune weights + a kill-switch per dimension.

**Connections (customer ↔ vendor ↔ admin)**
candidate dates + shortlist + reception-location → availability (vendor calendars) + travel/seasonality/cultural (admin tables) → ranked dates → couple **locks** → sets `events.event_date` → unlocks soft-holds (parent §6) → **notifies vendors** (0028). Vendor marks a day off → the couple's dates **re-rank**.

---

## §H. Home surface — the pre-date-lock nudge (also fixes a live drift)

The owner's original ask was to put the date reminders on the **Home "Upcoming"** strip. Home is under the **lean-3-block lock** (owner 2026-06-02), so the full engine should **not** render inline. Instead:

- A **single "Lock your wedding date" nudge** on Home with the Aligner's current best pick (*"Dec 14 keeps all 8 vendors and is easiest on your guests"*) → taps through to `/find-date`.
- Pre-lock, it shows exactly the three reminders the owner listed: **set the wedding date · finalize the reception (ground 0) · pick your top 2 dates.**

**Drift this closes (found this session):** Home's recommended-deadline + statutory-deadline sources (`lib/upcoming-items.ts`) **return nothing until `events.event_date` is set** — so *before* a couple locks a date, Home is silent on exactly this guidance. The pre-date-lock nudge is both the feature **and** the fix. (Ties to the parent's **keystone** — onboarding Phase-4 must write `date_candidates`/`date_window`; §9.1.)

---

## §H2. Date-onboarding flow (couple-facing capture)

Principle: **capture cheap → derive the rest → refine over time.** Ask only what we can't compute; derive D1–D5 + the calendar flags. Obeys the onboarding golden rules (no scrolling · one idea per screen · minimal words · thumb-zone split · Skip = defer · preloaded).

**Core (can't be derived):**
1. **When?** — exact · month · window · "help me pick." *This is the existing screen-6 picker and the **keystone** (parent §9.1): Phase-4 must WRITE `date_candidates`/`date_window`/`date_mode` — the missing DB commit that also keeps pre-date-lock Home silent (§H).*
2. **Anchor dates** — "A date to honor, or to avoid?" (`meaningfulDates` honor/avoid).

**Enrich (skippable · one signal each):**
3. **What matters most?** — soonest · least stressful · keep a vendor · best price · most guests can come → sets the default §D mode.
4. **Your guests** — "Many from out of town / abroad?" (yes/no · aggregate · RA 10173) + pax band → feeds D5 + D2.

**Payoff (the derive):**
5. **"Here's your best date"** — computed top 1–2 with the one-line *why* + trade-off → **Lock it** or **Explore in the Date Aligner.**

Everything else (feasibility · seasonality · traffic · cultural · liquor-ban) is **computed, never asked**, and re-ranks as they add vendors / set a budget.

---

## §I. Privacy (RA 10173) — carries parent §8, plus one new rule

All of parent §8 holds (aggregate-only · no cross-leak · suppress small-N). New, for D5:

- **Guest-origin stays aggregate + optional.** Prefer a yes/no — *"many guests from out of town?"* — over collecting guest addresses. Don't over-collect to sharpen a travel score.

---

## §J. Admin surface (0023) — reference tables, the calendar engine & the refresh action

The admin-owned half of this feature. All governed by the Setnayan team; the couple-facing Aligner only *reads* it.

### J.1 — Reference tables the admin owns
All admin-curated, deterministic, cold-start-ready (values **owner-to-set** — do not invent):
1. **Traffic-severity** by region × day-of-week × time-band (NCR severe; provincial differs).
2. **Holiday calendar** — fixed + moveable (Holy Week), with an **exodus-direction** flag.
3. **Typhoon-season calendar** × venue-setting risk weights.
4. **Style → required-lead-time curve** (pax/budget/grandeur → months) — feeds D1/D2.
5. **Cultural-avoidance vocabulary** (§F soft-caution · confirmed 2026-06-04) — Ghost Month, Sukob, Lent/Advent, Ramadan + the honest "you can still choose it" copy.
6. **Election / liquor-ban calendar** — election dates + COMELEC-resolved ban windows + LGU-local bans.
7. **Mode weight sets** — per-mode dimension weights + per-dimension kill-switch.

### J.2 — The calendar engine (how the date facts are produced)
Cheapest-truth-first, all **cron-free**:
- **Deterministic rules (zero maintenance):** national/local elections = 2nd Monday of May, triennial (2025→2028→…); standard liquor ban = election day + eve; Holy Week via Computus; fixed holidays. Extends the existing `auspicious-date.ts` holiday logic (which today only hardcodes fixed-date holidays).
- **Admin table (the variable/legal bits):** COMELEC's exact window, postponed barangay elections, special elections/plebiscites, LGU-local bans — human-entered when the resolution publishes.
- **Optional free/open feed:** PH public holidays from a free dataset (e.g. Nager.Date) or a bundled library — **never a paid per-call API** (also fits the OSS-first preference).
- **Honesty:** legal flags render **advisory** — *"a liquor ban is expected — confirm the COMELEC resolution"* — never a silent hard delete.

### J.3 — The admin refresh action (the button · owner-approved 2026-06-04)
Keeps the tables fresh without a cron:
1. **Scope** — pick year + source (Holidays · Elections/liquor-ban · Typhoon · All). A *specific*, targeted launch.
2. **Compute + fetch** — server action runs the deterministic engine + any free feed (`after()`/`waitUntil` if slow). No external paid call.
3. **Diff preview** — added / changed / removed vs. the stored table, **legal flags highlighted**.
4. **Approve** — all or per-row → upsert into the reference table + write an **audit row**. Live immediately, no deploy.
5. **Couple-side** picks it up on-render (compute-on-read), still behind the advisory label.

**Governance:** single-admin + diff-review for routine refreshes; route **liquor-ban changes** through the §9.1 two-admin gate (legally sensitive); **audit** every launch + approval.

**Cost:** compute-sourced (no paid feed) → **trigger ≈ $0** — pure compute + a trivial DB write; manual trigger = no idle infra. The only real cost is admin review time (the gate) + tiny existing Vercel/Supabase usage. *(An optional ops-side agent that drafts updates from a COMELEC PDF would use a few cents of Claude tokens a few times a year — that's the agent, not the button.)*

---

## §K. Scope + build-order placement

- **V1.x post-pilot** (parent §11). No code/migration with this lock.
- Slots **after** the parent's keystone (§9.1 onboarding date commit) and capacity (§9.2), **alongside/after** the Find-your-date surface (§9.4). The mode selector + deterministic dimensions are an **additive** layer on the shipped ranker — no regression to the default "Most vendors kept."
- Data-dependent dimensions (cohort velocity, eyeing density, trends) are deferred until volume exists; surfaced with confidence; **no cron.**
- **Freshness:** the admin refresh action (§J.3) keeps the calendar tables current — manual, diff-reviewed, audited, **cron-free, ≈$0.** The date-onboarding flow (§H2) is the couple-facing capture front-end and depends on the keystone DB commit (parent §9.1).

---

## Appendix — owner's 10 points → where they land

| # | Owner's point | Lands as |
|---|---|---|
| 1 | Best date by service-picking status | Availability spine (parent §5) — **shipped** |
| 2 | Service combo + distance + reception compatibility | Parent §5a reception ground-0 + distance-anchor (**shipped**); true "pair-well" = parent's future-enhancement |
| 3 | Too-near + too-much-left → earliest isn't best | **D1 Feasibility** (net-new) |
| 4 | Religion / pamahiin / Chinese / Filipino rules | Cultural mode + **§F soft-caution** (resolved 2026-06-04 · cautions down-rank, never disqualify) |
| 5 | Guest + supplier prep scales with grandeur | **D2 Style-scaled lead time** (net-new) |
| 6 | Consider all + what else | **D4 Seasonality** + **D5 travel-stress** + guardrails |
| 7 | Sparse data → still recommend | §E cold-start + 3-state honesty (**shipped** posture) |
| 8 | Evolves as data grows | Data-dependent layer, compute-on-read, **no cron** |
| 9 | Booking patterns (fast/slow) | **D3 Velocity** (net-new) |
| 10 | Best-selling designs/concepts | Admin trend analytics → couple-facing later |
| + | Guest transportation / least-stressful day | **D5 + the "Least stressful" mode (§C)** |
