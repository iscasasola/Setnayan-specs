# Global-Readiness Groundwork — 2026-06-10

**Status:** DESIGN ONLY · **zero code** · owner-requested *preparation* (2026-06-10). This is a forward-looking blueprint, **not** a V1 deliverable. V1 scope stays locked and Philippines-only; nothing here ships until the owner greenlights a specific country. The point is to (a) write down everything that changes per country and (b) mark the small set of "cheap insurance" structural seams worth taking early so a future expansion is *add-on work, not a rewrite*.

> **Owner intent (verbatim, 2026-06-10):** plans to register the business locally and use each country's local payment systems plus Apple Pay / Google Pay per country. The question answered here is narrow: **can the current system adapt to a new country (e.g. USA or other SEA markets), and what should we prepare?** — *"this is just purely for preparation."*

---

## 0 · The one-paragraph thesis

About **80% of the app is already country-neutral** — events, vendors, guests, seating, the matching engine, QR, galleries, Papic, reels, the render pipeline. A wedding is a wedding in Cebu, California, or Jakarta. The other **~20% is a Philippines-shaped layer** — currency, payments, tax, privacy law, language, wedding-culture content, region/wage logic, timezone. The clean way to expand is a **"country pack"**: bundle everything that varies into one per-country configuration the app routes through, with **PH as pack #1**. Preparing the app = building the *slots* now (cheap, do-once) and filling each country's pack later (real but repeatable). Two foundational seams — **currency-awareness** and a **payment-provider abstraction** — must be done *once, globally* before any country is "easy"; everything else is per-country fill that you do only when that country is actually on the table.

---

## 1 · The country-pack mental model

```
            ┌──────────── COUNTRY-NEUTRAL CORE (~80%, already built) ────────────┐
            │  events · vendors · guests · seating · matching engine · QR ·       │
            │  galleries · Papic · reels · render pipeline · auth · RLS · IDs     │
            └───────────────────────────────┬────────────────────────────────────┘
                                            │  reads "which country?"
            ┌───────────────────────────────▼────────────────────────────────────┐
            │                       COUNTRY PACK  (per market)                    │
            │  currency + price list · payment adapter(s) · tax module +          │
            │  receipt format · privacy/consent profile · language file ·         │
            │  wedding-culture content (faith grid · templates · deadlines) ·     │
            │  region taxonomy + vendor-economics bands · email templates ·       │
            │  data-residency target · domain/SEO                                 │
            └─────────────────────────────────────────────────────────────────────┘
                 PH = pack #1 (the only pack for the foreseeable future)
```

**Why this shape.** Today PH assumptions are scattered through the code. A "pack" makes the variation a *config you add*, not code you *rewrite*. The core never learns about any country; the pack carries all of it. Once the seams exist, "add the USA" becomes "author a US pack," not "re-engineer the app."

---

## 2 · Full per-country change inventory

Everything that varies, why, the **seam to prepare now** (cheap, do-once), and the **per-country fill** (deferred, repeatable).

| # | What changes | Why it varies | Prepare-now seam | Per-country fill |
|---|---|---|---|---|
| 1 | **Currency** | ₱ vs $ vs S$ vs Rp vs ฿ vs RM vs ₫ | `currency_code` on every money table + per-currency **minor-unit** awareness (PH=2 decimals, but **IDR/VND/JPY=0** — "centavos everywhere" silently breaks) | the currency, symbol, format |
| 2 | **Pricing** | A SKU costs different amounts per market; charm endings differ (₱1,499 vs $14.99) | prices become a per-market **price list**, not one hardcoded integer | the local prices |
| 3 | **Payments** | US cards/Apple-Google Pay · SG PayNow · ID GoPay/OVO/DANA · TH PromptPay · VN Momo/ZaloPay · MY FPX/GrabPay | a **payment-provider seam** (one swap point) + an **automated-checkout** flow — today's manual BDO/GCash inbox-matching does **not** generalize | each country's adapter(s) |
| 4 | **Tax** | PH BIR (VAT/percentage, Official Receipt, EWT, Form 2307, eFPS) → US 50-state sales tax → SG GST → ID/TH/VN VAT → MY SST | keep tax a **pluggable module** (0026 already is one) + a **configurable receipt/invoice** template | the country's tax module + receipt |
| 5 | **Privacy law** | PH RA 10173 → US CCPA/CPRA → SG PDPA → EU GDPR → ID/TH/VN PDP laws | a **consent/rights engine** (export · delete · retention) driven by config, not hardcoded RA 10173 | each law's specifics + local DPO |
| 6 | **E-commerce / e-signature law** | PH RA 8792 + RA 11967 → US ESIGN/UETA → local equivalents | keep contract e-sign (0032) law-profile-driven | each jurisdiction's rules |
| 7 | **Language** | UI text · date/number/address formats · name formatting | **externalize strings** into translation files (the EN/TL/CEB toggle is the *mechanism*; text is hardcoded inline today) | each language file |
| 8 | **Wedding culture** | PH faith grid (Catholic/civil/Muslim/mixed) + Filipiniana templates → US secular/denominational; SEA Buddhist/Hindu/Chinese tea ceremony | make wedding-types · faith options · template library **content/config, not code branches** | each market's types + templates |
| 9 | **Geography / regions** | PH 17 regions → US states → SEA provinces; matching radius | region taxonomy **data-driven** (matching already keys on regions — just don't hardcode PH ones) | each country's region list |
| 10 | **Timezone** | PH = **one** timezone; US has 6, SEA spans several. Day-of-guest live mode + wedding-day reminders assume `Asia/Manila` | store **`event_timezone`** per event; stop assuming Manila | nothing — the field just works |
| 11 | **Vendor economics** | Token burn banded to **PH minimum wages** (NCR/CALABARZON…); sub prices PH-set | wage-band → token-price map becomes **config per country** | each country's bands + sub prices |
| 12 | **Communications** | Email global (Resend ✓) but templates + sender domain are PH; no SMS in V1 | localizable email templates + per-market sender domain | translated templates |
| 13 | **Data residency** | **Indonesia & Vietnam legally require in-country storage** | flag before committing to ID/VN — can touch architecture (regional DB) | possibly a regional DB |
| 14 | **Brand / domain / SEO** | "Set na 'yan" is Tagalog; `.ph`; SEO per market | *not a code change* — a positioning decision | per-market domain + SEO |

---

## 3 · The "prepare now" seams (cheap insurance · do-once)

Six items where retrofitting *later* is genuinely painful but seaming *now* is cheap. These are the only things worth touching ahead of a real expansion. **None of them ships in V1** — they're captured here as ready blueprints.

### 3.1 — `currency_code` + minor-unit awareness *(the single biggest one)*

The money tables (e.g. `service_catalog`, `service_orders.amount_php`, budget/ledger integer columns) store **PHP centavos** with no notion of currency. Adding the concept to a small dataset is trivial; retrofitting it onto millions of peso rows later is a migration nightmare.

**Blueprint (not applied):**
```sql
-- forward-compatible, PH-default; every existing row reads as PHP automatically
ALTER TABLE service_orders   ADD COLUMN currency_code char(3) NOT NULL DEFAULT 'PHP';
ALTER TABLE service_catalog  ADD COLUMN currency_code char(3) NOT NULL DEFAULT 'PHP';
-- …repeat on every table that holds a money integer (budget lines, payouts, etc.)

-- per-currency exponent so a stored integer means the right thing
CREATE TABLE currency_meta (
  currency_code char(3) PRIMARY KEY,
  exponent      smallint NOT NULL,        -- PHP=2, USD=2, SGD=2, IDR=0, VND=0, JPY=0
  symbol        text     NOT NULL,
  symbol_before boolean  NOT NULL DEFAULT true
);
INSERT INTO currency_meta VALUES
  ('PHP',2,'₱',true), ('USD',2,'$',true), ('SGD',2,'S$',true),
  ('IDR',0,'Rp',true), ('THB',2,'฿',true), ('VND',0,'₫',false), ('MYR',2,'RM',true);
```
> **Rename note:** the literal column name `amount_php` becomes a misnomer once it can hold USD. A future migration can rename it to `amount_minor` — flagged, not forced. Surface for owner sign-off when it lands.

### 3.2 — `event_timezone` per event *(tiny field, big save)*

```sql
ALTER TABLE events ADD COLUMN event_timezone text NOT NULL DEFAULT 'Asia/Manila';  -- IANA tz
```
Day-of-guest live mode (T-1hr → T+8hr) and wedding-day reminders currently assume Manila. Store the event's own tz now; reminders/live-mode read it instead of a constant. Costs nothing for PH (every row defaults to Manila), saves a data-correctness bug the day a US wedding is created.

### 3.3 — Payment-provider seam

Wrap the current manual BDO/GCash apply-then-pay behind a thin `PaymentProvider` interface (`createCharge` · `confirmCharge` · `refund` · `webhook`), with the PH manual flow as the first implementation. Adding Stripe / Apple Pay / Google Pay later = "write an adapter," not "rewire checkout." **Note:** Apple/Google Pay are *automated instant checkout* — a payment *machine the platform doesn't have yet* even for PH; building it once benefits PH too.

### 3.4 — Externalize UI strings (going forward)

Don't hardcode new English inline; route copy through a strings layer. The EN/TL/CEB toggle already proves the mechanism — this just stops adding to the debt.

### 3.5 — Region taxonomy as data

Matching already keys on regions; ensure new region logic reads a **data table**, not a hardcoded PH enum, so a country's regions are an insert.

### 3.6 — The country-pack object itself

One config the app routes through (`country_pack` keyed on the event's country), PH as pack #1. Even unused, having the *indirection* means country-specific reads have a home instead of scattering.

---

## 4 · Deferred per-country fill (do NOT build now)

Real work, but **repeatable and country-triggered** — only build when a specific market is committed:

- Tax module + receipt format for the country (heaviest: US 50-state sales tax)
- Local payment adapter(s) + Apple/Google Pay
- Privacy-law profile (consent copy, rights flows, retention, DPO)
- Translation file(s) for the market's language(s)
- Wedding-culture content: faith grid, wedding types, template library, statutory deadlines
- Region list + vendor-economics bands (token burn, sub prices)
- Localized email templates + sender domain
- Domain + SEO/GEO + brand positioning for the market

Building any of these *before* a country is chosen is waste — every regime is different and specifics go stale.

---

## 5 · Two honest watch-outs

1. **Data localization (Indonesia, Vietnam)** is the *only* item that can force real architecture (a regional database, not just config). Singapore, Malaysia, Thailand, and the **USA do not require it** — so they are the friendlier first targets. Decide the residency story *before* committing to ID/VN.
2. **Automated checkout (Apple/Google Pay)** is not a per-country tweak — it's net-new payment infrastructure (today's flow is manual reconciliation). Build it once, behind the §3.3 seam; PH benefits too.

---

## 6 · The repeatable recipe (when a real country lands)

Once §3 seams exist, "add country X" is a checklist, not a project:

1. Author the **country pack** (§1): currency + price list · payment adapter · tax module + receipt · privacy profile · language file · region list · wedding-culture content · email templates · residency target · domain.
2. Stand up infra in-region if required (R2 bucket · Supabase region — only ID/VN force a separate DB).
3. Register the local entity + connect local rails + Apple/Google Pay *(owner-side, already planned)*.
4. QA the pack end-to-end against the country-neutral core.

**Easiest first targets:** other SEA markets (wedding culture, e-wallet behavior, and marketplace dynamics are close cousins of PH) over the USA (card-first, 50-state sales tax, different wedding norms) — though both hit the same two foundational seams.

---

## 7 · Recommended near-term groundwork (ranked)

Strictly optional, owner-gated, and **does not violate the V1 lock** (these are inert structural seams, not features):

| Rank | Item | Cost now | Pain if deferred |
|---|---|---|---|
| 1 | `currency_code` + `currency_meta` (§3.1) | Low | **High** — retrofitting money onto live rows |
| 2 | `event_timezone` (§3.2) | Very low | Medium — a real correctness bug on the first non-PH event |
| 3 | Payment-provider seam (§3.3) | Medium | High — checkout rewrite |
| 4 | Externalize strings going forward (§3.4) | Low (habit) | Medium — string-hunt later |
| 5 | Region taxonomy as data (§3.5) | Low | Low–Medium |
| 6 | Country-pack indirection (§3.6) | Low | Low |

Items **1 and 2** are the two pieces concrete and cheap enough to land standalone whenever the owner wants — both are pure-additive, PH-default, zero behavior change. Everything else is design-captured here and waits for a committed country.

---

## 8 · How a new country's marketplace populates (the cold-start loop)

A new country opens with an **empty marketplace** — and that's fine, because the app already ships the engine that fills it. The couple-managed vendor registry (`event_vendor_relationships`, 0006) lets couples **plot their own vendors** (off-platform rows, `marketplace_vendor_id IS NULL`). The **`vendor_invites` flow** (0006, locked 2026-05-19) lets the couple invite that vendor to claim a free Setnayan profile; on claim the new marketplace `vendors` row is **auto-linked back**, flipping the relationship off-platform → on-platform and unlocking chat. Net effect: **every couple who lists their own vendors is seeding the local marketplace** — the directory bootstraps itself, couple by couple, with no manual seeding.

> **Build-state note:** the couple-managed registry is core to shipped 0006/0007. Confirm the `vendor_invites` claim flow is wired in the live app (vs. spec-only) before leaning on it as the primary US/SEA growth engine.

### The money line — what works pre-pack vs. what waits

The split that makes "the rest are the same" precise: **everything that doesn't route money through Setnayan works in a new country today.** Only paying **Setnayan itself** hits the currency/payment/tax pack.

| Capability | Works in a new country **today**? | Why |
|---|---|---|
| Guest list · QR invites · seating · mood board · schedule · budget tracking | ✅ Yes | Country-neutral core |
| Plot own vendors → invite → marketplace grows | ✅ Yes | Registry + `vendor_invites` are country-neutral |
| Chat with vendors after they join | ✅ Yes | Country-neutral |
| **Pay a vendor** | ✅ Yes | Vendor↔customer money is **off-platform everywhere** (RA 11967) — Setnayan never touches it, so no currency work needed |
| **Pay Setnayan for its own SKUs** (Papic · Monogram · Save-the-Date · Pakanta · Panood) | ⛔ Waits on the pack | Needs currency (§3.1) + payment rail (§3.3) + tax/receipt (§2 #4) |
| **Paid vendor tiers + token economy** | ⛔ Waits on the pack | Priced in PHP, banded to PH wages |

### Phased expansion this unlocks

- **Phase 0 — open the doors (≈works now):** couples plan free, plot + invite their own vendors, the marketplace self-seeds. Setnayan earns nothing yet but **acquires couples *and* vendors ahead of any monetization spend.**
- **Phase 1 — flip on monetization:** once the country pack (currency + payment + tax) is in, turn on paid Setnayan SKUs + paid vendor tiers in local currency. The already-seeded marketplace now has something to buy.

The unpaid product *is* the customer-and-vendor acquisition engine — a country can **grow before its money layer exists.**

### The standalone-DIY floor (the real reason this works anywhere)

The marketplace isn't just *optional* — a couple can run their **entire** wedding with the marketplace empty and **no vendor ever joining.** Manually-added (off-platform) vendor records already carry full **price + inclusions + payment milestones**, all couple-managed and private (the vendor is never contacted and never sees the couple's numbers). The 2026-06-10 manual-add refinement (see `0006 § DESIGN ADDITION — 2026-06-10`) formalizes this: at add-time the couple chooses **"Connect to Setnayan?"** (Yes = invite/seed the marketplace · No = manage it yourself), and gains couple-side structured service-linking so they can compose their own packages. Net effect: **"manage everything from our app" holds with zero vendors, in any country** — the strongest country-neutral floor there is.

---

## 9 · Platform commission — the per-channel pricing axis (iOS / Android IAP)

Expansion adds a dimension beyond *country*: the **sales channel** (web · iOS · Android). Apple and Google take **15–30%** of any **digital** good sold via in-app purchase (IAP) — likely **15%** for Setnayan at first (Apple Small Business <$1M/yr · Google first-$1M rate). The same SKU nets less in-app than on web.

### The split — only Setnayan's *own digital* SKUs are affected

| Money type | Apple/Google cut? | Why |
|---|---|---|
| **Vendor bookings** (real-world services — photo, catering, venue) | **None** | Store cut applies to *digital* goods only; real-world services are exempt — **and** these are already off-platform (RA 11967). Double-safe. |
| **Setnayan's own digital SKUs** (Papic · Animated Monogram · Save-the-Date · Pakanta · Panood) | **15–30% if sold via IAP** | These are digital content consumed in-app → store IAP rules apply. |

So it's not "in-app services cost more everywhere" — it's "the renders/templates/digital features we sell *ourselves* lose 15% when bought inside the app store." Vendor money is untouched.

### The cut is itself a per-country variable (stacks on currency + tax)

- **USA (2025 Epic v. Apple ruling) + EU (DMA):** stores must allow **link-out to web checkout at reduced/zero fee** → the cut is largely *avoidable* in these markets.
- **Philippines + most of SEA:** legacy rules hold — digital goods must use IAP at full 15–30%.

→ "the % the store takes" belongs **in the country pack** alongside currency and tax.

### ⚠ Setnayan-specific rejection risk (decide before store submission)

The mobile app is a **Capacitor remote-URL WebView loading setnayan.com** (0052 · [[project_setnayan_native_shell_capacitor]]). Selling digital SKUs inside it through *Setnayan's own* web checkout instead of IAP is the **#1 App Store rejection trigger** (Guideline 3.1.1 — apps may not use their own mechanism to unlock digital content/functionality). For the digital SKUs this is an **app-approval** question, not just a margin one, and it differs per market. **A deliberate per-store, per-country stance is required before iOS/Android store submission** (iOS app not yet generated — 0052).

### Architecture impact — a channel axis on the price seam

The §3.1/§3.2 price seam gains a third axis: **price + take-rate per (country × channel)**, channel ∈ {web, ios_iap, android_iap}.
- **IAP = just another payment provider** behind the §3.3 seam: StoreKit (iOS) · Play Billing (Android) · web rail (browser). Same pattern, new adapters.
- **Per-SKU policy knob:** absorb the cut · mark up the in-app price · or sell web-only.
- **Take-rate is config** so US/EU link-out allowances lower it without code.

### Recommended posture (web-first)

**Sell the digital SKUs on the web; keep the native app for the experience.** Where rules allow (US/EU), steer purchases to the browser and keep ~100%. Where they don't (PH/SEA), either run IAP and accept ~15%, or keep those SKUs web-only with a system-browser hand-off to buy — within each store's steering rules. **Vendor bookings stay off-platform everywhere, untouched.**

---

## 10 · Channel-aware price model (the data shape for §9)

The concrete shape that lets one SKU carry web / iOS / Android prices. **Applies only to Setnayan's own digital SKUs** (`is_setnayan_service = true` + digital deliverable — Papic, Monogram, Save-the-Date, Pakanta, Panood). **Vendor bookings have no channel axis** (off-platform, RA 11967 — never an IAP). Three tables + a derivation rule (blueprint, not applied):

```sql
-- (a) base price list — the WEB reference price, per SKU × country  (= §3.2)
service_price_list(service_key, country_code, currency_code, base_minor, …)

-- (b) store commission — admin-editable config, per country × channel
channel_take_rate(
  country_code, channel,        -- channel ∈ 'web' | 'ios_iap' | 'android_iap'
  take_rate_bps,                -- web=0 · ios/android=1500 (15%) or 3000 (30%)
  external_link_allowed BOOLEAN -- US (2025 Epic) / EU (DMA) = true → can route to web at 0
)

-- (c) per-SKU channel policy
service_channel_policy(
  service_key, channel,
  policy,            -- 'absorb' | 'markup' | 'web_only'
  store_price_tier   -- snapped Apple/Google tier (IAP can't price arbitrarily)
)
```

**Derived display price, per channel:**
| Channel × policy | Buyer sees | Setnayan nets |
|---|---|---|
| web | `base_minor` | ~100% (less web processor fee) |
| IAP · `absorb` | `base` snapped to nearest store tier | `base × (1 − take_rate)` |
| IAP · `markup` | `base ÷ (1 − take_rate)` snapped **up** to a store tier | ≈ `base` |
| IAP · `web_only` | not sold via IAP — in-app "buy on web" hand-off where `external_link_allowed` | ~100% |

**Two IAP realities the model must respect:**
1. **Fixed price tiers.** Apple/Google IAP prices snap to *their* tier ladder — you can't charge an arbitrary amount. So `markup` rounds *up* to the nearest tier (`store_price_tier`), not to an exact gross-up.
2. **Settlement is delegated.** For IAP the **store sets the buyer's local currency** (tax-inclusive, store-localized FX) and **pays Setnayan monthly, net of its cut.** So the IAP "payment provider" adapter (§3.3) reconciles against **store payout reports**, not a direct charge — a different settlement model than the web rail. This *simplifies* IAP currency (the store localizes for you) at the cost of control.

**Net:** the §3.2 price list gains channel rows; §9's take-rate becomes table (b); the per-SKU absorb/markup/web-only decision is table (c). All admin-editable config — no code change when a tier or a country's `external_link_allowed` flips.

---

*Companion: this doc amends nothing that's shipped; it sits alongside `Storage_and_Drive_Copy_Architecture_2026-06-03.md` as a design note. When expansion gets real, the per-country fill (§4) becomes a new iteration; the seams (§3) become small migrations. App-store submission prereqs live in `09_Operations/App_Store_Launch_Checklist_2026-06-10.md`.*
