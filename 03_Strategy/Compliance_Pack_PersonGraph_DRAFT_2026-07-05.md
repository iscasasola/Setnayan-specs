# Compliance Pack — Person Graph (Connections · Life Stories · Trusted-Circle)

**Date:** 2026-07-05
**Status:** **DRAFT for DPO/counsel review (Indalecio Sacdalan Casasola II).** Built to RA 10173 by design (per the standing compliance-by-default rule); not a substitute for counsel sign-off. Pairs with the Privacy Policy amendment 2026-07-05 (`01_Contracts/Setnayan_Privacy_and_Security_Policy.md`) and the two counsel briefs.
**Covers:** the Phase-2 person-graph features (live behind flags as of 2026-07-05). Minors/legacy (Phase 3) DPIA is scoped in § 4 but not completed — it is counsel-first.

---

## 1. Just-in-time consent & notice strings (wire-able)

Plain-language notices to show *at the moment* of each action — the transparency layer § A.2 of the policy requires. Draft copy; the DPO refines wording.

| Surface | Notice / consent copy (draft) |
|---|---|
| **Send a connection request** | "We'll send [name] a request. You'll be connected only after they confirm — and they'll see your name to decide. You can cancel any time before they accept." |
| **Incoming connection request** | "Someone added you as their [relation]. Confirm to connect (you'll each see the other's name), or decline — nothing is shared if you decline." |
| **Confirm a connection** | "Connecting means you'll each see the other's name and that you're connected. It's private to the two of you — never shown to anyone else or made browsable." |
| **"Your Story" (life stories)** | "These are photos and clips you appear in, from events where photo-sharing was on. Only you see this as *your* story. Hide anything, or hide a whole event — it won't affect the host's gallery." |
| **RSVP photo consent (existing)** | Extend the existing string with: "…photos you appear in may also appear in your own private archive. You can hide or opt out any time." |
| **Trusted-circle badge (vendor)** | "Based on people in your circle who *chose* to endorse or review this vendor — shown only as an aggregate, never who, unless they explicitly vouched. Never based on who booked whom." |
| **Claiming your history (sign-up match)** | "We found memories and connections already tied to your email from events you took part in. Claim them so your history follows you." |

## 2. DPIA — Person Graph (connections + life stories + trusted-circle)

Scope: processing of personal + relationship data of adults through the person graph. Method: identify risk → likelihood/impact → mitigation (built) → residual.

| # | Risk | L / I | Mitigation already built | Residual |
|---|---|---|---|---|
| 1 | Exposing a person's data to someone they didn't consent to | High/High | Mutual confirmation required; **name-only, confirmed-only** cross-person visibility (SQL `visible_connection_names`); no contact details; deny-by-default RLS | **Low** |
| 2 | The graph becoming a browsable social directory | Med/High | Participant-scoped RLS; no "people you may know"; no browse; edges private to the two people | **Low** |
| 3 | A person's photo appearing in another's archive without basis | Med/High | Built on the event-level photo consent; per-person **hide** + per-event **opt-out**; references not copies; host gallery untouched | **Low–Med** — confirm event consent is adequate for cross-event archiving (counsel Q, brief §4.4) |
| 4 | Inferring sensitive info from relationship data | Med/Med | Extended kin **derived, not stored**; min-N (≥5) on any aggregate; only declared first-degree edges persisted | **Low** |
| 5 | Vendor recommendations exposing who-used-whom | Med/High | Aggregate-only, **min-N ≥ 5**, explicit-endorsement-only (never bookings), degree ≤ 2, not purchasable | **Low** |
| 6 | Cross-event face recognition / biometric creep | High/High | **Structurally impossible here** — association is tag/QR/confirmed-identity only; no face origin in the schema; face vectors stay per-event (§ 1.4) | **Low** |
| 7 | Pending requests leaking a name pre-consent | Med/Med | Names resolve **only for confirmed edges**; pending shows a neutral label | **Low** |
| 8 | Data kept longer than justified | Med/Med | Follows event/account retention (§4); hide/opt-out immediate; reference dies with source | **Low–Med** — confirm long-lived "memory" retention basis with counsel |

**DPIA conclusion (self-assessment):** residual risk is Low across the board, with two items (3, 8) flagged for counsel confirmation rather than redesign. Consistent with proceeding **once the Privacy Policy amendment is approved and the two counsel briefs are answered.**

## 3. Retention — new data types

| Data type | Retention | Deletion trigger |
|---|---|---|
| `person_connections` (edges) | Follows event/account retention (§4) | Either party deletes the connection, or account deletion; declined edges suppressed immediately |
| `person_story_items` (references) | Follows the source media's retention (§4) | Source media deleted, per-person hide, or event opt-out — whichever first |
| Trusted-circle signal | **Not stored** — computed on read | N/A |
| Person node | Follows account retention; an unclaimed seeded node follows the parent event | Account deletion; stale-event rules for unclaimed |

## 4. Minors & Legacy DPIA — SCOPED, NOT COMPLETE (Phase 3, counsel-first)

Not processed today (adults-only). Before any build-to-live, a full DPIA must cover, at minimum:
- **Minors:** guardianship proof standard; scope of guardian consent; the age-of-majority (18) ownership transfer + verification; whether a teen "assisted-access" window is permissible; re-consent at majority; retention of a minor's data pre-claim.
- **Legacy/post-mortem:** whether RA 10173 governs a deceased's data and who controls it; proof of death + direct-line heir; memorial-by-default posture; validity of an in-app pre-designation directive; wrongful-transfer reversal.
- **Both** warrant their own DPIA + NPC consultation. Instrument: `Phase3_Minors_and_Legacy_Counsel_Brief_2026-07-05`.

---

*Draft compliance artifacts prepared to a compliant baseline ahead of counsel. To be finalized with Indalecio Sacdalan Casasola II (DPO) and PH counsel; the Privacy Policy amendment publishes only after sign-off.*
