# Site-vs-Spec Reconciliation — 2026-06-04

> **Why this exists.** The published product on **setnayan.com** has moved ahead of the spec corpus. Owner directive: *"update our files and follow what is already existing on our website."* This report captures the full live catalog, maps every spec→site delta, flags the site's internal contradictions, lists exactly what was changed this session, and gives a file-by-file cascade map for the rest.
>
> **Rule applied:** the **live website is the source of truth.** Where the site contradicts itself, **`/pricing` wins** and the conflict is logged in § 3 for the owner to settle on the site.
>
> **Pages crawled:** `/` · `/pricing` · `/features` · `/for-vendors` · `/how-it-works` (2026-06-04).

---

## 1. Authoritative live catalog (mirror of /pricing)

`[Token]` = "Token Worthy" — redeemable with **vendor** tokens at a rate the vendor sets in their dashboard.

### 1.A Couple-side software SKUs

| SKU | Price | Build state | Site description |
|---|---|---|---|
| Animated Monogram | ₱2,499 | **Live** | Bespoke Monogram with Animation |
| Custom QR per Guest | ₱1,499 | **Live** | 1 QR code per guest (up to 250 pax) |
| Indoor Blueprint | ₱1,499 | **Live** | Guided from entrance to table |
| Papic (5 Seats) `[Token]` | ₱2,999 | **Live** | Unlimited photos + unlimited videos for 5 hours |
| Papic Guest (Disposable Camera) `[Token]` | from ₱2,999 | **Live** | 24 photos + 10 × 5-second videos |
| Setnayan AI | ₱1,499 | **Live** | Assisted planning (the AI planner) |
| High Res Archive | ₱2,999 / yr | In build | Yearly archive, billed per year |
| Live Background `[Token]` | ₱2,499 | In build | LED wall design background with monogram |
| Panood (Website Add-on) `[Token]` | ₱3,499 / day | In build | Live streaming per day embedded on the event page |
| Patiktok `[Token]` | ₱2,499 | In build | Up to 250 TikTok recordings |
| Pro Website `[Token]` | ₱5,499 | In build | Premium invitation + event page + editorial |
| Call-Time Escalator | ₱1,999 | Coming soon | SMS update to all vendors |
| Camera Bridge | ₱1,999 | Coming soon | Connect DSLR to Papic and Panood |
| Guest Stories (Papic Add-on) | ₱1,999 | Coming soon | 30-second story maker for guests |
| Live Venue Photo Wall `[Token]` | ₱2,499 | Coming soon | Live photo collage with live count |
| Pabati | ₱999 | Coming soon | Up to 300 × 5-second videos |
| Pakanta `[Token]` | ₱2,499 | Coming soon | Create a special song for the couple |
| Pakulay | ₱0 | Coming soon | Free mood board · palette + visual identity for every account |
| SDE (Papic Add-on) `[Token]` | ₱3,499 | Coming soon | 3-minute video compilation from Papic |
| Thank You Video (Papic Add-on) `[Token]` | ₱5,499 | Coming soon | 5-minute thank-you video for attendees |

### 1.B Bundles

| Bundle | Price | Scope |
|---|---|---|
| Setnayan Guided Planner Suite | ₱11,999 | one-time, per event |
| Setnayan Comprehensive Media Pack Bundle | ₱16,999 | one-time, per event |

### 1.C Vendor-side (canonical = /pricing)

| Item | Price | Annual | Notes |
|---|---|---|---|
| Pro Vendor (28-day prepaid block) | ₱2,499 / 28 days | ₱24,999 / yr (save ₱7,488 · 23%) | 1 category · 5 sub-seats · free vendor site · 100 free tokens once verified |
| Enterprise Vendor (28-day prepaid block) | ₱5,499 / 28 days | ₱54,999 / yr (save ₱16,488 · 23%) | all categories · unlimited sub-seats · 100 tokens |
| Additional Branch (per branch) | ₱999 / 28 days | — | Pro+ only |
| Feature boost (per feature, 7 days) | 4–100 tokens | — | redeemed from token balance |

**Token packs:** 4 / ₱1,000 · 10 / ₱2,400 · 25 / ₱5,500 · 50 / ₱10,000 · 100 / ₱18,000 (≈ ₱180–250 per token — **pilot** rates; the post-pilot ₱100/token region-weighted model from the 2026-06-04 vendor-token consolidation is not yet on the site). Verified vendors get **100 complimentary tokens** on approval.

### 1.D Money flow (per /pricing)

- **You → Setnayan:** software SKUs at 100% retail. PHP only · BIR receipts every transaction.
- **You → Vendor (off-platform):** settle directly with the vendor. Setnayan takes **0% commission**.
- **Vendor → Setnayan:** 28-day prepaid subscription + token top-ups.

---

## 2. Spec → live deltas (what changed)

| Area | Old spec value | Live site value | Verdict |
|---|---|---|---|
| AI planner | "Setnayan Concierge" ₱4,999 / 12mo (0016) | **"Setnayan AI" ₱1,499**, Live | Renamed + repriced |
| Live broadcast | Panood Daily Broadcast ₱2,499/day (0011) | **Panood (Website Add-on) ₱3,499/day** `[Token]`, In build | Repriced +₱1,000 |
| Monogram | Bespoke Monogram ₱2,999 (0037) | **Animated Monogram ₱2,499**, Live | Renamed + repriced, animation bundled |
| Papic seats | 3-seat ₱1,499 / 5-seat ₱2,499 (0012) | **Papic (5 Seats) ₱2,999** `[Token]` + **Papic Guest (Disposable) from ₱2,999** | Restructured (5-seat + guest "disposable" model) |
| Papic add-ons | SDE ₱24,999, AI highlights under Panood | **SDE ₱3,499**, **Thank You Video ₱5,499**, **Guest Stories ₱1,999** — all Papic-anchored | Reparented + repriced (SDE drastically cheaper) |
| LED maker | LED Background ₱599/₱899 (0005) | **"Live Background"/"Pailaw" ₱2,499** `[Token]`, In build | Renamed + repriced |
| Mood board | Pro Mood Board render packs ₱199–₱24,999 (0010) | **"Pakulay" ₱0** free mood board, Coming soon | Renamed; baseline free |
| Pakanta | 3 tiers ₱1,999 / ₱3,999 / ₱9,999 (0036) | **Single SKU ₱2,499** `[Token]`, Coming soon | Collapsed to one SKU |
| Save-the-Date | Save-the-Date Video ₱199 (0024) | not on /pricing | Likely folded; confirm |
| Tokens | "Wallet retired 2026-05-11 · no tokens anywhere" | **Vendor token economy LIVE** (packs + 100 free + `[Token]` redemption) | Customer wallet retired; **vendor tokens live** |
| Patiktok | Cam Bridge SKUs only (0017) | **Patiktok ₱2,499** (up to 250 recordings) `[Token]`, In build | New retail SKU |
| — | (not in spec) | **Custom QR per Guest ₱1,499**, Live | New |
| — | (not in spec) | **Indoor Blueprint ₱1,499**, Live | New |
| — | (not in spec) | **High Res Archive ₱2,999/yr**, In build | New |
| — | (not in spec) | **Pro Website ₱5,499** `[Token]`, In build | New |
| — | (not in spec) | **Call-Time Escalator ₱1,999**, Coming soon | New |
| — | (not in spec) | **Pabati ₱999** (up to 300×5s), Coming soon | New |
| — | (not in spec) | **Live Venue Photo Wall ₱2,499**, Coming soon | New (was a V2 "don't build" item) |
| Bundles | none canonical | **Guided Planner Suite ₱11,999** + **Comprehensive Media Pack ₱16,999** | New |
| Vendor Pro | ₱499 / week (0022) | **₱2,499 / 28 days** (/pricing) — but site self-contradicts, see § 3 | Changed (contested) |

---

## 3. Site-internal contradictions — OWNER MUST RESOLVE

These block a clean, deterministic price cascade into the remaining specs. Each needs one decision + a single-source fix on the website.

1. **Vendor Pro price — four different values live simultaneously.**
   - `/pricing`: **₱2,499 / 28 days**
   - homepage: **₱1,999 / 28 days**
   - `/for-vendors`: **₱4,999 / week** (founder rate ₱3,999/wk for life)
   - `/how-it-works`: **₱499 / week**
   These are different *business models* (28-day block vs weekly), not typos.

2. **Commission — 0% vs 5%.** Homepage + `/pricing` say **0% commission, vendors keep 100%**. `/for-vendors` says **Setnayan Pay is a flat 5.0%** routed to bank/GCash within 24h. Mutually exclusive customer-facing promises.

3. **Verification badge — paid vs free.** Homepage: **₱1,499 lifetime + ₱499 refresh**. `/pricing` + `/for-vendors`: **free to list, 100 complimentary tokens on approval**. (This is the same open flag noted in the 2026-06-04 vendor-token decision-log row: brief §2.2 ₱1,499 vs Onboarding §8 "Verified = ₱0".)

4. **"Setnayan AI" vs "Setnayan Concierge."** The AI planner SKU is **Setnayan AI ₱1,499**. But `/for-vendors` advertises a *free* **"Setnayan Concierge"** worth **₱2,499** for every couple a vendor books. Same product with two names + two values, or two different products? Decide and unify.

> Recommendation: lock vendor Pro to **one** model (the 28-day ₱2,499 on `/pricing` is the most detailed and internally consistent surface), pick **0% commission OR 5% Setnayan Pay** (not both), decide whether verification is free or paid, and unify the planner name. Then update homepage / `/for-vendors` / `/how-it-works` to match, and the remaining spec cascade (§ 5) can be finished mechanically.

---

## 4. Files changed this session

| File | Change |
|---|---|
| `CLAUDE.md` | Top live-reconciliation banner · SKU table fully replaced with live catalog · Payment section (vendor tokens live) · cost-cheat-sheet staleness banner · 0016 + 0037 iteration-row notes |
| `Pricing.md` | New **§ 0** authoritative live catalog · new **§ 0.1** contradictions · **§ 1** token-rule flipped (vendor tokens live) · header banner |
| `0011_panood/0011_panood.md` | Reconciliation banner (₱3,499/day · Website Add-on · Token) |
| `0012_papic/0012_papic.md` | Reconciliation banner (5 Seats ₱2,999 · Disposable from ₱2,999 · add-ons) |
| `0016_step_by_step_plan_builder/0016_step_by_step_plan_builder.md` | Reconciliation banner (Setnayan AI ₱1,499 · Concierge-name collision) |
| `0036_pakanta/0036_pakanta.md` | Reconciliation banner (single SKU ₱2,499) |
| `0037_bespoke_monogram/0037_bespoke_monogram.md` | Reconciliation banner (Animated Monogram ₱2,499) |
| `0005_led_background_maker/0005_led_background_maker.md` | Reconciliation banner (Live Background / Pailaw ₱2,499) |
| `0034_payments_and_cart/0034_payments_and_cart.md` | Reconciliation banner (vendor token economy live) |
| `DECISION_LOG.md` | 2 dated rows (reconciliation + contradictions) |
| `Site_vs_Spec_Reconciliation_2026-06-04.md` | This report |

**Deliberately NOT edited:** worktree/branch copies (`remove-time-of-day-greeting/`, `.claude/worktrees/`); dated historical handoffs + snapshots (immutable point-in-time records); binary financial workbooks in `05_Financials/` (owner-edited).

---

## 5. Remaining cascade map (prioritized, for a follow-up pass)

Do these **after** the § 3 contradictions are resolved so numbers don't get baked in twice.

**High priority (canonical/cross-referenced):**
- `02_Specifications/07_V1_Developer_Specification.md` — pricing references → live
- `02_Specifications/09_Panood_Feature_Specification.md` — ₱2,499/day → ₱3,499/day
- `02_Specifications/00_Iteration_Connection_Map.md` — token-retired claim → vendor tokens live
- `02_Specifications/18_Concierge_Brain/*` (18 files) — "Setnayan Concierge ₱4,999" → "Setnayan AI ₱1,499" **(blocked on contradiction § 3.4 — confirm naming first)**
- `0022_vendor_dashboard/0022_vendor_dashboard.md` — Vendor Pro ₱499/wk → resolved § 3.1 value; token packs; 100-free-tokens
- `0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md` — active apparatus table → live SKU names/prices
- `0023_admin_console/0023_admin_console.md` — add-on management catalog → live SKUs
- `0024_save_the_date/0024_save_the_date.md` — confirm Save-the-Date still sold (absent from /pricing)
- `0017_patiktok/0017_patiktok.md` — add retail Patiktok ₱2,499 SKU
- `0010_mood_board/0010_mood_board.md` — "Pakulay" naming; free baseline

**Status/handoff docs to refresh (living, not historical):**
- `App_Build_Status.md`, `V1_Gap_Analysis_Status.md`, `Installed_Stack_Inventory.md`, `Feature_Flow_Registry.md`, `System_Wiring_Map_2026-05-28.md`, `Cowork_Pending_Items.md`

**Contracts (legal — owner/counsel review):**
- `01_Contracts/Setnayan_Vendor_Agreement.md`, `01_Contracts/Bridal_Fair_Boost_Service_Agreement.md` — verification fee + commission language depends on § 3.2/§3.3 outcome

**Financial workbooks (owner-edited binaries):**
- `05_Financials/00_Pricing_and_Costs.xlsx`, `Revenue_Projection_Model.xlsx`, `Cost_vs_Revenue_Analysis.xlsx` — reprice rows to live catalog

---

## 6. New / notable naming (the "P-series")

The live product uses a Tagalog "Pa-" service family. Current mapping:

| Brand name | What it is | Old spec name |
|---|---|---|
| **Papic** | Paparazzi guest capture | Papic (same) |
| **Panood** | Live broadcast | Panood (same) |
| **Patiktok** | TikTok-format booth | Patiktok (same) |
| **Pakulay** | Mood board / palette | Mood Board (0010) |
| **Pailaw** | LED background maker | LED Background (0005) — also "Live Background" on /pricing |
| **Pakanta** | Custom wedding song | Pakanta (same) |
| **Pabati** | Greeting videos (up to 300×5s) | *new* |
| **Setnayan AI** | AI planner | Setnayan Concierge (0016) |

---

*Generated 2026-06-04 from a live crawl of setnayan.com. Treat § 1 as canonical until the next sweep; resolve § 3 before the § 5 cascade.*
