# Iteration 0037 — Bespoke Monogram (AI-Powered)

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **Ships as "Animated Monogram" · ₱2,499** (`service_key = ANIMATED_MONOGRAM`, lib/animated-monogram.ts, add-ons key `animated-monogram`, route `/dashboard/[eventId]/add-ons/animated-monogram`) — NOT the `bespoke_monogram` ₱2,999 SKU this spec describes.
> - **The shipped product is NOT the DALL-E brief→generate→30-refinement→vectorize loop.** What shipped is an SVG stroke-trace "drawn live" reveal applied to the event's FREE auto-generated text monogram (lib/monogram.ts + EventMonogram). The free monogram-maker lives at `/dashboard/[eventId]/monogram` (`monogram-maker.tsx`); the paid SKU only unlocks the animated render on the couple's surfaces. No `/bespoke-monogram` route, no brief form, no refinement counter, no `+10 refinements ₱199` add-on shipped.
> - **The Pro Hero Monogram widget tier (§2, ₱99/₱199) is NOT shipped as priced.** That path is the distinct iteration-0004 `monogram_hero_upgrade` widget (₱1,999, custom video/photo background + Potrace upload), gated separately on the Website tab — and is listed as DEFERRED Pro-widget purchase in the ground truth. Two monogram SKUs coexist; don't conflate them.
> - **Payment is apply-then-pay + manual admin approval** (0034): the inline-checkout drawer stamps `service_key='ANIMATED_MONOGRAM'`, customer uploads a payment screenshot, admin approves at `/admin/payments`. No card charge. The retired "Custom Monogram Pack ₱1,999" is gone.
> - **⚠ Folder-number collision:** this `0037_bespoke_monogram` shares the 0037 number with `0037_event_day_preload`. One must be renumbered (owner).
>
> When this body disagrees with the above, **the above wins.**

> **⚠ LIVE-SITE RECONCILIATION 2026-06-04.** Ships on setnayan.com/pricing as **"Animated Monogram" · ₱2,499 · build state Live** ("Bespoke Monogram with Animation") — i.e. the bespoke monogram now bundles the animated treatment and is priced ₱2,499 (down from the ₱2,999 spec'd below). The retired "Custom Monogram Pack ₱1,999" is fully gone. Canonical: `Pricing.md § 0`.

**Status:** Concept locked 2026-05-14. **UI refinement needed before engineering can build.**
**Companion:** Builds on 0002 (QR Invitation System) and 0004 (Invitation Widgets — Hero Monogram).
**Action:** Cowork session — please walk this spec and refine UI/UX, microcopy, states, and edge cases. Deliver an updated spec + an HTML prototype (same pattern as `0002_qr_invitation_system.html`) before engineering implements.

---

## 1. Overview

Couples buy a **fully bespoke monogram** designed by "Setnayan AI" — interlocked artisan letterforms in the style of luxury wedding logos (reference: Pinterest "interlocked wedding monogram"). The product is fully in-app: couple fills a brief, pays, sees AI-generated options live, refines via text feedback until they accept the final. The final SVG renders event-wide (QR center, hero, save-the-date, signage, future merch).

**Behind the scenes:** the AI engine is DALL-E 3 HD + vectorizer.ai. Customer-facing brand is **"Setnayan AI"** — DALL-E and OpenAI are never named in UI copy.

---

## 2. The 3-tier monogram model

| Tier | Content | Frame + Font | Price |
|---|---|---|---|
| **Free / Basic** | 2 letters + `&` (e.g. `J & S`) | Simple geometric frame · 1-2 default fonts | **₱0** — included |
| **Pro Hero Monogram** (per 0004 widget Pro tier) | 2 letters OR full first names (e.g. `JAMES & SAVA`) | Ornamental + heritage frames (laurel wreath / royal crest / sampaguita / capiz / banner-ribbon / Filipino heritage) · 8+ premium fonts · placement variants | **₱99** (or ₱199 Pro Bundle with 0004's other Pro widgets) |
| **Bespoke (this iteration)** | AI-generated interlocked / infused artisan letterforms — letters combine into a single luxury mark | One-of-a-kind. Not picker-driven. Generated from the couple's brief | **₱2,999** + optional `+10 refinements` add-on at ₱199 (multi-buyable) |

This iteration owns ONLY the Bespoke tier. Free + Pro tiers stay with their existing surfaces (0002 + 0004).

---

## 3. Bespoke customer journey (in-app, live render — no external tools)

### 3.1 Discovery + entry

- Entry point 1: `/dashboard/[eventId]/add-ons` grid → new "Bespoke Monogram" card (terracotta `Bespoke · ₱2,999` pill)
- Entry point 2: `/dashboard/[eventId]/invitation` page → "Upgrade your monogram" CTA next to the current free monogram preview
- Both deep-link to `/dashboard/[eventId]/bespoke-monogram` (new route)

### 3.2 Brief form (Screen 1 — `/bespoke-monogram`)

Couples fill a guided brief BEFORE paying — so they know what they're committing to:

| Field | Type | Required | Notes |
|---|---|---|---|
| Initials or Names | Toggle: Initials (e.g. `J & S`) OR Full names (e.g. `JAMES & SAVA`) | Yes | Picks the letter style |
| Partner A | Text | Yes | First name OR single letter |
| Partner B | Text | Yes | First name OR single letter |
| Connector | Radio: `&` / `and` / `at` / `y` | Yes | Default `&` |
| Personality words | Multi-select chip picker, 3 words from a curated list (e.g. `playful` `sophisticated` `minimalist` `botanical` `regal` `vintage` `modern` `whimsical` `romantic` `cultural` `bold` `delicate`) | Yes | Drives the AI prompt |
| Motif preference | Single-select dropdown: `None` / `Botanical (wreaths, vines)` / `Heritage Filipino (sampaguita, capiz, baybayin)` / `Geometric (linear, hexagonal)` / `Royal (crests, banners)` / `Calligraphic (flourishes)` | Optional | Defaults to None |
| Style direction (reference images) | File upload area — **up to 3 images**, JPG/PNG, max 5MB each, stored in R2 `setnayan-media/bespoke-briefs/<order_id>/...` | Optional | Couples drop Pinterest/inspiration here |
| Color preference | Auto-fill from couple's Bride & Groom palette (see 0010 Mood Board) — **read-only** | Auto | Customer can't override (preserves brand cohesion) |

CTA at bottom: **"Continue to payment · ₱2,999 · 30 refinements included"**

### 3.3 Payment + lock (Screen 2)

- Routes through existing 0034 order flow
- Order row creates with `service_key = 'bespoke_monogram'`
- Payment instructions (BDO + GCash) shown
- Couple uploads screenshot
- Admin reconciles (existing flow)
- On admin mark-paid → `bespoke_monogram_orders.status = 'awaiting_first_render'`

🔴 **Brief inputs LOCK at this point.** initials/names/connector cannot be edited from here. This prevents 1 transaction → multiple distinct logos.

### 3.4 First render — automatic (Screen 3 — generating state)

- Within 5 seconds of `status = 'awaiting_first_render'`, a server job fires DALL-E 3 HD × 4 variations with a templated prompt built from the brief
- Customer sees a **"Setnayan AI is creating your monogram..."** loading screen with a progress indicator and a soft message: *"We're generating 4 unique designs based on your brief. This usually takes about 30 seconds."*
- PNGs land in R2 `setnayan-media/bespoke-renders/<order_id>/<render_id>.png`
- Refinement counter starts at **30** and goes down by 4 (since first generation produced 4) → counter at **26**
- Status flips to `awaiting_customer_pick`

### 3.5 Pick + refine loop (Screen 4 — `/bespoke-monogram/refine`)

This is the heart of the experience. Layout:

- **Top:** Large preview of the currently-selected design (default: variation 1)
- **Strip:** Thumbnails of all 4 current variations — click to swap which one is "Top" / being refined
- **Refinement counter:** "26 refinements left" (live number)
- **Refinement chat panel:** Text input + suggested prompts ("Make it more delicate" · "More gold accents" · "Swap wreath for crest" · "Less ornate" · "Make the letters thicker")
- **Buttons:** `Refine (4 new variations)` — costs 4 refinements · `Accept this one as final` — locks and delivers

When customer types feedback + clicks Refine:
- Server fires DALL-E with: `{LOCKED_BRIEF} + {FEEDBACK_HISTORY} + {NEW_FEEDBACK}` → 4 new variations
- Counter drops by 4
- New variations replace the strip thumbnails; the previous top design stays in a "Previous attempt" carousel underneath for reference
- Customer can scroll-back-and-pick from older renders at any time (no extra cost)

When customer hits "Accept this one as final":
- Selected PNG fires vectorizer.ai → returns SVG
- SVG stored in R2 `setnayan-media/bespoke-finals/<order_id>.svg`
- Confirmation screen: "Your bespoke monogram is live across your event!"
- Status flips to `final`
- The SVG replaces the auto-generated monogram in 0002 QR center, 0004 Hero Monogram widget, save-the-date renders, and future LED templates

### 3.6 Quota-exhausted state (Screen 5 — counter hits 0)

If customer hits 0 refinements left without accepting:
- Refine button disables
- Banner appears: **"You've used all 30 refinements. Add more to keep refining, or accept your favorite design from above."**
- CTA: **`+10 refinements · ₱199`** → routes to existing 0034 order flow with `service_key = 'bespoke_monogram_refinements_10'`
- Customer can buy multiple ₱199 packs back-to-back

### 3.7 Final delivered state (Screen 6 — view)

After "Accept final":
- The bespoke SVG renders in the existing monogram surfaces event-wide
- Customer can come back to `/bespoke-monogram` to see the final + a download button (SVG + PNG @300dpi)
- 1 "I changed my mind" button — opens a contact-support form (NOT another free refinement; this is for genuine issues like "the AI gave us garbage letters")

---

## 4. Data model (sketch — eng will refine)

```sql
create table bespoke_monogram_orders (
  bespoke_id          uuid pk default gen_random_uuid(),
  public_id           text unique,     -- generate_public_id('B')
  event_id            uuid references events,
  couple_user_id      uuid references auth.users,
  order_id            uuid references service_orders unique,  -- the ₱2,999 base order

  -- Brief (locks after first generation)
  partner_a           text not null,
  partner_b           text not null,
  connector           text not null check (in ('&', 'and', 'at', 'y')),
  name_mode           text not null check (in ('initials', 'full_names')),
  personality_words   text[] not null check (cardinality = 3),
  motif_preference    text check (in ('none','botanical','filipino_heritage','geometric','royal','calligraphic')),
  reference_image_urls text[] default '{}',
  palette_snapshot    jsonb,  -- color from mood board at time of brief

  -- Live state
  status              text not null default 'awaiting_first_render'
                      check (in ('awaiting_first_render','awaiting_customer_pick','refining','final','cancelled')),
  refinements_left    int not null default 30,
  refinements_used    int not null default 0,
  current_top_render_id uuid references bespoke_monogram_renders,
  final_svg_url       text,  -- R2 URL of the locked SVG
  final_png_url       text,
  finalized_at        timestamptz,

  created_at, updated_at
);

create table bespoke_monogram_renders (
  render_id           uuid pk,
  bespoke_id          uuid references bespoke_monogram_orders on delete cascade,
  png_url             text not null,
  dalle_prompt        text not null,
  feedback_at_time    text,   -- what the customer typed before this generation
  generation_round    int not null,   -- 1 = first generation, 2 = first refinement, etc.
  created_at
);

create table bespoke_monogram_refinement_packs (
  pack_id             uuid pk,
  bespoke_id          uuid references bespoke_monogram_orders on delete cascade,
  order_id            uuid references service_orders unique,  -- the ₱199 add-on order
  refinements_added   int not null default 10,
  applied_at          timestamptz
);
```

---

## 5. Customer-facing copy rules

🔴 **Never say:**
- "DALL-E"
- "OpenAI"
- "AI model" or "AI engine" (use "Setnayan AI" instead)
- "Generative AI" (use "AI-powered design")

✅ **Say:**
- "Setnayan AI" (the brand)
- "AI-powered design"
- "Designed by Setnayan AI from your brief"

In loading states, prefer warm phrasing:
- ✅ "Setnayan AI is crafting your monogram..."
- ✅ "Refining your design..."
- ❌ "Generating with DALL-E 3 HD..."

---

## 6. Pricing summary

| SKU key | Display name | Price | What it includes |
|---|---|---|---|
| `bespoke_monogram` | Bespoke Monogram | ₱2,999 | First 4 renders + 26 refinement-generations (30 total renders), final SVG + PNG @300dpi delivery |
| `bespoke_monogram_refinements_10` | +10 Refinements (Bespoke) | ₱199 | 10 additional refinement-renders. Multi-buyable. Only purchasable while customer has a `bespoke_monogram_orders` row not yet `final` |

Existing `Custom Monogram Pack (₱1,999, remove watermark event-wide)` SKU is **retired** — the Bespoke product replaces it. Migration plan: any existing customers who paid for Custom Monogram Pack get a courtesy Bespoke upgrade (their existing watermark removal stays; they get the AI flow as a one-time free unlock).

---

## 7. UI refinement asks for Cowork

Please refine and produce HTML prototype (`0037_bespoke_monogram.html`) showing:

1. **Brief form** — exact layout, chip styles for personality words, file upload area for reference images, copy for the help text under each field
2. **Generating state** — animation/loader concept, microcopy variants for the wait
3. **Refine loop** — refinement counter visual treatment, layout of "top preview + thumbnail strip + chat panel + previous attempts carousel", what suggested-prompt chips look like
4. **Quota-exhausted CTA** — design of the "+10 refinements ₱199" upsell card
5. **Final delivered state** — celebration screen, download button affordances
6. **Mobile responsive treatment** — entire flow on a 390×844 viewport
7. **Edge cases**: brief input lock visualization (so customer sees their inputs greyed out post-payment), Setnayan AI brand mark / logo usage, error states (DALL-E API down, vectorizer.ai down)
8. **Anti-abuse messaging** — clear, friendly explanation that initials/names lock after first render so customer doesn't get frustrated trying to edit them

Use existing Setnayan design tokens: cream / ink / terracotta + lucide-react icons. Reference theme system in `02_Specifications/Theme_System_Implementation_Spec.md`. Match the warmth of 0021 Couple Dashboard.

---

## 8. Acceptance criteria (engineering — for after UI refinement)

1. Brief form rejects submissions where partner_a/partner_b are empty, or personality_words.length != 3
2. After payment is marked paid, brief inputs are read-only on every subsequent view
3. First generation fires automatically within 5 sec of `status = 'awaiting_first_render'`
4. Refinement counter is server-authoritative — client can't fake additional renders
5. DALL-E or OpenAI string never appears in any rendered HTML at customer-facing routes
6. Customer can scroll back to ANY previous render at no cost; refinement cost only applies to NEW generations
7. After `status = 'final'`, no further refinements possible — only contact-support escalation
8. Quota-exhausted state shows the ₱199 add-on card; buying it bumps `refinements_left += 10` atomically
9. Final SVG replaces the event's monogram across QR center, hero, save-the-date — verified via E2E test
10. `bespoke_monogram_orders.palette_snapshot` is captured at brief-submission time (so it's frozen against future palette edits)

---

## 9. Cost economics (owner reference)

- DALL-E 3 HD per generation: $0.080 USD ≈ ₱4.50
- Worst-case API cost per customer (30 refinements all used): 30 × ₱4.50 = ₱135
- Average expected API cost: ~₱30-50 per customer (most use 5-15)
- vectorizer.ai per final SVG: ~₱15
- Total cost ceiling per customer: ₱150
- At ₱2,999 retail: **~95% gross margin** worst case, **~98% average**
- `+10 refinements` add-on at ₱199 sells for ~₱45 cost = ~77% margin
- Even a fully-quota-exhausted customer buying 2 add-on packs (~₱5,000 total, 50 refinements) yields ₱225 cost = **~95% margin**

---

**This is a concept doc. UI/UX details + microcopy + HTML prototype need to land before engineering can build. Cowork — over to you.**
