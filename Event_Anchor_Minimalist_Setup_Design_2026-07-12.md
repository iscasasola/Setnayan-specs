# Event Creation — Minimalist Anchor Setup Design

**Authored:** 2026-07-12 — owner directive ("create a simple minimalist approach on how we can handle all these events properly … the event creation setup guide"), same session as the council verdict.
**Parent:** [`Event_Anchor_Model_Council_Verdict_2026-07-12.md`](Event_Anchor_Model_Council_Verdict_2026-07-12.md) — this doc is the owner-directed design that operationalizes the verdict + all session refinements.
**Status:** DESIGN. NOT built. Inherits the verdict's counsel gate on stored minors' birthdates (PR-D) and its 7 sign-off questions where still open.

---

## 0. Session refinements this design absorbs (owner, 2026-07-12)

1. **Milestone-birthday ladder (owner-locked): 1 · 7 · 18 (F) / 21 (M) · 60** — all other years are normal birthdays.
2. **Union anchor has STAGES:** dating → engaged → married (relationship start · proposal date · wedding date). Dating anniversary pre-wedding; celebrated date auto-shifts to the wedding date after marriage; silver/golden derive later. Captured via the love story the wedding onboarding already asks (PR #3144 specialty layer).
3. **Calendar holidays are a third anchor kind** (`calendar_holiday`): Christmas (ber-months = peak PH event season; company parties = Corporate), Valentine's (dinner-scale BUT the #1 proposal date → top of the wedding funnel). Zero PII, zero storage — an authored ruleset. Holiday set = owner decision; Undas excluded (burial retirement).
4. **Moments vs Events:** derived calendar entries ("moments") live on a Year-view calendar — passive, always current. An event row is created ONLY on the user's go-signal tap. Milestone moments open full pre-filled onboarding; light moments offer the one-tap light flow. This is how the app stays "busy helping all year" without nagging or picker pollution.
5. **Recurrence is a per-event TOGGLE on any type, not a type property.** Travel proves it: one-time (honeymoon) or annual (family summer outing · December balikbayan · company outing). Recurring travel recurs by SEASON WINDOW, not exact date, and its next-cycle suggestion CLONES last year's event (group, duration, per-day services) into a pre-filled draft.
6. **Dependent-account birthdays: storable ONLY for under-18 or above-50 (owner rule).** See § 2.

---

## 1. The minimalist principle

**Three questions, everything else derived.** Creation = WHO is it for → WHEN (one anchor question, often auto-derived) → IS IT YEARLY. Type-specific depth (specialty/brief questions, checklist, vendors) comes progressively *inside* the event, never at the gate. The picker stays the flat 14-type grid (council: unanimous).

```
Pick type (unchanged grid)
   ↓
ONE anchor question  ← the only new screen; per-type, skippable
   ↓
"Yearly?" toggle     ← only where sensible; smart defaults
   ↓
Event created → progressive brief inside
```

---

## 2. The People layer (the anchor store)

A lightweight account-level list — the minimal registry every anchor question reads from and writes to. **One record per person, canonical for identity + dates** (`signature_details` keeps ceremony content only, per the verdict's canonical-source rule).

| Record | What it holds | Notes |
|---|---|---|
| **Me** | own birthdate (optional) | self-consented, zero friction |
| **Partner / Us** | the union anchor: stage (dating/engaged/married) + relationship start · proposal date · wedding date | fed by the wedding love-story capture; powers anniversary/engagement/silver/golden |
| **Dependents** | name · birthdate · optional sex (for 18F/21M derivation; unknown → offer both) | **AGE FENCE (owner rule): creatable only if the person is UNDER 18 or OVER 50.** |

**Why the <18 / >50 fence is the right privacy shape:** it maps stored-birthdate standing to real family-care roles — guardians of children (powers 1st · 7th · debut; the record's job *ends* at the debut) and adult children honoring aging parents (powers the 60th; council: "children plan the parents' 60th"). Adults 18–50 are their own account — **invite them, never register them.** This is purpose-limitation made structural and materially strengthens the PR-D DPO/counsel case (no arbitrary-adult birthday registry is even possible).

Fence mechanics:
- Age computed at record-creation from the entered birthdate; out-of-range → friendly redirect: "They can join Setnayan and share their own dates with you" (invite flow).
- A dependent record **ages out at its LAST derived milestone, not a flat 18** (flow-check fix): a **female** record ages out at 18 (debut done); a **male** record persists to **21** (his debut rung is 21M — a flat-18 handoff would orphan his parent-planned 21st, T−12mo heads-up never firing). At the last milestone it goes dormant with a "hand it over" prompt (invite them to claim their data) — clean RA 10173 story: guardian-held while a minor, subject-owned at majority.
- Deletion path per record, consent copy at capture ("used only to compute milestones and remind you"), retention reconciled with `Data_Retention_Schedule_2026-07-11.md`.
- ⚠ Surfaced edge (owner may ignore): PWD/dependent adults aged 18–50 are excluded by the fence — accept the gap for V1 simplicity (their events still work via plain date entry, no stored anchor).
- Other people's anniversaries (e.g. parents' golden): **no stored anchor** — plain typed date entry at event creation. Keeps the registry birthdates-only.

---

## 3. The one anchor question, per type

| Type | The single question (screen 2) | Then |
|---|---|---|
| Wedding | **none** — date stays an OUTPUT of venue discovery (locked) | love story later captures relationship start + proposal → fills the union anchor free |
| Anniversary | "What date does this celebrate?" → **typed origin** (Our wedding · Our relationship · A milestone we're proud of · A date that matters to us) → one-tap "Our wedding" if on-platform, else enter date | Nth year derived; recurring by default. **Accepts any memorable yearly date** (owner override — see § 3b) |
| Birthday | "Whose birthday?" → **Me** / Partner / pick-or-add dependent | next birthday + milestone ladder derived; recurring by default |
| Debut | "When was the debutante born?" (pick/add dependent) | 18th (F) / 21st (M) derived → suggested weekends; age editable; skip = "I have a date" |
| Christening | "When was the baby born?" (add dependent) | urgency window only — the PARISH slot sets the date (date_model=output, unchanged) |
| Gender Reveal | pick a date (due-date capture **deferred** — counsel; verdict Q3) | — |
| Travel | pick a **date range** | recurs toggle = "yearly trip?" → next cycle suggests the season window + clones last year |
| Graduation | "When's the ceremony?" (school-imposed copy) | Mar–Jun season nudge |
| Reunion | "What batch/year?" → Nth reunion derived | Dec/Holy-Week season nudge |
| Corporate · Gala · Tournament | pick date (org-aware copy: "planning for an organization?") | recurs toggle ("annual?") |
| Celebration · Simple Event | pick a date | optional recurs toggle |

Every birthdate ask is **optional with a first-class skip** ("I already have a date") — the anchor is rewarded (derivation, reminders), never required.

---

## 3b. Memorable dates as recurring anniversaries (owner 2026-07-12: "place memorable dates we want to celebrate every year as anniversary")

**Anniversary generalizes to any yearly memorable date** — linguistically correct (an anniversary IS the annual return of a significant date, not only a wedding). Mechanically free: it's an anchor with `recurs=true` (the existing per-event toggle). Lives under the Anniversary type via a **typed origin** picker: *Our wedding · Our relationship · A milestone we're proud of · A date that matters to us* (labeled, user's words).

**Guardrail (HARDENED after the flow-check — label-only wasn't enough): TYPED positive origins only — NO free-text label, NO catch-all "a date that matters" origin, NO "for remembering" nudge branch.** The flow-check found the catch-all + free-label + memorial-nudge were *designing for the mourning case* and would let a user enter a parent's death anniversary → an annual reminder = the death-anniversary tracker the burial retirement (2026-05-16) killed. **Resolved: origins are exactly `wedding · relationship · milestone` (all celebratory); no "matters"/free-text option; nudge tone is celebratory only.** The burial-retirement lock wins.

**⚠ This is a deliberate OWNER OVERRIDE of the council's Conflict-B ruling** (which killed generalized anniversaries 3-to-1 for V1). The override is safe because the council's real objection was *free-text* dates backdooring mourning — and typed positive origins were the version they explicitly allowed. Union-only V1 is therefore superseded; § 8's open sign-off on this is resolved to YES-with-guardrail.

---

## 3c. Life-stage-aware picker — Personalized vs Standard events (owner 2026-07-12)

The picker personalizes to *where this person is in life*, driven by optional profile fields + the People graph. **Show everything, disable what doesn't apply** (unselectable, NOT hidden — shows the range + teaches what's possible; greyed with a "why" + when it unlocks).

**Profile fields that drive it** (all OPTIONAL, unlock-not-gate; ⚠ birthdate self-consented, **religion + civil status are SENSITIVE PI under RA 10173 §3(l)** — opt-in, higher bar):
- **birthdate** → milestone ladder, passed-milestone exclusion
- **civil status** (single · in a relationship · engaged · married · widowed · separated/annulled — no civil divorce in PH except Muslim code) → Wedding relevance + union-anchor stage
- **religion** → faith rites (§ Faith_Aware_Person_Graph)
- **People graph** (dependents · godchildren) → per-*person* milestone targeting

**Two buckets** — the line is **blank-create vs derived-for-you** (some types appear in BOTH):

- **Standard Events** — always creatable, blank slate, anyone/anytime: Celebration · Travel · Corporate · Tournament · Gala Night · Simple Event · Reunion · Graduation · **Wedding** (subject to the § 4b one-at-a-time guard + civil status) · Birthday (for anyone) · Anniversary (generic — any chosen date).
- **Personalized Events** — surfaced/pre-targeted from profile + graph, timeline-gated: **your** wedding anniversary (from your ACTUAL wedding date — distinct from the generic one) · milestone birthdays (1·7·18F/21M·60) for self + dependents · **Debut** (person approaching 18/21, not done) · **Christening · First Communion · Confirmation** (children, faith+age-gated) · **Gender Reveal** (when expecting).

**Mechanics:**
1. **Completed-milestone confirmation** — on birthdate entry, age INFERS which self-milestones passed, but the user CONFIRMS each (handles no-debut, faith changes). Completed / N-A → excluded from that person's options.
2. **Per-PERSON, not per-account** — a one-time milestone is enabled iff SOME person (self or dependent) is upcoming for it and hasn't done it. A 35-yr-old: own debut disabled (passed), daughter's debut enabled. The picker reads the People graph and pre-targets the person.
3. **Timeline enablement** — upcoming milestones enable as the date approaches (debut at ~17, etc.).
4. **Real vs generic anniversary** — the DERIVED anniversary (actual wedding date → pre-filled Year-view moment) is a distinct entry from the GENERIC create-an-anniversary (any date, typed origin). Aligns with PR-A's `anchor_origin`.

**Trust principle (owner 2026-07-12): "we store your events, not your documents."** The family/personal profile holds the people, dates, and events that matter — **NOT a document vault** (no gov IDs, PSA certificates, passports). This is RA 10173 **data-minimization** made visible; state it at the point of collecting sensitive fields. Scope caveat: some documents DO live elsewhere on the platform (vendor verification, 0032 contracts, payment proofs) — the promise is scoped to the personal/family profile, and is true there.

**Build split:** the SELF version (own birthdate + civil status, self-consented) → disable the user's own passed milestones — buildable sooner. The DEPENDENT-aware version (per-person targeting off stored children's data) → **counsel-gated** (PR-D). Civil status + religion, as sensitive PI, need the higher-consent capture regardless.

---

## 4c. When planning begins — the authored lead-time ladder (owner-LOCKED 2026-07-12: "yes, this is how we should do it")

Two distinct moments per event: the **heads-up** (first nudge — "this is coming, and events like it need N months") and the **start-planning** deadline (the real when-to-begin, calibrated to PH supplier reality). Reminders stop the instant the go-signal fires (the checklist deadline engine takes over). **All numbers are admin-tunable config data seeded in PR-F — not code** — so the ladder tunes from the console once real go-signal data arrives.

| Tier | Events | Heads-up | Start-planning | Forcing constraint (PH) |
|---|---|---|---|---|
| **Grand** | Debut (18/21) | T−12 mo | **T−9 mo** | venue like a wedding + cotillion rehearsals 2–3 mo + made-to-order gown + 18 Roses/Candles/Treasures roster diplomacy |
| **Grand** | 60th birthday | T−9 mo | **T−6 mo** | party 4–6 mo **+ balikbayan flight coordination** (date bends around who flies home) |
| **Grand** | 25th/50th anniversary | T−12 mo | **T−6 mo** | vow renewal = full production (church, original entourage, lifetime guest list) |
| **Milestone** | 1st · 7th birthday | T−5 mo | **T−3 mo** | venue + caterer + host + package; good kids' suppliers book out |
| **Standard** | 1st anniversary · recurring annual (company Christmas party, gala) | T−2 mo | **T−6 wk** | a produced evening, not a production |
| **Light** | ordinary birthday/anniversary | T−3 wk (single, quiet) | — | book the restaurant, order the cake |
| **Season** | recurring travel | ~2 mo before last cycle's window | — | fares/rooms; windows not dates |
| **Season** | ber-months (Christmas party, Dec reunion) | **Sep 1** | — | December is the mega-peak — Dec-weekend venues gone by October |
| **Birth-window** | Christening | dependent <1 yr, no binyag event → +2 mo | +6 mo | "within the first year"; parish sets the actual date |
| **Late/small** | graduation · gender reveal | T−3 to 4 wk | — | restaurant-scale; schools/scans confirm dates late |

**Cross-cutting rules:**
1. **December override** — ANY event landing in December (party, reunion, wedding) pulls its nudges ~6 weeks earlier (ber-months venue crunch). One authored seasonal rule covering the country's biggest event month.
2. **Family frequency cap** — ≤2 nudges per household per month; on collision the higher tier wins, the rest stay quiet Year-view lines. This is the "busy showing, selective about asking" guarantee.
3. **Delivery by tier** — every moment is always on the Year view (free, ambient); *email* (Resend, per 0028 prefs) only for Grand/Milestone heads-ups. Light/Season never email — in-app only.
4. **Go-signal is never gated by these times** — tap go 2 weeks before a 7th birthday and the adaptive checklist just compresses (it counts deadlines backward from the date).
5. **Mechanics** — a daily due-check of pure date math, fired on traffic via `claim_periodic_job` (cron-free); no scheduler.

**⚠ These fire for DEPENDENT accounts too (owner: "this also includes their dependent accounts").** The debut heads-up at T−12mo means a stored child's birthdate begins producing outreach a full year before the 18th; the 60th fires off a stored elder's birthdate. This long-arc, third-party-triggered outreach is exactly the value that justifies the fenced dependent record — AND exactly why **PR-D (the dependent People layer) stays counsel-gated**: reminders firing off a minor's stored birthdate for up to 18 years is the load-bearing RA 10173 question. The ladder is authored now; for dependents it does not fire until counsel clears PR-D.

---

## 4. Screen 3 — the recurs toggle

"Is this a yearly thing?" — smart defaults, one tap: **auto-on** birthday/anniversary · **offered** travel/corporate/gala/celebration · **hidden** wedding/debut/christening/gender-reveal/graduation (one-shot by nature). Recurrence lives on the event as a flag consumed by the moments calendar — **never an RRULE engine, never auto-created rows** (council, unanimous; cron-free honored).

---

## 2b. The married household (owner, 2026-07-12: "you will be anchored if married … you both share dependents … do events as a couple")

At the union anchor's **married** stage, the two accounts form a **shared household** — architecturally the same shape as the shipped `event_members` model (a shared space joined with a role), applied to a family. **Each spouse keeps their own account** (own identity, own KYC-if-vendor, own personal anchors); marriage adds a shared layer both can see and act in.

| What | Shared on marriage? | Rationale |
|---|---|---|
| The couple's anniversary | ✅ auto | it's the union's own moment |
| **Children** (dependents added during the marriage) | ✅ auto — joint dependents | both are parents; both see the child, both get milestone nudges, either can tap go |
| The shared **Year view** | ✅ auto | one merged family calendar |
| Each spouse's **own birthday** | personal, spouse can see | it's theirs; visibility ≠ ownership |
| Each spouse's **own relatives** (his father, her mother) | **opt-in per person** | cross-family PII — a deliberate share, never an auto-merge |

**The load-bearing rule: joint data auto-merges; personal relatives are opt-in.** Auto-copying one spouse's stored data about *their* parent into the other's account on marriage is exactly the silent cross-account PII spread RA 10173 guards against, and multiplies the PR-D surface. Stage-specific: dating/engaged share ONLY the wedding (jointly planned); the household (shared dependents + merged calendar) forms at **married**.

**Three edge cases (⚠ owner sign-off / counsel):**
1. **Dissolution** (annulment · widowhood · divorce) splits the household, but children don't vanish → joint dependents become **co-parented**: each ex keeps their own view + reminders. Counsel-adjacent.
2. **Blended families** — a child from a prior relationship is individually-owned by the parent, *shareable into* the household by choice (app never force-formalizes a step relationship).
3. **Muslim concurrency** — "household = union" pays off: each wife+husband share THEIR household's children; households stay distinct; dependents never cross between wives (the husband is the shared node, the kids are not). A "household = account" model would break here.

**⚠ Two owner sign-offs before lock:** (a) the consent asymmetry (joint kids auto-shared · each spouse's own relatives opt-in); (b) the co-parenting-on-dissolution rule.

---

## 4b. Anchor cardinality (owner rule, 2026-07-12: "an account cannot make 2 weddings")

Anchored events are UNIQUE per their anchor — the anchor, not the account, is the unit:

| Event | Unique per | Notes |
|---|---|---|
| Wedding | **1 per union** | remarriage = new union anchor = allowed automatically. ⚠ **PH-critical exception — civil + church for the SAME marriage** (very common, often years apart): model as (a) one wedding event with a ceremony list, or (b) two wedding events tagged civil/church on the same union — **owner to pick** (lean (b): matches how they're separately planned/scaled; church carries the SKU attach). Vow renewals (25th/50th) route through Anniversary — no collision. **Muslim rite (PD 1083, owner-raised 2026-07-12): unions may be CONCURRENT — up to 4 wives = up to 4 distinct union anchors = up to 4 weddings, each 1-per-union.** Concurrency allowed ONLY under the Muslim ceremony flow (rite flag exists — `Muslim_Wedding_Build_Plan_2026-06-28.md`), soft cap 4. The "new marriage" disambiguation branch therefore asks: previous marriage ENDED (annulment · widowhood · **divorce — legal for Muslims under PD 1083**) → close old union, or ADDITIONAL marriage under the Muslim rite → concurrent union. Never auto-close the prior union. Each union carries its own anniversary/silver/golden stream independently. **Pacing rule (owner, 2026-07-12 "but still not all in the same year"): concurrent UNIONS ≠ concurrent PLANNING — max 1 wedding in active planning per account across all unions; the next union's wedding unlocks only when the prior is completed (event date passed) or archived. Same-union ceremonies (civil+church pair) exempt. Rare legit overlap → admin exception desk (solo-operator "approve exceptions" pattern). No calendar counter needed — serialization spaces them naturally and closes the batch-fake-wedding hole.** |
| Debut | 1 per person, ever | |
| Christening | 1 per person, ever | |
| Gender Reveal | 1 per **pregnancy** | several over the years is normal |
| Birthday | 1 per person per year | |
| Anniversary | 1 per union per year | |
| Unanchored types (travel/celebration/corporate/…) | no cap | recurring series: 1 per cycle |

**⚠ RECONCILED to shipped code + flow-check (2026-07-12): the SHIPPED enforcement is a HARD BLOCK (#3183, owner-chosen), not the "guided, not walled" the earlier draft described.** Code is canonical. The flow-check found the shipped guard freed the slot only on `archived=false`, so a **completed/widowed/annulled** wedding still blocked remarriage → **owner-fixed: free the slot on COMPLETED or CANCELLED status too (not just archived), + a guided "is this a new marriage?" step** on the blocked attempt (church-of-same-marriage → attach · vow renewal → Anniversary · new marriage → new union once the prior is completed/archived). B1 also locks **civil+church = ONE wedding, a two-item ceremony list** (option (a) — forced by the hard block; option (b) two-events is retired). Muslim concurrency: hard-block also blocks it → **accepted for V1** (exception path later). Anti-abuse dividend unchanged. **This is a CODE FIX to the shipped guard (free-on-completed/cancelled + guided step), the next immediate build item.**

---

## 5. The Year view (moments calendar) — where "busy all year" lives

Derived read-only from: People birthdates + union anchor + holiday ruleset + recurring-event flags + upcoming one-shot events. Pure date math at read time (Rule 1; no scheduler — reminder sends ride the cron-free `claim_periodic_job` primitive + Resend).

- **Every moment shows.** Only **milestones nudge**: ladder birthdays (1/7/18-21/60) · first anniversary · silver/golden · ber-months party window · Valentine's-as-proposal · recurring-event season windows.
- **Go-signal:** tap a moment → onboarding opens **pre-filled** (type, date/window, celebrant, seeded `signature_details`; recurring clones last cycle). Nothing exists as an event until the tap.
- Ordinary years (dinner-scale) = a quiet calendar line + light "Set na 'yan?" reminder, one-tap Simple-Event flow. No grand-planning push.
- Membership fit: the reminder layer is FREE (it manufactures events → flywheel); the Membership's felt value = AI already active on the other side of every tap + the family's whole year visible in one place. The Year view is effectively the Membership home surface.

---

## 6. What this design never does (inherited locks)

Flat picker stays (no cluster grouping) · no auto-created events / RRULE / cron · no free-text annual anchors (typed origins only; death anniversaries excluded) · no celebrant→account auto-linking (invite only, consent-gated) · wedding never asks its date up front · no dedicated UI for the ~7 light types beyond the one anchor question.

---

## 7. Build mapping (extends the verdict's PR-A…E)

| PR | Adds from this design |
|---|---|
| **PR-A** wedding→anniversary link | + union-anchor **stages** (relationship start/proposal via love story) · dating-anniversary pre-wedding · celebrated-date shift at marriage |
| **PR-B** grad/reunion/gala question | unchanged (+ org-aware copy) |
| **PR-C** debut derivation | + reads the People layer (Me/Partner need no fence; full dependent store waits for PR-D) |
| **PR-D** person-anchor record ⚠ counsel-gated | = the **People layer + <18/>50 age fence** + birthday/christening capture + age-out handoff at 18 |
| **PR-E** recurs toggle | generalized to **any type** + season-window recurrence + clone-last-cycle for travel + **memorable-date typed-origin anniversaries** (§ 3b) |
| **PR-F** *(new)* holiday ruleset + **Year view** | calendar_holiday anchors (owner picks the set) · moments calendar · milestone nudge cadence · go-signal pre-fill |
| **PR-G** *(new)* married household | shared household layer at the married stage (§ 2b) · joint-dependent auto-share · opt-in relative share · ⚠ counsel-adjacent (dissolution co-parenting) — build near/after PR-D |

**Sequencing per the lifecycle research (`Lifecycle_Strategy_Research_2026-07-12.md`):** ship the **un-gated slice first** — PR-A + PR-F (own + union anchors, memorable-date anniversaries, Year view) = the whole free reminder→go-signal→Membership funnel, zero new PII, top of the queue. Then **let demand pull the rest** (instrument anchor-adds + go-signal taps → build PR-C/D/E/G when usage reaches for them, not speculatively). Keep V1 to the **80% case** (a couple · their own anchors · their kids); route the rare branches (Muslim concurrency · blended families · dissolution) to simple defaults or the exception desk, not full UI.

---

## 8. Open owner items

1. Holiday set for PR-F (Christmas ✅ Valentine's ✅ — Mother's/Father's Day? New Year? Undas stays OUT).
2. Verdict sign-offs: ~~anniversary=union-only V1~~ **RESOLVED → memorable-date anniversaries YES-with-guardrail (§ 3b)** · PR-D counsel routing · gender-reveal capture · binyag+1st-birthday combined-event tag.
3. Accept the 18–50 dependent gap (PWD/dependent adults) for V1 simplicity?
4. Civil+church wedding modeling (§ 4b): one wedding with a ceremony list (a) vs two wedding events on the same union (b)?
5. **Household (§ 2b):** confirm the consent asymmetry (joint kids auto-shared · each spouse's own relatives opt-in) + the co-parenting-on-dissolution rule (counsel-adjacent).
