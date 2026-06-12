# Schedule Matrix & Date Finder — design lock (2026-06-02)

**Status:** Design-locked · **V1.x post-pilot** (V1 scope is locked — this is the build target, not shipping now).
**Owns / touches:** cross-cutting — 0006 (vendors), 0021 (couple dashboard), 0016/0043 (onboarding date capture), 0028 (email), 0034 (orders/payment).
**Parent design:** [Vendor_Match_Personalization_2026-06-01.md](Vendor_Match_Personalization_2026-06-01.md) §2 "candidate-set date resolution / vendor-availability convergence" — this doc makes it concrete and adds the capacity rule + the honest-eyeing rules.

---

## The one-line idea

> **Couple-facing free-tool name:** this "Find your date" surface is the **Wedding Date Aligner** — #15 in [Time_and_Money_Saved_Model_2026-06-01.md](Time_and_Money_Saved_Model_2026-06-01.md) §H (free · ₱999 value · ~3h saved).

**The wedding date is an OUTPUT, not an input.** The couple gives a few candidate dates (or a date window) plus the vendors they want; the system returns **which date keeps the most of those vendors available**, and flags the trade-offs. One shared engine (candidate-date overlap) powers BOTH the "Find your date" matrix AND the honest "someone's eyeing your date" signal.

## Plain-English glossary (so this reads in Cowork)

- **Candidate dates** — the handful of dates the couple is considering, or a date range. Captured in onboarding (screen 6, the date picker).
- **A vendor's open days** — of the couple's candidate dates, the ones that vendor can still take.
- **The matrix** — a simple grid: candidate dates across the top, the couple's shortlisted vendors down the side, a tick where a vendor is open on a date. The column (the date) with the most ticks is the best date.
- **The eyeing count** — how many *other* couples are chasing the same vendor on a date that overlaps the couple's — shown as a number, never names.

---

## 1. Availability has THREE states (not two)

The honesty fix that makes empty calendars safe — never call a no-data vendor "free":

| State | Means | Shown to the couple as |
|---|---|---|
| ✅ Confirmed-free | The vendor's calendar has room on that date | "Free on this date" (or "1 slot left") |
| ◇ No conflicts on file | The vendor has no data for that day | "No conflicts on file — confirm with vendor" |
| ✗ Busy | The vendor is full / blocked that date | "Booked" |

**In-app Setnayan services are EXCLUDED from this matrix (owner-locked 2026-06-03).** The availability states + date-gate here are **external-vendor-only.** Setnayan's own in-app services (`is_setnayan_service = true`) are **always-available** (Setnayan-fulfilled · no wedding-date constraint), so they never date-gate, never consume `daily_booking_capacity`, and never appear as a row in the find-your-date grid — they're add-and-pay anytime ([0034](../0034_payments_and_cart/0034_payments_and_cart.md)). See DECISION_LOG 2026-06-03 "♾️ In-app services are ALWAYS-ON + direct-checkout".

## 2. Capacity-aware blocking (the 2026-06-02 refinement)

A date is **not** blocked the moment someone pays — it's blocked when the vendor **runs out of slots for that day.**

- Each vendor has a **per-day limit** — new column `vendor_profiles.daily_booking_capacity` (INT, default **1**). Most wedding vendors = 1; a caterer or an HMUA-with-a-team might be 2–3; a venue is usually 1.
- Every **paid** booking (an `event_vendors`/`orders` row reaching `deposit_paid`) uses **one slot** of that (vendor, date).
- A date flips to **Busy** only when paid bookings reach the limit. Limit 2 + 1 booking = **still open** → surface "**1 slot left**" (honest scarcity).
- A date is Busy if EITHER: paid bookings on that date ≥ the vendor's daily limit, **OR** the vendor placed a manual full-day block (a day off).

So: `daily_booking_capacity` is the **delivery** limit (how many weddings I can serve that day). The existing `max_soft_holds_per_date` stays as the **tentative-hold** fairness cap (how many couples can hold a *remaining* slot before anyone pays) — a separate dial, unchanged.

## 3. How vendor calendars fill (layered, cheapest-truth-first)

The matrix is only as good as the calendars behind it. Fill them in this order:

1. **Auto-decrement on payment (do this first).** When a Setnayan booking hits `deposit_paid`, automatically consume one slot of that (vendor, date) and block the date once the last slot is gone. Zero vendor effort, highest trust. (This is the deferred "Rule 5," now capacity-aware.)
2. **A simple vendor "blocked dates" screen** — so vendors mark dates they booked *off-platform* + their days off.
3. **Google/Apple calendar sync** — V1.5+, optional. The `synced_calendar` source already exists in the schema.

## 4. The shared engine (in plain English)

Three steps — the whole thing runs on these:

- **The couple's candidate dates** — read from the event (the specific-dates list, or expand the date window into a set of days).
- **Each vendor's open days** — for each shortlisted vendor, which of the candidate dates they can still take (the 3 states above).
- **The overlap count** — for any vendor, how many *other* couples have inquired-or-stronger on that vendor with candidate dates that **overlap** the couple's. Aggregate, small-N suppressed.

The first two steps → the **matrix** (Feature A). The third step → the **eyeing signal** (Feature B). Same data, two outputs. The engine extends `apps/web/lib/vendor-availability.ts`, which already computes per-vendor free days + the locked-vendor intersection.

## 5. Feature A — "Find your date"

A couple-facing surface. The matrix grid (your candidate dates × your shortlisted vendors), a **recommended date** ("Dec 12 keeps all 8 of your vendors"), and the trade-offs ("Dec 19 loses your photographer + band"):

```
                 Dec 12 (Sat)   Dec 19 (Sat)   Jan 9 (Sat)
Photographer        ✓ free         ✓ free         ✗ booked
Caterer            ✓ free         ✗ 1 slot left   ✓ free
Reception venue     ✓ free         ✓ free         ✓ free
Band               ✓ free         ✓ free         ✗ booked
HMUA               ✓ free         ✓ free         ✓ free
─────────────────────────────────────────────────────────
                 ALL 5 free ★    4 of 5         3 of 5
                 → recommended
```

**The couple never reads a raw grid — they read two rollups of it.** Because a wedding books **one vendor per category** (and a backup counts), the grid above rolls up to *category coverage*: a date **"merges"** the couple's vendors when **every must-have category has ≥1 free option**, and the *quality* of the merge is how many of their **top picks** it keeps.

**View 1 — "Find my best date" (the merge ranking).** The candidate dates, ranked by must-haves-covered → top-picks-kept. The date is the output:

```
YOUR DATES — ranked by how well they merge your vendors
★ Dec 12 (Sat)   All 8 categories covered · keeps every top pick    → best
  Dec 19 (Sat)   8 of 8 covered · 1 swap (your #1 band busy → #2 free)
  Jan 9 (Sat)    6 of 8 · Photographer + Band have no free option   → weakest
```

**View 2 — tap a date → "who works together here" (the combo).** Per category, the available vendors for that date — reading *down a date's column* is the team you can assemble:

```
WHO WORKS TOGETHER ON Dec 19 (Sat)
Reception venue   ✓ Casa Manila (your pick)
Photographer      ✓ Lens & Co (your pick)
Caterer           ✓ Feast PH (your pick)
Band              ✗ Stellar Live (#1) booked  →  ✓ The Groove (#2) free
HMUA              ◇ Glow Studio — no conflicts on file (confirm)
Florist           ✓ Bloom Lab (your pick)
Cake              ✓ Sugar & Co (your pick)
This date works — 1 swap (Band) to assemble your full team.
```

**Pin a non-negotiable.** The couple can mark a must-have vendor → the dates re-rank around it: *"Pin Lens & Co (Photographer) → only Dec 12 + Dec 19 keep her free; Jan 9 drops off."*

**Must-haves are free input.** The onboarding priority ladder already marks the bare-minimum categories (reception · ceremony · photo+video · attire), so the merge score weights venue/photographer above photobooth automatically — no extra question to the couple.

*The whole logic in one line:* for each candidate date, check each category the couple needs — is ≥1 of their shortlisted vendors free? Rank by must-haves-covered → top-picks-kept; the winner merges the most.

The couple commits a date → it sets `events.event_date`. **Soft-holds only become possible after this** (Option A).

> **Future enhancement (NOT V1.x scope) — "vendors who pair well."** Above, "work together" means *mutually available* on a date. A later layer could add true **compatibility** — vendors who've worked the same real weddings, are frequently booked together, or recommend each other — surfaced as "often booked with" hints inside the View-2 combo. Flagged as a future enhancement; not in the V1.x build.

## 5a. Reception is the date-gate ("ground 0") — the date-isolation half (directive 3 · 2026-06-02)

> Directive 3 has two halves. The **distance-anchor** half **shipped** (PR #786 — the Nearest sort + serves-area anchor on the chosen reception; see [Vendor_Match_Personalization_2026-06-01.md](Vendor_Match_Personalization_2026-06-01.md) §2a). **This half — reception availability *gates the candidate dates* — is the DEFERRED design the find-date build (§9) must follow.** The schedule engine has no reception special-casing yet; this section is its spec.

The reception is **not an equal peer** in the convergence (§4) — it's the **primary anchor**. *"Reception will be ground 0."* (owner 2026-06-02)

- **A candidate date is viable only if ≥1 shortlisted reception is free on it.** The reception's free candidate days define the **outer feasible-date set**; every other category then intersects *within* that set (§4). You can't have a wedding date the venue can't host.
- **Multi-pick reception is at the SHORTLIST layer.** Shortlisting several receptions **unions** their free candidate days → a wider set of possible wedding dates (each venue option opens its own dates). This does **not** flip the hard-single saturation rule — that governs the **LOCK** layer (you still book ONE venue; the same shortlist-many-lock-one model as every category · 2026-05-09 saturation lock + the `finalizeVendor` hard-single gate).
- **On lock, the chosen reception's free days become the HARD date boundary** the find-date matrix ranks all other categories within; the date settles on a day the locked reception **and** the couple's other top picks share.
- **Anchor precedence mirrors the shipped distance anchor** (locked → oldest-'considering' → fallback · Vendor_Match §2a) so the date-gate and the distance-anchor track the *same* reception.

## 6. Soft-hold timing (Option A — locked)

Shortlisting a vendor places **NO** hold. A soft-hold fires **only** when the couple narrows to one date and locks. → keeps the per-(vendor, date) fairness cap honest. No couple can tie up a vendor across 4 tentative dates.

## 7. Feature B — the honest "someone's eyeing your date" signal

Three tiers, all real, all aggregate, all scoped to **overlapping dates**:

| Tier | What it really is | Honest copy | Strength |
|---|---|---|---|
| 👀 Considering | Another couple **inquired** about the same vendor with overlapping candidate dates | "N couples are also looking at this vendor around your dates." | soft |
| 🔒 Held | A real soft-hold lands on a specific date (at lock) | "Someone just held this vendor for your date." | strong |
| ✓ Booked | A competitor's downpayment confirms | "This vendor is now booked for your date — here are 3 free alternatives." | hard |

- **Starts at the inquiry (Stage 2), NEVER at search (Stage 1).** Appearing in a couple's search results is an *impression*, not intent — counting it as competition = **manufactured scarcity (a fineable dark pattern).** The signal begins at the first deliberate action: the inquiry.
- Fires **synchronously** when a real inquiry lands on a vendor + overlapping date (**no cron**) → notifies the other couples chasing that vendor+date (in-app + an optional 0028 email).
- **Escalation:** considering → held → booked (the "slot's gone" path is honest, not theatre).
- **Throttle:** one nudge per genuine new event, capped (e.g. max 1/day per vendor-date) so it never reads as spam.

## 8. Privacy (RA 10173) — the rules that hold at EVERY tier

1. **Aggregate counts only — never identities.** "3 couples," never *which* couples, never "the Santos wedding."
2. **Never cross-leak the other side's plans.** Each side sees a count, not the other party's vendor list / client list.
3. **Suppress at small N.** A bare "1" on a niche vendor + a specific date + a small area can re-identify one real person even without a name. Don't show a "1," or strip the pinpoint specificity when N is tiny.

No conflict with privacy as long as these hold. The **privacy** failure mode (naming / cross-leak) is *separate* from the **honesty** failure mode (using Stage-1 search as if it were intent) — keep both dials set right.

## 9. The build order (keystone first)

1. **Onboarding Phase-4 commit → write `events.date_candidates` / `date_window` / `date_mode`.** **KEYSTONE** — the same fix also saves the couple's home personalization (the separate "onboarding → home" gap). Phase 2 already ships the date *picker* UI (PR #762); the missing piece is the **DB commit**.
2. **Capacity:** `daily_booking_capacity` column + auto-decrement on `deposit_paid` + the vendor "blocked dates" screen.
3. **The shared engine** + the 3-state availability.
4. **"Find your date"** surface + the date commit.
5. **The honest eyeing notification** (inquiry-triggered) + the 0028 template + the escalation + the throttle.

## 10. Schema + cross-iteration touch

- `events`: `date_mode`, `date_candidates[]`, `date_window_start/end` (already schema'd in migration `20260719000000` — needs the onboarding write to populate).
- `vendor_profiles`: **NEW** `daily_booking_capacity INT DEFAULT 1`.
- `vendor_calendar_blocks`: manual/synced full-day "day off" blocks (exists).
- `event_vendors` / `orders`: the **paid-booking** source for capacity counting + the inquiry/hold/booked tiers.
- `0028`: new email template(s) for the new-hold nudge + the booked-escalation.
- Cross-iteration: 0006 (vendor capacity + calendar), 0021 (couple "Find your date" + eyeing surface), 0016/0043 (onboarding date commit), 0028 (emails), 0034 (orders).

## 11. Scope

**V1.x post-pilot.** V1 ships current behavior. This is the convergence design (Vendor_Match_Personalization §2) made concrete + the capacity refinement + the honest-eyeing rules. **No code or migration shipped with this lock — design capture only.**
