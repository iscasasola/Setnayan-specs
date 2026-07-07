# Setnayan AI — Data Use: One-Pager for DPO Review

> **For:** the Setnayan DPO (registered with the NPC).
> **Ask:** review + sign off on the disclosure wording and the trend-anonymization approach below before two Setnayan AI features ("Inference" and "Trend") are switched on. The design is deliberately conservative — this should be a **sign-off, not a redesign**.
> **Date:** 2026-06-29. **Law:** RA 10173 (Data Privacy Act) + NPC issuances.

## What we want to do

Setnayan AI is the paid planning assistant. Two of its abilities use personal/behavioral data:

1. **Personalization ("Inference")** — learn from how an individual couple browses (what venues/styles/vendors they look at) to tailor *their own* suggestions. Example surfaced to the user: *"I noticed you keep looking at garden venues — want me to focus there?"*
2. **Aggregate trends ("Trend")** — use anonymized, grouped patterns across many couples to inform suggestions. Example: *"68% of couples like you added a coordinator."*

Everything else the assistant does (chasing vendors, watching budgets/deadlines, congratulating good picks) runs on data the couple already gave us for planning, and is **not** part of this review.

## The legal basis we're relying on

- **Personalization:** the couple's own data, processed to deliver the very service they're paying for, under **clear notice + opt-out consent**. First-party, expected use.
- **Trends:** computed only over **anonymized, aggregated** data with a minimum group size — at that point it is no longer personal data, so it falls outside RA 10173's processing obligations.

## The seven safeguards built into the design

1. **Clear notice, plain words.** At sign-up + in the privacy policy: *"Setnayan AI learns from how you plan to give you better suggestions, and uses anonymized patterns from all couples to spot trends. You can turn the personal part off anytime."*
2. **Every use is self-disclosing.** The assistant always says what it noticed ("I noticed…") — no hidden profiling. The user sees exactly what the system saw.
3. **Real opt-out.** A toggle in Settings → Privacy turns off personalization; honored immediately (right to object / withdraw consent). Stored on the existing `users.consent_state`.
4. **Two data types kept separate.** Personal-data-used-for-you (personalization) vs anonymized-data-used-for-everyone (trends) — different handling, never mixed.
5. **Trend anonymization + minimum group size.** Trends are counts/percentages over groups, never "couple X did Y." Names/IDs stripped. **A trend never displays unless its group is ≥ a minimum (proposed 25)** so no individual can be reverse-identified. (Enforced in code by the shipped `public.min_n_ok(count, floor)` helper.)
6. **Data minimization + retention clock.** Only the behavioral signals actually used for suggestions are kept; aged out after the event + retention window. No indefinite hoarding.
7. **Purpose limitation + rights.** Used only to improve the couple's planning — never sold, never used for unrelated marketing without separate consent. Behavioral data is included in the existing "download my data" + "delete my account" tools (iteration 0025).

## What we'd like the DPO to confirm

1. The **notice wording** (safeguard 1) is adequate for RA 10173.
2. The **opt-out** placement + immediacy (safeguard 3) satisfies the right to object.
3. The **minimum group size of 25** (safeguard 5) is acceptable as the anonymization floor (or set a different number).
4. The **retention window** for behavioral logs (safeguard 6) — confirm a specific period.
5. Whether personalization should be **on-by-default (with the off-switch)** or **opt-in** — our recommendation is on-by-default because every use is self-disclosing, but this is the DPO's call.

## Engineering state (so the DPO knows the stakes)

These two features are **built but switched OFF** behind a flag (`setnayan_ai_per_user_enabled`); they cannot collect or display anything until the flag is flipped, which we will not do until this sign-off. Everything is reversible from an admin toggle with no redeploy.
