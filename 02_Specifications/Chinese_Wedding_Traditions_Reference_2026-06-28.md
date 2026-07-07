# Chinese (Tsinoy) Wedding Traditions — Reference & Platform Implementation Map

**Status:** Drafted 2026-06-28 · Setnayan team
**Type:** Cultural reference + product-implementation blueprint
**Audience:** couples · vendors · admin · Concierge Brain content authors
**Scope:** the knowledge that makes a Chinese-tradition wedding *work properly* on Setnayan — and exactly where that knowledge plugs into the live taxonomy, date logic, ritual checklist, and vendor catalog.

**Cross-ref:**
- `18_Concierge_Brain/09_Date_Selection_Cultural_Logic.md` § Layer 2 (Chinese numerology — already shipped; this doc extends it with BaZi + ritual logic, does **not** duplicate it)
- `Taxonomy_Event_Faith_Scoping_Design_2026-06-10.md` (how `faith` + `event_type` drive the product)
- `Taxonomy_Events_Faiths_Completeness_Audit_2026-06-11.md` (the "Chinese is an active-but-empty dead-end" finding this doc closes)
- `0043_wedding_type_picker/0043_wedding_type_picker.md` (ceremony picker + secondary-ceremony / mixed-rite axis)
- `Vendor_Taxonomy_V1_Master.md` (where the specialist services below get tagged)

---

## 0. Read this first — the decision that shapes everything (DECIDED 2026-06-28)

> ✅ **OWNER-DECIDED 2026-06-28 — model (A): Chinese = a cultural OVERLAY on a primary rite.** Today the taxonomy models "Chinese" as a standalone faith parallel to Catholic/Civil/Muslim (active since migration `20260804000000`); the 2026-06-11 audit called that *incoherent*. The owner accepted the recommendation: **"Chinese tradition" is a *tradition layer* that attaches on top of a chosen primary ceremony (Catholic / Christian / Civil), via the existing mixed-/secondary-ceremony axis in 0043 — not a mutually-exclusive faith.** A pure Taoist/Buddhist-led ceremony remains expressible as a *primary* ceremony type. This matches Tsinoy (Chinese-Filipino) reality: a Tsinoy wedding is a church/civil rite PLUS tea ceremony, ang pao, double-happiness, lauriat, and auspicious-date discipline.
>
> **Also locked:** BaZi posture = **advisory + delegate-to-specialist, never compute a verdict** (§ 2.3). The remaining build choices (temple venue type, tea-ceremony helper, vendor leaves) are adopted at the recommendation in § 6 and staged as code PRs. **The corpus/spec side is done; the code side (migrations, seeds, venue type) is build-ready and ships via the repo worktree+PR workflow.**

---

## 1. Cultural foundation — the "why" behind the rules

Chinese weddings rest on three load-bearing ideas. Every rule, taboo, and ritual downstream is an expression of one of them.

1. **Cosmic compatibility & timing** — the union must be *astrologically sound* and held on an *auspicious date*. (Four Pillars / BaZi, Five Elements, Tong Sing almanac, numerology.)
2. **Family lineage & filial piety** — marriage joins two *families*, not two individuals. The rituals publicly enact respect for elders and the welcoming of the couple into each lineage. (Tea ceremony, betrothal gifts, hair-combing by an elder.)
3. **Auspicious symbolism & warding off misfortune** — color, number, object, and word-sound choices are curated to invite blessing (双喜 double happiness, red, gold, the number 8) and repel bad luck (the number 4, mourning proximity, "broken" or "empty" symbolism).

> **Tsinoy note (important for a PH-first product):** the Chinese-Filipino community is predominantly **Hokkien** (Minnan / Fujian origin), so the everyday vocabulary is Hokkien, not Mandarin — *ang pao* (紅包), *lauriat* (the banquet), *ti-nïu* etc. Many mainland practices below (hair-combing, bridal-bed jumping, formal BaZi fortune-telling) are observed **variably** in the Philippines — strongly in traditional families, lightly or symbolically in modern urban ones. The **near-universal** Tsinoy practices are: **the tea ceremony, ang pao, double-happiness decor, the lauriat banquet, and avoidance of the number 4.** The platform should treat the rest as *opt-in* ritual modules, never as mandatory steps.

---

## 2. The Four Pillars of Destiny (BaZi / 八字) — compatibility & date selection

### 2.1 What it is

A person's destiny is mapped from the **exact year, month, day, and hour of birth** — the **Four Pillars (四柱 sì zhù)**. Each pillar carries two characters: a **Heavenly Stem (天干 tiān gān)** and an **Earthly Branch (地支 dì zhī)** — eight characters total, hence **八字 BaZi** ("eight characters"). Each character maps to one of the **Five Elements (五行 wǔ xíng): Wood (木) · Fire (火) · Earth (土) · Metal (金) · Water (水).**

### 2.2 The two uses at a wedding

**A. Couple compatibility check.** A fortune teller (or a Tong Sing-literate elder) reads the bride's and groom's two BaZi charts together to see whether their Five Elements **balance** (one partner supplies what the other lacks) or **clash** (conflicting elements that fold-lore says foretell friction). The aim is complementarity.

**B. Auspicious-date selection (the most important use).** The chosen wedding **day, month, and year** must be auspicious for *both* the bride's and the groom's zodiac signs/charts, actively avoiding *clashes* (相沖 xiāng chōng) believed to bring hardship. This is more granular than the number-numerology layer Setnayan already documents — it's chart-specific, not just "does the date contain an 8."

### 2.3 How Setnayan handles it (design posture — LOCKED to "advisory, never blocker")

Setnayan does **not** ship a BaZi calculation engine in V1, and **must not gate** date selection on astrology. The product posture is **transparency + advisory**, consistent with the existing date philosophy ("the date is an OUTPUT of vendor discovery; cultural logic is surfaced as reasoning the couple weighs"):

- **V1 (ship-now):** Surface BaZi as an *educational + delegation* layer. When a couple's profile indicates Chinese tradition, the Concierge explains what a BaZi date-check is, why families value it, and offers a **"Consult a date specialist"** path that routes to a vendor-taxonomy leaf (§ 5: *Feng-shui / Date Consultant*). The couple's chosen candidate dates (`events.date_candidates[]`, already schema'd) get annotated with the **number-numerology layer that already ships** (8/6/9 good, 4 bad, Ghost Month caution) — not a chart computation.
- **V1.x (optional):** a lightweight, clearly-labeled "auspicious date scorer" that flags number-numerology + Ghost Month + lunar conflicts. **Never** a hard filter; always "here's the reading, you decide."
- **Out of scope for V1:** computing actual Four-Pillar charts or element-clash verdicts. That is fortune-teller territory; we *connect* the couple to one, we don't impersonate one. (Avoids both accuracy risk and the "app is telling me my marriage is doomed" failure mode.)

> **Caveat / what NOT to say:** never render a deterministic "your charts clash / your marriage will fail" verdict. The platform's voice is *"many Chinese-Filipino families consult a specialist for this — here's how, and here's what they look at."*

### 2.4 Data capture — birthdays (and birth *times*) matter

BaZi is computed from **birth year + month + day + HOUR** for *both* partners — so honoring the Chinese layer properly means the platform can, optionally, capture each partner's **date of birth and approximate time of birth.** The birth *hour* (the "hour pillar") is the piece most people don't have memorized; it's on the PSA birth certificate or known by a parent. This single data point is what separates a real BaZi reading from generic number-numerology — which is exactly why a Chinese-tradition wedding "cares about the birthday."

**Where it lives & the rules (locked):**

- **New optional fields** on the couple/partner profile: `partner_birth_date` and `partner_birth_time` (per partner — bride + groom). Both **opt-in**, surfaced **only** when the Chinese overlay is on or the couple starts the auspicious-date flow.
- **Purpose-limited & consented (RA 10173).** Birth time is sensitive personal data with no other product use. Capture it only for the date-check feature, with an explicit purpose notice, store it encrypted-at-rest, never display it on any public/guest surface, and include it in the data-export + deletion flows (0025 Privacy & Data).
- **Two uses:** (1) hand the birth date/time to the **date / feng-shui specialist** (vendor leaf) the couple is routed to; (2) drive a derived, non-sensitive **zodiac animal + element** label the Concierge can reference for educational color. The app still **does not** compute a clash verdict.
- **Never required.** A couple can plan a Chinese-overlay wedding with zero birth data — they just don't get the BaZi date-check, only the number-numerology + Ghost-Month layers that already ship.

> This is the concrete answer to "Chinese's birthday matters for them": yes — and we capture it carefully, optionally, and only to *connect them to a specialist*, never to pass judgment on the marriage.

---

## 3. The rites & rituals — sequenced

The canonical Chinese wedding is a **sequence of family rites**, not a single ceremony moment. Below is the spine, in rough order, with the Setnayan ritual-module mapping. Each is a candidate **`wedding_tradition_items`** row (admin-editable; see § 5.3).

### 3.1 Betrothal gifts — 過大禮 *guò dà lǐ* (Hokkien Tsinoy: "tea-pai" / *pang-tiⁿ*)

The groom's family formally presents gifts to the bride's family — traditionally gold jewelry, money in red envelopes, auspicious foods (e.g., wine, tea, pastries, sometimes a roast pig), and paired/even-numbered items symbolizing "things come in pairs." The bride's family reciprocates with **return gifts**, often of lesser value, signalling acceptance and grace. In the Philippines this is frequently compressed and modernized but the **gold + ang pao** core persists. *Even numbers throughout; the number 4 is excluded.*

### 3.2 Hair-combing ceremony — 上頭 *shàng tóu*

The **night before** the wedding, a respected female elder ("a good-fortune woman" — married, with living children, considered lucky) combs the bride's (and separately the groom's) hair **exactly four strokes**, each stroke a spoken blessing:

1. First stroke — *from beginning to end* (a union that lasts a lifetime)
2. Second stroke — *harmony from now to old age* (growing old together)
3. Third stroke — *sons and grandsons* (abundance of descendants)
4. Fourth stroke — *wealth and a long-lasting marriage*

(Note: this is the **one** sanctioned use of "four" — four blessings — and is unrelated to the number-4 death taboo, which governs *dates and quantities of objects/money*.)

### 3.3 Bridal-bed installation — 安床 *ān chuáng*

The marital bed is set up in an **auspicious position and on an auspicious date/hour** (often chosen via the almanac), dressed in red and gold, and scattered with fertility symbols — dates (棗 *zǎo*), peanuts (生 *shēng*), longans, lotus seeds, pomegranates (the pun chain reads "*birth of children soon and continuously*"). Young **virgin boys** are invited to roll/jump on the bed to encourage the birth of sons. Until the wedding night, the made-up bed is ideally not slept in or sat on by others.

### 3.4 Tea ceremony — 敬茶 *jìng chá* (THE core rite)

The defining ritual and, in the Philippines, **near-universal even in otherwise Westernized Tsinoy weddings.** The couple **kneels and serves tea to their elders in strict order of precedence** — the **groom's side first** (parents, then grandparents, then senior aunts/uncles, outward by seniority), **then the bride's side.** Serving tea signifies respect, filial piety, and the **official welcoming of the new spouse into each family.** In return, elders drink, offer a blessing, and give the couple **ang pao (red envelopes) or gold jewelry.** Sweet additions to the tea — lotus seeds, red dates — pun toward "a sweet union and early children."

The **order of precedence is socially load-bearing**: getting it wrong (serving the bride's parents before the groom's, or an aunt before a grandparent) is a real faux pas. Any Setnayan tea-ceremony aid must produce a **correct serving order list** from the family roster.

### 3.5 The banquet — *lauriat* (酒席 *jiǔ xí*)

The reception is a multi-course Chinese banquet ("lauriat" in PH usage). It carries its own auspicious-food grammar (whole fish 魚 *yú* ~ *surplus/abundance*; whole chicken ~ *family unity & a complete/good start*; long noodles ~ *longevity*; lotus-seed/red-bean desserts ~ *fertility & sweetness*; suckling pig). **Toasts ("yam seng")**, seating hierarchy (elders and principal families closest to the couple's table), table **numbering that skips 4**, and red-and-gold styling are all governed by the symbolism rules in § 4.

### 3.6 Other modules (commonly modernized / optional)

- **Door games (闖門 / "gatecrashing")** — the groomsmen "earn" entry past the bridesmaids with tasks/ang pao before the groom fetches the bride. Modern, fun, increasingly common at Tsinoy weddings.
- **Bridal fetching & umbrella / rice-and-fan rituals** — regional variants; treat as optional.
- **Reverse / return visits (回門 *huí mén*)** — the couple's return to the bride's family days after the wedding.

---

## 4. Taboos & auspicious rules — the guardrails

These are the rules the platform must *respect in its own UI* (e.g., never auto-assign table #4) and *surface to couples*.

| Rule | Detail | Platform obligation |
|---|---|---|
| **Avoid 4 (四 *sì* ~ 死 *sǐ*, "death")** | No weddings on 4-heavy dates; **no table #4**; never put ₱-amounts ending in obvious 4s in ang pao; avoid 4 of anything. | **Seating editor must skip / warn on table number 4.** Date layer already flags 4-heavy dates (`09_…md`). Ang-pao guidance copy. |
| **Favor 8 (八 *bā* ~ 發 *fā*, "prosper")** | Most coveted number — dates, table counts, ang pao amounts, guest counts. | Date layer already favors 8/6/9. Optionally surface "lucky" table-count nudges. |
| **Even numbers / things in pairs** | Gifts, courses, decor come in pairs; "good things come in twos." Odd numbers (except auspicious singletons) read as incomplete. | Betrothal-gift checklist defaults to even quantities. |
| **Avoid mourning proximity** | A wedding within (typically) **100 days — and conservatively up to a year — of a funeral / death of an immediate family member** is taboo; some families postpone. | Date-selection caution chunk (new — see § 5.2). Advisory only. |
| **Ghost Month avoidance** | 7th lunar month (Aug–Sep, shifts yearly) avoided for weddings. | **Already shipped** in `09_…md`. |
| **Color** | **Red & gold** = joy, luck, prosperity. **White & black** historically = mourning/funeral (modern Tsinoy couples *do* wear white gowns for the church rite, but Chinese-rite styling leans red). | Mood-board / styling defaults for the Chinese layer skew red-gold; don't hard-block white. |
| **囍 Double Happiness** | The 双喜 glyph is *the* wedding sigil — invitations, decor, ang pao, backdrop, gifts. | Monogram / invitation / decor templates should offer a 囍 motif for the Chinese layer. |
| **Broken / sharp / "cutting" gifts** | Clocks (送鐘 ~ "attending a funeral"), knives/scissors (cutting the relationship), shoes, umbrellas, pears (分 ~ separation) are taboo gifts. | Gift-etiquette guide content. |

---

## 5. Platform implementation map — admin · couple · vendor + their connections

This is the architect view: the same knowledge above, expressed as concrete surfaces and the wiring between them. (Honors the "every feature needs admin + customer + vendor surfaces *and their connections*" mandate.)

### 5.1 Faith / event-type taxonomy (the spine)

- **Today:** `faith = 'Chinese'` is an active, storable, pickable value but a **content dead-end** — 0 tagged specialist services, no temple `venue_type`, no traditions guide, generic faith-NULL tea bar (per 2026-06-11 audit).
- **Recommended model (see § 6):** keep a couple's **primary ceremony** (Catholic / Christian / Civil / Taoist / Buddhist) and attach **"Chinese tradition"** as an **overlay flag** via the existing **mixed-/secondary-ceremony axis in 0043**, rather than as a mutually-exclusive faith. A pure Taoist/Buddhist-led Chinese ceremony remains expressible as a *primary* ceremony type.
- **Gap to close either way:** define a **`temple` (and optionally `ancestral-hall`) ceremonial venue type** — onboarding already promises a 🛕 Temple card the platform currently can't deliver (`VENUE_TYPES` hardcoded to 6; audit finding).

### 5.2 Date logic (Concierge Brain extensions)

Existing `09_Date_Selection_Cultural_Logic.md` § Layer 2 already ships **lucky 8/6/9 · avoid-4 · Ghost Month.** Author **two new chunks** in that file (same template, single-admin authority, cited source):

1. **`Layer 2 — Four Pillars / BaZi date & compatibility (delegated)`** — explains BaZi, frames it as specialist-consulted, routes to the date-consultant vendor leaf. Advisory, never a verdict.
2. **`Layer 2 — Mourning-proximity avoidance`** — the 100-day/1-year post-funeral taboo as a gentle date caution.

### 5.3 Ritual checklist (`wedding_tradition_items` → couple `/paperwork` + planning surfaces)

Seed admin-editable rows (faith-tagged `Chinese` / overlay) for the § 3 spine, each with a short "what it is / who's involved / when / what to prepare":

`betrothal_gifts` · `hair_combing` · `bridal_bed_install` · `tea_ceremony` · `lauriat_banquet` · `door_games` (optional) · `return_visit` (optional).

**The tea-ceremony row is the high-value one** — pair it with a **tea-ceremony serving-order helper** that reads the couple's family roster and outputs the correct precedence list (groom's side → bride's side, by seniority). This is a genuinely useful, low-cost couple tool and a natural Setnayan "signature moment" for the Chinese layer.

### 5.4 Vendor / service taxonomy (canonical leaves to add + tag `Chinese`)

Per `Vendor_Taxonomy_V1_Master.md`, the Chinese layer needs specialist leaves so couples can actually *find* the right vendors (closing the "0 tagged services" gap):

- **Date / feng-shui consultant** (BaZi date-check, bridal-bed siting)
- **Lauriat / Chinese banquet caterer** (distinct from generic catering)
- **Qipao / qun-kua (裙褂) attire** — bridal cheongsam, traditional embroidered two-piece, groom's tang-suit
- **Tea-ceremony set & styling** (tea set, kneeling cushions, red-and-gold ceremony backdrop)
- **囍 Double-happiness decor / calligraphy / signage**
- **Betrothal-gift & ang-pao supplier** (gold, gift baskets, red envelopes, dragon-phoenix candles)
- **Lion/dragon dance troupe** (banquet entertainment)

Each leaf carries a sample photo (per the "refinements" pattern) and feeds the couple's marketplace + the AI matchmaking leaf-match contract.

### 5.5 Symbolism into the existing creative SKUs

- **Seating editor (0008):** enforce the **no-table-4** rule (skip/warn); offer Chinese-rite table styling.
- **Monogram / invitation / Save-the-Date / LED:** offer a **囍 double-happiness** + red-gold variant for the Chinese layer (ties into the animated-logo surface rollout).
- **Mood board (0010):** red-gold palette defaults under the Chinese layer; don't hard-block white.

### 5.6 Surface-by-role summary

| Role | What they get | Connected to |
|---|---|---|
| **Couple** | Chinese-tradition overlay on their primary ceremony · ritual checklist (§ 3) · tea-ceremony serving-order helper · date cautions (4 / Ghost Month / BaZi / mourning) · 囍 creative variants · specialist-vendor discovery | taxonomy (5.1) · Concierge date logic (5.2) · `wedding_tradition_items` (5.3) · marketplace leaves (5.4) |
| **Vendor** | New specialist leaves to list under (date consultant · lauriat caterer · qipao · tea-set styling · 囍 decor · betrothal/ang-pao supply · lion dance) · faith-tagged so Chinese couples surface them | taxonomy leaves (5.4) · leaf-match contract |
| **Admin** | Edit Chinese ritual rows (`/admin/wedding-traditions`) · author/verify date-logic chunks (single-admin) · approve new vendor taxonomy leaves · define `temple` venue type | governance rules (Concierge README) · taxonomy governance queue |

---

## 6. Decisions — RESOLVED 2026-06-28

| # | Decision | Resolution |
|---|---|---|
| 1 | Overlay vs. standalone faith | ✅ **(A) Overlay** — Chinese is a tradition layer on a primary rite (0043 mixed/secondary axis). Standalone Taoist/Buddhist stays expressible as a primary ceremony type. |
| 2 | `temple` ceremonial venue type | ✅ **Add `temple`** (+ keep `ancestral-hall` as a later option). Required to honor onboarding's 🛕 promise. See Appendix C. |
| 3 | Tea-ceremony serving-order helper | ✅ **Build it** as a couple-facing tool — the signature moment for the Chinese layer (reads family roster → correct precedence list). Staged as a code PR. |
| 4 | BaZi posture | ✅ **Advisory + delegate-to-specialist, never compute a verdict** (§ 2.3–2.4). Locked. |
| 5 | 7 Chinese specialist vendor leaves | ✅ **Approved** for the taxonomy governance queue. See Appendix B. |

**Build split:** corpus/spec side (this doc · the two Concierge chunks in `09_Date_Selection_Cultural_Logic.md`) is **done**. Code side ships via the repo worktree+PR workflow, recommended order: **(1)** seed `wedding_tradition_items` (Appendix A) → **(2)** add the 7 vendor taxonomy leaves (Appendix B) → **(3)** add `temple` venue type (Appendix C) → **(4)** tea-ceremony serving-order helper → **(5)** optional `partner_birth_date`/`partner_birth_time` capture for the BaZi date-check (§ 2.4).

---

## Appendix A — `wedding_tradition_items` seed rows (build-ready)

Faith/overlay tag `Chinese`; admin-editable at `/admin/wedding-traditions`; fallback seed in `lib/wedding-traditions.ts`. `optional=TRUE` rows are surfaced but never block the checklist.

| key | title | optional | when | one-liner |
|---|---|:---:|---|---|
| `betrothal_gifts` | Betrothal gifts (過大禮) | no | pre-wedding | Groom's family presents gold, ang pao & paired auspicious goods; bride's family reciprocates. Even numbers; no 4s. |
| `hair_combing` | Hair-combing ceremony (上頭) | yes | night before | A good-fortune female elder combs the bride's/groom's hair in four strokes, each a spoken blessing. |
| `bridal_bed_install` | Bridal-bed setup (安床) | yes | pre-wedding (auspicious hour) | Bed dressed red & gold, scattered with fertility fruits/seeds; young boys invited to roll on it. |
| `tea_ceremony` | Tea ceremony (敬茶) | no | wedding day | The couple kneels and serves tea to elders — groom's side first, then bride's, by seniority — receiving ang pao/gold in return. **Pair with the serving-order helper.** |
| `lauriat_banquet` | Lauriat banquet | no | reception | Multi-course Chinese banquet with auspicious dishes, yam-seng toasts, hierarchy seating, no table #4. |
| `door_games` | Door games / gatecrashing (闖門) | yes | wedding morning | Groomsmen complete tasks/ang pao to "earn" the bride before the fetching. |
| `return_visit` | Return visit (回門) | yes | days after | The couple returns to the bride's family home after the wedding. |

---

## Appendix B — Chinese specialist vendor taxonomy leaves (governance queue)

Add under `Vendor_Taxonomy_V1_Master.md`, faith-tag `Chinese`, each with a sample photo (refinements pattern), feeding the leaf-match contract.

1. **Date / feng-shui consultant** — BaZi date-check, bridal-bed siting, auspicious-hour selection.
2. **Lauriat / Chinese banquet caterer** — distinct leaf from generic catering.
3. **Qipao / qun-kua (裙褂) & tang-suit attire** — bridal cheongsam, embroidered two-piece, groom's suit.
4. **Tea-ceremony set & styling** — tea set, kneeling cushions, red-gold ceremony backdrop, dragon-phoenix candles.
5. **囍 Double-happiness decor / calligraphy / signage.**
6. **Betrothal-gift & ang-pao supplier** — gold, gift baskets, red envelopes.
7. **Lion / dragon dance troupe** — banquet entertainment.

---

## Appendix C — `temple` ceremonial venue type

`VENUE_TYPES` / `CEREMONIAL_VENUE_TYPES` are currently hardcoded to 6 types with no temple, so onboarding's 🛕 Temple card can't be delivered (audit gap). Add **`temple`** (icon 🛕, ceremonial=true) — covers Taoist/Buddhist temple and ancestral-hall ceremonies for the standalone-primary path. Keep `ancestral-hall` noted as a future sibling. Admin can then create temple venues and tag them.

---

---

## 7. Sources

- User-supplied cultural brief (2026-06-28) — Four Pillars/BaZi, hair-combing, bridal bed, tea ceremony, number taboos, mourning avoidance.
- Existing corpus: `18_Concierge_Brain/09_Date_Selection_Cultural_Logic.md` § Layer 2 (Tong Sing numerology — shipped & cited).
- Tsinoy (Philippine-Hokkien) adaptation notes — to be **verified with a named community/cultural source before any couple-facing copy ships** (per Concierge Brain governance rule 2: every chunk cites a named authority). Flag for content-verification pass.
