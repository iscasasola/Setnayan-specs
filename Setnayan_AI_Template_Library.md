# Setnayan AI — Template Library (v1.1, PROPOSED)

> **Status:** Design proposal from the 2026-06-29 brainstorm, voice-refined. NOT yet owner-locked. The 6 open items are tracked for sign-off in **`Setnayan_AI_Subscription_Decisions_2026-06-29.md`** (settle them there, then this library + the per-user model become canonical). The subscription price is **owner-locked 2026-07-02: ₱499 first 28-day cycle (intro) → ₱799/28-day cycle** — **admin-managed, never hardcoded** (`platform_retail_catalog_v2`).
>
> **v1.1 changelog:** added enforceable voice micro-rules; tightened copy for warmth + the inform-never-pressure rule.

## Purpose

Every message Setnayan AI ever sends is a **template with data slots** — the rule engine decides *which* template fires and pours in values from data you already store. No language model writes anything, so the assistant stays **deterministic and free** (cost ≈ storage only; see "How it stays free"). This file is the canonical library a build session works from.

---

## How it stays free

Two design rules keep marginal cost at ~zero:

1. **Deterministic firing.** Triggers are SQL conditions + rule evaluation over existing data (bookings, budget ledger, reviews, shortlist, behavioral events, cohort aggregates). No per-user inference calls.
2. **String substitution, not generation.** Copy is a fixed string with `{slots}`. Even "drafted" vendor messages (SEC-04) are templated. The moment any template is rendered by an LLM instead, that template flips from free → per-use cost. **Keep the library deterministic to hold the ~95–99% margin.**

---

## Template anatomy

Every entry has the same shape:

```
[ID] Name                         Enabled for: ALL | WEDDING-ONLY | ...
Trigger:    deterministic condition (+ data read)
Don't fire: the restraint rule (when to stay silent)
Slots:      {placeholders} ← source
Copy:       the words, with {slots}
Action:     what the user can tap
Learns:     what their response trains (the data loop)
```

---

## Voice spec (applies to every template)

- **Warm, plain, premium.** No jargon, no exclamation-spam, never salesy.
- **Inform, never pressure.** State facts; let the user draw the urgency. (Critical for trend + pre-booking templates.)
- **Tentative when inferring.** "Seems like…", "I noticed…" — never assert a guess as fact.
- **One decision per message.**
- **Honest in the quiet.** A calm week is said plainly, never padded with invented work.

### Voice micro-rules (enforce at render)

- **₱ formatting:** `₱` + thousands separators, no decimals — `₱2,994`, never `PHP 2994.00`.
- **Contractions on** ("you're", "I'd", "it's") — warm, not formal.
- **One breath per message.** An em-dash for the aside; never stack clauses or bury a second ask.
- **No pressure verbs — ever.** Banned: "hurry", "don't miss out", "act now", "limited", "last chance". Use neutral time framing: "earlier is easier", "worth starting soon".
- **Address the organizer directly** — "you" / "your {event}", never third-person ("the couple should…").
- **CTAs are verbs in the user's interest** — "Show me", "Compare", "Remind me". Never "Buy now" inside an assistant message.
- **Praise is specific, never generic** — name the evidence (`{review_count} reviews at {avg_stars}★`), never a bare "Great!".
- **Inferences open with the observation** — "I noticed…", "Seems like…" — so the user always sees what the AI saw.

---

## Global restraint engine (sits above the whole library)

- **Confidence gate** — inferences below threshold do not fire at all.
- **Frequency cap** — at most ONE proactive interruption between weekly digests; everything non-urgent waits for the digest (SEC-01).
- **Priority + dedup** — if several could fire, send the highest-stakes one; never repeat the same template within its cooldown.
- **Channel rule** — urgent guard items (money/deadline/date-risk) may interrupt (in-app + email); everything else accretes into the weekly receipt.
- **Quiet hours** — no proactive pushes outside daytime local hours.
- **Silent-week honesty** — if nothing real happened, the digest says so.

---

## Event-type variant system

One template serves every event type by resolving **terminology slots** from `event_type_profiles` (your shipped 0053 engine), and by an **Enabled for** gate. Only genuinely type-specific templates are restricted.

### Terminology slots (resolved per event type)

| Slot | wedding | birthday | debut | christening | generic |
|---|---|---|---|---|---|
| `{organizer}` | the couple | the host | the celebrant's family | the family | the host |
| `{event}` | wedding | birthday | debut | christening | event |
| `{event_day}` | wedding day | big day | debut | christening | event day |
| `{date_label}` | wedding date | party date | debut date | christening date | event date |

The copy below is written in wedding terms for readability; at render time each `{event}/{organizer}/…` is swapped from the profile. "Enabled for: ALL" means the template works for every type via these slots.

### Enablement summary

- **ALL types:** every Secretary, Commend, Inference, and Trend template, plus guards GRD-01/03/04/05/06/07/08/09/10.
- **WEDDING-ONLY (today):** GRD-02 (PH statutory). Other types enable their own statutory pack when one exists.

---

# THE LIBRARY

## 1 · SECRETARY — *does the work*

```
[SEC-01] Weekly receipt  (ASSEMBLY — the keystone retention piece)   Enabled for: ALL
Trigger:    weekly, per active subscriber
Slots:      {checked_count}, {on_track_count}, {flags[]}, {next_task}, {horizon_item}
            ← the week's fired events + the task backlog
Copy (busy week):
  "This week I checked {checked_count} things on your {event} — {on_track_count}
   on track.
   {flags rendered as bullets}
   Next up: {next_task}."
Copy (quiet week):
  "Calm week — everything's on track. One thing on the horizon: {horizon_item}."
Action:     [Open plan]
Learns:     which items they open → what they care about
```

```
[SEC-02] Stuck — decision type  (too many options, frozen → NARROW)   Enabled for: ALL
Trigger:    a category open > {weeks}, ≥{N} vendors shortlisted, 0 booked
Don't fire: 0 vendors viewed (that's discovery → SEC-03)
Slots:      {category}, {weeks}, {top2[]}, {differentiator}
Copy: "You've been weighing {category} for {weeks} weeks. Based on your budget,
       {date_label}, and the style you keep picking, I'd look hardest at these two:
       {top2}. The main difference: {differentiator}."
Action:     [Compare these two] [See others]
Learns:     which they pick → refines the differentiator weighting
```

```
[SEC-03] Stuck — discovery type  (nothing fits → OFFER MORE)          Enabled for: ALL
Trigger:    a category open > {weeks}, vendors viewed but 0 inquired
Slots:      {category}, {new_count}, {relaxed_filter}
Copy: "Still nothing right for {category}? I found {new_count} more if we relax
       {relaxed_filter} a little. Want to see them?"
Action:     [Show me] [Keep my filters]
Learns:     which constraint they'll flex → the real priority
```

```
[SEC-04] Vendor went quiet → templated follow-up  (drafting, still FREE) Enabled for: ALL
Trigger:    inquiry sent, no vendor reply in {days}
Slots:      {vendor}, {service}, {date_label_value}
Copy (to user): "{vendor} hasn't replied in {days} days. Want me to send a nudge?"
Draft (templated, no LLM):
  "Hi {vendor}, following up on our inquiry about {service} for {date_label_value}.
   Are you available, and could you share a quote? Thank you!"
Action:     [Send nudge] [Edit first] [Skip]
Learns:     reply-rate → vendor responsiveness (feeds GRD-04)
```

```
[SEC-05] Quote received → summarize & compare                         Enabled for: ALL
Trigger:    a vendor replies with a quote on an open inquiry
Slots:      {vendor}, {amount}, {inclusions[]}, {vs_benchmark}
Copy: "{vendor} quoted ₱{amount} ({inclusions}). That's {vs_benchmark} for
       {category} in your area. Want to compare it against your shortlist?"
Action:     [Compare] [Accept] [Negotiate]
Learns:     accept/negotiate behavior → price sensitivity
```

```
[SEC-06] Next task (fractal backlog — never invent, surface real)     Enabled for: ALL
Trigger:    the prior task completed AND a next-smaller task exists
Don't fire: backlog empty (stay silent — honesty rule)
Slots:      {next_task}, {why_now}
Copy: "Nice — that's locked. Next, while there's time: {next_task} ({why_now})."
Action:     [Start] [Later]
Learns:     pacing preference
```

```
[SEC-07] Date convergence detected                                    Enabled for: ALL
Trigger:    ≥{N} shortlisted/booked vendors cluster on one date
Slots:      {date}, {count}, {category_list}
Copy: "Most of your picks ({count} so far) point to {date}. Want me to do a
       focused search around that date, or stay open to others?"
Action:     [Focus on {date}] [Stay open]
Learns:     confirms the implicit date decision
```

```
[SEC-08] Shortlist thin / weak fit → recommend more                   Enabled for: ALL
Trigger:    a needed category has <{min} viable matches at current filters
Slots:      {category}, {found_count}, {suggestion}
Copy: "Your {category} options are running thin ({found_count}). I can widen the
       search by {suggestion} — want me to?"
Action:     [Widen] [Keep tight]
Learns:     flexibility per category
```

```
[SEC-09] Plan-progress milestone                                      Enabled for: ALL
Trigger:    a category count crosses a milestone (e.g., {locked} of {total})
Slots:      {locked}, {total}, {remaining_highlight}
Copy: "You've locked {locked} of {total} key categories — solid progress.
       The big one left: {remaining_highlight}."
Action:     [See what's left]
```

## 2 · GUARD — *watches risk*

```
[GRD-01] Deposit / payment due                                        Enabled for: ALL
Trigger:    tracked payment due ≤7 days, unpaid
Don't fire: paid, or reminded in last 3 days
Slots:      {vendor}, {amount}, {due_date}, {days_left}
Copy: "Heads up — your {vendor} payment (₱{amount}) is due {due_date},
       {days_left} days away."
Action:     [Mark paid] [Remind me the day before]
Learns:     payment exists / reminder timing
```

```
[GRD-02] Statutory deadline                                   Enabled for: WEDDING-ONLY
Trigger:    a {document} lead-time/expiry window reached
Slots:      {document}, {deadline}, {days_left}
Copy: "Your {document} needs attention — {deadline} ({days_left} days). I'll
       remind you again at 30 days."
Action:     [Got it] [Show requirements]
Note:       Other event types enable their own statutory pack if/when one exists.
```

```
[GRD-03] Shortlisted vendor price rose                                Enabled for: ALL
Trigger:    a shortlisted vendor's price increased since you saved it
Slots:      {vendor}, {old_price}, {new_price}, {category}
Copy: "{vendor} (on your {category} shortlist) went from ₱{old_price} to
       ₱{new_price}. Lock it in, or want alternatives?"
Action:     [Lock now] [Show alternatives]
Learns:     price-change sensitivity
```

```
[GRD-04] Vendor reliability flag                                      Enabled for: ALL
Trigger:    a shortlisted/booked vendor's responsiveness or rating drops below {floor}
Don't fire: below min-N evidence (avoid punishing thin data)
Slots:      {vendor}, {signal}   (e.g., "slow to reply lately", "rating dipped")
Copy: "A note on {vendor}: {signal}. Worth a quick check-in before you commit
       further — want me to draft a message?"
Action:     [Draft message] [Show alternatives] [Dismiss]
Learns:     dismiss/act → calibrates the reliability floor
```

```
[GRD-05] Over-budget drift                                            Enabled for: ALL
Trigger:    committed + pending > total budget by ≥{threshold}
Slots:      {over_amount}, {top_driver_category}
Copy: "You're ₱{over_amount} over budget right now — mostly {top_driver_category}.
       Want me to find a few places to trim, or raise the total?"
Action:     [Show trims] [Raise budget]
Learns:     trim vs raise → true budget ceiling
```

```
[GRD-06] Date conflict / double-book                                  Enabled for: ALL
Trigger:    two commitments collide on the same slot
Slots:      {item_a}, {item_b}, {slot}
Copy: "Two things land on {slot}: {item_a} and {item_b}. That's a clash — want
       to resolve it now?"
Action:     [Resolve]
Note:       Mirrors your DB-level conflict guard (couple-facing voice).
```

```
[GRD-07] Contract window closing                                      Enabled for: ALL
Trigger:    a free-cancellation / free-change deadline ≤{days} away
Slots:      {vendor}, {window_type}, {deadline}
Copy: "Your {window_type} window with {vendor} closes {deadline}. If anything's
       uncertain, decide before then — after that, changes may cost."
Action:     [Review contract] [I'm sure]
```

```
[GRD-08] Unverified vendor about to receive money                     Enabled for: ALL
Trigger:    a payment is being logged to an unverified vendor
Slots:      {vendor}
Copy: "Quick check — {vendor} isn't verified on Setnayan yet. Confirm their
       details before sending money. Want tips on paying safely?"
Action:     [Safety tips] [I trust them]
Note:       Verification status itself is FREE; this proactive warning is the AI layer.
```

```
[GRD-09] Vendor availability changed (your date at risk)              Enabled for: ALL
Trigger:    a shortlisted vendor's availability for your date changes
Slots:      {vendor}, {date}, {status}
Copy: "{vendor}'s availability for {date} just changed ({status}). If they're
       a top pick, lock them soon — want me to reach out?"
Action:     [Reach out] [Show alternatives]
```

```
[GRD-10] Last-minute rescue                                           Enabled for: ALL
Trigger:    a booked vendor cancels / falls through
Slots:      {category}, {date}, {backup_count}
Copy: "{vendor} fell through for {category}. I already found {backup_count}
       open on {date} — want to see them now?"
Action:     [Show backups]
Note:       Where your last-minute matching engine becomes a rescue feature.
```

## 3 · COMMEND — *reassures* (praise stays scarce; spend it only when earned)

```
[CMD-01] Post-booking reassurance  (warm — decision made)             Enabled for: ALL
Trigger:    booking confirmed AND vendor Bayesian score ≥ {threshold}
Don't fire: score below threshold (silence carries signal)
Slots:      {vendor}, {review_count}, {avg_stars}, {events_this_month}
Copy: "Great choice. {vendor} has {review_count} reviews at {avg_stars}★ and
       finished {events_this_month} events this month — you're in good hands."
```

```
[CMD-02] Pre-booking evidence  (cool — inform, NEVER exhort)          Enabled for: ALL
Trigger:    user viewing a shortlisted strong vendor, not yet booked
Slots:      {vendor}, {events_this_month}, {avg_stars}
Copy: "For context: {vendor} has done {events_this_month} events this month at
       {avg_stars}★, and their calendar is filling for your date."
Note:       NO "you should book!" — facts only. If prior nudged, CMD callbacks
            reference continuity, never re-recite cold.
```

```
[CMD-03] Plan-progress affirmation                                    Enabled for: ALL
Trigger:    user is ahead of the typical timeline for their date
Don't fire: never shame for being behind (the guard handles "behind", gently)
Slots:      {ahead_descriptor}
Copy: "You're {ahead_descriptor} for your timeline — genuinely ahead of the
       curve. Nicely done."
```

```
[CMD-04] Good-deal commend                                            Enabled for: ALL
Trigger:    a booking lands below the cohort benchmark (cohort ≥ min-N)
Slots:      {vendor}, {category}, {below_amount}
Copy: "Good eye — you booked {vendor} about ₱{below_amount} under what couples
       like you typically pay for {category}."
```

## 4 · INFERENCE — *learns you* (always surfaced openly; the "I noticed" IS the consent)

```
[INF-01] Taste drift                                                  Enabled for: ALL
Trigger:    ≥{N} views/saves clustering on one attribute (style/region/budget band)
Don't fire: below confidence gate
Slots:      {attribute}, {value}
Copy: "I noticed you keep looking at {value} {attribute}. Want me to lean that
       way across your shortlist — or are you still exploring?"
Action:     [Yes, lean that way] [Still exploring]
Learns:     confirms/corrects inferred preference (highest-value signal)
```

```
[INF-02] Cross-connect (your existing vendor also offers it)          Enabled for: ALL
Trigger:    searching {service}, AND a booked vendor offers {service}
Slots:      {service}, {existing_vendor}
Copy: "You're looking at {service} — {existing_vendor}, who you've already
       booked, also offers it. Add it with them instead of hiring separately?"
Action:     [See their offer] [Keep looking]
```

```
[INF-03] Budget signal                                                Enabled for: ALL
Trigger:    picks consistently skew above/below the stated budget by ≥{margin}
Slots:      {direction}, {category}
Copy: "Your {category} picks keep landing {direction} your stated budget.
       Want me to update the budget, or re-filter to it?"
Action:     [Update budget] [Re-filter]
Learns:     real budget vs stated
```

```
[INF-04] Region / proximity convergence                              Enabled for: ALL
Trigger:    shortlisted vendors cluster in one area
Slots:      {area}
Copy: "Your vendors cluster around {area}. Want me to anchor proximity there
       for the rest of your search?"
Action:     [Anchor there] [Keep open]
```

```
[INF-05] Looking-but-not-acting                                       Enabled for: ALL
Trigger:    many views in a category over {days}, 0 inquiries
Slots:      {category}, {days}
Copy: "You've been browsing {category} for {days} days without reaching out.
       Stuck on something? I can narrow it down or send inquiries for you."
Action:     [Narrow it down] [Send inquiries] [Just browsing]
Learns:     discovery vs decision block (routes to SEC-02/03)
```

## 5 · TREND — *learns from everyone* (aggregate, min-N gated, factual)

```
[TRD-01] Cohort trend                                                 Enabled for: ALL
Trigger:    a real, rising pattern in the user's cohort; cohort size ≥ {min_N}
Don't fire: cohort below min_N (privacy + statistical floor)
Slots:      {percent}, {cohort_descriptor}, {service}
Copy: "{percent}% of {organizer}s like you ({cohort_descriptor}) added {service}.
       Worth a look for yours?"
Action:     [Show me] [Not for us]
Note:       Factual share only — never "everyone's doing it!"
```

```
[TRD-02] Spend benchmark                                              Enabled for: ALL
Trigger:    user setting/over budget in a category; cohort ≥ min_N
Slots:      {category}, {median_spend}, {cohort_descriptor}
Copy: "For reference, {organizer}s like you ({cohort_descriptor}) spent around
       ₱{median_spend} on {category}."
```

```
[TRD-03] Timing benchmark                                             Enabled for: ALL
Trigger:    a category still open past the cohort's typical booking point; cohort ≥ min_N
Slots:      {category}, {typical_timing}, {cohort_descriptor}
Copy: "Most {organizer}s like you book {category} by {typical_timing}. You've got
       room, but it's worth starting soon."
Action:     [Start now] [Remind me]
```

```
[TRD-04] Pairing pattern                                              Enabled for: ALL
Trigger:    user booked A; cohort who booked A frequently added B; cohort ≥ min_N
Slots:      {a}, {b}, {percent}
Copy: "{percent}% of {organizer}s who booked {a} also arranged {b} — want me to
       check your options?"
Action:     [Show {b}] [No thanks]
Note:       Correlation framed as correlation, not prescription.
```

```
[TRD-05] Seasonal / availability pressure  (factual, never manufactured) Enabled for: ALL
Trigger:    measurable availability tightening for the user's date/category; cohort ≥ min_N
Slots:      {category}, {date}, {availability_signal}
Copy: "A heads-up grounded in real bookings: {category} availability for {date}
       is {availability_signal}. No rush, but earlier is easier."
Action:     [Look now] [Later]
```

---

## Build notes

- **Entitlement chokepoint:** every template fires only when `isSetnayanAiActive(user/event)` is true — extend the existing chokepoint to check the per-user subscription window (`user_ai_subscription.active_until > now()`), fanned out to the user's events.
- **Cron-free firing:** triggers evaluate on write/read events (Next 15 `after()`/`waitUntil`) and on user activity — no polling sweeps. The weekly receipt assembles lazily on next load within the window (+ optional Resend email).
- **Data sources are all existing:** bookings, `service_orders`/budget ledger, event-bound reviews (Bayesian score), shortlist, behavioral event log, cohort aggregate views (min-N enforced in the view).
- **One renderer:** a single `renderTemplate(id, slots, profile)` does terminology resolution + string substitution. Adding an event type = add a profile row; adding a trigger = add a library entry. No new system either way.

## Open items for owner sign-off (from the 2026-06-29 brainstorm)

1. ~~Final subscription price~~ **RESOLVED 2026-07-02: ₱499 first 28-day cycle (intro) → ₱799/28-day cycle** (single tier, unlock-all).
2. **Per-user replaces vs runs alongside the legacy per-event AI SKU (was ₱3,999)** during transition.
3. **Consent posture for behavioral personalization** (INF-*) — opt-in vs disclosed-on-by-default (PH counsel).
4. **Consent basis for aggregate analytics** (TRD-*) — privacy-policy disclosure + `consent_state`; set the **min-N value**.
5. **LLM boundary** — confirm message-drafting (SEC-04) and any future chat stay templated (free), or are the one budgeted exception.
6. **Autonomy: ask vs act** — do confident guards/secretary actions execute-then-report, or always ask first?
