# NPC / RA 10173 — Creator Economy & Sharing Processing Addendum

**Date:** 2026-07-17
**PIC:** SETNAYAN SOFTWARE DEVELOPMENT SERVICE — sole proprietorship of Indalecio Sacdalan Casasola II · DTI BN Reg. No. 8297508
**DPO:** Indalecio Sacdalan Casasola II · iscasasolaii@gmail.com
**Status:** **DRAFT — filing-ready baseline, NOT a substitute for legal review.** For DPO (owner) + PH counsel finalization, then folding into `NPC_Compliance/02_RoPA` + `05_DPIA_Register`.
**Purpose:** Records the *new processing* introduced by the Creator Economy + Sharing Program (shipped 2026-07-16/17) so the RoPA and DPIA Register stay complete ahead of NPC filing. Cross-refs: `Creator_Economy_Discount_Collab_Build_Plan_2026-07-16.md`, `Social_Share_Settings_Council_Verdict_2026-07-16.md`, `Privacy_Reconciliation_Home_and_Data_Flows_2026-07-13.md`.

---

## 0. Platform posture (the interpretive lens — owner-stated 2026-07-17)

Setnayan is a **self-service, self-asserted, unverified-identity** consumer platform for account holders. **It does not require government ID** and **does not authenticate the truth** of the information an account holder places about themselves (name, event details, the vendors they say they used, their story). That information is **voluntary, user-supplied, and controlled by the account holder** for the purpose of operating their own account — analogous to the posture of a general social platform. *(This is distinct from the VENDOR side — R-03 vendor verification — which DOES process government ID/liveness and is separately assessed.)*

**Consequence for this addendum:** for an account holder's **own** self-asserted data, the lawful basis is **consent + the account contract**, obligations are proportionate, and Setnayan takes no accuracy-verification role. Heightened controls apply only where processing touches **a different data subject** (chiefly *guest likenesses* in showcased media) — and there the platform relies on **consent the event already collects**, not new verification.

---

## 1. New processing activities (RoPA rows — continue the pack's R-## sequence after the last used)

| # | Processing activity | Data subject(s) | Data categories | Proposed lawful basis (counsel to confirm) | Sensitive trigger | Inherent risk | Residual (after built controls) |
|---|---|---|---|---|---|---|---|
| **R-09** | **Public creator "Chapters" + Storyteller profiles** — an account holder opts their event page public; embeds their own finished video (hosted on *their* channel, not Setnayan); credits vendors; shows a curated substrate | Account holder (self); incidentally others named/shown | Self-asserted profile + event data; a public URL slug derived from display name; embedded 3rd-party video reference | **Consent** (explicit public/hidden toggle, default OFF) + account contract | None (self-asserted) | LOW | **LOW** — opt-in default-OFF, per-account toggle, slug rename control, empty-state name-oracle closed |
| **R-10** | **Chapter→inquiry attribution + inquiry-source labels** — links a viewer's vendor inquiry to the chapter that referred it; labels the inquiry's origin for the vendor | Viewer (customer), creator, vendor | Referral linkage on the private thread; aggregate "inquiries-driven" count | **Legitimate interest** (marketplace attribution) + consent (public counters) | None | LOW–MED | **LOW** — attribution lives on the *private* thread; only *aggregate counts* public; never names the booker to the creator; provenance columns DB-locked against forgery |
| **R-11** | **Follower graph + view counters** | Account holders | Who-follows-whom (edges); aggregate view/follower counts | **Consent** (voluntary follow) + legitimate interest (counts) | None | LOW | **LOW** — follow graph **private** (Pattern-A RLS); only aggregate counts public; view counters carry **no per-viewer row** |
| **R-12** | **Vendor↔creator discount collab** — vendor spends a token to offer a creator a discount; terms exchanged; deliverable = a crediting chapter | Vendor, creator | Offer terms; token-spend ledger tags; collab status | **Contract / legitimate interest** (B2B marketplace) + consent (creator opt-out) | None | LOW | **LOW** — creator opt-out toggle (default ON to receive; can disable); terms private to the two parties + admin; creator's own rate never public; **no money held by Setnayan (0% commission, off-platform settlement)** |
| **R-13** | **Guest media in showcased teasers** — a Setnayan-hosted short teaser rendered from the event's Papic gallery photos | **Guests (third parties)** | Guests' images/likeness; the gallery derives from face-tag substrate (links to **R-01**) | **Consent of the guest** — via the *existing* event consent chain (`guests.photo_consent` at RSVP + `couple_approved_for_showcase`) | **Biometric-adjacent** (source gallery is face-tagged — see R-01) | **HIGH** (third-party likeness + biometric linkage) | **MED→LOW (post-fix)** — teaser now renders **only** showcase-approved frames; geo/EXIF stripped; **but see § 3 decision (a)** |

*(Degree Recommendation / "used around your circle" is **not** a new row — it folds under the existing **R-02 Person Graph** DPIA and remains **counsel-first / not processed**. See § 3(c).)*

---

## 2. Privacy-by-design controls already built (evidence for the residual-risk column)

Verified in shipped code by the 2026-07-17 permissions audit (20 of 24 controls present + sound):
- **Access control:** canonical RLS on every new table; owner-write / two-party-read scoping; SECURITY DEFINER RPCs re-check caller identity; privilege-escalation guard on `users`; **provenance columns DB-locked** against client forgery.
- **Consent surfaces:** per-account public/hidden toggle (default OFF); creator offer opt-out (default ON-to-receive); recap social opt-out; per-artifact `marketing_share_consents`; guest `photo_consent` + `couple_approved_for_showcase`.
- **Data minimisation:** follower graph private (counts only); view counters aggregate (no per-viewer rows); attribution never names the booker; creator's private rate never public; geo/EXIF stripped on outbound shares.
- **Admin/curation:** public featuring is admin-only, deny-by-default, audit-logged; one moderation queue; report targets for chapter/event/profile.
- **Money:** 0% commission, Setnayan holds no funds; token ledger tagged; escrow verified regression-free.

---

## 3. Decisions still requiring DPO (owner) + PH counsel — the filing-gate items

**(a) Biometric reconciliation for showcased guest media (ties R-13 ↔ R-01).** The teaser now honors the event's showcase-consent chain, so it no longer surfaces *unapproved* guest faces. The open question for counsel, framed precisely:

*Two RA 10173 controls, two distinct jobs — they pair, neither substitutes:*
- **Event-scoping = the proportionality / purpose-limitation control (§11).** Face vectors are per-event, never reused across events, used only to auto-tag *that* private gallery (enforced in code — "Face detection is per-event-scoped; vector store never reused"). This is a **strong, recognised** control and materially lowers residual risk — but it constrains *scope*, it does **not** supply the *lawful basis*.
- **Explicit consent = the lawful-basis control (§13).** Biometric data is **sensitive personal information (§3(l))**, which needs explicit consent (or another §13 basis). Event-scoping does **not** cure this; R-01's DPIA already found the RSVP-photo-upload implicit consent "likely insufficient — explicit, separate, evidenced face-recognition opt-in required."

*Primary vs secondary purpose — the line event-scoping cannot cross:*
- **Primary use** (auto-tag within the private event): fully served by event-scoping + RSVP consent. Contained, low residual risk.
- **Secondary use** (put face-tagged-derived media into a *public* teaser/showcase): a **new, incompatible purpose** — here purpose-limitation cuts *against* re-use. Event-scoping does not authorise it; the **guest showcase-consent chain** (`photo_consent` + `couple_approved_for_showcase`, now enforced in the teaser) is the control that does.

**Interim safe posture** (✅ IMPLEMENTED in code — PR #3379, 2026-07-17, auto-merging): the teaser now honors the recap path's gates exactly — **guest** captures (`papic_guest_captures`) require the double gate `consent_to_public = TRUE AND couple_approved_for_showcase = TRUE AND hidden_at IS NULL`; **seat/crew** captures use the moderation exclusion (`moderation_state NOT IN nsfw/consent/faceblock-withheld`); frames resolve geo-stripped AVIF derivatives only (never the original). Zero approved frames → the teaser renders no guest faces. This moves **R-13 residual risk MED→LOW.** Event-scoping unchanged. **The single remaining question for counsel reduces to:** *given the tight event-scoping, is the existing RSVP/showcase consent chain explicit enough to serve as the face-recognition opt-in for both the primary tagging and the secondary showcase — or must an explicit, separate biometric opt-in be added before either?* (A wording/UX change, not an architecture one; resolve alongside the R-01 face-vectors DPIA.)

**(b) Lawful-basis confirmation for R-09/R-10/R-12** — confirm the proposed bases above (consent/contract/legitimate-interest) and, where legitimate interest is cited, that the LIA (legitimate-interest assessment) is recorded. Given the self-asserted posture (§ 0), these are low-risk, but counsel should ratify the basis wording that lands in the Privacy Notice (already live and disclosing these flows).

**(c) Degree Recommendation / People layer — keep counsel-first, unwired.** Confirmed inert today (enum value only; no cross-person data flows; `NEXT_PUBLIC_DEPENDENT_PEOPLE` off). This is the one activity the self-asserted posture does **not** cover — it surfaces *other people's* activity to a user (cross-person disclosure), so it stays under R-02's counsel-first gate with the built-in **k-anonymity + "never identify who"** design. **Do not flip its flag until R-02's DPIA is DPO/counsel-signed.**

**(d) Vendor attribution (R-12 adjacent)** — a creator crediting a vendor now renders a *shoppable* card only when a real collab/booking exists (else plain text), removing the unconsented-endorsement claim. Counsel to confirm this is sufficient vs. a vendor opt-out.

---

## 4. Net effect on NPC filing

This addendum **adds no new HIGH-risk system beyond R-01/R-13's biometric linkage**, which is already in the register. Under the self-asserted posture, R-09–R-12 are LOW/residual-LOW and fold into the RoPA as consent/contract-based account-holder processing. **The single filing-gate is § 3(a)** — the biometric basis for showcasing face-tagged guest media — which should be resolved alongside the existing R-01 face-vectors DPIA. Everything else is built, controlled, and disclosed.

**Owner action:** review §§ 0 & 3 as DPO; route § 3(a)–(c) to PH counsel with the R-01 DPIA; then fold R-09–R-13 into `02_RoPA` and `05_DPIA_Register` and proceed with NPCRS registration.

*Prepared as a compliant baseline for DPO + counsel finalization. Not legal advice.*
