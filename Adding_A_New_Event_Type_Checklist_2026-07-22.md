# Adding a New Event Type — The Net (touchpoint checklist) · 2026-07-22

> Built from a full-repo sweep (2026-07-22) after `gala_night` was missed and `date`/`hangout` shipped rendering as "Wedding checklist". `events.event_type` is **TEXT with an FK to `event_type_vocab`** (the enum was dropped, migration `20261205000000`). Most surfaces resolve an unknown type through a generic fallback — but a handful **require** an entry, and several **feature-gate** silently. Paths are under `apps/web/` unless noted.

## 1. REQUIRED — the type is rejected / absent without these

| # | Do this | Where / why |
|---|---|---|
| 1 | **Insert an `event_type_vocab` row** (`status='active'`, `enabled=true`, label, emoji, description) | The `events.event_type` FK rejects any unregistered type; `create-event/actions.ts` + `/onboarding/[type]` validate against `getCreatableEventTypes()`; `enabled=false` = invisible/uncreatable. This is the one hard prerequisite. |
| 2 | **Scope ≥1 `service_categories.applicable_event_types`** to the new key — **after** step 1 | Trigger `validate_applicable_event_types` (migration `20261104000000`) rejects scoping to an unregistered type. The reach-matrix (`20270832295038`) set **explicit** arrays that omit all unlisted types → a new type has **zero marketplace categories** until appended. |
| 3 | **AI price tier** in `lib/setnayan-ai-type-pricing.ts` (`AI_TIER_BY_EVENT_TYPE`) | Unlisted → default Tier C (₱499). Add explicitly to price it right; confirm the tier's `SETNAYAN_AI_*` catalog SKU exists. |

That's the hard floor: creation, marketplace, and pricing then work.

## 2. RECOMMENDED — works via fallback, but generic/mislabeled until filled

| Touchpoint | Fallback | Why fill it |
|---|---|---|
| **`CHECKLIST_EVENT_LABELS` (`lib/checklist.ts`) ⚠** | falls through to **WEDDING chrome** | Highest priority — a missing entry mislabels the whole checklist as a wedding. Guarded by `checklist-event-labels.test.ts` **only if** the type is also in `ANCHOR_BY_TYPE`. |
| **`ANCHOR_BY_TYPE` (`lib/event-anchor.ts`)** | `FALLBACK_ANCHOR` (fixed_date/input) | Add for correct date semantics AND so the checklist-label guardrail covers it. Update `event-anchor.test.ts`'s expected-keys list. |
| **`event_type_profiles` seed row** | `GENERIC_PROFILE` (host/event, marketplace on, STD+monogram OFF) | Bespoke terminology, `enabledSurfaces`, event_class/layer_mode. |
| **`EVENT_TYPE_CHECKLIST_DEFS` (`checklist-event-type-defs.ts`)** | `GENERIC_EVENT_CHECKLIST_DEF` | A real per-type task list vs. the celebration template. |
| **`schedule-run-of-show.ts` `PROGRAMS`** | GENERIC spine | A tailored run-of-show. |
| **onboarding: `type-questions.ts` · `persona-packs.ts` · `specialty-catalog.ts` · `SPECIALTY_KIND_BY_TYPE` (event-brief.ts)** | generic top-N, no signature fields | Tailored onboarding questions / starter plan. |
| **`public/event-types/{key}.webp`** | branded gradient tile | A hero photo on the picker card. |
| **`role-sets.ts`** | `GENERIC_ROLE_SET` | Custom roles (else host/vip/family/helper). |

## 3. FEATURE-GATE — silently OFF until you opt the type in (allowlists)

- **`papic-event-access.ts`** phase sets — new types are fail-closed denied the guest-camera pass. Add to a phase to sell Papic for it.
- **`event-type-profile.ts` `enabledSurfaces`** — generic omits `save_the_date` + `monogram` → STD cinematic reveal + monogram stay OFF.
- **`statutoryPackKey`** (only `WEDDING_PROFILE`) → cascades to the wedding-only gates: PSA/CENOMAR/license deadlines (`upcoming-items.ts`, `preparation.ts`, `setnayan-ai-triggers.ts` GRD-02, `setnayan-ai-activity.ts`), the 12-month roadmap (`followRoadmap` in `studio-recommendations.ts` / studio+suite pages), `/paperwork`, `/seat`, date-selection lock. Leave off unless the type genuinely needs a statutory pack.
- **`schedule-templates.ts`** — starter templates are wedding-only (`[]` otherwise → no "load a template" menu; auto-seeds generic).
- **`leaf-suggestions-core.ts`** — untagged "also want" leaves default wedding-only.
- **`papic-face-mode.ts` `FORCE_MODE_B_EVENT_TYPES`** (`christening`, `debut`) — additive; others default fail-closed mode_b anyway.

## 4. DO-NOT-TOUCH — intentionally frozen

- `EVENT_TYPES_FALLBACK` (`create-event/_components/event-types.ts`) — the pre-cutover safety net; the file says *"Do NOT add new types here."* Roster is DB-driven from the vocab.
- `WEDDING_PROFILE` / `WEDDING_ROLE_SET` / `CHECKLIST_TEMPLATE` — the "byte-identical wedding" guarantees (pinned by tests). Wedding is deliberately excluded from the generalized maps.
- `wedding` can't be retired / disabled (platform anchor — `event-types-mutations.ts`, admin actions).
- `telemetry/fault-log.ts KNOWN_EVENT_TYPES` — unrelated (telemetry-fault enum, not `events.event_type`).

## Minimum viable new type
Vocab row (§1.1) → category scope (§1.2) → AI tier (§1.3) → **`CHECKLIST_EVENT_LABELS` + `ANCHOR_BY_TYPE`** (§2, or it mislabels as a wedding). Everything else is tailoring.

_History: `gala_night` (registered but missed by the reach study — grep vs. vocab), then `date`/`hangout` (registered 2026-07-22) exercised this net; the checklist-label miss is exactly item §2 row 1._
