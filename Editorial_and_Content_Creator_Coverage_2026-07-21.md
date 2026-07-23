# Editorial & Content-Creator Coverage — magazines and content companies as marketplace vendors

**Date:** 2026-07-21 · **Status:** ⚠ NEW MODEL — owner-directed, applied to the corpus; several sign-offs open in §7
**Trigger:** owner, verbatim — *"aside from our editorials, we will allow magazines to cover weddings with our app. so they can request for services from editorial companies."*
**Follow-ups, verbatim:** *"editorials are not photographers, these are companies that create content for weddings."* · *"we want to allocated services on what event they cover."* · *"couple requests from magazine, or content creators"* · *"customer pays content creators."*

---

## 0 · 🚨 READ THIS FIRST — "editorial" means THREE different things in this corpus

Conflating them would corrupt all three. Before writing or building anything that uses the word, establish which sense is meant.

| # | Sense | What it is | Who owns it | Where it lives |
|---|---|---|---|---|
| **A** | **Setnayan's own publishing surface** | `setnayan.com/blog` + `/recommendations/[category]`, affiliate links (Involve Asia), sponsored content | **Setnayan** — first-party media + affiliate revenue | Iteration `0038_editorial_and_affiliates/` *(⚠ **ARCHIVE STUB** since 2026-07-02; original body at `git show 573a96c:0038_editorial_and_affiliates/0038_editorial_and_affiliates.md`. **Do NOT re-expand it.**)* |
| **B** | **The per-wedding "Event Editorial"** | A Setnayan-**rendered** magazine-style Chronicle of the couple's own event — the 9-section long-form template on their public page | **Setnayan** — it is a product/SKU | `DECISION_LOG.md` 2026-05-19 (0002 Phase 4) · `OPERATOR_GUIDE_Account_to_Editorial_2026-06-20.md` · `Feature_Catalog_Canon.md` — ⚠ **corrected 2026-07-21:** its body table (line 59) still lists a standalone *"Editorial Website · Pro ₱4,999"*, but that SKU is **RETIRED** by the same file's own as-built correction (line 13): the à-la-carte RSVP / RSVP Pro / Event Website / **Editorial Website** SKUs were **collapsed into one Couple Website PRO**. So sense B ships as **free auto-editorial + the Couple Website PRO customization unlock**, *not* as a ₱4,999 Editorial Website. **Do not quote ₱4,999.** |
| **C** | **⭐ Editorial / content-creation COMPANIES** | Third-party businesses — magazines, content studios, creator teams — that a couple **hires and pays** to cover their wedding | **The vendor.** Setnayan neither produces nor resells it | **THIS DOCUMENT.** Marketplace taxonomy, `editorial` tile under the `documentary` parent |

> ### 🔑 The `editorial` **marketplace tile** means sense **C**, and only C.
> It is not the blog. It is not the Chronicle SKU. A couple browsing the `editorial` tile is shopping for **a company to hire**.

**And per the owner: sense C is NOT photography.** *"Editorials are not photographers, these are companies that create content for weddings."* A photographer delivers images of the day; an editorial company **produces content about the event** — features, written spreads, social/short-form packages, brand-grade coverage. They may commission or employ photographers; that is their supply chain, not the couple's purchase. The existing `photography` / `videography` canonicals are **not** coverage of this category and must not be used as a substitute.

---

## 1 · Why this lands on a tile that already exists and is broken

`Taxonomy_Expo_Gap_Verdict_2026-07-21.md` §0a measured **two dead tiles**, not three:

| Tile | Parent | State |
|---|---|---|
| `ceremony_venue` | venue | **DEAD** — 0 canonicals |
| **`editorial`** | **documentary** | **DEAD** — 0 canonicals |

`editorial` ships in `WEDDING_TILE_ORDER`, resolves to **zero** canonical services, and therefore short-circuits to `EMPTY` in `apps/web/app/dashboard/[eventId]/vendors/_actions/category-search.ts` before any query runs. **A couple who taps it today sees nothing, always.**

**So this model needs no new tile.** The hole was already reserved; the owner supplied the definition that fills it.

🚨 **ATTRIBUTION CORRECTION 2026-07-21 — do not stretch owner decision 1 to cover this.** An earlier pass of this file claimed *"owner decision 1 (**yes**) approves the taxonomy data fix, which is the same fix."* **It is not the same fix.** Per `DECISION_LOG.md` (2026-07-21 owner decision block), decision 1 reads: ***"seed the venue canonicals — yes."*** That **yes** was scoped to **`ceremony_venue`**. The owner said nothing about seeding canonicals under `editorial`.

**What is actually owner-backed here:** the *category definition* (decision 2 — *"editorials are not photographers, these are companies that create content for weddings"*) and the *commercial model* (*"couple requests from magazine, or content creators"* · *"customer pays content creators"*). **What is NOT owner-backed:** the taxonomy seed itself — which canonicals, how many, and whether `editorial` gets seeded at all. That remains **§7 #1, open.** The two tiles are dead for the same *reason* and are fixed by the same *mechanism*; that does not make one approval cover both.

⚠ **Implementation note the corpus must carry:** PR #3460 shipped `apps/web/lib/taxonomy-tile-reachability.test.ts`, whose allowlist **asserts in both directions** — an allowlisted tile that starts resolving fine **also fails the build**. Seeding canonicals under `editorial` therefore **requires deleting its allowlist entry in the same change**, or CI goes red. Also per that verdict's §4: the fix must be **additive**, never a full seed regeneration, which re-emits all mappings with `ON CONFLICT … DO UPDATE SET` on every column and clobbers prod hand-edits.

---

## 2 · The model

> **Couples request coverage from magazines and content-creation companies through the app. The CUSTOMER PAYS THE CONTENT CREATOR. Setnayan does not resell, intermediate, or hold that payment.**

| Step | Who | What |
|---|---|---|
| 1 | Couple | Browses the `editorial` tile / is matched, and **requests coverage** — *"couple requests from magazine, or content creators"*. Sends a **lock** |
| 2 | Editorial company | Accepts the lock and attaches a **finalized proposal**; its amount computes the fee |
| 3 | Editorial company → **Setnayan** | ⭐ **Vendor PREPAYS the Booking Fee to SEND the finalized proposal.** Unpaid ⇒ the proposal does not send (§3) |
| 4 | Couple | **Accepts the price** — the handshake confirming the number is true to their plan. No second charge |
| 5 | Couple → vendor | **Customer pays the content creator directly.** Settlement is off-platform, exactly as with every other vendor category |

**They are ordinary marketplace vendors.** Same registration, same profile, same verification, same subscription ladder, same inbox, same booth. Nothing about this category needs its own commercial machinery — which is the strongest argument for putting it here rather than inventing a program around it.

### 2.1 What makes them different from photographers (for the canonical seed)

A shared tile-parent (`documentary`) is correct — both are "the record of the day" — but the purchase differs:

| | Photography / videography | Editorial / content company |
|---|---|---|
| Deliverable | Images / film **of** the event | **Published or publishable content about** the event — feature spreads, written editorial, social/short-form packages |
| Buyer's intent | Keep the memory | Be **covered** |
| May subcontract | — | Yes — photographers, writers, editors are their inputs |
| Setnayan's Chronicle (sense B) | Unrelated | ⚠ **Adjacent — see §5** |

---

## 3 · Does the Booking Fee apply? — **Yes, and the reasoning is airtight for the base case**

Per `3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md` §3.0, the Booking Fee applies to a vendor whose booking Setnayan sourced. **The vendor PREPAYS the fee to SEND their finalized proposal** (§3.0d, owner-corrected 2026-07-21 — this supersedes both the original first-payment trigger and the interim "customer accepts → fee").

**This category satisfies every element of that test:**

1. A **third-party vendor** sells an **event service** to a **couple**, for **money**.
2. The couple **pays the vendor directly**, off-platform — identical to every other category. *(The fee has never depended on Setnayan touching the money; §3.0j is explicit that not holding it is an advantage, not an exception.)*
3. There is a **finalized proposal with a price**, so the prepaid send gate has something to compute against and something to gate.
4. Imports stay free (§3.0e) — a magazine bringing its own client pays nothing.

**Same schedule, no special case:** ₱50 floor → 2.0% → cap **₱4,000**.

⚠ **Inherited open items.** This category inherits the model's unresolved edges wholesale — **no refund rule if the couple walks after the vendor paid to send** (§3.0d-iii-b), the suspended *"you pay when your client says yes"* copy (§3.0d-iii-a), and the **lock on-platform / real deal off-platform** leak (§3.0d-ii). ⚠ The last is **plausibly worse here**: editorial deliverables are intangible and their scope is elastic, so a token in-app proposal is easier to make look legitimate than for a venue or a caterer.

### 3.1 🚨 The ₱0 / barter booking — SHARPER under the prepaid gate, still undecided (§7 #4)

**Editorial coverage is frequently traded rather than sold** — a magazine covers a wedding for access, exposure, or portfolio, and the couple pays nothing. This edge is **real, common in this category specifically, and still unresolved**.

⚠ **The corrected mechanism makes it worse, not better.** Under the old acceptance trigger a ₱0 booking merely produced an awkward invoice. **Under the prepaid gate, a ₱0 proposal would have to clear a fee the vendor must pay *before Setnayan will send it at all*.** So the platform would be **charging a vendor for permission to send a quotation with no consideration in it** — and if they decline, the barter coverage simply cannot be transacted in-app. That is a category-shaped hole, not a rounding error: it pushes exactly the deals this category is built on off-platform.

The marginal-bracket schedule still has **no rule for a ₱0 proposal**, and the ₱50 floor would bill on nothing. Options (₱0 proposals fee-exempt · a flat listing fee · barter not bookable in-app) — **none is the owner's, and none is chosen here.**

---

## 4 · "Allocate services on what event they cover" (owner decision 3)

> *"we want to allocated services on what event they cover."*

An editorial company that covers **debuts** should not surface to a **wedding** couple, and vice versa. Read at face value this is **per-event-type service allocation** — a vendor's services carry the event types they actually serve.

✅ **This is not a new build.** It is the **existing live defect** already recorded in the vendor-onboarding work: `vendor_profiles.event_types` is stuck at `['wedding']` and **nothing propagates coverage → profile**, so non-wedding vendors are effectively **invisible**. PRs 1–2 shipped as **#3457**; the propagation gap remains. The same plumbing serves editorial/magazine vendors — this decision **raises the priority of an existing fix**, it does not open a new workstream.

⚠ **Ambiguity flagged, not resolved (§7 #5):** "allocate services on what event they cover" could mean (a) filter a vendor's *visibility* by event type — the reading above — or (b) let a vendor attach **different service/price lists per event type** (a wedding package and a debut package under one profile). (b) is a materially larger schema change. **(a) is assumed here** because it matches the live defect exactly; confirm before building.

---

## 5 · Collision check — three things this must NOT disturb

1. **Sense A (0038) is untouched.** Setnayan's blog, affiliate links, and sponsored content are a first-party revenue surface. An editorial *vendor* is not an affiliate partner, does not get placement in `/recommendations/`, and buying booth ads never buys editorial coverage on Setnayan's own pages. *(The 0038 file stays a stub — this document is its dated sibling, not an expansion.)*
2. **Sense B (the Chronicle SKU) is untouched.** Free auto-editorial + Pro customization remains a Setnayan-rendered product on the couple's own page. ⚠ **But the adjacency is real and should be watched:** a couple who hires a magazine may reasonably expect that magazine's work to *appear in* their Chronicle. Whether hired-vendor content can flow into the Setnayan-rendered editorial is **undecided** (§7 #3) and touches rights, credit, and consent.
3. **The placement rule holds.** *"Money can never buy placement in a real couple's room"* (booth rule, council verdict 2026-07-19). An editorial vendor gets a booth because they were **booked**, never because they paid.

### 5.1 ⚠ The creator-program collision — two distinct roles, name them

`Creator_Program_Council_Verdict_2026-07-15.md` positions creators as a **CAC-negative distribution loop, not a paying segment**: free Creator Kit, comped ~99%-margin SKUs in exchange for a *"Made on Setnayan"* watermark, and a treasury-free money path (*"we have no monetary source to pay them"* — credits or brand-pays-direct).

The owner's model says **the customer pays the content creator.** These are not the same person doing the same thing, and the corpus must stop using one word for both:

| Role | Paid by | Relationship | Booking Fee | Governed by |
|---|---|---|---|---|
| **Creator-as-hired-vendor** | **The couple**, directly | Ordinary marketplace vendor with a quotation | **Yes** (§3) | This document |
| **Creator-as-promotional-partner** | Nobody in cash — comped SKUs, credits, audience | Distribution partner | N/A — no booking | `Creator_Program_Council_Verdict_2026-07-15.md` |

**Both can coexist, and the same company can hold both roles at different times** — a studio that covers a wedding for a fee this month and posts a comped promo next month. What breaks is a single "creator" concept that is sometimes paid and sometimes comped, because the fee, the consent, and the credit rules differ. ⚠ **Whether one account may hold both roles simultaneously is open (§7 #2)** — it is the obvious way to launder a paid booking into a comped one.

---

## 6 · What to seed (proposal — the shape, not the final list)

Additive `TAXONOMY_MAP` entries under the existing `editorial` tile (folder `documentary`), plus `canonical_service_schemas` stubs, **plus deletion of the `editorial` allowlist entry in the reachability test** — the same cheap pattern the taxonomy verdict costed for its 8 additions (no new tile, no new folder, no new PG enum value).

| Candidate canonical | Covers |
|---|---|
| `wedding_editorial_feature` | Magazines / editorial companies producing a published feature on the event |
| `content_creation_team` | Content studios / creator teams producing social + short-form coverage packages |

⚠ **Two is a proposal, not a verdict.** The taxonomy verdict's own maintenance rule — *rental / shoot-type / cart-type / package composition are **facets** underneath a tile, never their own tile* — argues the split could equally be **one** canonical with a facet. **Owner/taxonomy call (§7 #1).** Do not seed until it is made; a canonical is cheap to add and awkward to remove.

---

## 7 · Open sign-offs

| # | Question | Why it is open |
|---|---|---|
| 1 | **How many canonicals under `editorial` — one with facets, or two (`wedding_editorial_feature` + `content_creation_team`)?** | The owner defined the category, not its grain. §6 |
| 2 | **May one account hold both creator roles** (hired vendor + comped promotional partner) at once? | §5.1 — the obvious fee-avoidance path |
| 3 | **May a hired editorial vendor's content appear inside the Setnayan-rendered Chronicle (sense B)?** | §5 — rights, credit, consent; also blurs A/B/C for the couple |
| 4 | 🚨 **₱0 / barter coverage — is the Booking Fee owed?** ⚠ **SHARPENED, not resolved, by the 2026-07-21 correction** | §3.1 — editorial coverage is often traded, not sold. Under the **prepaid send gate** a ₱0 proposal must clear a fee the vendor pays *before Setnayan will send it*, so the platform charges for permission to send a quotation with no consideration — or the barter deal goes off-platform entirely |
| 5 | **"Allocate services on what event they cover" = visibility filtering, or per-event-type service lists?** | §4 — (a) is an existing defect fix; (b) is a schema change |
| 6 | **Does an editorial vendor need its own verification standard?** | They publish about a real couple's private event; ordinary vendor verification may not be the right bar. ⚠ Note owner decision 4: logo is required **before verification**, not at shop creation |
| 7 | ⚠ **Do the shortlist / vendor-website fee paths apply here, and where is their gate?** | Owner widened fee scope (*"any transactions to shortlist and websites will have booking fee"*), but those paths have **no proposal-send chokepoint** — model sign-off 3d-iv. An editorial vendor with a Setnayan-hosted site hits this immediately |
| 8 | ⚠ **NEW — does the ₱0/barter edge (#4) reappear as its OWN abuse surface here?** | Model doc §3.0m-d records that above the ₱300,000 cap the marginal fee rate is **zero**, so over-declaring is free and buys a better market segment. **Editorial deliverables are intangible and elastically scoped**, which makes an inflated proposal easier to make look legitimate here than for a venue or caterer — the same property flagged in §3 for the *understatement* leak, running in the opposite direction |

---

## 8 · Cross-references

- `Taxonomy_Expo_Gap_Verdict_2026-07-21.md` — the dead `editorial` tile (§0a) and the additive-fix constraints (§4)
- `3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md` §3.0 / **§3.0d** — the Booking Fee schedule and the **prepaid finalized-proposal gate** this category inherits, plus §3.0d-scope (shortlist + website), §3.0d-ii (the residual leak), §3.0d-iii (the suspended copy + the missing refund rule) and **§3.0m** (the three honesty forces — two owner-confirmed, one proposed — and the **mirror over-declaration risk** above the cap)
- `Creator_Program_Council_Verdict_2026-07-15.md` — the comped promotional-partner model this must not be confused with
- `0038_editorial_and_affiliates/` — sense A · **archive stub, do not re-expand**
- `OPERATOR_GUIDE_Account_to_Editorial_2026-06-20.md` · `Feature_Catalog_Canon.md` — sense B, the Chronicle SKU
