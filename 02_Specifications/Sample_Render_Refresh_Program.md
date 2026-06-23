# Sample Render Refresh Program — Setnayan canonical spec

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas (or "still accurate"):
> - **Unbuilt — this whole program depends on a render pipeline that does not exist.** As of 2026-06-07 there is no template-sample gallery, no `template_samples` / `customer_feedback` tables, no donor-consent flow, no Remotion render layer, and no `r2:setnayan-samples/...` bucket usage in `apps/web` @ `origin/main`. The "bootstrap the owner's wedding against all 30 templates" launch sequence never ran.
> - **Built on a fully retired SKU + price set.** Nearly every price here is wrong vs. the live catalog: Save-the-Date ₱99, Personal Reel ₱49, LED Background ₱99, AI Video Highlight ₱999, **AI Edited Highlight ₱2,999→₱3,499**, and especially **Same-Day Edit ₱24,999** (live SDE = **₱3,499**). The charm-ladder these reward tiers are built on is superseded by the 2026-06-04 live-site reconciliation — see `AS_BUILT_GROUND_TRUTH_2026-06-07.md` § 1.
> - **Reward/credit mechanic conflicts with current payment + token model.** The `comp_grant` free-render credits, the 10%-discount-then-tier-reward ladder, and guest-wide credit spread were designed against the old in-app render economy. The live model is **apply-then-pay with manual admin approval** (iteration 0034); the customer token wallet (0003) is RETIRED; comp grants exist in code but do NOT auto-pay an add-on order. Do not treat the reward economics here as current.
> - **Cross-cutting product facts:** commission is **0%** (no Setnayan Pay 3%/5%); planner SKU = **"Setnayan AI" ₱1,499**; **Pakanta = single SKU ₱2,499**; vendor↔customer money is OFF-PLATFORM (RA 11967).
>
> When this body disagrees with the above, **the above wins.**

**Status:** Locked 2026-05-12 · **AI Edited Highlight pricing amendment 2026-05-16**
**Owner:** Operations + Product (admin curation lives in iteration 0023)
**Touches:** iterations 0005 · 0011 · 0012 · 0023 · 0024 · 0025 · privacy policy

> **⚠️ AMENDMENT 2026-05-16 — AI Edited Highlight 3-min repriced ₱2,999 → ₱3,499.** Every inline reference below that quotes the AI Edited Highlight price at ₱2,999 should be read as the **new locked value ₱3,499** (per `CLAUDE.md` 2026-05-16 marketplace/payment/verification lock row § 14). The reprice resolves a prior internal conflict (Strategy B said ₱2,999; charm pricing table said ₱4,999; new lock ₱3,499 lands cleanly between). Margin tables and per-tier reward economics below remain directionally accurate at the new price — the SDE → AIEH gift-ladder remains intact, just at the new ₱3,499 anchor.

---

## Why this program exists

Setnayan's template gallery needs **live sample renders** so couples shopping for a Save-the-Date / AI Highlight / SDE can see what each template actually looks like applied to a real Filipino wedding. Two problems this program solves:

1. **Cold-start** — on Day 0 of V1 launch, the catalog has 30 templates but zero samples. Without samples, the gallery is abstract; couples can't pick confidently.
2. **Sample staleness** — even if Setnayan commissions stock samples, they age. Fresh samples from real recent weddings are far more compelling than 2-year-old stock footage.

This program solves both with a single mechanic: **the owner's wedding bootstraps the catalog; every paying customer can donate their render to refresh the pool, with a 10% per-SKU discount as thanks.**

---

## 1. Bootstrap (V1 launch · Day 0)

The owner's (`S89U-ADM1N00ICE` per current fixtures) wedding footage gets rendered against all 30 V1 templates once, in advance of launch. Output stored at:

```
r2:setnayan-samples/{template_id}/v1_bootstrap.mp4
```

Each template starts with **1 active sample** (the bootstrap render). The rotating-multi-sample slots fill in over the first 3 months of launch as customers donate.

---

## 2. Rotating sample pool (locked)

**Each template carries up to 3 active samples** at any given time.

- Gallery / template-picker UI renders a randomly-selected sample on page load
- "Refresh" button rotates to a different sample without page reload
- Couples see varied weddings, not the same sample repeatedly

Schema:

```sql
CREATE TABLE template_samples (
    sample_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id            TEXT UNIQUE NOT NULL DEFAULT generate_public_id('S'),
    template_id          TEXT NOT NULL,                                  -- e.g. 'HF-01'
    donor_user_id        UUID REFERENCES users(user_id),                  -- NULL for bootstrap
    source_render_id     UUID REFERENCES service_orders(service_order_id),-- NULL for bootstrap
    r2_sample_key        TEXT NOT NULL,
    status               TEXT NOT NULL CHECK (status IN ('active','archived','reverted','revoked')),
    donated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activated_at         TIMESTAMPTZ,
    archived_at          TIMESTAMPTZ,
    admin_reverted_by    UUID REFERENCES users(user_id),
    revert_reason        TEXT,
    consent_signed_at    TIMESTAMPTZ NOT NULL,   -- RA 10173 explicit consent timestamp
    consent_text_version INTEGER NOT NULL        -- which consent version was shown
);

CREATE INDEX ON template_samples (template_id, status);
```

Constraint: per template, at most 3 rows where `status = 'active'`. When a 4th candidate is added, the oldest active sample auto-transitions to `archived`.

---

## 3. Donor flow (locked, auto-approve, all-opt-in rewarded)

1. **Customer renders a video** (Save-the-Date, AI Highlight, SDE, etc.) via the standard checkout flow
2. **Post-render success screen** displays the consent prompt with the **tier-matched free render reward offer** (see § 4 for exact text and § 7 for the reward ladder)
3. **If customer opts in:**
   - Customer's render copied to `r2:setnayan-samples/{template_id}/{sample_id}.mp4`
   - New `template_samples` row inserted with `status = 'active'`
   - If the template already has 3 active samples, the oldest one transitions to `archived`
   - **Customer's reward credit immediately added to their account** — a `comp_grant` row created with the matched-tier free-render SKU (see § 7 ladder). Credit redeemable for 12 months. No expiry pressure.
   - Customer sees confirmation: *"Your Capiz Garden render is now in the Setnayan sample pool. Your free AI Edited Highlight credit is ready to use whenever you'd like."*
4. **If customer opts out:** nothing happens. Their render is theirs alone. No reward credit.

**Auto-approve, admin revert within 48 hrs:** the new sample goes live immediately on `activated_at`. The "Sample Curation" surface in 0023 Admin Console shows the most-recent 48-hour window of new samples with a one-click "Revert" action. Reverted samples transition to `status = 'reverted'`, the previous archived sample restores to active, **and the donor's free-render credit stays in their account** (they don't get punished for an admin call — they opted in good faith).

**All-opt-in rewarded (not contest-based):** every customer who opts in gets the free-render credit immediately at consent time. There is no "win or lose." The credit is the thank-you for joining the donor pool, regardless of whether their specific render later gets selected as the monthly featured sample (see § 6 for featured status, which is a separate marketing mechanic).

---

## 4. Consent prompt (RA 10173 compliant)

Exact text shown at post-render success screen, with explicit opt-in checkbox. The reward text adapts to the donor's SKU per the § 7 ladder:

```
✨ Help us improve Setnayan — and get a free render

Like how your "Capiz Garden" Same-Day Edit came out?
Let us feature your render as a sample for this template.

  Your reward: 1 free AI Edited Highlight (3-min) render
  Value: ₱2,999 · Use it anytime in the next 12 months ·
  Pick any template you like for the free render.

[ ] Yes — feature my render and add the free credit to my account.
       I consent to Setnayan using my render publicly in the template
       gallery and marketing channels for 12 months. I can revoke this
       consent anytime in Settings → Privacy & Data.

[ Continue → ]
```

(The reward line is dynamic — Save-the-Date donors see "Free Personal Reel template unlock · Value: ₱49"; SDE donors see "Free AI Edited Highlight · Value: ₱2,999"; etc. per § 7 ladder.)

Per **RA 10173 § 12(a)** (consent must be freely given, specific, informed):
- The free-render reward is positioned as a thank-you, not a coercion (customer can decline freely with no penalty)
- The scope is specific (this template, this render, gallery + marketing channels)
- Duration is bounded (12 months default; auto-archive after 12 months unless renewed)
- Revocation is clearly stated and available in-app

Consent record:
- `template_samples.consent_signed_at` = exact timestamp of opt-in
- `template_samples.consent_text_version` = which version of the prompt was shown (versioned because the legal text may evolve)

**Revocation flow:** customer goes to Settings → Privacy & Data → "Donated Samples" → sees list of their active sample contributions → can revoke any. On revoke:
- That sample transitions to `status = 'revoked'`
- The previous archived sample for that template restores to active (or the bootstrap sample if none exist)
- **Customer keeps the free render credit already received** (a good-faith opt-in shouldn't be punitively reversed if the customer changes their mind about the sample being public)

---

## 5. Monthly admin curation + Featured Status mechanic

The "Sample Curation" surface in iteration 0023 Admin Console (added as a sub-surface of the existing "Pricing & Catalog" surface) shows per-template:

- Currently-active samples (up to 3 per template)
- Donor pool from the past month (candidate samples that auto-replaced)
- Quick-action buttons: **Revert** · **Keep** · **Force-rotate** (manually promote an archived sample to active) · **Mark as Featured**

**Monthly cadence:** admin opens the surface around month-end, reviews any auto-replaced samples flagged as "needs review" (e.g., low-confidence quality flags from the render pipeline), confirms or reverts as needed. No required action — the auto-approve flow keeps the catalog fresh without admin gating.

### Featured Status — separate from the reward

The free-render credit (§ 7) is the **reward for opting in** — every donor gets it immediately, no contest, no waiting.

**Featured Status** is something different: a **separate monthly marketing recognition** for the specific donors whose renders the admin selects as the next month's three featured samples per template. Featured status is a *public* designation, not a transactional reward.

What featured donors get:
1. A confirmation email: *"Your Capiz Garden Save-the-Date is one of three featured samples on Setnayan for March 2027. Couples shopping for templates this month will see your render in the gallery."*
2. A "Featured March 2027" badge on their landing page (optional toggle in Settings → Privacy & Data)
3. A line on their public landing page footer: *"This wedding has been featured by Setnayan in the global template gallery."* (toggleable)
4. Permission (in the consent text) for Setnayan to repost their render on Setnayan's social channels with credit (`@maria.and.juan` or however the couple credits)

What featured donors DO NOT get:
- Extra cash, additional discount, or additional render credit beyond what they already received at opt-in
- Exclusive treatment that would make non-featured donors feel cheated

Why featured status is decoupled from the reward:
- Every donor gets the reward (cross-sell engagement)
- Selection is purely an editorial / marketing decision (admin chooses the best samples to showcase)
- Avoids the "contest" frame that would suppress opt-in rates
- Featured status becomes a desirable public marker without making the rest of the program feel transactional

Schema for featured status:

```sql
ALTER TABLE template_samples ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE template_samples ADD COLUMN featured_at TIMESTAMPTZ;
ALTER TABLE template_samples ADD COLUMN featured_for_month DATE;  -- which month they're featured for
```

Admin's monthly action: for each template, mark up to 3 samples as `is_featured = TRUE` for the upcoming month. The customer-facing gallery filters to `WHERE is_featured = TRUE AND featured_for_month = current_month` for the display rotation.

---

## 6. Quarterly template tally (locked 2026-05-12 — new)

At the **end of each quarter** (March 31, June 30, September 30, December 31), an automated job generates a per-template usage report:

```sql
SELECT
    template_id,
    COUNT(*) AS render_count,
    DATE_TRUNC('quarter', created_at) AS quarter
FROM service_orders
WHERE status = 'paid' AND template_id IS NOT NULL
GROUP BY template_id, DATE_TRUNC('quarter', created_at)
```

The report appears in the admin console's "Template Performance" surface (new sub-surface of "Sample Curation" in 0023).

**Flag rule:** any template with **0 renders during the quarter** appears on the "Zero-Use Templates" list with three admin actions:

| Action | What it does |
|---|---|
| **Remove** | Template archived. `templates.status = 'archived'`. Existing renders that used it keep working forever; no new renders can pick it from the gallery. Frees a catalog slot for a replacement. |
| **Keep** | Template stays active. Admin determines it needs more time (e.g., a Cinematic Drama variant during peak Filipiniana season). Resets the zero-use counter for next quarter. |
| **Replace immediately** | Remove + open the template curation flow to commission a new candidate. New template goes through the same Cowork-driven design pass + admin approval that produced the V1 catalog. |

**Grace period:** newly-added templates get a **2-quarter grace** before becoming eligible for removal. Templates added mid-quarter count from their full first quarter of exposure.

**Sample handling on template removal:**
- All `template_samples` for the removed template stay in storage (preserved for couples who already used it — their landing-page galleries continue to render correctly forever)
- The template never appears in NEW couples' selection galleries

Schema:

```sql
ALTER TABLE templates ADD COLUMN status TEXT NOT NULL
    DEFAULT 'active' CHECK (status IN ('active','archived','retired'));
ALTER TABLE templates ADD COLUMN added_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE templates ADD COLUMN last_render_at TIMESTAMPTZ;
ALTER TABLE templates ADD COLUMN quarterly_review_passed_count INTEGER NOT NULL DEFAULT 0;
```

---

## 7. Reward mechanics — tier-matched free render credits

Locked 2026-05-12: replaces the earlier 10%-discount model. Every customer who opts in to donate their render receives a **free-render credit for a different SKU one tier down** from what they donated. The reward scales with their donation; cost to Setnayan is trivial; cross-sell engagement is the strategic win.

### Reward ladder

| Donor SKU (what they're rendering) | Free reward (what they get) | Reward value | Setnayan cost to fulfill |
|---|---|---:|---:|
| Save-the-Date (₱99) | Free Personal Reel template unlock | ₱49 | ~₱2 |
| Personal Reel template (₱49) | Free Save-the-Date render | ₱99 | ~₱5 |
| LED Background (₱99) | Free Save-the-Date render | ₱99 | ~₱5 |
| AI Video Highlight 60s (₱999) | Free LED Background + Free Personal Reel template | ₱148 | ~₱7 |
| AI Edited Highlight 3-min (₱2,999) | Free AI Video Highlight 60s | ₱999 | ~₱10 |
| Same-Day Edit (₱24,999) | Free AI Edited Highlight 3-min | ₱2,999 | ~₱30 |

The reward is **one tier down** to (a) keep the gift cost low, and (b) get the customer to try a SKU they hadn't yet engaged with. A SDE donor gets a free AIEH — they discover the shorter cinematic format. An AIVH donor gets free LED + Personal Reel — they discover both reception-display and post-event-reel surfaces.

### No monthly cap on rewards (locked)

Every customer who opts in gets the free-render credit **immediately**, regardless of the size of the donor pool that month. The cost per fulfillment is small (₱2–30 in compute); the cost of capping rewards (reduced opt-in rates, smaller donor pool, worse UX) is much larger. Featured status (§ 5) is the only thing capped at 3 per template per month — and featured status is a separate marketing recognition, not a reward.

### Per-customer anti-abuse rule (locked)

Max 1 reward per `(customer_user_id, template_id, donor_sku_type)` combination, lifetime. Prevents farming. Customer can still earn many rewards across:
- Different templates within the same SKU (donate Capiz Garden STD AND Editorial Cream STD → 2 rewards)
- Different SKUs across the same template (donate Capiz Garden STD AND Capiz Garden AIEH → 2 rewards)
- Different events (couple's first wedding AND their anniversary celebration → independent reward pools)

### Reward storage & redemption

- **Credit creation:** at opt-in time, a `comp_grant` row is created with the matched free-render SKU per the ladder. `comp_grant.user_id`, `comp_grant.sku_key`, `comp_grant.qty = 1`, `comp_grant.expires_at = NOW() + INTERVAL '12 months'`, `comp_grant.source = 'sample_donation'`, `comp_grant.linked_template_id`, `comp_grant.linked_render_order_id`.
- **Credit display:** customer's dashboard shows a "My Rewards" widget listing active credits. One-click "Use this credit" launches the corresponding SKU's checkout flow with the credit pre-applied.
- **Credit redemption:** at checkout, the eligible credit auto-applies; `service_orders.amount_php_centavos = 0`, `service_orders.comp_grant_id` populated.
- **Credit expiry:** 12 months from issuance. Auto-expires; customer notified at 30 days and 7 days before expiry.

### Rating + comment required on every free render redemption (locked 2026-05-12)

Every free render credit redemption (couple's OR guest's) requires the redeemer to submit BOTH a 5-star rating AND a free-text comment before the render starts. This converts the free-credit program into a feedback engine.

**Required at redemption time:**
- **Rating:** 1–5 stars (whole-star only)
- **Comment:** free text, minimum 20 characters (prevents "ok" / "great" / "thanks" stub responses)
- **Stored in:** new `customer_feedback` table linked to the comp_grant_id and the resulting service_order_id
- **Optional consent toggle:** "Make my comment a public testimonial." If toggled, the comment may appear on the corresponding template's gallery page or marketing surfaces; if not, comment is internal-only.
- **Cannot proceed:** the render Submit button is disabled until both fields meet validation. No skip / no defer.

Schema:

```sql
CREATE TABLE customer_feedback (
    feedback_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id          TEXT UNIQUE NOT NULL DEFAULT generate_public_id('F'),
    user_id            UUID NOT NULL REFERENCES users(user_id),
    comp_grant_id      UUID REFERENCES comp_grants(comp_grant_id),
    service_order_id   UUID REFERENCES service_orders(service_order_id),
    template_id        TEXT NOT NULL,
    rating             INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment            TEXT NOT NULL CHECK (LENGTH(comment) >= 20),
    public_testimonial BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON customer_feedback (template_id, rating);
CREATE INDEX ON customer_feedback (submitted_at);
```

**Why this rule is valuable:**
- Hundreds-of-testimonials-per-month at scale (every redemption produces one) — bulk customer-feedback flow Setnayan would otherwise have to commission separately
- Real-time NPS signal — average rating per template tells admin which templates need work
- Template-level quality data — surfaces problems early (e.g., "users keep rating Capiz Garden 3 stars and commenting about pacing")
- Public testimonials (consented) become marketing content for the template gallery and landing pages
- Adds friction in the right place — customers feel they "earned" their free render

---

## 8. Guest Credits — viral spread mechanic (locked 2026-05-12)

**Gated to premium donors only.** Only customers who opt-in to donate from one of these flagship SKUs trigger the guest-wide credit spread:

| Donor SKU | Triggers guest credits? | Guest credit | Setnayan cost @ 200 guests |
|---|:---:|---|---:|
| Save-the-Date (₱99) | No | — | — |
| Personal Reel template (₱49) | No | — | — |
| LED Background (₱99) | No | — | — |
| Patiktok booth (₱2,499) | No | — | — |
| AI Video Highlight (₱999) | **No** (margin too thin past ~400 guests) | — | — |
| **AI Edited Highlight (₱2,999)** | **YES — all guests** | Free Personal Reel template unlock (₱49 value) | ~₱400 |
| **Same-Day Edit (₱24,999)** | **YES — all guests** | Free Personal Reel template unlock (₱49 value) | ~₱400 |

**Why only the premium tier:** at the AIEH (₱2,999) and SDE (₱24,999) price points, the margin holds at 66%+ and 96%+ respectively even at 500-guest weddings. Lower-tier donor SKUs would go negative-margin under the guest-credit cost.

### What triggers guest credit issuance

When a couple opts in to donate their **AIEH** or **SDE** render as a sample (§ 3 donor flow), the system:

1. Issues the couple's own tier-matched free render credit (per § 7 ladder)
2. **Queries `event_members` for all `member_type = 'guest'` rows for that event_id**
3. Issues 1 `comp_grant` per guest with `sku_key = 'personal_reel_template_unlock'`, `qty = 1`, `expires_at = NOW() + INTERVAL '12 months'`, `source = 'sample_donation_guest_spread'`, `donor_couple_id`, `donor_event_id`
4. **Sends each guest a notification:**
   - In-app banner: *"Maria & Juan's AI Edited Highlight was featured by Setnayan! As their guest, you've earned 1 free Personal Reel template unlock — worth ₱49. Render your own personal wedding reel anytime in the next 12 months."*
   - Email: same message
   - Push (V1.5+): same message

### Guest credit redemption

Same rating + comment requirement applies. When a guest goes to redeem their free Personal Reel template unlock:
1. Picks any of the 30 V1 templates
2. Picks their photos for the render (from the couple's Papic gallery)
3. **Required: 5-star rating + ≥20-char comment** before render submits
4. Render starts; output delivered to their account

### Guest-credit-specific consent

The couple's consent at donation explicitly includes:
- *"I consent to Setnayan giving each of my guests one free Personal Reel template unlock as a thank-you, on my behalf."*

This is treated as part of the same RA 10173 consent flow as the sample-publishing consent. The couple is the principal granting the gift; Setnayan is the platform fulfilling it. No separate guest opt-in required (it's a gift, not a sale).

### Margin per donation (with guest spread)

| Donor SKU | Couple's reward cost | Guest credits @ 200 guests | Total Setnayan cost | Customer-paid revenue | Margin |
|---|---:|---:|---:|---:|---:|
| AI Edited Highlight (₱2,999) | ₱10 | ~₱400 | ₱440 (incl. render compute) | ₱2,999 | 85% |
| AI Edited Highlight (₱2,999) @ 500 guests | ₱10 | ~₱1,000 | ₱1,040 | ₱2,999 | 65% |
| Same-Day Edit (₱24,999) | ₱30 | ~₱400 | ₱870 (incl. SDE compute) | ₱24,999 | 96% |
| Same-Day Edit (₱24,999) @ 500 guests | ₱30 | ~₱1,000 | ₱1,470 | ₱24,999 | 94% |

Margin holds healthily at any wedding size. The SDE math is especially bulletproof — even a 500-guest wedding leaves Setnayan with ~94% margin AND ~500 new customers experiencing the platform via their guest credit.

### Strategic value

Two big wins beyond the donation itself:

1. **Generosity halo for the couple.** *"We donated our wedding's AI Edited Highlight to Setnayan and they gave every one of our guests a free Personal Reel render."* That's a sentence couples want to say to friends and family. Filipino bayanihan culture amplifies this.
2. **Marketing reach × 100.** Each AIEH/SDE donation puts Setnayan in front of 100–500 new potential customers (the guests). Each guest who redeems their credit experiences the platform firsthand. At scale, this is a self-perpetuating funnel.

### Operational caveats

- Guest count comes from `event_members` at the moment of donation opt-in. Guests added after donation do not retroactively get credits.
- Guests who decline event invitations (`event_members.rsvp_status = 'no'`) still get credits — Setnayan is the gift-giver and decisions on who attended belong to the couple, not Setnayan.
- Maximum guest count per event is bounded by the guest list size; no artificial Setnayan-imposed cap.
- If a guest later revokes their account (RA 10173 § 16 hard-delete), unused credits are voided.

### Margin math after rewards

The reward ladder reduces revenue per donor very slightly relative to the no-donation case, but the cost is in compute, not revenue:

| SKU | Original price | Donor pays (full) | Setnayan also fulfills (free reward) | Total Setnayan cost | Net Setnayan revenue | Margin |
|---|---:|---:|---|---:|---:|---:|
| Save-the-Date | ₱99 | ₱99 | Personal Reel template (cost ₱2) | ₱5 + ₱2 = ₱7 | ₱99 | 93% |
| Personal Reel template | ₱49 | ₱49 | Save-the-Date render (cost ₱5) | ₱2 + ₱5 = ₱7 | ₱49 | 86% |
| LED Background | ₱99 | ₱99 | Save-the-Date render (cost ₱5) | ₱5 + ₱5 = ₱10 | ₱99 | 90% |
| AI Video Highlight 60s | ₱999 | ₱999 | LED + Personal Reel (cost ₱7) | ₱10 + ₱7 = ₱17 | ₱999 | 98% |
| AI Edited Highlight 3-min | ₱2,999 | ₱2,999 | AI Video Highlight 60s (cost ₱10) | ₱30 + ₱10 = ₱40 | ₱2,999 | 99% |
| Same-Day Edit (SDE) | ₱24,999 | ₱24,999 | AI Edited Highlight 3-min (cost ₱30) | ₱440 + ₱30 = ₱470 | ₱24,999 | 98% |

Customer pays the full SKU price (no discount), Setnayan absorbs the free-render fulfillment cost. Margin floor is the Personal Reel donor case at 86%; everything else is 90%+.

---

## 8. Cross-iteration integration

This program threads through multiple iterations. Each affected iteration's spec needs the corresponding section added during implementation:

| Iteration | Integration point |
|---|---|
| 0011 Panood (AIVH · AIEH · SDE) | Post-render success screen renders the consent prompt; payment flow applies the 10% discount |
| 0012 Papic (Personal Reels) | Same — applies to each guest's Personal Reel render too |
| 0024 Save-the-Date | Same |
| 0005 LED Background | Same |
| 0023 Admin Console | Adds "Sample Curation" + "Template Performance" sub-surfaces |
| 0025 Profile Settings | Adds "My Donated Samples" tab under Privacy & Data with revocation control |
| 01_Contracts/Setnayan_Privacy_and_Security_Policy.md | Adds a "Sample contributions" section covering the consent + revocation flow |

---

## 9. Operations & launch sequence

| Day | Action |
|---|---|
| T-14 days from V1 launch | Owner's wedding rendered against all 30 templates → 30 bootstrap samples stored |
| T-7 days | Admin reviews each bootstrap sample, approves or flags for re-render |
| T-0 (launch day) | Template gallery goes live with bootstrap samples |
| T+30 days (end of Month 1) | First monthly admin curation pass; donor pool reviewed |
| T+90 days (end of Quarter 1) | First quarterly template tally; zero-use templates flagged for review |
| T+365 days | First annual catalog review; the catalog should now be heavily refreshed with real customer samples |

---

## 10. Risk mitigations

- **Bad-quality donor render goes live and embarrasses Setnayan.** Auto-approve is a risk. Mitigation: the 48-hr revert window plus a "needs review" flag on samples flagged by the render pipeline (e.g., low overall brightness, heavy blur, audio sync issues).
- **Customer revokes a sample that's been the live sample for 6 months.** Mitigation: the previous archived sample is preserved and restores automatically. If no archived sample exists, the bootstrap sample restores.
- **A template gets removed but a customer's render that used it is still live on their landing page.** Mitigation: removed templates stay in `templates` table with `status = 'archived'`. Their Remotion JSX component stays in the codebase. New renders can't pick them, but old renders continue to work indefinitely.
- **Consent text changes legally.** Mitigation: `consent_text_version` tracks which version each customer agreed to. If a legal change requires re-consent, the system can prompt customers whose stored consent version is below the required minimum.

---

## 11. Cost analysis

Per-donor cost (free-render reward fulfillment, tier-matched per § 7 ladder):

| Donor SKU | Reward fulfillment cost | Customer-paid SKU revenue | Net per donor |
|---|---:|---:|---:|
| Save-the-Date donor | ₱2 (free Personal Reel template) | ₱99 | ₱97 net |
| Personal Reel donor | ₱5 (free STD render) | ₱49 | ₱44 net |
| LED Background donor | ₱5 (free STD render) | ₱99 | ₱94 net |
| AI Video Highlight donor | ₱7 (free LED + Personal Reel) | ₱999 | ₱992 net |
| AI Edited Highlight donor | ₱10 (free AIVH) | ₱2,999 | ₱2,989 net |
| Same-Day Edit donor | ₱30 (free AIEH) | ₱24,999 | ₱24,969 net |

**Monthly cost projection** at three volume assumptions (10% opt-in rate, mix-weighted across SKUs):

| Volume | Total donors/mo | Reward fulfillment cost/mo | Storage cost/mo |
|---|---:|---:|---:|
| 100 weddings/mo (early launch) | ~10 | ~₱100 | ~₱5 |
| 1,000 weddings/mo (mature) | ~100 | ~₱1,000 | ~₱50 |
| 10,000 weddings/mo (scale) | ~1,000 | ~₱10,000 | ~₱500 |

Other operational costs:

| Cost line | Per-month amount |
|---|---:|
| Sample storage on R2 (Cloudflare) | ~₱0.50 per sample per year (negligible) |
| Compute for sample render (donor's own order — already paid) | ₱0 incremental |
| Compute for reward redemption render (Setnayan-fulfilled) | per ladder above |
| Admin time for monthly curation + featured selection | ~30 min/month |
| Admin time for quarterly template tally review | ~30 min/quarter |
| LiveKit/Daily fees, vendor fees, etc. | ₱0 — these are pure-compute renders, no external services in the redemption path |

**Net benefit calculus:** the marketing value of a constantly-fresh template gallery driven by real Filipino weddings is significant. The reward fulfillment cost (₱10–30 at scale per high-tier donor) is dwarfed by the lifetime-value lift of customers who return to redeem their free credit (engagement on a second SKU → potential upsells like Custom Monogram Pack, Pro template unlock, more renders). Even at 10,000-weddings/mo scale, the monthly cost is ~₱10K — a rounding error against expected V1 revenue.

---

## 12. Open questions for V1.5+

- Should multi-sample rotation extend to **5 active samples per template** instead of 3 once the donor pool grows large?
- Should there be a "featured this month" sample selected by Setnayan editorial, separate from the rotating pool?
- Should donors get a public credit (badge on their landing page: "Featured in Setnayan gallery") for additional social-share marketing value?

These are V1.5+ considerations; V1 ships the simpler model above.
