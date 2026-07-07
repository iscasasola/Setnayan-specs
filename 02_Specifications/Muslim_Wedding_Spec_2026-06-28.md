# Muslim Wedding Specification — Setnayan V1

**Status:** Drafted 2026-06-28 · consolidates scattered Muslim/Islamic content into one source of truth
**Owner sign-off required:** § 17 (contested rulings) + § 16 (vendor gaps to seed) before any are treated as locked
**Authoritative sources:** Code of Muslim Personal Laws of the Philippines (**Presidential Decree No. 1083, 1977**) · Office on Muslim Affairs / NCMF (National Commission on Muslim Filipinos) · Qur'an 4:4, 4:24–25, 24:32 on mahr & marriage · Shari'a Circuit/District Court rules · ITQAN Academy Muslim Marriage Rules · Setnayan internal vendor + wedding-archive data
**Cross-references:** [`0043_wedding_type_picker`](../0043_wedding_type_picker/0043_wedding_type_picker.md) · [`0044_per_category_schemas`](../0044_per_category_schemas/0044_per_category_schemas.md) · [`Vendor_Taxonomy_V1_Master`](Vendor_Taxonomy_V1_Master.md) · [`18_Concierge_Brain/01_Filipino_Cultural_Reference`](18_Concierge_Brain/01_Filipino_Cultural_Reference.md) · [`Catering_Dietary_Halal_Model_2026-06-11`](../03_Strategy/Catering_Dietary_Halal_Model_2026-06-11.md) · [`Adaptive_Checklist_Design_2026-06-17`](Adaptive_Checklist_Design_2026-06-17.md) · [`Taxonomy_Events_Faiths_Completeness_Audit_2026-06-11`](../03_Strategy/Taxonomy_Events_Faiths_Completeness_Audit_2026-06-11.md)

---

## 0. Why this document exists

Setnayan already lets a couple pick `ceremony_type = 'muslim'` end-to-end (DB enum, vocab, picker, sub-types). What's been missing is the **depth** that makes the event *work properly*: a single, sourced reference that (a) explains what a valid Islamic marriage actually requires, (b) maps every one of those requirements to a concrete product field, surface, or vendor, and (c) is honest about where Islamic practice legitimately varies so the product **offers choices instead of prescribing dogma**.

This is also Setnayan IP — like the rest of `18_Concierge_Brain`, its accuracy *is* the product. Every fact below cites a source. No anonymous "common knowledge."

> **Governing principle (locked).** Islam has multiple schools of jurisprudence (madhhab) and a wide traditional↔progressive spectrum. Filipino Muslims are predominantly **Shafi'i**, but Hanafi practice and reformist views exist. Where a ruling varies, Setnayan **surfaces the choice to the couple and defaults to the most common Filipino-Muslim (Shafi'i) practice** — it never hard-codes one ruling as "the" rule. See the existing cultural-reference rule: *"Don't prescribe interfaith solutions — they vary by family and faith leader."*

---

## 1. The two layers of a Filipino Muslim wedding

A Muslim wedding in the Philippines lives in **two layers at once**, and the product must hold both:

| Layer | What it is | Who governs it | Setnayan handling |
|---|---|---|---|
| **Religious (the Nikah)** | The Islamic marriage contract — valid in the eyes of Islam | Imam / qadi, per the couple's madhhab | Ceremony flow, roles, mahr, modesty, halal — §§ 2–9 |
| **Civil / legal (the State)** | Legal recognition under Philippine law | **PD 1083** (Code of Muslim Personal Laws), registered with the **Shari'a Circuit Court** and the local civil registrar | Legal checklist + paperwork budget line — § 12 |

**Key legal fact (PD 1083).** For two Muslims, or a Muslim man and a non-Muslim (Kitabiyya) woman, a marriage solemnized per Muslim rites and **registered with the Shari'a Circuit Court clerk (who acts as civil registrar for Muslim marriages)** is legally valid — they do **not** need a separate civil ceremony. This is why the audit found Muslim weddings are (correctly, by design) **excluded from the `civil_registrar` venue group** — the mosque/qadi route registers directly. Many couples still *choose* a separate civil wedding for portability or interfaith reasons; the product supports both via the `mixed` ceremony branch (§ 15).

> ⚠ **Document the intent in code.** The exclusion of `muslim` from `civil_registrar` currently reads as an unexplained omission. Add a code comment / admin note citing PD 1083 so a future engineer doesn't "fix" it.

---

## 2. The five validity pillars — and where each lives in the product

An Islamic marriage is valid when **five core elements** are present. Setnayan's job is to make sure a Muslim couple is *prompted for, can record, and can fulfil* each one. This is the spine of the whole feature.

| # | Pillar (Arabic) | Plain-English meaning | How Setnayan represents it |
|---|---|---|---|
| 1 | **Mutual consent — Ridā** | Both bride and groom freely agree; no coercion. | Captured in the Nikah ceremony record; the *ijab/qabul* step (§ 3). Day-of script item. |
| 2 | **The guardian — Walī** | The bride's male guardian (father, then nearest male relative) consents and represents her in the contract. | **New guest-list role** `wali` (§ 11). Required field on a Muslim event's ceremony record. Coordination checklist task. |
| 3 | **Two witnesses — Shuhūd** | At least two adult Muslim witnesses observe the contract. | **New guest-list roles** `witness_1`, `witness_2` (§ 11). Checklist task "Confirm 2 witnesses." |
| 4 | **The bridal gift — Mahr** | Mandatory gift from groom to bride; hers alone. | **Budget line item** `mahr` (already specced) + optional **Mahr Coordination Service** vendor (§ 5, § 16). |
| 5 | **The contract — Nikah (ijab + qabul)** | Offer and acceptance in one sitting, solemnized by an imam/qadi. | Ceremony-flow record + **`muslim_imam` officiant** vendor; auto-resolve when a mosque venue is picked (§ 16 gap). |

> **Design rule.** When `ceremony_type='muslim'`, the couple's planning hub shows a **"Five essentials of your Nikah" card** that checks off each pillar as it's satisfied (wali confirmed → witnesses confirmed → mahr set → imam booked → date/venue set). This is the single most important UX artifact in the whole faith track — it turns abstract religious requirements into a tangible, reassuring checklist. (Free; part of the core couple tool — never paywalled, per the seat-plan / core-tool precedent.)

---

## 3. The Nikah ceremony flow (what happens, in order)

Used to generate the **day-of schedule template**, the **coordinator brief**, and the **Concierge Brain** answer when a couple asks "what happens during the ceremony?"

1. **Khutbat-an-Nikah (sermon)** — the imam opens with a short sermon on the meaning of marriage in Islam.
2. **Confirmation of consent** — the imam confirms the bride's consent (often relayed through her wali or directly, per local practice) and the groom's consent.
3. **Ijab and Qabul (offer & acceptance)** — the formal offer and acceptance, **made in one sitting**. Customarily stated clearly; in many Filipino-Muslim ceremonies the groom repeats acceptance (commonly **three times**) before witnesses.
4. **Mahr declaration** — the agreed mahr is named and given/pledged to the bride (§ 5).
5. **Signing of the contract (Aqd-Nikah)** — the marriage contract is signed by the parties, the wali, and the witnesses; registered with the Shari'a court.
6. **Du'a (closing supplication)** — the imam offers blessings (commonly a recitation/du'a for the couple).
7. **Walima** — the public wedding feast, often a separate event, sometimes the same day (§ 6).

> **Variation flag.** Whether the bride is physically present at the contract signing, whether she speaks her own acceptance or the wali speaks for her, and the exact wording all vary by family/region/madhhab. Setnayan presents this as the **typical** flow and lets the couple annotate their own ceremony order in the schedule editor.

---

## 4. Mutual consent, the Wali, and the Witnesses (pillars 1–3)

### Consent (Ridā)
Both parties must agree **freely**. Forced marriage invalidates the nikah. Product touch-point: the consent pillar is recorded as part of the ceremony; the Concierge Brain must **never** frame any party's agreement as optional or pressured.

### The Wali (bride's guardian)
- The wali is normally the **father**; if unavailable, the order passes to the nearest adult male relative (paternal grandfather, brother, paternal uncle…). In the Shafi'i view a wali is generally required for the marriage's validity.
- **Product:** a **`wali` role** in the guest list / entourage taxonomy (§ 11), with a required-confirmation checklist task. The wali's name appears on the ceremony record and (optionally) the invitation, paralleling how ninang/ninong appear for Catholic weddings.
- **Variation flag (surface, don't decide):** schools differ on whether an adult previously-married woman may contract herself without a wali (Hanafi view), and on who serves as wali if the father has passed or is non-Muslim. Setnayan presents the standard Shafi'i default and lets the couple record their actual arrangement; the Concierge Brain answer ends with *"confirm with your imam."*

### The Witnesses (Shuhūd)
- Minimum **two adult Muslim witnesses**. **Variation flag:** the classical requirement is two men, *or* one man and two women in some schools; practice on female witnesses varies. Product offers two witness slots and does **not** enforce gender — it records who the couple's imam accepts.
- **Product:** `witness_1` / `witness_2` roles (§ 11) + a "Confirm your 2 witnesses" checklist task that unlocks the "witnesses ✓" tick on the Five-essentials card.

---

## 5. Mahr — the mandatory bridal gift (pillar 4) · deep dive

The mahr is the **groom's mandatory gift to the bride**, and it is **hers alone** — not her family's, not shared. It is one of the things that most distinguishes a Muslim wedding's planning from a Catholic/civil one, and it deserves first-class product support.

### What couples need to know
- **Mandatory, not optional.** A nikah without an agreed mahr is defective. (Qur'an 4:4.)
- **Can be financial or symbolic** — cash, gold, property, or something of meaning (even teaching/memorizing Qur'an has precedent). What matters is that it has value to the bride and she accepts it.
- **Prompt vs. deferred** — mahr can be paid in full at the contract (*mu'ajjal*, prompt) or partly/fully deferred (*mu'akhkhar*, payable on demand or at divorce/death). The split is recorded in the contract.
- **Simplicity is praised.** Per prophetic teaching, the most blessed marriages are those of least burden; an extravagant mahr is discouraged. The Concierge must reflect this — **never** push couples toward a larger mahr.

### Product handling
| Need | Surface |
|---|---|
| Record the agreed mahr (amount/description, prompt vs deferred split) | Ceremony record field on a Muslim event; feeds the **Five-essentials card** |
| Show it in the couple's money view | **Budget line item `mahr`** (already specced in 0043 downstream-impact) — *labelled as a gift to the bride, NOT a Setnayan-billable cost.* Must never be confused with platform SKUs. |
| Help couples who want guidance | Optional **Mahr Coordination Service** vendor (§ 16) — etiquette, customary ranges by ethno-cultural group, presentation logistics |
| Answer questions | Concierge Brain chunk (§ 18) |

> **Guardrail.** The mahr line is **between the couple and the bride** — Setnayan neither processes it nor takes a fee on it. Keep it visually distinct from billable platform/vendor line items so no one mistakes it for a charge. (Consistent with the vendor-payment-disclosure principle: *Setnayan doesn't hold the money.*)

---

## 6. The Walima — the wedding feast

The **walima** is the public marriage feast hosted (traditionally by the groom) to **announce and celebrate** the marriage. It is a *Sunnah* (strongly recommended), and it is the part of the wedding that looks most like the "reception" the rest of Setnayan already models — so most of the platform's existing reception machinery applies, with three Islamic overlays:

1. **Publicity is the point.** The marriage should be announced openly — this is *why* the feast exists. Setnayan's save-the-date / invitation / landing-page tooling serves this directly.
2. **Simplicity over extravagance.** Showing off is discouraged ("the most blessed marriage is the one with the least expense"). The Concierge and budget tooling must respect this — a **"keep it simple"** posture, not an upsell posture, on the Muslim track.
3. **Halal celebration + (optional) gender separation.** Halal menu, no alcohol/pork, modest entertainment, and — depending on the family's interpretation — **separated seating/areas for men and women**. See §§ 7–9.

**Product:** the walima is the couple's reception event in Setnayan. Its specific overlays drive the dietary filter (§ 8), the gender-separation seating mode (§ 9), and the entertainment/vendor filters (§ 9).

---

## 7. Modesty & dress code

Modesty governs the couple's attire, and it propagates outward to **guest-facing dress guidance** — which is a real product surface (the invitation / landing page can carry a dress code).

| Who | Expectation | Product touch-point |
|---|---|---|
| **Bride** | Modest, dignified attire; often elaborately beautiful within modesty (hijab varies by family). | Attire vendor taxonomy: *Modest Muslim Bridal*, *Maranao*, *Tausug*, *Yakan* (exist). |
| **Groom** | Modest, dignified attire — barong, suit, or ethno-cultural men's wear (e.g. men's Maranao formal, thobe). | **GAP — groom-side Muslim attire = 0 services.** Must seed (§ 16). |
| **Guests** | Modest — cover arms and legs; women may need a head scarf, especially for the religious portion in/near a mosque. | **Dress-code field** on invitation/landing + a guest-facing note; Concierge FAQ. |

> **Product addition.** Add an optional **"Dress code / modesty note"** field to the Muslim event's invitation + day-of guest card (0031). Default suggested copy (editable): *"We warmly request modest attire — shoulders and knees covered. Ladies, please bring a scarf for the ceremony."* This is a small field with outsized respect value.

---

## 8. Halal & dietary (no alcohol, no pork)

This is already modelled — Setnayan's `faith_compatibility` shared attribute group (0044) carries `halal_certified` / `halal_compatible`, and `ceremony_type='muslim'` **auto-applies a halal filter** to the catering & beverage marketplace. This spec just pins the rules the filter encodes:

- **No pork, no alcohol** anywhere in the food/beverage program. Alcohol is excluded from bar SKUs → couples are routed to **mocktail-only / alcohol-free bar** services (exist: rows 35/40/49).
- **Halal-certified vs halal-compatible** — certified = formally certified supply chain; compatible = no haram ingredients but not certified. The couple chooses how strict via the filter; default for a Muslim event = show certified first, compatible second, hide non-halal.
- **Cross-contamination awareness** (shared fryers/grills) is part of the caterer's `faith_compatibility` self-description; `allergen_aware` tag is adjacent.

**See** [`Catering_Dietary_Halal_Model_2026-06-11`](../03_Strategy/Catering_Dietary_Halal_Model_2026-06-11.md) for the graded-capability model — this spec defers to it and does not duplicate the tag schema.

---

## 9. Gender separation & entertainment (interpretation-sensitive)

**Some** Muslim families separate men and women at the walima (separate entrances, seating sections, or entirely separate halls); **many** Filipino-Muslim weddings are mixed. This is the single most interpretation-variable logistic, so it is **a couple-set toggle, never an assumption.**

| Setting | Product behavior |
|---|---|
| `gender_separation = none` | Standard seating chart. |
| `gender_separation = sections` | Seating editor offers a **men's section / women's section** split with separate role-tier rings; QR/print pack groups accordingly. |
| `gender_separation = separate_spaces` | Two linked sub-layouts (e.g. two halls); coordinator brief notes dual-flow logistics. |

- **Vendor expertise exists:** *Gender-Separated Reception Coordinators* (row 155) and *Mosque Coordinators* (row 156).
- **Entertainment:** modest, halal-appropriate. Ethno-cultural music/performance is celebrated (kulintang, singkil, pangalay — § 10) and surfaced via the relevant vendor rows; the Concierge avoids recommending anything (e.g. certain performance/alcohol-centric acts) that conflicts.

> **Locked tone.** The product presents gender separation as a **neutral logistical option the couple controls**, with zero editorializing in either direction. Default = `none` (most common), couple opts in.

---

## 10. Ethno-cultural sub-types (mandatory when `muslim`)

Per [0043](../0043_wedding_type_picker/0043_wedding_type_picker.md), picking `muslim` **requires** an ethno-cultural sub-type (`events_sub_type_required_when_muslim_or_cultural` constraint). These shape attire, music, décor, and Concierge styling — they are cultural, layered *on top of* the religious nikah, which is constant across all of them.

| Sub-type | Region / people | Signature elements | Vendor hooks |
|---|---|---|---|
| `maranao` | Lanao (Maranao) | Singkil dance, kapag-arung procession, kulintang ensemble, **okir** woodcarving motifs, malong textiles | Maranao attire, Okir décor specialists, kulintang |
| `tausug` | Sulu (Tausug) | Pangalay dance, heavy **beadwork**, paggalay performance | Tausug beadwork attire, kulintang |
| `maguindanao` | Maguindanao | Agongan/kulintang music, pangalay variations | kulintang, décor |
| `sama_bajau` | Sulu/coastal (Sama-Bajau) | Igal dance, lugu chants, coastal/maritime themes | coastal décor, performance |
| `yakan` | Basilan (Yakan) | Distinctive **Yakan weaving/textiles**, textile ceremonies | Yakan textile bridal, weaving décor |
| `general_muslim` | Any / non-specific | Generic Islamic wedding, no ethno-cultural specialty | core Muslim vendor set only |

> **The nikah is constant; the culture is the variable.** A Maranao and a Tausug wedding share the identical five pillars (§ 2) but differ entirely in attire, music, and décor. The product keeps the religious spine fixed and lets the sub-type drive the aesthetic + vendor surfacing. This also feeds the **Mood Board** (palette/motif suggestions: okir for Maranao, Yakan weave palettes for Yakan, etc.).

---

## 11. Roles & entourage taxonomy (guest-list integration)

Muslim weddings have a **different role structure** from Catholic ninang/ninong. Add these to the guest-list / entourage role taxonomy (0001) so they're pickable when `ceremony_type='muslim'`:

| Role | Required? | Notes |
|---|---|---|
| `wali` | **Required** (pillar 2) | Bride's male guardian. One. |
| `witness_1`, `witness_2` | **Required** (pillar 3) | Two adult Muslim witnesses. Gender not enforced (§ 4 variation). |
| `imam` / `qadi` | Required (officiant) | The solemnizer; usually a booked vendor (§ 16), can also be recorded as a named person. |
| `groom_representative` (wakīl) | Optional | If the groom appoints a proxy for the contract. |

The Catholic candle/cord/veil/coin sponsor roles are **suppressed** for `muslim` (they don't apply), exactly as the checklist already suppresses Pre-Cana. Conversely `wali`/`witness` roles are suppressed for non-Muslim tracks.

---

## 12. Timeline & legal checklist

**Timeline default (per 0043):** Muslim = **~6-month dual-track** (nikah + walima + halal procurement + imam booking). Generated checklist surfaces, by phase:

- **Early:** choose imam/qadi & mosque or venue · confirm wali · identify 2 witnesses · agree mahr (couple + families) · pick ethno-cultural sub-type.
- **Mid:** halal catering · modest attire (bride **and groom**) · gender-separation decision · décor/music per sub-type · guest dress-code note.
- **Legal (PD 1083):** marriage contract registration with the **Shari'a Circuit Court** clerk (civil-registrar function); marriage license requirements per local Shari'a court; **optional** separate civil registration only if the couple wants it (NOT auto-required — § 1).
- **Late / day-of:** ceremony order (§ 3) · walima logistics · coordinator brief.

**Suppressed for Muslim:** Pre-Cana, banns, CENOMAR-as-Catholic-requirement, church fee line. **Added for Muslim:** mahr line, halal-premium awareness, walima line, imam/qadi fee.

**See** [`Adaptive_Checklist_Design_2026-06-17`](Adaptive_Checklist_Design_2026-06-17.md) — that engine gates tasks on `ceremony_type`; this section specifies the Muslim task set it should emit.

---

## 13. Budget defaults

When `ceremony_type='muslim'`, the budget planner pre-fills these faith-specific lines (amounts are placeholders — prices are admin-managed, never hardcoded):

| Line | Nature |
|---|---|
| **Mahr** (gift to bride) | Couple→bride; **not** a Setnayan/vendor charge — visually distinct (§ 5). |
| Imam / qadi officiant fee | Vendor or honorarium. |
| Halal catering (walima) | Standard reception line, halal-filtered. |
| Modest attire — bride **and groom** | Two lines (groom line currently has no vendor pool — § 16). |
| Ethno-cultural performance/décor | Per sub-type (kulintang, okir, Yakan weave, etc.). |
| Shari'a court / legal registration | Paperwork line, region-varying. |

**Suppressed:** church fee, alcohol bar. **Tone:** the simplicity principle (§ 6) means the Muslim budget defaults lean modest, and the Concierge never upsells extravagance.

---

## 14. Three-surface map (architect mandate)

Every feature needs **customer + vendor + admin** surfaces *and their connections*. Here it is for the Muslim track:

### Couple (customer)
- Faith picker → `muslim` + mandatory ethno-cultural sub-type.
- **Five-essentials of your Nikah** card (§ 2) — the signature surface.
- Muslim-specific checklist (§ 12), budget defaults (§ 13), guest roles (§ 11).
- Halal-filtered vendor marketplace; gender-separation seating toggle (§ 9).
- Dress-code field on invitation/landing (§ 7); sub-type-aware Mood Board (§ 10).
- Concierge Brain answers (§ 18).

### Vendor
- Muslim-specialized categories (§ 16): imam/qadi, halal caterers, modest attire (bride **+ groom gap**), Maranao/Tausug/Yakan attire & décor, kulintang, henna, gender-sep coordinators, mosque coordinators, mahr coordination, walima specialist (gap).
- `faith_compatibility` self-tagging (halal certified/compatible) so they surface under the auto-filter.
- Officiant **auto-resolve**: picking a mosque venue should surface a `muslim_imam` (gap — § 16).

### Admin (Setnayan HQ)
- **Taxonomy editor** (`/admin/taxonomy`) governs `faith_vocab` / `event_type_vocab` — but couple-facing pickers don't yet read it (§ 16 structural gap).
- **Concierge Brain editor** (0023) — admin (Ice) fills/validates the Muslim cultural chunks (§ 18) pre-launch, ideally with an imam's review.
- **Vendor verification** — verifying halal certs, BMA/NCMF-registered imams, ethno-cultural specialists.
- **Venue seeding** — BARMM-first mosque & Muslim-friendly venue expansion (§ 16 gap).

### Connections (the wiring that makes it "work properly")
`faith picker → checklist gating → vendor halal filter → seating gender-mode → budget defaults → email templates → Concierge answers`. Today this chain is wired for Muslim **except**: officiant auto-resolve (off), and the pickers are hardcoded rather than reading `faith_vocab` (§ 16).

---

## 15. Mixed / interfaith (Muslim + X)

Handled by the existing `mixed` branch (0043): couple sets `is_mixed_ceremony=TRUE` + `secondary_ceremony_type`. Common Muslim interfaith combinations:

- **Muslim + Civil** — religious nikah *plus* a separate civil ceremony for portability/interfaith recognition (note: under PD 1083 a registered Muslim marriage is already legal, so this is a *choice*, not a requirement — § 1).
- **Muslim + Catholic** (or other) — interfaith couples; typically different days, separate officiants, distinct dietary/logistics. Under Islamic law a Muslim man may marry a Kitabiyya (Christian/Jewish) woman; a Muslim woman's interfaith marriage is treated differently across schools — **Setnayan presents options and defers to the couple's faith leaders, never adjudicates.**

For mixed events the product takes the **intersection** of constraints (e.g. halal applies if either ceremony is Muslim) and **surfaces both** ceremonies' task sets.

---

## 16. Gaps to close (from the 2026-06-11 audit + this spec)

Storage and the core journey work. These are the **content/wiring gaps** that keep the Muslim track from being fully first-class. Flagged for owner sign-off / scheduling — none are V1-scope expansions of the *product*, they're seeding + small wiring.

| # | Gap | Type | Priority |
|---|---|---|---|
| G1 | **Groom-side Muslim attire = 0 services** (bride has 4) — add men's Maranao formal, men's Tausug, thobe/modest groom wear | Vendor seeding | **High** (visible hole) |
| G2 | **Five-essentials of your Nikah card** + `wali`/`witness` guest roles + mahr/ceremony record fields | Build (couple) | **High** (the signature UX) |
| G3 | **Imam auto-resolve** when a mosque venue is picked (parity with Catholic/Civil/INC) | Wiring | Medium |
| G4 | **Walima specialist** category distinct from general halal caterers (feast-specific menu guidance) | Vendor seeding | Medium |
| G5 | **Thin venue pool** (3 mosques) — BARMM-first mosque + Muslim-friendly venue seeding | Vendor/venue seeding | Medium |
| G6 | **Document the `civil_registrar` exclusion intent** (PD 1083) in code/admin notes | Doc/comment | Low but easy |
| G7 | **Traditions guide content** — seed the Muslim Concierge Brain chunks (§ 18), validated by an imam | Content | **High** (this doc starts it) |
| G8 | **Guest dress-code / modesty field** on invitation + day-of card | Build (small) | Medium |
| G9 | **Gender-separation seating mode** in the seat editor (§ 9) | Build | Medium |
| G10 | **Pickers read `faith_vocab`** instead of 17 hardcoded TS lists (prerequisite for any new faith; benefits Muslim consistency too) | Refactor | Strategic (separate workstream) |

---

## 17. Open decisions for owner sign-off (contested rulings — do NOT lock without you)

These are points where Islamic practice legitimately varies and Setnayan's neutral-by-default posture needs your explicit blessing before launch. Per the cultural-reference governance, the product should **offer the choice and defer to the couple's imam** — confirming that's the intended stance:

1. **Female witnesses** — product offers two un-gendered witness slots (records whoever the couple's imam accepts). ✅ recommended. Confirm.
2. **Wali for previously-married brides** — product records the couple's actual arrangement, defaults to Shafi'i (wali present), Concierge says "confirm with your imam." Confirm.
3. **Gender separation default = `none`, couple opts in.** Confirm (vs. defaulting to `sections` for stricter families).
4. **Mahr never processed/feed-charged by Setnayan**, shown as a couple→bride gift line. ✅ recommended. Confirm.
5. **No separate civil ceremony auto-required** (PD 1083 registration suffices) — civil is offered as an *option* via `mixed`. Confirm.
6. **Imam review before launch** — strongly recommend an NCMF-registered imam / qadi reviews § 2–10 and § 18 before the Muslim track goes live, the way Catholic content cites the CBCP handbook. Owner to source the reviewer.

---

## 18. Concierge Brain — seed chunks (ready to paste into `01_Filipino_Cultural_Reference.md`)

These follow the existing chunk format. They **expand** the single existing "Catholic, Civil, and Muslim wedding tracks" chunk into proper Muslim depth. Admin (Ice) reviews/validates with an imam, then commits via the 0023 Brain Editor.

---

### The Nikah — Islamic marriage contract

**Tags:** nikah, muslim, islamic, ceremony-type, ijab, qabul, validity
**Applies to:** Muslim couples (`ceremony_type='muslim'`)
**Cross-ref:** Muslim_Wedding_Spec_2026-06-28.md, 05_Legal_BIR_Reference.md, 04_Planning_Timelines.md
**Source:** Code of Muslim Personal Laws (PD 1083) · Qur'an 4:4 · NCMF · ITQAN Academy Muslim Marriage Rules
**Last verified:** 2026-06-28 · Setnayan team (pending imam review)

A valid Islamic marriage (nikah) rests on five essentials: the free **consent** of both bride and groom; the **wali** (the bride's male guardian) giving consent and representing her; at least **two adult Muslim witnesses**; the **mahr** (the groom's mandatory gift to the bride, hers alone); and the **contract itself** — the offer (ijab) and acceptance (qabul) stated in one sitting and solemnized by an imam or qadi. In the Philippines this is governed by the Code of Muslim Personal Laws (PD 1083); a marriage solemnized by Muslim rites and registered with the Shari'a Circuit Court is legally recognized — a separate civil wedding is optional, not required.

#### Common follow-ups
- "Do we also need a civil wedding?" (Not legally, under PD 1083 — but some couples choose one.)
- "What if my father can't be my wali?" (The role passes to the nearest adult male relative; confirm with your imam.)
- "Can a woman be a witness?" (Practice varies by school — confirm with your imam.)

#### Caveats / what NOT to say
- Don't prescribe one school's ruling as "the" rule — Filipino Muslims are mostly Shafi'i, but practice varies; defer to the couple's imam.
- Don't treat the Muslim ceremony as needing civil validation to "count" — PD 1083 makes it legal on its own.
- Don't dismiss any pillar as optional — all five are required for validity.

---

### Mahr — the bridal gift

**Tags:** mahr, dowry, muslim, bridal-gift, budget
**Applies to:** Muslim couples
**Cross-ref:** Muslim_Wedding_Spec_2026-06-28.md, 08_Budget_Allocation_Reference.md
**Source:** Qur'an 4:4 · prophetic tradition on simplicity · NCMF
**Last verified:** 2026-06-28 · Setnayan team (pending imam review)

The mahr is a **mandatory gift from the groom to the bride** and belongs to her alone — not to her family. It can be money, gold, property, or something symbolic of genuine value to her, and it can be given in full at the wedding (prompt) or partly deferred. Islam praises **simplicity** — the most blessed marriages are those of least burden — so an extravagant mahr is discouraged. In Setnayan, the mahr appears as a budget line marked as a gift to the bride; it is never a Setnayan or vendor charge, and Setnayan never processes it.

#### Common follow-ups
- "How much should the mahr be?" (Whatever the couple/families agree — simplicity is encouraged; there's no fixed amount.)
- "Can the mahr be non-cash?" (Yes — gold, property, or something meaningful.)
- "Is the mahr the same as the dowry her family gets?" (No — the mahr is the bride's own, not her family's.)

#### Caveats / what NOT to say
- Never push a larger mahr — simplicity is the prophetic ideal.
- Don't confuse mahr with a platform cost or vendor payment.
- Don't imply the family receives the mahr.

---

### The Walima — the wedding feast

**Tags:** walima, feast, reception, muslim, halal, gender-separation
**Applies to:** Muslim couples
**Cross-ref:** Muslim_Wedding_Spec_2026-06-28.md, Catering_Dietary_Halal_Model_2026-06-11.md
**Source:** prophetic tradition (Sunnah of walima) · NCMF · Setnayan vendor data
**Last verified:** 2026-06-28 · Setnayan team (pending imam review)

The walima is the public wedding feast that announces and celebrates the marriage — a strongly recommended Sunnah. It's the Muslim wedding's "reception," with three overlays: it should be **announced publicly** (the whole point is to make the marriage known); it should favor **simplicity over extravagance**; and it must be a **halal celebration** — no alcohol or pork, modest entertainment, and, depending on the family, separate areas for men and women. Setnayan applies a halal filter to catering and beverages automatically for Muslim events, offers an optional gender-separated seating mode, and surfaces ethno-cultural music and décor per the couple's sub-type.

#### Common follow-ups
- "Do we have to separate men and women?" (It depends on your family's practice — Setnayan makes it an option you control.)
- "Can we serve alcohol for non-Muslim guests?" (A walima is a halal celebration; Setnayan routes you to alcohol-free bar options.)
- "Is the walima the same day as the nikah?" (It can be the same day or separate — both are common.)

#### Caveats / what NOT to say
- Don't assume gender separation — many Filipino-Muslim weddings are mixed; let the couple decide.
- Don't upsell extravagance — simplicity is praised.
- Don't recommend alcohol or non-halal catering.

---

## 19. Change log

| Date | Change |
|---|---|
| 2026-06-28 | Initial draft — consolidated scattered Muslim content into one sourced spec; mapped five pillars to product surfaces; catalogued audit gaps G1–G10; seeded three Concierge Brain chunks; flagged six contested rulings for owner sign-off. |
