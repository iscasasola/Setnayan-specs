# Compliance Facts Register — Setnayan

**Date:** 2026-07-05
**Purpose:** The single source for every `[TO CONFIRM]` value across the NPC pack. Owner-supplied facts + values I could derive (live DB / code / known infra). Finalize with the DPO (the owner/proprietor) + PH counsel, then thread into the pack (or maintain via the admin Compliance page — see note at end).

> ✅ **The BIR TIN has been REDACTED from this file** (2026-07-05) — the sensitive government ID now lives only in the access-controlled **admin → Compliance** page (PR #2848), never in a repo. This file remains a working reference for the non-sensitive facts; still keep it out of any public repository.

---

## 1. Business identity — ✅ supplied
| Field | Value |
|---|---|
| PIC (legal) | **SETNAYAN SOFTWARE DEVELOPMENT SERVICE** (sole proprietorship) |
| Proprietor | Indalecio Sacdalan Casasola II |
| DTI Business Name No. | 8297508 (national · valid 25 Jun 2026 – 25 Jun 2031) |
| **BIR TIN** | **[redacted — held by owner; entered in admin → Compliance]** *(sensitive government ID; deliberately not stored in this file / any repo)* |
| Registered / principal address | **76 Sampaguita Avenue, Quezon City** *(barangay + ZIP — add if NPC form requires)* |
| NPC registration no. | *(blank until filed)* |

## 2. DPO & team — ✅ supplied
| Field | Value |
|---|---|
| DPO | **Indalecio Sacdalan Casasola II** (the proprietor/PIC also serves as DPO) · iscasasolaii@gmail.com · **already registered on the NPC DPO system (2026-07-07)** |
| DPO employment basis | Internal — the proprietor/PIC also acts as DPO (2-person founding team). ⚠ **PIC = DPO:** NPC generally prefers a DPO with autonomy from the controller; for a 2-person sole proprietorship this is commonly accepted — counsel to confirm and, if kept, note a short independence rationale in the designation sheet (doc 03). |
| DPO phone / designation date | *(to set — recommend stamping the date the manual is adopted)* |
| Total headcount | **2** — Indalecio S. Casasola II (proprietor + DPO) + Claire E. Buanhog (VP, co-founder) |
| Staff with personal-data access | Both (2 of 2) |

## 3. Scale — ⚠ RE-READ FROM LIVE DB 2026-07-31 · the 2026-07-05 figures below are STALE AND HIGH

| Data subjects | 2026-07-05 (stale) | **2026-07-31 (live)** |
|---|---|---|
| Customer accounts (`users`) | 19 | **6** |
| Vendors (`vendor_profiles`) | 50 | **2** |
| Guests (`guests`) | 332 | **39** |
| Events | 61 | **3** |
| **Active biometric face vectors** (sensitive) | **0** | **0** — `guest_face_enrollments` is empty (0 rows), `user_face_profiles` 0 |

> **⚠ The counts went DOWN by roughly 10×, which means test data was purged at some point between 2026-07-05 and 2026-07-31.** Total data subjects today = **45** (6 accounts + 39 guests), **not the "~401" quoted in `00_ADOPTION_COVER_SHEET`** and echoed through docs 01/03. Those prose figures are labelled as a *2026-07-05 pre-launch snapshot*, which keeps them defensible as history — but **do not type them into an NPC form.**
>
> ✅ **The filing itself is safe:** `/admin/compliance/data-sheet` computes every scale count **live** at render time (`data-sheet/page.tsx` → `countOf()`), so the exported sheet reports whatever is true on the day it is generated. The risk is only that a human reads the prose instead of the export. **Re-read the counts on the day you file** — do not trust any number written in this pack.
>
> The registration-threshold analysis is **unaffected**: 45 subjects and 0 biometric vectors are further below the ≥1,000-SPI trigger than the stale figures were, and the recommendation to register still rests on the **risk-to-rights + not-occasional** grounds, which are volume-independent (doc 03 § B.4).

- **Sensitive-data holders today:** 0 biometric (no active face vectors); vendors submit government IDs during verification (a subset of the 50); guest `dietary_restrictions` may reveal health/religion (special category). Counts are small + pre-launch — but per the RoPA, **NPC registration is still advised** on the *risk-to-rights + not-occasional* grounds, independent of volume.

## 4. Breach response team — ⚠ currently the 2-person team
- No external DBRT members yet. Document the 2-person structure: **DPO = the proprietor (owner)** leads; **VP (Claire E. Buanhog)** supports. Add an external PH counsel liaison when engaged.
- 24/7 escalation contacts + DPO breach hotline: *(to set — even a single mobile + the DPO email suffices to start).*

## 5. Sub-processors — ✅ derived (jurisdictions from known infra)
| Sub-processor | Role | Jurisdiction / hosting | Personal data? | DPA on file |
|---|---|---|---|---|
| Vercel | App hosting / edge | United States (global CDN) | Yes (in transit) | `[confirm]` |
| Supabase | Database (Postgres) | **Singapore** (ap-southeast-1) | Yes (PII) | `[confirm]` |
| Cloudflare R2 | Media / object storage | APAC region | Yes (photos/vectors) | `[confirm]` |
| Resend (+ SendGrid fallback) | Email | United States | Yes (email addresses) | `[confirm]` |
| PostHog | Product analytics | US **or** EU cloud — *confirm which instance* | Minimal (no PII in events; opt-out) | `[confirm]` |
| Persona / Veriff / Onfido | Vendor ID verification | US / EU | Yes (gov ID — sensitive) | `[confirm]` |
| Anthropic / OpenAI | AI features | United States | Prompt content only | `[confirm]` |
| **Suno** | Music generation | United States | **NO personal data** — text-prompt / owned-catalogue only ⇒ **not a personal-data sub-processor** | n/a |
| **Face matching** | Biometric embedding + match | **ON-DEVICE** (face-api.js / MediaPipe, in-browser); vectors stored in Supabase (Singapore). **No third-party face-matching service.** | Yes (biometric, stored) | n/a (in-house) |

## 6. Processing specifics — ✅ derived
| Question | Answer |
|---|---|
| Sensitive RSVP fields collected | `dietary_restrictions` + `meal_preference` (may reveal health / religious belief — special category). **No standalone religion or health field.** |
| Solely-automated decisions w/ legal/significant effect | **YES — one, as of 2026-07-07:** the Anti-Fraud engine (DPIA **R-08** / ROPA **DPS-12**) can **automatically suspend** a vendor's public listing at a high fraud score (**reversible**). The **irreversible** wipe/ban is NOT automated (routed through the four-eyes admin gate). AI planning features remain assistive only. See `08_DPIA_AntiFraud_Trust_Integrity_2026-07-07.md` §6 (RA 10173 §16(c)/§34) — a formal contest/appeal path is a flagged follow-up. |
| Maya Business (payment gateway) | **Not active** — dormant / V1.5 roadmap; no contract yet. Current payment is manual apply-then-pay (BDO/GCash). |
| Staff NDAs / privacy training / device policy | *(to set — for a 2-person team, a short signed confidentiality + basic-hygiene note suffices; recommend adopting.)* |
| DPIA / designation adoption dates | *(to set on adoption.)* |

## 7. Remaining true unknowns (short list for owner/DPO + Claire/VP)
1. Barangay + ZIP for the address (if the NPC form requires granularity)
2. The DPO (owner) contact phone + the designation/adoption date *(email supplied: iscasasolaii@gmail.com)*
3. PostHog instance region (US vs EU cloud)
4. Which sub-processors have a signed DPA on file
5. Whether to adopt the light NDA / training / device-hygiene notes (recommended)

---

*This register resolves the large majority of the pack's `[TO CONFIRM]` items. **Recommended next step:** move these facts into an access-controlled **admin Compliance page** (editable, admin-only, can export the NPC data sheet) — the correct secure home for the TIN + DPO details, rather than a plaintext file.*
