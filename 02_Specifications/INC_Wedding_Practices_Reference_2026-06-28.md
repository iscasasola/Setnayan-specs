# Iglesia ni Cristo (INC) Wedding — Practices, Requirements & Platform Implementation Map

**Status:** Drafted 2026-06-28 · Setnayan team
**Type:** Faith reference + product-implementation blueprint
**Audience:** couples · vendors · admin · Concierge Brain content authors
**Scope:** the knowledge that makes an INC (Iglesia ni Cristo) wedding *work properly* on Setnayan — and exactly where it plugs into the live taxonomy, ceremony/officiant logic, attire & decorum rules, reception posture, and vendor catalog.

> **Naming note:** sibling to `Chinese_Wedding_Traditions_Reference_2026-06-28.md`. Titled "Practices & Requirements" rather than "Traditions" deliberately — the INC self-understanding is doctrine-and-practice, and the church explicitly distances itself from "tradition" and superstition. Couple-facing copy must respect that framing.

**Cross-ref:**
- `Taxonomy_Event_Faith_Scoping_Design_2026-06-10.md` (how `faith` + `event_type` drive the product)
- `Taxonomy_Events_Faiths_Completeness_Audit_2026-06-11.md` (INC is rated **"COMPLETE — model journey"** there; this doc deepens the content behind that rating)
- `0043_wedding_type_picker/0043_wedding_type_picker.md` (ceremony picker; `ceremony_type='inc'`)
- `18_Concierge_Brain/09_Date_Selection_Cultural_Logic.md` (date logic — and the one place INC needs a **suppression** rule, see § 5.2)
- `Vendor_Taxonomy_V1_Master.md` (where the specialist services below are tagged `INC`)
- Live code: `apps/web/lib/wedding-traditions.ts` (the `inc:` guide, 5 items today — this doc is the spec to enrich it), `lib/faith-registry.ts` (`inc` entry), `lib/officiant-auto-resolve.ts` (INC is one of 3 auto-resolving faiths)

---

## 0. Read this first — the one decision that shapes everything

> ⚠ **OWNER SIGN-OFF NEEDED — load-bearing, but the *opposite* shape from the Chinese fork.**
>
> Chinese needed a *structural* decision (overlay vs. standalone faith). **INC does not** — it is genuinely a **standalone, mutually-exclusive faith**, and the taxonomy already models it correctly (`ceremony_type='inc'`, auto-resolving `inc_minister`, `inc_counseling`, `inc_chapel`). The audit already rates INC **COMPLETE**.
>
> INC's real decision is a **posture** one: **how prescriptively should the platform default to INC's distinctive rules?** INC weddings are governed by **kabanalan (sanctity) + kapayakan (simplicity)** and a set of rules that are *stricter and more enforced than most PH faiths*: both parties must be members, modest attire is required of **guests too**, receptions are traditionally **alcohol-free and dance-free**, there is **no entourage/choir/extravaganza** inside the chapel, and — critically — **date-numerology and luck logic are doctrinally rejected.**
>
> This doc is written to the **"prescriptive defaults, advisory tone, never a hard gate"** posture (recommended): when a couple picks INC, the platform **pre-sets** the INC-appropriate defaults (alcohol-free reception, modest dress-code note on invites, entourage de-emphasized, numerology suppressed) and **explains why**, while letting the family adjust where INC practice itself allows variation (e.g., some modern receptions). It must **never block** a user or police belief — Setnayan informs and defaults, the congregation governs. See § 7 for the specific defaults that need a yes/no. **Most of the deep content below is not yet wired in; the taxonomy spine is.**

---

## 1. Doctrinal foundation — the "why" behind every rule

INC weddings rest on three load-bearing ideas. Every rule and default downstream is an expression of one of them.

1. **Kabanalan — sanctity / holiness.** Marriage is a sacred act of worship performed inside the house of worship (kapilya), under the authority of the Church. The tone is reverent, not festive-first; decorum is expected of everyone present.
2. **Kapayakan — simplicity / modesty.** Ostentation is discouraged. The wedding is deliberately *not* an extravaganza: no large entourage, no choir-as-spectacle, no costly props inside the chapel, modest attire. The focus is the vow and the worship, not the production.
3. **Unity in the faith.** Marriage is between two members of the Church. The union is expected to be *equally yoked* — both parties members in good standing — so the household is built on a shared faith. This is the rule with the hardest edge and the most product-sensitivity (see § 2).

> **Tone for the whole product when faith = INC:** warm, respectful, and *plain*. Never frame INC rules as quirky "traditions," never inject luck/superstition language, never push upsells that read as extravagance. The platform's voice: *"Here's how INC weddings are typically held — confirm the specifics with your local congregation."*

---

## 2. Membership & eligibility — the rule with the hardest edge

**The rule.** Both the bride and groom are expected to be **INC members in good standing.** Marriage to a non-member ("sumasampalataya" / one outside the faith) is not permitted within the Church rite. A non-member partner who wishes to marry within the Church first **studies the doctrine (pag-aaral / Bible studies) and is baptized** into the Church. Pre-marital guidance is provided by the ministry.

**Why it matters to the product.** This is real and load-bearing, and it is also **socially and legally sensitive.** Setnayan must **inform, never gatekeep.** The platform does not verify anyone's religion, does not block event creation, and does not expose membership status to vendors or other users.

**Platform posture (recommended — confirm in § 7):**
- When faith = INC, the Concierge/onboarding surfaces a **plain-English explainer**: *"INC weddings are held for members of the Church. If a partner is not yet a member, the local congregation can guide them through doctrinal study and baptism before the wedding — talk to your minister early, as this affects your timeline."*
- This is the **single biggest timeline driver** unique to INC: if one partner is studying toward baptism, the wedding date depends on that completing first. The **deadline/timeline engine should treat "non-member partner → baptism path" as an upstream milestone** the couple is nudged to resolve with their lokal early.
- **Hard guardrails:** no membership field stored on users, no "are you a member?" gate, no vendor visibility of any of this. Pure advisory copy + a timeline nudge.

---

## 3. The ceremony — sequenced

The INC wedding is a **single, reverent worship-rite inside the kapilya**, arranged and governed by the local congregation. Below is the spine with the Setnayan mapping. Each is a candidate `wedding_tradition_items` row (admin-editable; see § 5.3).

### 3.1 Arrangement through the local congregation (lokal)
Everything is coordinated through the **couple's local congregation (lokal)**, not booked à la carte. The **minister (officiating)** is arranged through the lokal; the couple does **not** shop for an officiant on the open marketplace. *(This is why `inc_minister` is a **marketplace-hidden, auto-resolved** officiant in the taxonomy — correct as built.)*

### 3.2 Pre-marital guidance / counseling
The ministry provides **pre-marital guidance** before the wedding. *(Modeled as `inc_counseling` — built.)* Couple-facing copy should set the expectation that this is arranged with the lokal, not a third-party vendor.

### 3.3 The venue — the kapilya (house of worship)
Held in an **Iglesia ni Cristo kapilya.** *(Modeled as `inc_chapel` ceremonial venue type, 3 registered venues today — built; venue pool is thin, flag for seeding.)* The chapel is a place of worship: decorum, dress, and conduct rules apply to **everyone present, including guests.**

### 3.4 Duration & order of service
The ceremony typically runs **~1 to 1.5 hours** and follows the Church's order of service. Conduct and the **seating arrangement are directed by officials of the local congregation** — couples and guests follow the congregation's guidance on where to sit and how to comport themselves. The seating of guests inside the kapilya is therefore **not** a free-form Setnayan seating-editor exercise; the *reception* seating is. (See § 5.5.)

### 3.5 Attire — modest & formal, **for guests too**
Dignified, formal, modest dress is **strictly expected.** Skin-revealing clothing is not allowed — **no sleeveless tops, no short dresses/skirts** — and this applies to **guests**, not just the couple and principal sponsors. This is one of the most distinctive INC rules and a frequent source of guest confusion, so it is a prime candidate for **proactive guest communication** (see § 5.4).

### 3.6 Principal Sponsors (Ninong / Ninang)
Principal sponsors are part of the rite. **If non-member principal sponsors are included, they are limited to one pair (one Ninong + one Ninang).** Member sponsors are not capped the same way. A sponsor-coordination tool must encode this **one-non-member-pair limit** and surface it when the couple builds the sponsor list.

### 3.7 No "extravaganza" inside the chapel
Consistent with kapayakan, the following are **typically not used** inside the kapilya: a **bridesmaids/groomsmen entourage**, a **choir-as-performance**, and **expensive/elaborate props.** Setnayan should **de-emphasize entourage and spectacle features by default** for INC events (not hide them destructively — default them off / collapse them, with a note explaining why).

---

## 4. The reception — reverence first, celebration second

### 4.1 Prayer before the meal
It is **standard practice to open the reception with a prayer before the meal begins.** The reception program/timeline should include a **prayer slot** at the start for INC events. *(Connects to the day-of / schedule timeline, 0031.)*

### 4.2 Alcohol & dancing — the one place practice varies
This is the **only major INC rule with genuine variation**, and the platform should represent it honestly:
- **Traditional posture:** receptions are kept **alcohol-free and without dancing** — a wholesome program and appropriate music.
- **Modern variation:** some families adopt a looser policy **depending on the family's decision** and their congregation's guidance.

**Recommended default (confirm § 7):** default the INC reception to **alcohol-free + no formal dance program**, with explicit, non-judgmental copy: *"INC receptions are traditionally alcohol-free with a wholesome program. Some families decide differently — confirm what's right for you with your family and congregation."* This default feeds **catering recommendations** (no open-bar SKUs surfaced by default), the **reception program builder**, and **vendor matching**.

### 4.3 Wholesome program & music
The reception program and music are kept **wholesome and appropriate.** This shapes:
- **Pakanta / song features & reception music** — surface appropriate, wholesome selections; never auto-suggest content at odds with the tone.
- **Entertainment vendor matching** — don't default-surface party-DJ/dance-floor-centric vendors for INC; favor program-host / acoustic / appropriate-music options.

---

## 5. Platform implementation map — admin · couple · vendor + their connections

The architect view: the knowledge above expressed as concrete surfaces and the wiring between them. (Honors the "every feature needs admin + customer + vendor surfaces **and their connections**" mandate.)

### 5.1 Faith / ceremony taxonomy (the spine) — **already coherent**
- **Today (built):** `ceremony_type='inc'` is active, pickable, storable; `inc_minister` officiant **auto-resolves** (one of only 3 faiths — catholic/civil/inc — with venue-implied officiant resolution); `inc_counseling` seminar; `inc_chapel` ceremonial venue type (3 venues); 2 visible specialist services (Modest INC bridal attire; INC-friendly/alcohol-free catering); a 5-item `inc:` traditions guide in `wedding-traditions.ts`.
- **No structural change needed.** INC is *not* an overlay case — it is a standalone faith and that is correct. The work is **content depth + prescriptive defaults**, not re-modeling.
- **Gap to close:** venue pool is thin (3 chapels); seed more `inc_chapel` venues alongside marketplace growth (audit § venue-thinness already flags INC + Muslim as priority since their journeys are otherwise complete).

### 5.2 Date logic — the **suppression** rule (unique to INC)
Unlike Chinese (which *adds* numerology/BaZi cautions) and consistent with Catholic, **INC doctrine rejects luck/superstition.** Therefore, when faith = INC, the Concierge date layer must **NOT** surface:
- lucky/unlucky numbers (8/6/9/4),
- Ghost Month avoidance,
- BaZi / astrological compatibility,
- any "auspicious date" framing.

**Action:** in `18_Concierge_Brain/09_Date_Selection_Cultural_Logic.md`, gate the cultural-numerology layer so it is **skipped for `inc` (and `catholic`/`civil`)**. The INC date driver is **practical, not mystical**: congregation/minister availability, the baptism-path milestone (§ 2), and venue booking. Author a short INC date chunk that says exactly that.

### 5.3 Practice checklist (`wedding_tradition_items` → couple `/paperwork` + planning)
Enrich the existing `inc` guide rows (admin-editable; currently 5 short items) with the § 2–4 depth. Proposed rows, each with "what it is / who's involved / when / what to prepare":

`lokal_arrangement` · `inc_pre_marital_guidance` · `kapilya_ceremony` (incl. ~1–1.5h + congregation-directed seating/decorum) · `modest_attire` (the guest-inclusive dress rule) · `principal_sponsors` (one-non-member-pair limit) · `simplicity_no_entourage` · `reception_prayer` · `reception_posture` (alcohol/dancing variation copy).

> **High-value, low-cost couple tools to consider:** (a) a **guest dress-code note generator** (§ 5.4); (b) a **sponsor-list builder that enforces the one-non-member-pair limit** (§ 3.6). Both are genuinely useful and distinctly INC.

### 5.4 Guest communication (invitation site 0002 · RSVP · email 0028)
The **modest-attire rule applies to guests**, so it should ride on guest-facing surfaces automatically for INC events:
- **Invitation site / RSVP (0002):** auto-include a clear, gracious **dress-code line** — *"In keeping with the ceremony, we kindly ask guests to wear modest, formal attire (no sleeveless tops or short dresses/skirts)."*
- **Email templates (0028):** the wedding-day reminder / RSVP-received templates carry the same note for INC events.
- This is the single highest-leverage couple-facing addition: it prevents the most common real-world INC-wedding friction (guests turned away or uncomfortable at the chapel).

### 5.5 Seating & creative SKUs
- **Seating editor (0008):** the **reception** seating is the editable surface; the **kapilya** seating is congregation-directed, so don't present chapel seating as a free-design canvas for INC. Keep reception table planning fully available.
- **Entourage / spectacle features:** default **off / collapsed** for INC (no bridesmaids-groomsmen line-up by default, no choir-as-performance module), with an explanatory note. Never hard-delete — a family can re-enable.
- **Monogram / invitation / Save-the-Date / LED / mood board:** keep styling **tasteful and restrained** for INC — offer modest, elegant defaults; avoid loud "extravaganza" template variants as the default selection. (Couples can still choose freely.)

### 5.6 Vendor / service taxonomy (`INC`-tagged leaves)
INC's ethos is *fewer, appropriate* specialists — resist the urge to mint a long SKU list (that would cut against kapayakan). Keep/confirm the built leaves and add only what genuinely serves an INC couple:
- **Modest INC bridal attire** *(built)* — confirm groom-side coverage (the audit flags groom-side attire as ZERO across faiths).
- **INC-friendly / alcohol-free catering** *(built)* — distinct from open-bar catering; should be the **default** catering surface for INC.
- **Candidate adds (owner to approve):** modest formalwear for the entourage/sponsors; restrained floral & chapel-appropriate styling; reception **program host / appropriate-music** entertainment (in place of party-DJ). Each carries a sample photo per the "refinements" pattern and feeds the leaf-match contract.

### 5.7 Surface-by-role summary
| Role | What they get | Connected to |
|---|---|---|
| **Couple** | INC defaults pre-set (alcohol-free reception · modest-attire guest note · entourage de-emphasized · numerology suppressed) · practice checklist (§ 3–4) · sponsor-limit-aware list builder · baptism-path timeline nudge · congregation-arranged minister/counseling explainer | taxonomy (5.1) · date suppression (5.2) · `wedding_tradition_items` (5.3) · guest comms (5.4) · marketplace leaves (5.6) |
| **Vendor** | INC-tagged leaves to list under (modest attire · alcohol-free catering · restrained styling · appropriate-music entertainment) · surfaced to INC couples by leaf-match | taxonomy leaves (5.6) · leaf-match contract |
| **Admin** | Edit INC practice rows (`/admin/wedding-traditions`) · author the INC date-suppression chunk (single-admin) · approve any new INC vendor leaves · seed more `inc_chapel` venues | governance rules (Concierge README) · taxonomy governance queue · venue seeding |

---

## 6. Current built state vs. this spec (honesty check)

> ✅ **SHIPPED 2026-06-28 (PRs [#2311] + [#2315], auto-merge).** The autonomous build pass landed the high-value, low-risk deltas below. Status column updated. Two items remain deferred (membership/baptism timeline nudge; entourage default-off) and the taxonomy/vendor-leaf adds stay parked for governance per § 7.

| Area | Status | Notes |
|---|---|---|
| Ceremony/officiant taxonomy | ✅ pre-built | `inc` + auto-resolving `inc_minister` — correct as built, no change |
| Counseling | ✅ pre-built | `inc_counseling` |
| Venue | ✅ pre-built | `inc_chapel` (3 venues); venue seeding still a content task; chapel-seating ≠ free-design (documented) |
| Traditions guide | ✅ **SHIPPED #2311** | deepened `inc:` rows (§ 3–4): lokal, ~1–1.5h congregation-directed, modest-attire-for-guests, sponsor one-pair limit, simplicity, prayer-first/alcohol-free reception |
| Date logic | ✅ **SHIPPED #2311** | numerology + astrology suppressed for `inc` (`auspicious-date.ts`). INC-only by design — Catholic keeps its intentional folk-numerology overlay; no Ghost-Month/BaZi exists in code (Concierge-markdown only) |
| Guest attire comms | ✅ **SHIPPED #2311 + #2315** | dashboard dress-code **prefill** (#2311) + public-invite empty-state **modest-attire note** for INC (#2315). (Email-template variant not yet wired — minor) |
| Reception defaults | ⚠ **SHIPPED #2315 but INERT** | INC reception spine added to `schedule.ts` (prayer-led, wholesome, no dance set) — correct + ready, BUT the day-of seed (`seedDefaultScheduleBlocks`) is **pre-existing dead code, never called**, so no event auto-gets a seeded timeline today. The INC reception posture IS delivered live via the enriched `/paperwork` guide; the schedule spine activates if/when the seed is wired (separate platform decision). |
| Sponsor one-pair limit | ✅ **SHIPPED #2315** | advisory note on the guest role picker for INC (`guests/[guestId]`) |
| Planning checklist | ✅ **SHIPPED #2331** | INC-specific checklist items (`isIncCeremony` gate): lokal coordination · ministry pre-marital guidance · minister/chapel confirmation. Catholic-worded items (Pre-Cana/banns/canonical interview) correctly stay hidden from INC; INC items never leak into Catholic. |
| Membership/baptism timeline | ⚠ partial | advisory copy IS in the guide (#2311); a dedicated timeline-milestone nudge is **deferred** (§ 7.2) |
| Entourage/spectacle default-off | ⛔ deferred | guide documents it; auto-defaulting entourage roles off is **not** built (would touch shared role-set logic — parked, § 7) |
| Vendor specialist leaves | ⛔ deferred | governance + INC-simplicity + founder-only marketplace → parked (§ 7.5); de-faith lock forbids faith-tagging catering |

---

## 7. Open decisions for owner sign-off

> **Build status (2026-06-28):** under the owner's standing full-authority directive, the recommended posture was adopted and the safe high-value deltas shipped (PRs [#2311] + [#2315]). Items 1, 3, 4, 6 below are **RESOLVED / SHIPPED** (decisions taken as recommended); items 2 and 5 remain **OPEN** (deferred, see notes). Any of the shipped defaults can be reverted by owner request.

1. ✅ **RESOLVED (shipped) — Posture:** adopted **"prescriptive INC defaults + advisory tone + never a hard gate."** Shipped: numerology/astrology date-suppression (#2311), modest-attire note on dashboard + public invite (#2311/#2315), prayer-led/no-dance reception program (#2315). *Refinement vs. the original list:* numerology suppression is **INC-only** (Catholic intentionally keeps its folk-numerology overlay); there is no Ghost-Month/BaZi in code to suppress. Entourage *default-off* was NOT shipped (see item below) — the guide documents it instead.
2. ⚠ **OPEN — Membership/baptism handling (sensitive — § 2):** the **inform-only** stance is live as advisory copy in the guide, but a dedicated **timeline-milestone nudge** for a non-member partner's baptism path is **not built** (it implies most INC couples have a non-member partner, which they don't; and there's no stored field to trigger it — by design). Confirm: leave as advisory copy only, or build an opt-in nudge? Lock remains: **no stored membership field, no gate, no vendor visibility.**
3. ✅ **RESOLVED (shipped) — Sponsor one-non-member-pair limit (§ 3.6):** surfaced as an advisory note on the guest role picker (#2315). Not DB-enforced (intentional — it's a guideline, not a hard cap).
4. ✅ **RESOLVED (shipped) — Reception posture default (§ 4.2):** alcohol-free + no-dance is now the **seeded reception program** for INC (#2315), editable by the couple. A separate "catering matching hides open-bar SKUs" rule was **not** built — there is no per-faith catering matcher today, and the **de-faith lock (2026-06-11) forbids faith-tagging food/catering**. Reception posture lives in the schedule + guide instead.
5. ⚠ **OPEN — Vendor leaves (§ 5.6):** **deferred** (recommend declining most, to honor INC simplicity). Rationale: the marketplace is founder-only (no vendors to populate new leaves), the groom-attire gap is platform-wide (all faiths), and the de-faith lock blocks a faith-tagged catering leaf. Revisit alongside the platform-wide groom-attire fix + marketplace growth.
6. ✅ **RESOLVED (shipped) — Date-suppression (§ 5.2):** numerology + astrology gated off for `inc` (#2311). **Catholic/civil deliberately NOT suppressed** — the code intentionally surfaces folk-numerology for Catholic couples ("folk observance alongside the sacrament"); honoring that intentional design rather than over-applying the gate.

> The taxonomy spine (§ 5.1) is live and correct. The §§ 3–4 + 5.2–5.5 deltas are now **shipped** (PRs #2311 + #2315); §§ 5.6–5.7 vendor/admin-governance items remain parked per items 2 + 5 above.

[#2311]: https://github.com/iscasasola/setnayan-platform/pull/2311
[#2315]: https://github.com/iscasasola/setnayan-platform/pull/2315

---

## 8. Sources & sensitivity note

- **User-supplied brief (2026-06-28)** — members-only union, modest attire (incl. guests), one non-member sponsor-pair limit, no entourage/choir/extravaganza in the chapel, ~1–1.5h ceremony, congregation-directed conduct/seating, reception alcohol/dance variation, prayer before the meal.
- **Existing corpus/code:** `Taxonomy_Events_Faiths_Completeness_Audit_2026-06-11.md` (INC = COMPLETE), `wedding-traditions.ts` (`inc:` guide), `faith-registry.ts`, `officiant-auto-resolve.ts`.

> **Sensitivity / verification gate (build-for-long-term):** INC is a real church with an official position on how its weddings are conducted, and its doctrine and decorum are governed by the Church, not by Setnayan. **Before any couple-facing INC copy ships, verify wording with a named INC member/authority** (per Concierge Brain governance: every chunk cites a named source). The platform must never *state doctrine as fact on the Church's behalf*, never gatekeep belief, and always defer the specifics to the couple's local congregation. Frame everything as *"typical INC practice — confirm with your lokal."*
