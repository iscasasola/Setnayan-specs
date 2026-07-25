# Vendor Add-on VARIANT SPLIT — Survey & Build Plan (2026-07-25)

**Companion to** `Vendor_Monetization_Model_LOCKED_2026-07-25.md` (§ 2 add-on prices) and `Vendor_Monetization_BUILD_PLAN_2026-07-25.md` (§ ⏱ BUILD PROGRESS).

Produced by a 13-agent survey + adversarial fact-check of the Vendor AI and Deep Search subsystems against `origin/main` on 2026-07-25 (every claim carries a file:line citation; a second agent tried to refute each survey and its corrections are folded in).

**Status:** § 3 ("safely buildable now") SHIPPED as PR #3702. § 1 (AI Basic vs Advanced) is **BLOCKED ON OWNER**. § 6 is a live trap list — read it before touching any add-on path.

---

# THE BUILD PLAN — AI Chatbot + Deep Search variant split (flag-dark behind `NEXT_PUBLIC_VENDOR_ADDON_TIERED_PRICING`)

Verified against working tree `claude/vendor-3d-ads-gate` @ `5927cdf1f`. Where the six surveys disagree I state the winner and the evidence.

---

## 0. Survey disagreements — resolved before anything else

| Conflict | Winner | Evidence |
|---|---|---|
| shipped-gate-pattern **D4**: "Deep Search is per-search → follow Papic (replace the FINAL price)" | **WRONG. Follow 3D.** | `vendor-deep-search-addon.ts:167-170` — `resolveDeepSearchPricePhp` returns **0** for a Pro+ vendor's first run of the cycle. Replacing the final price with `resolveVendorAddonPricePhp(...)` returns the band price unconditionally and **silently deletes the Pro+ free search**. The band figure must be injected as the `cyclePricePhp` **input**, exactly as `booth-addon-actions.ts:175-178` does. |
| ai-capability-inventory #32: matrix is "INERT / no consumer" | **WRONG** | 4 live consumers: `photo-challenge-actions.ts:197`, `vendor-challenge-section.tsx:71`, `booth-addon-actions.ts:176`, `subscription/page.tsx:198`. Only the **four variant keys** have no consumer. The module header comment is stale. |
| market-intel: "Market Scan needs `max_uses` 8 → 25" | **Overstated** | `vendor-deep-search.ts:109` `MAX_CONTINUATIONS = 4` + the `pause_turn` resume loop at `:301-318` already reaches ~40 searches/run. No constant change required. |
| deep-search fact-check: renaming the DPO control key "silently **un-gates** the feature" | **Backwards** | `data-privacy-controls.ts:332-347` fail-closes to `false`; `deep-search/actions.ts:95` returns an error on `false`. A renamed key with no DB row = Deep Search **permanently OFF**, not open. Still a reason not to rename — just the opposite failure. |
| ai-plumbing: "three user-facing strings hardcode ₱1,500" | **Two** | `ai-addon-actions.ts:173` and `:218`. The third is a JSDoc block on `VENDOR_AI_ADDON_FALLBACK_PHP`. |
| catalog survey: `is_active` is a kill-switch on "every buy action" | **4 of 7** | AI/booth/photo-challenge/deep-search do the explicit `is_active === false` reject. Branch/seat/custom filter `.eq('is_active', true)` and fall back to a **hardcoded literal** — retiring those rows changes the price, doesn't stop the sale. |

---

## 1. THE OPEN PRODUCT QUESTION — what separates AI Chatbot Basic from Advanced

### The two facts that frame everything

**Fact 1 — nothing in the AI Chatbot costs us money per use.** The only Anthropic SDK import in the whole tree is `apps/web/lib/vendor-deep-search.ts:1`. Every auto-reply capability is deterministic regex + Supabase reads. So an AI Basic/Advanced split is a **value fence, not a cost fence** — there is no cost-recovery argument anywhere in it. Only Deep Search burns real money (~₱9/run Haiku, `vendor-deep-search.ts:101-104`).

**Fact 2 — the entitlement is a single boolean with nowhere to put a level.** `inbox-decision.ts:55`: `if (!input.addonActive) return { run: false, reason: 'no_addon' }`. `vendor_profiles` has exactly two AI columns, `ai_addon_trial_used_at` and `ai_addon_expires_at` (migration `20270905761946:92-104`) — I grepped; **there is no variant/level column anywhere**. Today Basic and Advanced would be indistinguishable at read time.

### Candidate A — "Answers" vs "Answers **and acts for you**"

| | Capability | File |
|---|---|---|
| **Basic** | all 8 answers | `answer.ts:59` price · `:77` inclusions · `:93` coverage · `:105` discount · `:118` social proof · `:132` capability · `:138` lead time · `:174` availability |
| | confidence gate + handoff routing | `engine.ts:34`, `MIN_CONFIDENCE` `:21` |
| | daily cap, AI disclosure, single-tenant snapshot | `inbox-decision.ts:52`, `chat-message-stream.tsx:671`, `adapter.ts:87` |
| **Advanced** | compatibility auto-accept | `auto-accept.ts:107` `maybeAutoAccept` |
| | compat scoring + "why you match" | `auto-accept.ts:139-163`, `auto-accept-decision.ts:107` |
| | waiting-high-compat-lead flag | `auto-accept.ts:218-234` |

**Fatal today.** `auto-accept.ts:27-37` documents its own blocker, and I confirmed it: `placeHoldViaRpc` (`:297`) calls `unlock_vendor_event_hold` under the service-role client where `auth.uid()` is NULL → the RPC raises FORBIDDEN → **every auto-accept fails closed to manual**. Advanced would be sold on a feature that has never fired in production. Also the only Advanced capability that **spends the vendor's money** (1 token per accept), which is a hard thing to auto-enable behind a price tier.

### Candidate B — "Answers what's already on your page" vs "Answers what only you know" ← **RECOMMENDED**

| | Capability | File | Built? |
|---|---|---|---|
| **Basic** | price / inclusions / coverage / capability / lead-time / discount | `answer.ts:59, :77, :93, :105, :132, :138` | ✅ shipped |
| | confidence gate, handoff, daily cap, disclosure, isolation | `engine.ts:34`, `inbox-decision.ts:52`, `adapter.ts:87` | ✅ shipped |
| **Advanced** | **real date availability yes/no** | wire `EngineSignals.dateAvailable` (`types.ts:~106`) at `inbox-hook.ts:236`, which today passes `signals: undefined` on purpose | ⛔ unbuilt |
| | **"what your AI has been saying"** report | reads `vendor_bot_replies` (written at `inbox-hook.ts:242-250`, `:269-277`) — **zero readers today** | ⛔ unbuilt, data already there |
| | social-proof selling reply | `answer.ts:118` | ✅ shipped (move to Advanced) |

### Candidate C — the schema's own "Pro" line

`vendor_bot_config.mode='smart'`, `.voice_profile`, `.reply_in_couple_language`, plus the `vendor_reply_templates` table — all declared in `20270822679405_vendor_autoreply_v1_schema.sql:16-20, :45-57`, all with **zero readers or writers** in app code (only doc comments in `config.ts:14` and `autoreply-card.tsx:29`, plus a test at `config.test.ts:89` asserting they're ignored).

**Reject.** "Smart mode" and voice phrasing almost certainly need an LLM, which destroys the ₱0-marginal-cost, ~100%-margin property that makes this product sellable at all, and collides head-on with the owner-locked *"Setnayan AI = deterministic + free (Rule 1)"* decision.

### Recommendation: **Candidate B**, in plain business English

> **Basic answers the questions whose answers are already printed on your page.** Your prices, what's included, what events you cover, how far ahead to book. A couple could have found all of it by scrolling. What they're paying for is that it arrives at 11pm in three seconds instead of tomorrow morning. That's worth ₱1,500–2,000 a month.
>
> **Advanced answers the one question that isn't on your page: "is my date free?"** That answer changes every week, only you know it, and it's the question that decides whether the conversation continues or dies. It's also the honest reason Advanced costs more — building it means us reading your real calendar and capacity, not just re-printing your profile. Advanced also gives you the receipt: a report of every question your AI answered this week, so you can leave it switched on without wondering what it said in your name.
>
> Everything else in Basic stays in Basic. We are not taking a working feature away from anyone to build a paywall.

**Why B beats A and C commercially:** A is unsellable until an owner-open RPC ruling lands. C burns the margin. B fences on something we genuinely have to build, which is the only kind of fence a vendor won't resent.

### Which capabilities cost real money per use (arguing for Advanced)

**None in the AI Chatbot. Zero.** Say this to the owner directly, because it kills one tempting-but-hollow idea: *"Basic 30 replies/day, Advanced unlimited"* would be a pure arbitrage fence — the cap at `inbox-decision.ts:52` protects the **vendor's brand**, not our bill. Vendors will work that out.

The only capability adjacent to this product with a real per-use cost is Deep Search (~₱9/run) — which is exactly why the Deep Search half of this plan can proceed and the AI half cannot.

### ⛔ OWNER SIGN-OFF REQUIRED BEFORE THE AI HALF SHIPS — three questions

1. **Where's the line?** A, B, or C. Recommended: B.
2. **Does the free first cycle apply to Advanced?** `ai_addon_trial_used_at` is one column, one-per-account. If Advanced also gets a free cycle, a vendor who burned it on Basic will demand a second one. Recommended: **free cycle is Basic-only**, no schema change, no double-free.
3. **Do existing Solo AI holders get grandfathered?** At flag-flip, Solo renewal goes ₱1,500 → ₱2,000 (+33%) with **no capability change**. Pro/Enterprise stay ₱1,500. See §4.

Shipping a purchasable `ai_chatbot_advanced` SKU before Q1 is answered means selling ₱1,000/28d for a behavioural difference of nothing. Don't.

---

## 2. Deep Search split — About You is today, Market Scan is net-new

### Is About-You today's behaviour? **Yes, verbatim. Not a rename of anything.**

`SYSTEM_PROMPT` (`vendor-deep-search.ts:132-140`) and `buildUserPrompt` (`:209-221`) research the vendor's **own** business only; inputs are self-only (`vendor-deep-search-run.ts:50-58` — business name, website, one social URL, city, their own claimed services). The vendor types nothing. `Market Scan does not exist in any form.`

Closest prior art, both **not** reusable as-is:
- `buildVendorStudyPrompt` (`vendor-deep-search.ts:183`) — admin-only, still single-subject.
- Market Intel (`demand-radar.ts:272`, `price-position.ts:109`) — internal DB rollups, **already bundled into Pro** via `canSeeMarketIntel` (`vendor-tier-caps.ts:507`). Repackaging it as "Market Scan" would **double-sell what Pro already includes**. Flag to owner.

Also flag: `verified-median-read.ts:39-43` states the price machinery deliberately emits *no* cross-vendor judgement. A Market Scan that names or ranks competitors departs from that posture — counsel review before build, not after.

### Free-per-cycle allowance: **About-You only. Neither shared, nor both.**

Today: `deepSearchHasFreeAllowance = isTierAtLeast(tier,'pro')` (`vendor-deep-search-addon.ts:102`) → Pro/Ent/Custom get 1 free per 28d; Solo always pays. Counted by `countDeepSearchUsesSince` (`:208`) over `vendor_deep_search_uses`, which I confirmed has **no variant column** (migration `20270907924171:100-115`).

Recommend: keep the free run on **About-You**, give Market Scan **no free path at all**. Three reasons:
1. Giving away a ₱2,000 Market Scan once a cycle undercuts the whole reason it exists.
2. About-You free is the "keep your profile fresh" habit loop — that's what it's for.
3. **It sidesteps a live correctness bug.** `deepSearchAiConfigured()` is checked **only on the paid branch** (`deep-search/actions.ts:222`). With `ANTHROPIC_API_KEY` unset, a Pro+ **free** run silently executes `runLiteDeepSearch` (`vendor-deep-search.ts:453`), which fetches the vendor's **own website**. For a Market Scan that would hand back own-site data presented as a competitor scan. No free Market Scan path = no such hole to plug.

### Exact file-by-file change list (Deep Search)

**Do NOT rename `vendor_deep_search`.** It is load-bearing in six places: `vendor_billing_catalog.sku_code`; the literal `orders.service_key` on every in-flight order (`actions.ts:237`); the frozen `EXACT_HOOKS` key (`sku-activation.ts:627`); the `PrivacyControlKey` union (`data-privacy-controls.ts:42, :225`); the seeded `data_privacy_controls` row (`20270912318857:14`); and `privacy-coverage.ts:93`. `vendor_deep_search` **stays** as About-You; Market Scan gets a **new** code.

| File | Change |
|---|---|
| `apps/web/app/vendor-dashboard/deep-search/actions.ts` | Import flag + `resolveVendorAddonPricePhp`. At **:148-152**, `const cyclePricePhp = tieredPricing ? resolveVendorAddonPricePhp('deep_search_about_you', tier) : catalogCyclePricePhp` — **injected as INPUT** to `resolveDeepSearchPricePhp` at `:152`. Free-run branch (`:167-215`) untouched. |
| `apps/web/app/vendor-dashboard/deep-search/page.tsx` | **:95-101** mirror the same ternary before `resolveDeepSearchPricePhp` at `:101`. |
| `apps/web/app/vendor-dashboard/deep-search/_components/deep-search-runner.tsx` | **No change.** Already fully prop-driven via `peso(pricePhp)` (`:29`, props `:30-41`). |
| `apps/web/app/vendor-dashboard/subscription/page.tsx:501-509` | Doorway subline hardcodes "₱500 each" / "₱500 per search" — derive from the resolved band. |
| `apps/web/lib/vendor-deep-search-addon.ts` | **PR-1: no change.** PR-2 adds `VENDOR_DEEP_SEARCH_MARKET_SKU_CODE = 'vendor_deep_search_market'` (must start `vendor_` — see Trap 4) + a `variant` field on the eligibility/price inputs. |
| `supabase/migrations/<new>` (PR-2) | `ALTER TABLE vendor_deep_search_uses ADD COLUMN IF NOT EXISTS variant TEXT NOT NULL DEFAULT 'about_you' CHECK (variant IN ('about_you','market'))` + same on `vendor_web_dossiers` + new catalog row seeded `is_active = FALSE` + widen `vendor_deep_search_uses_free_cycle_uidx` to `(vendor_profile_id, free_cycle_start, variant)`. |
| `apps/web/app/admin/payments/actions.ts:404` | **Widen the `after()` test to both SKUs.** See Trap 1. |
| `apps/web/lib/sku-activation.ts:627` | Second `EXACT_HOOKS` entry for the market SKU. `deactivateOrderSku` needs **nothing** — a completed run is already-consumed (documented `:1489-1490`). |
| `apps/web/lib/data-privacy-controls.ts` | **New** control key `vendor_deep_search_market` + a seeded DB row. The existing control's scope is explicitly *"the vendor's OWN business"* (`:229`) — researching **other** businesses is materially wider and needs its own DPO entry, not a reused one. |

### In-flight and stored dossiers

- **In-flight `submitted` orders**: because `vendor_deep_search` is not renamed, every pending order still resolves in `EXACT_HOOKS` and activates normally. Zero orphans.
- **Stored dossiers**: all existing rows are About-You. `DEFAULT 'about_you'` makes the backfill free — no data pass.
- **Two pre-existing display bugs the variant column will make more visible** (fix in PR-2, cheap): a failed run leaves **no** history row at all (`vendor-deep-search-run.ts:126-162` writes the use row only after `complete`; the free claim is deleted on failure at `actions.ts:195`) — so the "Failed" chip is dead code; and after the 180-day purge (`vendor-dossier-retention.ts:26`) sets `dossier_id` NULL, `page.tsx:183-184`'s `d?.status ?? 'running'` renders every old completed search as **"Running" forever**.

---

## 3. SAFELY BUILDABLE RIGHT NOW — the next PR

**PR-1: put both existing flat SKUs on the tier band. No variants. No new SKUs. No migration.**

This is safe without the owner's answer because **today's capability set lands in Basic under every candidate split** — A, B, and C all keep the existing answers in the base tier. So repricing today's flat SKU to the `ai_chatbot_basic` band commits to nothing about where the Advanced line falls.

### Files

**AI (3D-Booth shape, `booth-addon-actions.ts:139-182` is the template):**
- `apps/web/app/vendor-dashboard/subscription/ai-addon-actions.ts`
  - import `isVendorAddonTieredPricingEnabled` + `resolveVendorAddonPricePhp`
  - after the catalog read at **:138-150**: `const cyclePricePhp = tieredPricing ? resolveVendorAddonPricePhp('ai_chatbot_basic', tier) : catalogCyclePricePhp;` then the **unchanged** `resolveVendorAiAddonPricePhp({ trialUsed, cyclePricePhp })` — free first cycle survives untouched
  - derive `renewalPricePhp = resolveVendorAiAddonPricePhp({ trialUsed: true, cyclePricePhp })` + a `peso()` helper, and **delete the two hardcoded `₱1,500` strings at :173 and :218**
  - **leave the tier gate at :119 alone** (`isTierAtLeast(tier,'solo')`) — see below
- `apps/web/app/vendor-dashboard/subscription/page.tsx` — mirror at **:174-179**, feed `AiAddonCard` at **:466**. `ai-addon-card.tsx` needs **no branch**: all copy already reads `peso(pricePhp)` (`:117, :119, :180, :181, :187`).

**Deep Search:** the three edits in §2 (actions.ts:148-152, page.tsx:95-101, subscription/page.tsx:501-509).

**Tests** (pure layer only, matching the shipped precedent): extend `vendor-addon-pricing.test.ts` and `vendor-deep-search-addon.test.ts` with the flag-OFF byte-identity **loop** over every tier value — copy the strongest existing form, `booth-branding-gate.test.ts:64-73`, not Papic's two-value spot check.

**Fragment:** `changelog.d/vendor-addon-variant-foundation.md` — **ROOT** `changelog.d/`. `apps/web/changelog.d` does not exist and CI enforces it.

### ⚠️ Do NOT copy the Papic/3D "open the tier gate to every tier" move

Both precedents lifted a **Pro+** gate. AI and Deep Search gate on **Solo+** (`ai-addon-actions.ts:119`; `vendor-deep-search-addon.ts:85`). Opening either below Solo requires touching `sku-activation.ts:327` / `:573`, where `assertVendorAddonActivationEligible(ctx, vendorProfileId, 'solo')` **throws** — a Free-tier vendor's paid order would strand as `status='paid'` with a Sentry alert and no entitlement. That file has **zero flag awareness**. Out of scope for PR-1; needs its own decision.

### Migration: **NONE NEEDED for PR-1. Here is why.**

I checked the constraint directly rather than assuming:

- `grep -rln "ai_addon_expires_at\|vendor_deep_search" supabase/migrations/` → 5 files, **all schema/seed/RLS. No `CREATE FUNCTION` gates on either entitlement.** Both gates are 100% TypeScript. (Papic needed a migration only because `papic_create_vendor_challenge` carried a SQL tier `RAISE`.)
- `platform_settings.vendor_addon_tiered_pricing_enabled` **already exists** (`20271001130000:24-25`) and is only read by the Papic RPC — irrelevant here.
- Offering types `vendor_addon_recurring` and `vendor_addon_metered` **already exist** in both CHECKs (`20270907924171:44-70`). No CHECK surgery.
- Both catalog rows already exist. PR-1 adds no SKU, so `price_php > 0` is never in play — the ₱0 paths stay in the TS resolvers where they belong.

---

## 4. Migration plan for existing entitlement holders

### Who exists today

- **AI**: vendors with non-null `ai_addon_trial_used_at` and/or a future `ai_addon_expires_at`.
- **Deep Search**: vendors with rows in `vendor_deep_search_uses` (free-claim or paid).

### At PR-1 flag-flip (no variants sold yet)

| Holder | What happens |
|---|---|
| AI, active window | **Nothing.** `isVendorAiAddonActive` reads the same column; `inbox-decision.ts:55` takes the same boolean. Entitlement untouched, not revoked, not shortened. |
| AI, **Solo**, at next renewal | **₱1,500 → ₱2,000 (+33%), no capability change.** |
| AI, Pro/Ent/Custom, at next renewal | ₱1,500 → ₱1,500. Unchanged. |
| Deep Search, **Solo**, next paid run | **₱500 → ₱1,000 (2×).** |
| Deep Search, Pro/Ent/Custom | Free run still free (`resolveDeepSearchPricePhp` short-circuits before the price); 2nd+ run stays ₱500. Cycle anchor (`tier_expires_at`) unchanged. |
| Anyone with an in-flight `submitted` order | Activates normally — `service_key` doesn't change, `EXACT_HOOKS` unchanged. Note the order was priced at insert, so it settles at the **old** price. Correct behaviour. |

**The Solo increase is the single owner-visible consequence of PR-1 and must be surfaced in the fragment, not buried.** It is a pricing decision hiding inside a plumbing PR. Grandfathering options: (a) accept + announce; (b) freeze Solo holders on the catalog price via a per-vendor legacy marker. There is precedent for (b) — the Website Pro ₱3,500 grandfather. Owner's call.

### At the later variant flip

- **Every existing `vendor_ai_addon` holder maps to Basic.** Backfill `ai_addon_level = 'basic'` in the migration for any row with a non-null `ai_addon_expires_at` **or** `ai_addon_trial_used_at`, **and** read it as `?? 'basic'` in the reader. Both, not either — migrations here auto-apply unreliably on bursty merges, and a partially-applied migration must not silently downgrade a paying vendor to "no level".
- **`vendor_ai_addon` stays the Basic service_key forever.** Adding `vendor_ai_addon_advanced` as a second `EXACT_HOOKS` entry means in-flight orders never orphan and no historical order needs rewriting.
- **Trial**: recommended answer is Basic-only, so nobody who already burned it gains or loses anything. If the owner says otherwise, that needs a per-level trial column and a decision about vendors mid-trial.
- **Deep Search uses**: `DEFAULT 'about_you'` makes every historical row correct with zero backfill.
- **Nobody loses an entitlement at any point in this plan.** No window is revoked, no `is_active` is flipped on a row people hold, no service_key is renamed.

---

## 5. Ordered PR breakdown

| # | PR | Risk (one line) |
|---|---|---|
| **1** | **Flat AI + flat Deep Search onto the tier band, flag-dark. No variants, no migration.** ← *next PR* | Solo renewal rises 33% / 100% at flip — a pricing decision inside a plumbing PR; state it in the fragment and get an explicit ack. |
| **2** | Deep Search variant **plumbing**: `vendor_deep_search_market` SKU seeded `is_active=FALSE`, `variant` columns + widened free-cycle index, second `EXACT_HOOKS` entry, **widen the `after()` test at `admin/payments/actions.ts:404`**, new DPO control key. | Miss the `after()` widening and the admin's Approve click blocks for the full 10–30s run and can strand an order half-activated. |
| **3** | Market Scan **engine**: new system+user prompt, new result type + parser (`VendorDossier` at `vendor-deep-search.ts:42-51` is single-subject), new render, no free path, `deepSearchAiConfigured()` enforced. | Cannot be switched on without DPO + counsel: the existing control is scoped to *"the vendor's OWN business"* (`data-privacy-controls.ts:229`), and `verified-median-read.ts:39-43` says the platform deliberately makes no cross-vendor judgement. |
| **4** | **⛔ BLOCKED ON OWNER** — AI variant plumbing: `ai_addon_level` column + backfill, `vendor_ai_addon_advanced` SKU, second `EXACT_HOOKS` entry, `deactivateOrderSku` branch matching **both** codes. | Shipping a purchasable Advanced SKU before Q1 in §1 is answered sells ₱1,000/28d for zero behavioural difference. |
| **5** | The Advanced capability itself: compute `EngineSignals.dateAvailable` and wire it at `inbox-hook.ts:236`. | Real engineering — needs a calendar/capacity source that doesn't exist yet; `types.ts` contract demands the signal be keyed to `event.primaryDate` or it must hand off. |
| **6** | "What your AI said" panel over `vendor_bot_replies`. | Low. Note `compat_score` is NULL on every non-`auto_accept` row (only `auto-accept.ts:276` writes it), so ordinary replies have no compat context. |
| **7** | *(optional, separate)* Fix the config card to require the add-on. | Independent of the split; see Trap 9. |

Follow the 3D precedent on granularity: **one PR when there's no migration** (PR-1), split only when a migration must land first (PR-2/3).

---

## 6. Traps — specific things in this codebase that will bite

1. **`apps/web/app/admin/payments/actions.ts:404`** — `if (activationCtx.serviceKey === VENDOR_DEEP_SEARCH_SKU_CODE) after(...)` tests **one literal**. Add a second Deep Search SKU without widening it and the market-scan hook runs **synchronously inside the admin's Approve request** for 10–30s. Highest-value single line in this whole plan.
2. **`apps/web/lib/sku-activation.ts:1326`** — `expiryColumn: 'ai_addon_expires_at' | 'booth_addon_expires_at'` is a hardcoded union literal. A per-variant AI expiry column won't typecheck. Sharing one window + a level marker avoids this entirely — another reason to model Basic/Advanced as a **ladder**, not two windows.
3. **`apps/web/lib/sku-activation.ts:327` (and `:573`)** — `assertVendorAddonActivationEligible(..., 'solo')` **throws**, and the file has zero flag awareness. Open the buy gate below Solo and paid orders strand as `status='paid'` with a Sentry alert and no entitlement.
4. **`apps/web/lib/orders.ts:187-203`** — `isVatInclusiveServiceKey = serviceKey.startsWith('vendor_')`. Any new SKU code **must** start `vendor_`, or `admin/payments/actions.ts:235`'s shortfall guard demands base×1.12 and strands every order. The newest add-on seed, **`booth_studio`** (`20270928120000:388`), violates this — do **not** copy it as your template. Copy `20270907924171:72-88` (and keep `price_php` out of the `DO UPDATE SET`).
5. **`apps/web/lib/vendor-deep-search-addon.ts:167-170`** — replacing the **final** price destroys the Pro+ free run. Inject as `cyclePricePhp` **input** (`booth-addon-actions.ts:175-178`). This is exactly where the shipped-gate-pattern survey's own D4 advice would have shipped a revenue-visible regression.
6. **`apps/web/lib/data-privacy-controls.ts:42, :225`** + the seeded row from `20270912318857:14` — the DPO key is the string `vendor_deep_search`. Rename it in TS without a matching DB row and `isDataPrivacyControlActiveWith` fail-closes → Deep Search is **permanently off**. (The deep-search fact-check says "silently un-gates" — that's backwards.)
7. **`apps/web/app/vendor-dashboard/deep-search/actions.ts:222`** — `deepSearchAiConfigured()` guards **only** the paid branch. A **free** run with no API key silently runs `runLiteDeepSearch` (`vendor-deep-search.ts:453`), which fetches the vendor's **own** site. Give Market Scan no free path, or this returns own-site data labelled a competitor scan.
8. **`apps/web/lib/vendor-addon-tier-pricing.test.ts:66`** — `assert.equal(skus.length, 6)`. The four variant keys already exist so PR-1 is fine; add a 7th key and the suite fails.
9. **`apps/web/app/vendor-dashboard/shop/page.tsx:866` + `shop/autoreply-actions.ts`** — the config card gates **only** on `vendorAutoReplyEnabled()`. I grepped: **zero** occurrences of `ai_addon` in `autoreply-actions.ts`. A vendor with no add-on can switch the bot on and it silently never runs (`inbox-decision.ts:55` → `no_addon`). With **two** variants this doubles: a Basic vendor could set Advanced-only knobs. Not a security hole; a real honesty gap.
10. **`apps/web/app/vendor-dashboard/deep-search/page.tsx:183-184`** — `const status = d?.status ?? 'running'`. The 180-day purge (`vendor-dossier-retention.ts:26`) nulls `dossier_id`, so every completed search older than 180 days renders as **"Running" forever**. Also: a failed run leaves **no** history row at all, so the "Failed" chip is unreachable.
11. **`apps/web/app/vendor-dashboard/subscription/ai-addon-actions.ts:173` and `:218`** — hardcoded `₱1,500` in user copy, wrong for every band and every variant. 3D already solved this (`booth-addon-actions.ts:206, :251` use `peso(renewalPricePhp)`); copy that. Note 3D left its own stale *tier* copy behind (`v/[slug]/booth/page.tsx:152`, `booth-addon-actions.ts:141`) — don't inherit that half of the precedent.
12. **Root `changelog.d/`** — `apps/web/changelog.d` does not exist; commit `a24aec23f` exists solely to fix that mistake. CI guard is `apps/web/scripts/lint-changelog-dir.mjs`.
13. **`apps/web/lib/v2-catalog.ts:85-92`** — the `V2VendorSku.offering_type` union is *already* missing `vendor_addon_per_event` and `vendor_addon_metered`, and `fetchV2VendorCatalog` casts with `as`, so it lies rather than failing typecheck. Widen it when you touch it.
14. **`apps/web/app/admin/pricing/_surfaces/pricing-surface.tsx:81` / `:244`** — the row type declares only three `offering_type` values, so `VENDOR_OFFERING_LABEL[row.offering_type]` resolves `undefined` for every add-on row. New SKUs appear at `/admin/pricing` and are price-editable, but render a **blank offering label**.
15. **`vendor_deep_search_uses_free_cycle_uidx`** (`20270912537338:36-38`) — partial unique on `(vendor_profile_id, free_cycle_start) WHERE was_free`. Adding a `variant` column **without** adding it to this index means a Market Scan free claim would collide with the About-You free claim in the same cycle and fall through to paid.
