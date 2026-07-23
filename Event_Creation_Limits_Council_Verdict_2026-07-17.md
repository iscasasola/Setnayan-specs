# Event_Creation_Limits_Council_Verdict_2026-07-17

> **Council verdict — life-event creation limits (cardinality + eligibility gate).** 5 seats (product · privacy/counsel · abuse/solo-op · architecture · UX), each adversarially cross-examined, synthesized 2026-07-17. Status: **BUILT same day — PR #3373** (owner "build it now" 2026-07-17 resolved the § 9 sign-offs; see build addendum at the bottom). Migration `20270821100000` applied to prod.

> **⚠ Owner refinements over the verdict (2026-07-17, applied in the build):** (1) **Measured life types are HIDDEN, not just soft-gated** — the create grid hides debut/christening when nothing in the account's People data concerns them; this overrides the council's "no hidden tiles" ruling, mitigated by a permanent "show all event types" expander (wayfinding doorway). **Wedding is always available to an adult — "this is not a measured date."** Unmeasured types (gender reveal, graduation, birthday) always show. (2) **Per-type horizon table locked** (owner "yes" to the preparation-months map): debut 548d/18mo · birthday 274d/9mo · christening 183d/6mo · gender reveal 152d/5mo · graduation 122d/4mo — generalizing the debut-only 548-day constant; all soft advisories.

**Scope.** Recon baseline: `origin/main` @ #3337 (2026-07-17). Ground truth verified across seats: the only cardinality rule in prod is the one-in-planning wedding guard (`apps/web/app/dashboard/(account)/create-event/wedding-guard.ts:49-91`); `ANCHOR_BY_TYPE` + the pure milestone math live in `apps/web/lib/event-anchor.ts` (milestoneAges, nextMilestone) and `apps/web/lib/dependent-people.ts`; the dependents layer is counsel-gated behind `NEXT_PUBLIC_DEPENDENT_PEOPLE`, flag-OFF, effectively empty in prod; there are **four** events-insert server paths, not one — `create-event/actions.ts:285`, `onboarding/wedding/actions.ts:430`, `onboarding/simple/actions.ts:59`, `onboarding/_shared/commit-event.ts:86` — and the shipped wedding guard is wired into only the first, an existing bypass this build must not copy. Christening and gender_reveal already collect honoree SPI into `events.signature_details`, a gap already on the NPC pre-filing task list (`apps/web/lib/npc-filing-tasks.ts:66-67`); this design must not widen it. Files touched by the verdict: new `apps/web/lib/life-event-gate.ts`, new sibling guard in `create-event/`, one small `events` migration, the four insert call sites, create-form relabels, `/privacy`.

**The organizing ruling.** "One per life event" ships as the shipped wedding-guard generalized — **one IN-PLANNING life event per (creator account × event type × honoree)** — and "eligibility" ships as a **planning-horizon advisory on the party date the form already collects**, never as a birthdate demand and never as a hard wall. The gate is a coherence rail for honest families (one home per milestone, duplicates redirected to their doorway), and the council books it as exactly that: it is **not** fake-inquiry protection, which remains the settlement-side hold-and-release design and must not lose priority to this feature. Data earns features; features never ransom data — with a linked person the gate dissolves into prefill, without one it costs a single optional name field. Every divergence from the owner's verbatim directive (soft advisory vs. hard block; 18 months vs. "a year"; in-planning vs. once-ever) is surfaced as a numbered sign-off below, not silently applied.

---

## 1. Classification — life vs. lifestyle

The flag lives in **code, not the DB**: `LIFE_GATE_BY_TYPE` in the new `apps/web/lib/life-event-gate.ts`, beside `ANCHOR_BY_TYPE`, per the Conflict-E ruling already quoted in that file ("pure map first; promote to a vocab/profile column only when admin-editability is actually needed"). A DB column without an admin editor is an orphaned gate; unknown/admin-added vocab types **fail open to lifestyle**, so the dynamic-vocab objection dissolves. `event_type_profiles.event_class` answers a different question (Samahan ownership) and is not overloaded.

| Type | Class | Cardinality | Rationale |
|---|---|---|---|
| wedding | LIFE | account (shipped guard, untouched) | Owner-locked, flow-check-reconciled; the reference implementation. No new window — long engagements are normal and weddings are the revenue engine. |
| debut | LIFE | per-honoree slot | Person-timeline, once-flavored; the ONLY type with an eligibility (horizon) read in V1. |
| christening | LIFE | per-honoree slot | Person-timeline; date-OUTPUT type so no horizon can run; no attestation (religion-neutral silence — the type choice already implies faith voluntarily; the gate must not compound it). |
| birthday | LIFE | per-honoree slot | Every birthday sits on a person's timeline; NO milestone/ordinary split (the attacker picks the claimed age — unenforceable) and no annual key (edit-desync). Milestone-ness (1/7/18F/21M/60) is tone and nudge, never a gate. |
| graduation | LIFE | per-honoree slot, repeatable | People graduate kinder→postgrad; slot frees on settlement. No level picker (overbuild), no eligibility question (education is SPI-adjacent). |
| gender_reveal | LIFE | per-honoree slot (honoree = expectant parent, optional; blank = singleton slot) | Per-pregnancy semantics without pregnancy records. Account-singleton was rejected — it walls a household hosting a sister's reveal with no doorway. Due date stays voluntary (health-adjacent). |
| anniversary | LIFESTYLE (v1) | none | Union-anchored but recurring by nature; anchor_date/anchor_origin are optional at creation so a per-anchor key is undefined for the common case, and no union-subject primitive exists. Revisit only if one lands. |
| travel | LIFESTYLE | none | Activity, repeatable, owner-verbatim ungated. |
| corporate | LIFESTYLE | none | Same. |
| tournament | LIFESTYLE | none | Same. |
| reunion | LIFESTYLE | none | Same. |
| celebration | LIFESTYLE | none | Same; also the honest landing spot for themed parties. |
| gala_night | LIFESTYLE | none | Same. |
| simple_event | LIFESTYLE | none | Same. |
| *(unknown / future vocab)* | LIFESTYLE | none | Fail open — failing closed creates orphaned blocks a solo operator must hand-clear. |

Lifestyle types get **zero** new UI, zero questions, zero caps. The account-wide 12-event ceiling (integrity seat) is rejected: it contradicts the owner's explicit "no rules on lifestyle events."

## 2. Cardinality rule

**Predicate.** For a life-type creation, an existing event E blocks iff: E is owned by the same creator account (wedding-guard's `member_type='couple'` query shape, one query) AND `E.event_type = N.event_type` AND E is in-planning — `NOT archived AND (event_date IS NULL OR event_date >= manilaToday())`, byte-identical to `isInPlanningWedding` — AND `honoreeKey(E) = honoreeKey(N)`.

**Honoree key resolution:** `honoree_dependent_id` when linked (PR-3, flag-on) → else `lower(trim(honoree_label))` → else the per-type singleton slot (unlabeled = one at a time; opening a second slot costs exactly one non-sensitive act: typing a name).

**Grandfather rule (mandatory):** legacy rows (NULL `honoree_label`, pre-gate) **never block**. New unlabeled creations are distinguished from legacy by a gate-epoch constant in the guard. No prod account is retroactively frozen out of a type it was using.

**What frees the slot:** archive, or the event date passing — wedding-guard precedent (widow/annulled logic carries over: next year's birthday plans after this year's happens). There is **no once-ever lifetime lock**: no completion signal exists in the data model, so "settled blocks forever" is unimplementable as specified (architecture seat's `once_per_honoree`, killed). Instead, for debut and christening a **settled** same-honoree same-type event triggers a **soft interstitial**, not a block: "Already on her timeline" → [Open it] / [This is a different celebration — create anyway]. Hard block only on a live duplicate; self-serve escape on everything else.

**Enforcement:** app-layer only, via one shared `assertLifeEventCreatable()` called at **all four** insert paths (create-event, onboarding/wedding, onboarding/simple, onboarding/_shared/commit-event) — the wedding path early-returns to the untouched shipped guard. Guarded by a **grep-based source test** (scan for `.from('events')` + `.insert`), not an import assertion, so future insert paths fail CI. No DB constraint or trigger (CHECK can't reference now(); inserts run through the admin client; the server action is the choke point, per shipped precedent). Edit paths are **not** re-guarded in V1 — the in-planning predicate reads live `event_date` so there is no snapshot to desync, and the council openly accepts that date edits can walk past the debut window (see § 6: this rail is not a security boundary).

## 3. Eligibility rule + privacy-safe data design

**Debut only in V1.** The machinery is generic (an `eligibility` field on the map) but no other type gets a check: christening is date-OUTPUT (no date exists at creation to gate on), graduation/gender_reveal/anniversary would probe SPI-adjacent facts for zero verification value.

**Mechanism — the typed party date IS the declaration.** Debut is already date-INPUT in `ANCHOR_BY_TYPE`; the form already asks "Kailan ang debut?" The gate adds only a horizon read: if the date falls within `DEBUT_WINDOW_DAYS = 548` (18 months — owner constant, sign-off #2), planning opens with zero friction. Beyond it: a **soft advisory, never a block** — "Malayo pa 'yan — we usually see debut planning open about a year and a half out" with two live doors: [Adjust the date] and [Start planning anyway]. **No attestation checkbox and no stored attest blob.** The privacy seat's boolean was killed twice over: the guardian clause forces ates, godparents, and coordinators to lie (consent theater, adjudication noise), and the blob itself stores an age-band about a named third party on a row readable by every event member. The type choice + party date already carry the same information with **zero new collection**. We never ask for a birthdate, birth year, sex, or ordinal age — anywhere in this gate, ever.

**Verified tier (PR-3, flag-on):** a linked dependent with a birthdate upgrades the gate to concierge — `nextMilestone` **prefills** the debut date and the Year-view moment card deep-links into a pre-passed create flow. A mismatch shows the derived truth as an **advisory with proceed-anyway** — the verified path must never be stricter than the unlinked path (architecture seat's hard verified block killed as incentive inversion: it teaches users not to link their children).

**New data, exactly one field:** `events.honoree_label` — optional free-text first name, ordinary PI at the sensitivity of existing guest names. PR-1 ships with (a) a select-surface audit excluding it from all public `/u/`, vendor, and guest read paths (events is read via `select('*')` in places — this is real work, not a footnote), and (b) the `/privacy` disclosure line, in the **same PR** as the collection, per the privacy-reconciliation register discipline. `honoree_label` is a display/guard key only and does **not** duplicate or extend the pre-existing `signature_details` honoree SPI (christening birthdate/sex, reveal due date) — that gap stays on the open NPC task list and is neither widened nor silently absorbed here.

## 4. Sequence stance

**Suggested, never enforced — unanimous, and closed.** Three reasons, any one sufficient: most accounts join mid-life; a christening prerequisite leaks religion (RA 10173 sensitive PI, owner-locked unlocks-not-gates); and fakers fabricate the chain in four clicks while every honest mid-life joiner becomes a solo-operator support exception. The ladder (1/7/18F/21M/60) stays what it already is: derived Year-view moments that become creation **doorways** (deep-link with honoree pre-bound) when a lawful birthdate exists via the counsel-gated dependent layer. No backward "add her christening?" prompts in V1. The milestone-tone charm ("Big one 'to — her 7th!") and the sequence whisper require birthISO + sex, which the flag-off form never collects — they ship **only** behind the dependents flag (UX seat's flag-off charm layer killed as running on vapor).

## 5. Blocked-state UX

Invitation, not wall; every card ships its doorways (wayfinding lock); warm Taglish register (sign-off #7); no greyed or padlocked tiles on the create grid (a locked debut tile infers things about a family and is a wall in costume); the existing 3-question inline form is relabeled, never wizard-ized — "Para kanino ang debut?" (optional name + auto-composed event title) · "Kailan?" · "Saan / ilan kayo?".

Three states:

1. **Live duplicate** (the only hard block): "Tuloy pa rin ang planning para kay Maria — nandito na ang debut niya." Doors: **[Buksan ang Maria's Debut]** (primary, deep-link) · **[Iba ang celebrant]** — reveals the name field; creation proceeds only when the normalized key differs, and the copy asks for a distinguishing detail ("Maria (pamangkin)"), which resolves the identical-name planner case without a fuzzy matcher (near-match similarity cards killed — no metric was ever scoped) · **inline archive door** ("Tapos na ang lumang event? Archive it") — mandatory on this card, because undated in-planning events otherwise block forever with no exit.
2. **Far-horizon advisory** (debut only, soft): derived-truth copy when verified, generic when not; doors [Adjust the date] / [Start planning anyway], plus [Add her to your People] **only when the dependents flag is on**. The "[Save as a moment]" CTA is **cut from V1** — killed twice as a fake door (derived moments have no substrate flag-off).
3. **Settled same-milestone interstitial** (debut/christening, soft): [Open it] / [Create anyway].

Error params follow the shipped convention (`?error=life_event_exists&existing={id}`, mirroring `?error=wedding_exists`).

## 6. What this actually protects

Honestly stated: **family-OS coherence and accident prevention** — one home per milestone, duplicate creations redirected into the existing event, an honoree substrate that upgrades cleanly into the person graph. It is trivially bypassable by a typed name variant, a date edit, or routing through a lifestyle type — and the council forbids booking it as integrity infrastructure. Vendor-token and fake-inquiry protection live where they already live: settlement-side hold-and-release, refund-on-ghost, cluster throttling (designed, sign-offs pending, **not built** — that work keeps priority). Because every honest planner always has a live door (create-anyway, distinct-name, archive), the gate never pressures real debuts into miscategorizing as "celebration," which protects the per-type customization and taxonomy quality the owner's directive actually serves.

## 7. Build plan

**Schema (PR-1, one migration, idempotent):** `ALTER TABLE public.events ADD COLUMN IF NOT EXISTS honoree_label TEXT, ADD COLUMN IF NOT EXISTS honoree_dependent_id UUID REFERENCES public.dependents ON DELETE SET NULL;` + partial index on `honoree_dependent_id`. No new table → no new RLS surface; columns ride events' existing policies (precedent: migration 20270728247263). No `event_type_profiles` column. No attest storage.

**PR-1 — ships now, env-flag `LIFE_EVENT_GATE` default OFF, merges byte-identical (house style):**
- `apps/web/lib/life-event-gate.ts`: `LIFE_GATE_BY_TYPE` map (fail-open lifestyle), pure `blockingLifeEvent()`, `normalizeHonoree()`, `DEBUT_WINDOW_DAYS`, gate-epoch grandfather constant — unit-tested like the wedding guard.
- Sibling async guard in `create-event/` reusing the wedding-guard query shape; `wedding-guard.ts` untouched.
- `assertLifeEventCreatable()` wired into **all four** insert paths + the grep-based insert-path CI test.
- Form relabels, three state cards, honoree select-surface audit, `/privacy` disclosure line.

**PR-2 — owner-sign-off-gated (items below), then flag flip:** classification map final, window constant, copy pass (one owner Taglish pass, not per-PR strings), `life_event_blocked` PostHog event (no PII) so the 548-day constant gets telemetry before it's locked.

**PR-3 — counsel-gated, rides the EXISTING `NEXT_PUBLIC_DEPENDENT_PEOPLE` gate, no new counsel ask:** person picker (optional, skippable forever), `honoree_dependent_id` linking + attested→verified upgrade, deterministic prefill/advisory, Year-view moment → create-event deep-link, per-person cardinality upgrade (the link **loosens** the account-level singleton while tightening per-person — the privacy seat's inversion, adopted), post-creation "Add to People" whisper.

Explicitly not built: admin queues, crons, DB constraints, ID verification, account caps, fuzzy matchers, `is_test` flags (internal/founder accounts bypass the gate — the demo escape hatch).

## 8. Rejected alternatives

1. **DB `lifecycle_class` column** (product, privacy, UX seats) — Conflict-E precedent; a flag with no admin editor is an orphaned gate; fail-open code map answers the dynamic-vocab objection.
2. **Mandatory "who is this for?" + milestone_key grammar** (product) — a shadow, flag-free rebuild of the counsel-gated person graph; per-key grammars (`birthday_{year}`, `reveal_{YYYY-MM}`, graduation level picker) overbuild and desync on date edits.
3. **Birthday-as-gated-for-all-ages with annual keys / milestone-only split** (product / privacy) — the first is false-positive machinery on the highest-volume type; the second is unenforceable (attacker picks the age) and smuggled an owner-directive narrowing into a seed.
4. **Guardian-attestation checkbox + stored attest blob** (privacy, architecture) — excludes legitimate non-guardian planners, consent theater under §13(a), stores an age-band SPI blob readable by event members, and its adjudication value is noise.
5. **Account×type cardinality = 1 in degraded mode** (privacy) — hard-blocks multi-child families in the mode that is prod reality indefinitely.
6. **Account-wide 12-event in-planning cap** (integrity) — contradicts the owner's verbatim "no rules on lifestyle events"; N was a guess with no telemetry.
7. **"Save as a moment" with zero schema** (integrity, UX) — fake door; derived moments have no flag-off substrate.
8. **`once_per_honoree` settled-blocks-forever** (product's once-shot keys, architecture) — no completion signal exists; archived-real-debut silently reopens the "lifetime" slot; replaced by the soft interstitial.
9. **Anniversary as life / per-anchor** (product, architecture) — union-subject primitive doesn't exist; anchors optional at creation leave the common case keyless.
10. **Verified tier stricter than attest tier** (architecture) — incentive inversion against the Family-OS positioning.
11. **Gender_reveal account singleton** (integrity, architecture, UX) — dead-ends a legitimate concurrent second reveal.
12. **Hard 12-month window / hard eligibility blocks of any kind** (product, and the owner's verbatim reading) — throttles the second revenue hero (PH debuts plan 12–24 months out), and its only exits are lie-or-leave — a wayfinding violation; surfaced as sign-off #1, not silently softened.
13. **Unanimous standing rejects, now council positions:** no birthdate/DOB/derived-year collection in any gate; no enforced sequence (religion leak + mid-life joiners); no admin exception queues; no ID verification; no per-account event-count caps; no minted milestone event types; no greyed/padlocked tiles; no multi-step life-event wizard; no touching `wedding-guard.ts`.

## 9. Open owner sign-offs

1. **Soft vs. hard:** your verbatim rule was a hard eligibility gate; the council ships a horizon **advisory** with [Start planning anyway] (hard blocks are unverifiable, RA-10173-radioactive, and an exception factory for a solo operator). Approve the soft advisory? (yes/no)
2. **Window:** 18 months (`DEBUT_WINDOW_DAYS = 548`) instead of your verbatim "a year," matching real PH debut lead times. Approve 18 months? (yes/no)
3. **Classification table in § 1** — specifically anniversary = lifestyle (v1), birthday = life at every age with one in-planning slot per honoree, graduation = repeatable. Approve the table as ruled? (yes/no)
4. **"One per life event" = one IN-PLANNING per honoree**, with sequential real events and a self-serve [Create anyway] on settled duplicates — not a lifetime database lock. Accept this reading? (yes/no)
5. **Wedding untouched:** the shipped wedding guard stays byte-identical, no new window on weddings. Confirm? (yes/no)
6. **No account-wide cap** on total in-planning events (lifestyle stays truly unlimited). Confirm? (yes/no)
7. **Booking:** this gate is product-shape/accident-prevention; hold-and-release settlement remains the fake-inquiry moat and keeps build priority. Confirm? (yes/no)
8. **Copy register:** warm Taglish for all gate states, one owner copy pass before flag flip. Approve? (yes/no)


---

## Build addendum — 2026-07-17 (PR #3373)

Shipped same day, exactly per § 7 with the owner refinements above:

- `apps/web/lib/life-event-gate.ts` — `LIFE_GATE_BY_TYPE` (fail-open), pure cardinality predicate + `LIFE_GATE_EPOCH_ISO='2026-07-18'` grandfather, per-type horizons, measured-visibility helpers (`hiddenMeasuredTypes`, `debutConcernsBirthdate` 18F/21M, `christeningConcernsBirthdate` <8). 12 unit tests incl. the **insert-path source scan**.
- `create-event/life-event-guard.ts` — async guard wired into **all four** events-insert paths; `onboarding/wedding/actions.ts` now also runs the shipped wedding guard (the recon-confirmed bypass is closed). `wedding-guard.ts` untouched.
- Picker: "Para kanino?" optional honoree field (life types only, never a birthdate) · "Malayo pa ’yan" soft advisory · measured-type hiding + "show all event types" expander (flag `NEXT_PUBLIC_DEPENDENT_PEOPLE` drives measurement; flag off → nothing hides).
- Blocked-state card (`?error=life_event_exists&existing=…`): open-existing (primary) · different-celebrant door · archive hint.
- Migration `20270821100000` (renamed from 20270820100000 after a prod version collision): `events.honoree_label` + `events.honoree_dependent_id`, comments, partial index. **Applied to prod.** `/privacy` honoree clause extended in the same PR. Public event reads verified column-scoped (no leak).
- NOT in this PR (follow-ups): dependent person-picker + `nextMilestone` prefill (concierge tier), `life_event_blocked` PostHog event, Year-view moment → pre-passed create deep-link.
- ⚠ Discovered in passing: main migration `20270820688344_seed_owned_reel_music_velvet_court.sql` fails against prod (NULL `category`), breaking `supabase db push --include-all` — flagged as a separate task.
