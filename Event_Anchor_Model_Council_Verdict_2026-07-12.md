# Council Verdict — Date-Anchor Clustering of the 14 Event Types

**Authored:** 2026-07-12 — owner directive ("Use the council to analyze this approach")
**Method:** 5-seat design council (data-model · product-strategy · UX/onboarding · devil's-advocate · PH-cultural) + synthesis judge · workflow `wf_fcd47df4-e2d`
**Status:** ANALYSIS + recommendations. NOT built. 7 owner sign-off questions open (§ 5); PR-D counsel-gated.
**Newer sibling (owner-directed design, same day):** [`Event_Anchor_Minimalist_Setup_Design_2026-07-12.md`](Event_Anchor_Minimalist_Setup_Design_2026-07-12.md) — the minimalist 3-question setup guide operationalizing this verdict + the later same-session refinements (union-anchor stages · calendar holidays · moments-vs-events Year view · per-event recurs toggle · the <18/>50 dependent age fence · PR-F). Read it after this doc.
**Origin:** Owner observed the 14-type create-event picker splits by *date anchor* — birthday-anchored (Debut/Birthday/Christening/Gender Reveal), wedding-date-anchored (Wedding/Anniversary), generic milestone, organizational, Travel — and asked whether to cluster accordingly.

## 0. Owner refinements captured this session (2026-07-12, mid-council)

These landed while the council deliberated and are folded into the verdict below:

1. **Milestone-birthday ladder OWNER-CONFIRMED: 1 · 7 · 18 (female) / 21 (male) · 60 — all other years are normal birthdays.** (Owner first floated 3/7/13; 3 and 13 explicitly dropped on the PH-cultural correction.) Milestone years get the full proactive treatment (early nudge, grand-event lead times); ordinary years get a light reminder. The 18F/21M split means the celebrant record wants *optional* sex to derive the debut year — when unknown, offer both.
2. **Travel = a date-RANGE container, not a date-anchored event.** It can host per-day in-app services across multiple dates (Papic day 2, Live Studio day 4 — the per-day-priced SKUs already fit), covers lodging/tour packs, and bridges to the flip-later multi-business verticals (hotels · lodging · tourist guides). Matches the council's `date_range` anchor kind for Travel.
3. **The lifecycle loop: stored anchors → deterministic milestone horizon → proactive reminder ("start planning?") → user GO SIGNAL → jump into onboarding pre-filled** (type derived, date pre-set, celebrant attached, `signature_details` pre-seeded). Reminder is FREE (it manufactures events → feeds the flywheel); the Membership's value is that AI is already active on the other side of the tap. Nothing auto-creates without the tap (consent posture). Mechanically: Rule-1 date arithmetic + authored lead-time rules, on the cron-free `claim_periodic_job` primitive + Resend — no new infra class. This is the council's "Membership milestone engine" (§ 4) made concrete.

---

## 1. Headline verdict: **YES-BUT-RESHAPED**

All five seats converge on the same judgment: **the owner has found the right insight and proposed the wrong artifact.** Date-anchoring is the correct *lifecycle-economics* principle — anchor dates (a person's birthdate, a couple's wedding date) are the primitive that turns one-off events into the recurring family relationship the ₱3,999/yr Membership monetizes. But the five exclusive clusters conflate at least three orthogonal axes (what the date commemorates · whether the date is an input or output of planning · who the celebrant is), and four of the fourteen types are misclassified even on the proposal's own terms.

**The verdict: keep the payload, drop the buckets.** Implement date-anchoring as two or three small per-type *attributes* layered onto machinery Setnayan already shipped (`date_model` in the Adaptive Checklist spec, `SPECIALTY_KIND_BY_TYPE` in `lib/event-brief.ts`, `signature_details` from PR #3144) — never as a picker reorganization, never as a taxonomy rewrite of `event_type_vocab`, never as auto-created recurring events.

---

## 2. Corrected anchor table (all 14 types)

The owner's clusters survive only as default values in this table — with the four misclassifications fixed (gender reveal, christening, wedding's producer role, travel).

| Type | Anchor kind | Event date: derived or chosen? | Recurs? | Celebrant |
|---|---|---|---|---|
| **Wedding** | **none — anchor PRODUCER** (creates the union date on completion) | **Output** of venue discovery — never date-first (locked spec) | No | Couple |
| **Anniversary** | `union_date` — consumes a wedding date (one-tap link if the wedding is on-platform; plain user-entered otherwise — most customers' weddings predate Setnayan) | Derived (Nth year → suggested window) | Yes — annual; **event-scale at 25th/50th** (kasalang pilak/ginto) | Couple |
| **Debut** | `person_birthdate` | Derived **window** (18th birthday → nearest weekend; age editable, e.g. 21 for sons) | No (one-shot milestone) | Other person — usually a minor until the date |
| **Birthday** | `person_birthdate` | Derived window (next occurrence; PH milestone ladder: 1st · 7th · 18th · 60th) | Yes — annual | Self OR other ("Me" default, one tap) |
| **Christening** | `person_birthdate` — **as urgency window only** (binyag within ~year 1), never sets the date | **Output** — parish baptism slot drives it (per shipped checklist spec §5.3) | No | Infant — a minor, guardian-held data |
| **Gender Reveal** | `expected_due_date` — **NOT a birthdate**; an estimate that shifts; health-adjacent sensitive data | Chosen (input, timed around ~20-wk scan) | No | Unborn child / expectant parents |
| **Celebration** | `none` (optional origin date if user opts in) | Chosen | Optional "celebrate annually" toggle | Self / any |
| **Graduation** | `fixed_external` — school calendar imposes it (Mar–Jun season nudge) | Externally imposed | No (per degree) | Self or other |
| **Reunion** | **cohort** (batch year → Nth computed), season-nudged (Dec balikbayan · Holy Week) | Chosen | Sometimes | Cohort, not a person |
| **Corporate** | `none` / `org_date` (founding-anniversary variant) | Chosen | Often annual | Organization |
| **Tournament** | `fixed_date` or `date_range` (multi-day brackets) | Chosen / externally scheduled | Seasonal | Organization |
| **Gala Night** | `none` / `org_date` | Chosen | Often annual | Organization |
| **Simple Event** | `none` | Chosen | No | Any |
| **Travel** | `date_range` — not a date at all | Chosen range | No | Self / group |

**Key structural corrections vs the owner's clusters:**
- **Cluster 1 splits three ways**: gender reveal has no birthdate (due date, pre-birth); christening is birth-*windowed* but parish-*dated* (date_model=output); only debut/birthday truly derive from the birthdate.
- **Cluster 2 mixes opposite roles**: Wedding *produces* the anchor Anniversary *consumes*. Treating wedding as union-anchored would push date-first onboarding onto the hero type — directly contradicting the locked "never frame set-your-date as step 1" design.
- **Clusters 3–5 carry no structure** and collapse to `none`/`fixed`/`range` defaults.

---

## 3. Consensus vs conflict

### Where all five seats agree (treat as settled)

1. **Attributes, not buckets.** The clustering is an explanatory lens, not a schema enum, not a picker structure. Anchor kind must be a per-type *default* that is per-event *overridable*.
2. **Celebrant ≠ account holder is the single most important observation** in the proposal. A parent planning a child's binyag/7th/debut is the *normal* case, and today's schema has no subject-person concept. This is native PH behavior (parents plan and fund the 18th; children plan the parents' 60th and golden anniversary).
3. **The picker stays a flat 14-type grid.** Nobody thinks "I want a person-anchored event"; they think *debut*, *binyag*, *kasal*. A cluster-first two-step would bury Wedding and Debut — the two revenue heroes — one tap deeper. At most: hero ordering + optional decorative headers.
4. **Recurrence = deterministic suggestion, never auto-created events.** No RRULE engine, no cron (honors the cron-free lock), no picker pollution. Derive on read: debut = birthdate+18y, anniversary N = years since union date. All pure date math — fully Rule-1 compliant, ~zero marginal cost.
5. **This structurally feeds the Membership.** "Upcoming milestones for this family" over stored anchors is the deterministic, free renewal engine for the ₱3,999/yr SKU.
6. **Death anniversaries must be explicitly excluded.** Babang-luksa is the most common PH non-wedding annual observance; a free-form "annual anchor" silently reopens the owner-retired burial territory (2026-05-16, "wrong app, wrong moment").
7. **Stored third-party birthdates — overwhelmingly minors' — are an RA 10173 gate**, not a detail (see §6).

### Where the seats genuinely conflict — and the council's rulings

**Conflict A — Cross-event `event_anchors` table (data-model seat) vs no-persons-table, JSONB-only (devil's advocate).**
*Ruling: the anchor table is the right **target** model; the devil's advocate is right about **sequencing**.* The reuse argument wins long-term — one child's binyag, birthdays, and debut referencing ONE person record is the entire membership flywheel, and a JSONB-only design guarantees the stale-duplicate pattern the corpus reset was fighting. But union anchors (the couple's *own* wedding date — zero new PII) ship now; person anchors (others'/minors' birthdates) are *designed now, built only after counsel clears*, flag-off, per the established Smart Seat-Plan gate pattern. Until then, any celebrant DOB captured stays inside the event's `signature_details`, purpose-limited.

**Conflict B — Generalized anniversary ("anything you celebrate annually"): allow via override (data-model) vs kill/defer (product-strategy, devil's advocate, ph-cultural).**
*Ruling: kill for V1 — 3 seats to 1, and the risk asymmetry is decisive.* Anniversary V1 = union/wedding dates only, with typed origin options, no free text. "Celebrate anything annually" routes to **Celebration + a recurs toggle** later. Under the all-events Membership, extra recurring event kinds add support surface with zero incremental ARPU, dilute the wedding-first brand, and backdoor death anniversaries.

**Conflict C — Anniversary as picker peer vs contextual post-wedding upsell only (product-strategy).**
*Ruling: both.* Anniversary stays in the picker — it's already live (PR #3127), and the ph-cultural seat is right that most anniversary customers celebrate weddings Setnayan never saw, so the contextual-only model orphans the majority case. AND the completed-wedding dashboard gets the "your first anniversary is in N days" nudge, which is the highest-leverage single build.

**Conflict D — Nudge cadence: annual birthday/anniversary prompts (data-model, ux) vs milestone-only, "annual prompts read as spam" (ph-cultural).**
*Ruling: milestone-tuned, PH-calibrated.* One first-anniversary suggestion (the membership-renewal moment — measure its conversion), then silver (25th) and golden (50th) framed as vow-renewal events on the wedding rails. Birthdays: nudge the milestone ladder (1st · 7th · 18th · 60th), soft-prompt ordinary years only for members. Never nag annually on ordinary anniversaries — dinner-scale in the PH.

**Conflict E — Where per-type defaults live: `event_type_vocab` column vs pure TS map.**
*Ruling: pure map first.* Mirror the shipped `SPECIALTY_KIND_BY_TYPE` pattern in `lib/event-brief.ts` — zero migration, zero risk to the day-old PR #3127/#3144 surfaces. Promote to a vocab/profile column only when admin-editability is actually needed.

---

## 4. What this drives vs what it must NOT drive

| Target | Drive it? | Why |
|---|---|---|
| **Post-pick anchor question** (the single screen after choosing a type) | ✅ YES | The highest-value application: "When was the debutante born?" → "She turns 18 on Mar 4, 2028" → suggested weekends. Deterministic delight, and the cheapest fix for the 4 types running generic onboarding with NULL `signature_details`. Every birthdate ask is optional with a first-class "I already have a date" skip. |
| **Membership milestone engine** (deterministic "upcoming milestones" suggestions) | ✅ YES | The renewal reason for ₱3,999/yr. Suggest, never auto-create. |
| **Celebrant-aware copy** ("your birthday" bugs across ≥4 types) | ✅ YES | Cheap, fixes real copy today. |
| **Anniversary/graduation/reunion/gala capture** (fills PR #3144's NULL specialty types) | ✅ YES | One question each; anniversary's specialty detail *is* the anchor. |
| **Onboarding flow order** | ❌ NO | That is `date_model`'s job (input/output, already spec'd). Cluster 1 mixes output-christening with input-debut — cluster-driven flows would contradict the locked venue-first design. |
| **Picker UI restructure** | ❌ NO | Flat 14, Wedding + Debut hero-ordered. Unanimous. |
| **`event_type_vocab` taxonomy rewrite / cluster enum** | ❌ NO | Attributes on existing seams, not a parallel taxonomy on top of unshipped checklist stubs. |
| **Recurrence engine / auto-created events / cron** | ❌ NO | Violates cron-free lock and pollutes the event picker. |
| **Investment allocation** | ❌ NO | Debut keeps second-hero treatment regardless of sitting among light types in cluster 1. |

### Build order (honors wedding-first · don't-over-invest · Rule 1 · Membership)

1. **PR-A — Wedding→Anniversary link** *(build first; zero new PII, no counsel needed)*: anniversary capture = "what date does this commemorate?" with one-tap "use my wedding" if on-platform + Nth-year derivation; "first anniversary in N days" card on completed weddings. One PR serves the Event Brief gap AND the Membership nudge. Instrument suggested-event → Membership conversion.
2. **PR-B — One anchor question for graduation / reunion / gala_night** (ceremony date · batch year → Nth · org-aware copy). Cheap, fills the generic-onboarding gap.
3. **PR-C — Debut DOB → 18th derivation window** (second hero delight; DOB optional-but-rewarded, age editable). Light DPO copy review — the debutante is a minor until the date.
4. **PR-D — Person-anchor record + Birthday/Christening/Gender-Reveal capture** — *designed now, built flag-off, shipped only after DPO/counsel clears* (§6). Includes the binyag+1st-birthday combined-event tag if owner approves.
5. **PR-E — "Celebrate annually" toggle + next-cycle suggestion card** (one flag + one date computation).

The other ~7 types get default anchor values in the map and **no dedicated UI** — per the 2026-07-11 don't-over-invest lock.

---

## 5. Owner sign-off questions

1. **Anniversary scope (the council recommends union-only for V1):** confirm killing "anything you celebrate annually" as an Anniversary feature — generic annual celebrations route to Celebration + a recurs toggle instead. Yes/no?
2. **Person-anchor build authorization:** the christening→birthday→debut chain requires storing children's birthdates for up to 18 years — colliding with the 5-yr default in the pending Data Retention Schedule. Authorize routing this through DPO/counsel review (same gate as Smart Seat-Plan) before PR-D is built?
3. **Gender Reveal due-date capture:** pregnancy data is the most sensitive of all 14 types. Ship due-date capture at all in V1, or leave Gender Reveal anchor-less (plain chosen date) until counsel clears?
4. **Nudge cadence:** confirm milestone-tuned (1st anniversary once, then 25th/50th; birthday ladder 1·7·18·60) — no annual nagging on ordinary years. Yes?
5. **Combined-event affordance:** binyag + 1st birthday as ONE party is a very common PH pattern the type system can't express. Approve a lightweight secondary-type tag (vs forcing two events)?
6. **Debut age default:** 18 default, editable (some families hold sons' debuts at 21). Confirm?
7. **Gala Night:** resolve via celebrant copy ("planning for an organization?") rather than moving/regrouping the type — it stays in the picker. Confirm?

---

## 6. Privacy / RA 10173 flags (raised by all five seats — not optional)

- **Minors' birthdates are the hot zone.** The most valuable chain (binyag→birthdays→debut) is a registry of non-consenting children's PII held for up to 18 years. The platform already counsel-gated *weaker* person-data (Smart Seat-Plan matching); the corpus already requires DPO sign-off for birth data (BaZi checklist). PR-D does not ship without the same treatment: guardian-held record, purpose-limited consent copy ("used to compute milestones and remind you"), deletion path, retention treatment reconciled with `Data_Retention_Schedule_2026-07-11.md` (currently `[PENDING COUNSEL]`).
- **Expected due dates are health-adjacent sensitive PI** (RA 10173 §3(l) territory) — strictly more sensitive than birth data. Separate DPO line item; short retention; explicit consent copy.
- **Celebrant→`users` account linking must never be automatic.** The celebrant is account-owned data; any link to a real user account is optional and consent-gated, mirroring the existing counsel-gated posture on matched-account event sends.
- **Death-anniversary exclusion is a compliance-adjacent brand guardrail too:** typed origin options only (wedding · relationship · founding · personal milestone), no free text, no memorial framing — honoring the 2026-05-16 burial retirement.
- **Canonical-source rule:** once the anchor record exists, it is canonical for celebrant identity + dates; `signature_details` keeps ceremony content only (godparents, 18 Roses, love story). Backfill any birthdates already in JSONB in the same migration — otherwise the stale-duplicate pattern the corpus reset fought returns inside the app.

---

**Bottom line for the owner:** Your instinct is right and it's worth money — anchors are how one wedding becomes a family's 18-year relationship with Setnayan, and that's exactly what the Membership sells. But ship it as three small fields (anchor kind · the existing date_model · a recurs flag) plus one carefully-gated celebrant record — not as five buckets. Build the wedding→anniversary link this week (no legal exposure, direct Membership feed); design the child-milestone chain now but let counsel clear it before it stores a single birthdate.