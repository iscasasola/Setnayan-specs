# NPC / RA 10173 — Vendor AI (Auto-Reply) & Deep Search Processing Addendum

**Date:** 2026-07-22
**PIC:** SETNAYAN SOFTWARE DEVELOPMENT SERVICE — sole proprietorship of Indalecio Sacdalan Casasola II · DTI BN Reg. No. 8297508
**DPO:** Indalecio Sacdalan Casasola II · iscasasolaii@gmail.com
**Status:** **DRAFT — filing-ready baseline, NOT a substitute for legal review.** For DPO (owner) + PH counsel finalization, then folding into `NPC_Compliance/02_Records_of_Processing_Activities` + `05_DPIA_Register`.
**Purpose:** Records the *new processing* introduced by the two paid **Vendor AI add-ons** — **Vendor AI (auto-reply)** and **Vendor Deep Search** — so the RoPA and DPIA Register stay complete ahead of NPC filing. Both flows are **built but held fail-closed** behind the `/admin/data-privacy` control board (`vendor_ai_autoreply`, `vendor_deep_search`, seeded **inactive**); the `/admin/data-privacy` **Coverage & drift** panel lists both as **"privacy-sensitive, not yet declared."** Cross-refs: `Vendor_Subscription_Ladder_2026-07-22.md`, `Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md`, `Vendor_Pricing_Council_Verdict_2026-07-22.md`.

> **⚠ Do NOT flip the code coverage map to "declared" yet.** The `/admin/data-privacy` panel stays **RED** for these two controls until counsel actually folds these rows into the filed RoPA/DPIA. Marking `apps/web/lib/privacy-coverage.ts` `declaredIn` green before that would be false assurance — exactly what the panel is built to prevent. This doc is the artifact counsel incorporates; the green flip is a follow-up code change made *after* incorporation. Likewise, **the two `/admin/data-privacy` controls stay INACTIVE** until the DPO signs off (§ 4) — activating records `approved_by/at` as the RA 10173 audit trail.

---

## 0. Posture (the interpretive lens)

These are **vendor-elected, paid add-ons** a verified vendor turns on for their **own** shop. Two distinct processing shapes:

- **Vendor AI (auto-reply)** processes the **couple's** messages + event brief *on the vendor's behalf* — a delegated, automated version of what a vendor already does by hand when they read an inquiry and reply. The couple is the data subject; the lawful hook is the couple's own act of messaging that vendor (consent + the couple↔vendor contract) plus a **transparency duty** because a *machine*, not a person, is now reading and answering.
- **Vendor Deep Search** processes the **vendor's own business information** gathered from **public web sources** (the vendor's site, directory listings, review sites). The vendor is the initiator and primary subject; the heightened item is **incidental third-party PII** (e.g. a reviewer's name on a public review) that may appear in fetched pages, plus an **external subprocessor** (Anthropic web search, US) and **storage** of a structured dossier.

Both are **fail-closed**: neither runs (nor charges) until (a) its `/admin/data-privacy` control is `active` **and** (b) the vendor holds the paid entitlement **and** (for Vendor AI) the `NEXT_PUBLIC_VENDOR_AUTOREPLY_V1` master flag is on. Neither ever touches **biometric/face** data or the couple's **guest list**.

---

## 1. New processing activities (RoPA rows — continue the pack's R-## sequence; last used R-15)

| # | Processing activity | Data subject(s) | Data categories | Proposed lawful basis (counsel to confirm) | Sensitive trigger | Inherent risk | Residual (after built controls) |
|---|---|---|---|---|---|---|---|
| **R-16** | **Vendor AI (auto-reply)** — a paid, per-vendor add-on that reads the messages in the couple↔vendor chat thread **plus that couple's Event Brief** (event date, guest count, budget-per-head, venue) and **auto-answers** — and, if the vendor enables it, **auto-accepts a booking request** — on the vendor's behalf. The reply is **deterministic** (rule engine, no generative LLM) and shown to the couple labelled **"⚡ AI auto-reply."** Strictly **single-tenant**: scoped to the one vendor's own threads; never reads across vendors or events. | **Couples** (the messaging party) | Chat message text in that thread; the couple's event brief (date, pax, budget-per-head, venue); derived reply + accept/handoff decision | **Consent + contract** — the couple chose to message this vendor; the assistant answers *for* that vendor. Plus RA 10173 **§ 34** transparency for automated processing. | **None** — the assistant is **not** fed sensitive PI: no religion/civil-status/family/biometric fields enter it (couple-faith consumption stays unwired) | **MED** (automated processing of a person's messages by a machine acting for a third party) | **LOW** — deterministic (no free-text generation, no hallucinated commitments); **AI-labelled** on every reply so the couple knows it isn't a person; couple can always reach a human (every message still reaches the vendor; nothing is hidden); **single-tenant** isolation (per-vendor scope enforced in `inbox-hook.ts`); **fail-closed** behind the admin-approved control + master flag + paid entitlement; **no SPI ingress** |
| **R-17** | **Vendor Deep Search** — a paid add-on that runs **AI web research** (Anthropic `web_search`) over the **vendor's own business** across public sources (own website, listing pages, review sites) and stores a **structured business dossier** (`vendor_web_dossiers`) the vendor reviews to auto-fill their profile. | The **vendor**; **incidentally**, third parties named in fetched public pages (e.g. review authors, publicly-named past clients) | Public business facts (services, pricing signals, hours, coverage, ratings); incidentally, third-party names/quotes present on public review/listing pages; the stored dossier summary | Vendor's **consent + contract** (vendor initiates, about its own business); **legitimate interest** (RA 10173 § 12(f)) for the incidental public-web third-party content, **minimised** to a business summary and short-retention | **None inherent** (public-source business data); incidental third-party PII is public + minimised | **MED** (external AI subprocessor fetches open-web pages that may name third parties; a dossier is stored) | **LOW** — vendor's **own** business only (search inputs are the vendor's business name/site/city — never guest data, never chat); **subprocessor disclosed** (Anthropic, US — already a listed subprocessor); only a **structured summary** is stored, not raw pages; **180-day rolling retention TTL** on `vendor_web_dossiers` (cron-free purge, shipped in PR #3546); **keyless fail-safe** (no `ANTHROPIC_API_KEY` → the paid path is blocked, never charges); **fail-closed** behind the admin-approved control + paid entitlement |

---

## 2. Privacy-by-design controls already built (evidence for the residual-risk column)

Verified in shipped code this session (PRs #3517/#3525 build; #3546 hardening; #3549 the DPO gates):

- **Activation governance:** both flows live behind the admin-approved `data_privacy_controls` board (`vendor_ai_autoreply`, `vendor_deep_search`), seeded **inactive / fail-closed** (migration `20270912318857`); approving records `approved_by/at` as the permanent RA 10173 audit trail; the features read `status='active'` at runtime (no env flag needed to *hold* them off — the control is the gate). Gates: `lib/vendor-autoreply/inbox-hook.ts` (reads through the hook's own single-tenant admin client via `isDataPrivacyControlActiveWith`) and `app/vendor-dashboard/deep-search/actions.ts`.
- **Vendor AI — labelling + determinism:** every auto-reply is inserted with `is_bot=true` and surfaced to the couple as **"⚡ AI auto-reply"**; the engine is a deterministic rule set (no generative model → no invented promises); a booking-intent message is **handed off** to the human vendor, not auto-answered, unless the vendor explicitly enabled auto-accept.
- **Vendor AI — single-tenant isolation:** the hook keys every read to the one thread's `vendor_profile_id` + `event_id`; it cannot read another vendor's threads. Faith/family/biometric couple fields are **not** passed into the engine.
- **Deep Search — scope + subprocessor + retention:** inputs are the vendor's own `business_name`/`website`/`location_city`/`services` (never guest or chat data); the Anthropic web-search subprocessor is disclosed in the Privacy Notice subprocessor list; the stored dossier is a structured summary purged on a **180-day rolling TTL** (`lib/vendor-dossier-retention.ts`, cron-free); a missing API key **fail-safes** to blocking the paid run (no charge).
- **Money integrity (context):** both are apply-then-pay add-ons; a refund/reject now deactivates the entitlement; Deep Search free-runs use a race-safe atomic claim. (Not a privacy control, but confirms no silent re-processing.)

---

## 3. Public Privacy-Notice wording (proposed — added to `/privacy` for review)

Two new sections were drafted onto the public `/privacy` page (couple-facing) as the transparency artifact, mirroring the existing "Anti-fraud & trust integrity" §34 pattern:

- **"Vendor AI assistant (automated replies)"** — discloses that a vendor may enable a paid assistant that reads that thread's messages + the couple's event brief to answer (and optionally accept) automatically; that it is labelled, deterministic, single-tenant, SPI-free; and the couple's RA 10173 § 34 right to object / reach a human.
- **"Vendor Deep Search (vendor business research)"** — discloses the vendor-initiated public-web research, the Anthropic subprocessor, the "no guest/personal data sent" boundary, the incidental-public-PII minimisation, and the 180-day retention.

The `Anthropic` subprocessor line is extended to name the AI-web-research capability.

*(These are DRAFT notice wordings for counsel to confirm before the controls are activated — publishing forward-looking disclosure of a held-off feature is proper and is the prerequisite to turning it on; it does not by itself constitute the NPC filing.)*

---

## 4. Decisions still requiring DPO (owner) + PH counsel — the filing-gate items

**(a) Automated-processing transparency for Vendor AI (R-16).** Confirm the `/privacy` "Vendor AI assistant" wording satisfies RA 10173 **§ 34** (data subject informed that a decision/reply is based on automated processing) and **§ 16** (right to object / obtain human intervention). Assessment: the AI-label + always-reach-a-human + deterministic-no-commitment design is proportionate; the notice wording is the likely minimum.

**(b) Subprocessor + cross-border transfer for Deep Search (R-17).** Anthropic (US) is already a listed subprocessor. Confirm the **web-search** capability (Anthropic fetches open-web pages on our behalf) is adequately covered, that the cross-border transfer basis holds, and that a subprocessor/DPA term covers it. Confirm the **180-day** dossier retention is an acceptable class.

**(c) Incidental third-party PII in Deep Search (R-17).** Fetched public pages may name reviewers or past clients. Confirm **legitimate interest** (§ 12(f)) + minimisation (store only a business summary) + short retention is a sufficient basis, or whether the dossier must be scrubbed of third-party names on ingest.

**(d) No-SPI-ingress guarantee for Vendor AI.** Ratify that keeping the couple's faith/family/biometric fields **out** of the auto-reply engine is a hard requirement (it is, in code today) — so activating R-16 never turns the assistant into an SPI processor.

**(e) Ratify activation.** These controls are **not yet active**. DPO to sign off, then set each `/admin/data-privacy` control to `active` (reversible by un-approving). External counsel review recommended before treating activation as permanent.

---

## 5. Net effect on NPC filing

This addendum adds **no new HIGH-risk system**. R-16/R-17 are **MED inherent → LOW residual**: R-16 is automated processing of ordinary message/brief data under consent + contract with §34 transparency, deterministic, labelled, single-tenant, SPI-free; R-17 is public-source business research with a disclosed subprocessor, minimisation, and a 180-day retention. The filing-gate items are **notice wording (§ 4a)**, a **subprocessor/transfer + retention confirmation (§ 4b–c)**, and the **SPI-ingress guarantee (§ 4d)** — Privacy-Notice + RoPA/DPIA text, not an architecture change.

**Suggested DPIA Register lines (`05_DPIA_Register`):**
- *"Vendor AI (auto-reply) — automated processing of couple messages on a vendor's behalf"* — inherent MED, residual LOW (deterministic, labelled, single-tenant, SPI-free, fail-closed); DPO + counsel to ratify §§ 4(a),(d).
- *"Vendor Deep Search — AI public-web research on a vendor's own business"* — inherent MED, residual LOW (own-business scope, disclosed subprocessor, minimised dossier, 180-day TTL, fail-closed); DPO + counsel to ratify §§ 4(b),(c).

**Owner action:** review §§ 0 & 4 as DPO; route § 4(a)–(d) to PH counsel; then fold **R-16/R-17** into `02_Records_of_Processing_Activities` + add the two DPIA lines to `05_DPIA_Register`; **then** (and only then) update `apps/web/lib/privacy-coverage.ts` so `vendor_ai_autoreply` + `vendor_deep_search` point `declaredIn` at the filed RoPA/DPIA and the coverage panel goes green; **separately**, when ready to sell, activate the two `/admin/data-privacy` controls.

*Prepared as a compliant baseline for DPO + counsel finalization. Not legal advice.*
