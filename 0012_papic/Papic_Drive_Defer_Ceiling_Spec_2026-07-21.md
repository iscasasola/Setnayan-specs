# Papic — Drive-defer ceiling (spec, 2026-07-21)

> **Status: SPEC. Not built.** Scoped from an owner session on 2026-07-21 while stress-testing a
> long planning window ("what if they consume 80% on day 1, two years out?").
>
> **Evidence discipline.** `[VERIFIED-CODE]` = read at a cited `path:line` on `origin/main` ·
> `[MEASURED]` = read from live prod · `[MODELLED]` = arithmetic on assumed inputs.

---

## § 1 — The problem in one sentence

The full-res drop sweep **defers indefinitely** when a photo's Google Drive copy cannot be confirmed,
so a stuck copy job means we hold the 4 MB original **forever** — and a long capture window makes
"forever" arbitrarily expensive.

---

## § 2 — What actually triggers it (two corrections to the session's first read)

`isDriveDeferred(r2ObjectKey, state)` `[VERIFIED-CODE — papic-fullres-drop-core.ts:130]`:

| `DriveCopyState` | Deferred? | Meaning |
|---|---|---|
| `not_connected` | **NO** | the couple never pointed a Drive at this event — guard is a no-op, **drops normally at day 90** |
| `connected` + key in `confirmedKeys` | NO | copy confirmed, safe to drop |
| **`connected` + key NOT confirmed** | **YES — indefinitely** | queued · retrying · failed · never enqueued |
| **`unknown`** (read failed/ambiguous) | **YES — indefinitely** | *"a read failure must never authorize a deletion"* |

> 🔴 **CORRECTION 1 — it is NOT "the couple didn't connect Drive."** That case drops on schedule.
> The session's first analysis assumed the opposite and produced a ₱302 / 40%-margin figure for a
> no-Drive event. **That figure is wrong.** A no-Drive event costs ~₱81 (84% margin) `[MODELLED]`.
>
> 🔴 **CORRECTION 2 — the earlier "photos vanish before the wedding" claim was also wrong.** There is
> **no gallery expiry anywhere in the codebase**; `papic_photos.expires_at` is vestigial from the
> removed sampler (migration `20270307073708`) and is always NULL. The drop also refuses any row
> without a `display_r2_key` (*"dropping would LOSE the photo"* `[VERIFIED-CODE :48]`). **No
> data-loss path exists today.** Both corrections are recorded because each nearly caused a change
> to destructive code that was not needed.

**So the real population is: couples who DID connect Drive, whose copies are stuck.** Causes seen in
the wild: Drive quota exhausted · OAuth grant revoked after connecting · a copy job that silently
never enqueued · repeated API failures. Each leaves the photo permanently deferred with no retry
ceiling and no operator signal.

---

## § 3 — What it costs

Worst realistic case from the owner's stress test: **₱500 tier · 2,400 photos (80% of pool) captured
on day 1 · wedding 2 years out · Drive connected but stuck.** All `[MODELLED]` at ₱11.49/GB-yr
(R2 standard — tiering is not built).

| Line | Today (unbounded) | With a 180-day ceiling |
|---|---|---|
| Full-res 9.6 GB | held ~2.25 yr → **₱248** | held 180 d → **₱54** |
| Gallery 0.77 GB (2.5 yr) | ₱22 | ₱22 |
| Compute | ₱24 | ₱24 |
| Reconciliation | ₱7.50 | ₱7.50 |
| **Total** | **₱302** | **₱108** |
| **Margin @ ₱500** | **40%** | **78%** |

**The property that matters is not the ₱194.** It is that the ceiling makes full-res exposure
**independent of window length**. Today a 2-year plan costs ~9× a 3-month one on this line; with a
ceiling they cost the same, because exposure is bounded by days-since-capture rather than by how far
away the wedding is. That is what makes a long capture window safe to sell.

---

## § 4 — The design

**Add a second, later threshold. After it, drop regardless of Drive state.**

```
DEFAULT_FULL_RES_RETENTION_DAYS = 90    (unchanged — normal eligibility)
DRIVE_DEFER_CEILING_DAYS        = 180   (new — hard stop on deferral)
```

| Age since `captured_at` | Behaviour |
|---|---|
| < 90 d | not eligible — skip |
| 90–180 d | eligible; **defer** if Drive unconfirmed/unknown *(today's behaviour)* |
| **> 180 d** | eligible; **drop regardless of Drive state** |

### 4.1 Why this is safe

**The gallery copy always survives.** `isEligibleForDrop` already refuses any row without a
`display_r2_key` `[VERIFIED-CODE :48]`, and that guard is untouched. So dropping past the ceiling is
**a downgrade to web quality, not a deletion** — which is the retention model as designed
(display-vs-download, `Pricing.md` § 2.1a).

The current guard protects the original at **unbounded cost to us**, with no ceiling and no operator
visibility. That asymmetry is the defect: it treats an indefinite hold as free.

### 4.2 What must NOT change

| | Why |
|---|---|
| `display_r2_key` required | the only thing standing between a drop and real data loss |
| **clips excluded entirely** | a clip's `r2_object_key` **is** the playable file — no web-copy fallback exists |
| `sample/...` keys excluded | seed data |
| `HIGH_RES_ARCHIVE` events exempt | the **paid** opt-out (`KEEP_FULL_RES_SKU`, `papic-fullres-drop.ts:42`) — a couple who paid to keep originals must never hit the ceiling |
| Fail-safe on read errors *within* the window | ignorance still defers, up to the ceiling |

> ⚠ **The ceiling does nothing for video.** Clips are excluded from the sweep by construction, so
> their full-res bytes are perpetual regardless. That is a separate, larger line — the answer is the
> **clip-compression path** specced 2026-07-17 and never built (`Papic_Pricing_Lock_2026-07-20.md`
> § 8 item 8). Do not conflate the two.

---

## § 5 — Warnings before the ceiling fires

The couple chose Drive; they must not discover the consequence afterwards. Escalating notice on the
existing `daily-email-jobs` rail (which already reads the Keep-Full-Res SKU at `:391`):

| Day | Message |
|---|---|
| 60 | *"Some photos haven't reached your Google Drive yet."* — with a reconnect link |
| 120 | firmer; names the count |
| 170 | final: *"After [date] we'll keep only the web-quality copy of N photos."* |
| 180 | ceiling fires; a completion notice states what happened |

**⚠ Cron-free constraint.** Setnayan runs periodic work via `claimPeriodicJob()` compare-and-swap
fired from `after()` on request traffic — `apps/web/vercel.json` is `"crons": []`. So warnings fire
**opportunistically, not on the exact day.** Copy must therefore say *"after [date]"*, never *"in
exactly 10 days"*, and the ceiling itself must tolerate firing late. **A missed deletion deadline we
advertised is worse than a vague one we keep.**

---

## § 6 — Edge cases

| Case | Behaviour |
|---|---|
| Drive connects on day 179 | copy confirms → normal drop path; ceiling never reached |
| Drive connects on day 181 | too late for those originals; gallery copy persists. Notice must be past-tense and honest |
| Grant revoked mid-window | state stays `connected`, copies fail → ceiling applies. This is the most likely real trigger |
| Drive quota exhausted | same as above |
| Couple buys `HIGH_RES_ARCHIVE` at day 150 | **exempt from that moment** — the sweep must re-check the SKU each pass, not cache eligibility |
| Event postponed | irrelevant — the ceiling is **capture-anchored**, not event-anchored |
| Photo captured after the event | same rule; nothing special |

---

## § 7 — Open questions

1. **Is 180 the right ceiling?** It is 2× the retention window and the first defensible round number.
   The honest answer needs the **measured** distribution of how long stuck copies stay stuck — which
   nobody has pulled. Ship it admin-tunable, not hardcoded.
2. **Should the ceiling be per-event configurable?** Probably not — one number is easier to defend
   and one more dial is one more thing to misconfigure.
3. **⚠ DPO:** does dropping an original after a bounded wait need to appear in the retention schedule
   and the NPC filing? The filing already carries four conflicting numbers (90 d code · 6 mo dossier ·
   "indefinitely" · 5 yr schedule) and **this adds a fifth state** — "held up to 180 d pending an
   external copy." It is *more* defensible than an indefinite hold under storage limitation, but it
   must be **written down before it ships**, not after.
4. **Telemetry first.** How many events are currently in a stuck-Drive state? If it is zero, this is
   prophylactic and can queue behind revenue work. **Measure before building** — the same discipline
   that showed Papic was pre-revenue.

---

## § 7.5 — 🔴 STEP 1 RAN. THE ANSWER IS ZERO. DO NOT BUILD THIS YET.

Measured against live prod, 2026-07-21 `[MEASURED]`:

| | |
|---|---|
| Total `papic_photos` platform-wide | **13** |
| Ever dropped (`full_res_dropped_at`) | **0** |
| Past 90 d, still held, drop-eligible shape | **0** |
| **Past 180 d, still held** | **0** |
| `drive_copy_artifacts` rows | 6 |

**There is no stuck-Drive population. There is barely a photo population.** Thirteen photos exist
across 63 events, and the sweep has never dropped anything.

**⇒ This spec is entirely PROPHYLACTIC.** Every peso in § 3 is `[MODELLED]` on a scenario
(2,400 photos on day one) that is **185× the platform's entire photo count**. The margin table
describes a business that does not exist yet.

**Recommendation: file this and do not build it.** It touches the only code that permanently deletes
a customer's file, to fix a condition with zero occurrences, on a platform with 13 photos. Build it
when the measurement is non-zero — the query in § 8.1 is the trigger, and re-running it costs
seconds.

**What to do instead, now, for free:** put the ceiling in the *spec* (done) so whoever builds the
sweep's next iteration inherits it, and re-run § 8.1 before any Papic launch push. The failure mode
this prevents is real; it is simply not yet reachable.

---

## § 8 — Recommended sequencing

1. **Measure** — count photos where Drive is connected and the copy is unconfirmed past 90 days.
   One query. It sizes the whole problem.
2. **DPO note** — add the bounded-hold state to the retention schedule (§ 7.3).
3. **Build** — ceiling constant + the `isEligibleForDrop` branch + unit tests covering: under 90 d ·
   90–180 d deferred · past 180 d dropped · past 180 d **without** a display copy still refused ·
   `HIGH_RES_ARCHIVE` exempt at every age.
4. **Warnings** — the day-60/120/170 rail.

**Steps 1–2 gate step 3.** This touches the only code in the platform that permanently deletes a
customer's file; it does not ship on a modelled number and an unwritten retention state.

---

*Compiled 2026-07-21. Two analytical corrections recorded in § 2 — both nearly caused an unnecessary
change to destructive code. Every peso figure is `[MODELLED]`; the stuck-Drive population has never
been measured.*
