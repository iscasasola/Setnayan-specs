# Setnayan AI — Account-Level "Planning Style" Personalization · Spec + Governance · 2026-07-17

> Owner direction (2026-07-17): collect each user's viewing/inquiring patterns → an account-level personalized planning style (food/cuisine, photography style, moods/themes, usual vendor categories), gathered on approval, governed on Setnayan AI settings, with granular per-signal delete. Owner answers: (1) keep it ORDINARY PI — religion is already known from the family/faith profile (automatic, separate consent), never inferred from food; (2) self-scoped; (3) stay strictly inside RA 10173 allowed bounds. Mockup: Claude artifact `planning-style-settings` (https://claude.ai/code/artifact/d0533282-bfcd-49c7-943c-b9735f1b686f). NOT built — design + governance, ships behind DPO + counsel + NPC ROPA.

## What already exists (activation, not greenfield)
- **`preference-match.ts` + `event-preferences.ts`** — a preference layer matching a couple's chosen attributes vs vendor facet tags by ARRAY OVERLAP; **floats matches up, never excludes**. Today it's EXPLICIT + EVENT-level (`event_vendor_preferences.attribute_payload`). Spec: `Vendor_Match_Personalization_2026-06-01.md`. Inert until vendor facet payloads exist.
- **INFERENCE templates INF-01…05** (`setnayan-ai-templates.ts`) — consent-gated, inert. INF-01 = *"I noticed you keep looking at {value} {attribute} — want me to lean that way across your shortlist?"* — the exact surfacing.
- **`admin-data-access.ts`** — RA 10173 "who viewed whom" access-log precedent.
- The account "Setnayan AI · data-governance checklist" concept (Standard / Activate / Approve / Wipe) — see [[project_setnayan_account_ai_checklist]].

**The one new piece:** an ACCOUNT-level, BEHAVIORALLY-derived taste profile that persists ACROSS events — so a returning user's next event pre-fills their known style. Generalizes the event-level explicit preferences up to the account.

## The vision (owner 2026-07-17): the AI secretary/butler
The profile IS the user's compiled decision-making — every taste and choice, remembered. That's what turns Setnayan AI into a **secretary/butler/assistant** who already knows them: *the next time they create an event, it starts with better options suited to their liking, not a blank page.* The value compounds across a lifetime of events (wedding today · christening in three years · barkada dinner next month) — the same person, the same remembered taste. This maps to the existing SECRETARY template category (SEC-01…09). **And it is all theirs to erase, anytime** — the full wipe (below) is the safety valve that makes the memory trustworthy.

## The model (two layers)
1. **Explicit** (built, event-level): the user states preferences for an event.
2. **Behavioral** (new, account-level, consented): Setnayan AI notices patterns across events — cuisine, photography style, moods/themes, the vendor categories the user keeps opening — and offers to remember them.

**Deterministic (Rule 1 — no LLM):** tallies + thresholds, not ML. "Opened garden-editorial 8×, documentary photo 6×, Filipino-Spanish cuisine 5× → that's your style." Feeds the existing float-up matcher + the INF templates. No per-call cost.

## Governance = the product (RA 10173, owner-answered)
- **Opt-in, off by default** — behavioral collection starts only on approval; the explicit layer works without it.
- **A visible profile on Setnayan AI settings** — the user SEES their collected taste (delight + RA 10173 right-to-access).
- **Granular delete + full wipe** — each collected signal is individually removable (the mockup's per-chip ×), AND a **full wipe** ("Wipe everything Setnayan AI has learned" — erases the entire compiled memory, every taste and pattern), plus a download (right to access) + turn-off (withdraw consent, stops collection without deleting). The full wipe is the trust anchor: the memory is only acceptable because it's entirely erasable on demand.
- **Ordinary PI only (owner call).** Food stays cuisine/flavor TASTE only. **Religion is set in the family/faith profile with its own consent and is automatic — never inferred from food or vendor choices.** (This removes the SPI-from-food risk without losing the faith signal, which the faith graph already holds. See [[project_setnayan_faith_person_graph]].)
- **Self-scoped (owner call).** The profile is never visible to vendors, guests, or any other account. Guards the live `guest_saved_vendors` cross-event finding — one person's patterns must never surface to another. See [[project_setnayan_privacy_reconciliation]].
- **Purpose-locked.** Used only for the user's own planning. Never sold, never shared — consistent with 0% commission (Setnayan earns from vendors, not data).

## Guardrails / do-not-cross (owner: "do not cross past the not allowed for data privacy")
- No Sensitive PI in the behavioral profile (no religion/health/dietary-restriction inference). Cuisine = taste, not a religious proxy.
- No cross-person compilation; strictly self-scoped, per-account.
- No collection before opt-in; no dark patterns on the consent.
- Counsel + DPO sign-off + an NPC ROPA purpose entry (behavioral profiling of PI) before it ships — rides with the privacy reconciliation work in flight.

## Build sketch (for Opus, post-counsel)
1. Consent flag on the account (opt-in, default off) — extend the account settings / `users.consent_state` pattern.
2. A deterministic signal tally: view/inquiry/save events → per-account preference vectors keyed by the vendor facet dimensions (cuisine, photo style, mood, category). Threshold surfaces a preference.
3. Account-level read wired into `preference-match` (float-up) so a new event pre-fills the known style; INF templates surface it ("want me to lean that way?").
4. The Setnayan AI settings surface (per the mockup): visible profile · per-signal delete · download · wipe · turn-off.
5. RA 10173 plumbing: access (download), erasure (granular + whole), consent-withdrawal (turn-off stops collection), retention limit, ROPA entry.
