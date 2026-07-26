# Vendor Monetization — 7-Track Ship-Readiness Report (2026-07-26)

> Produced by 7 parallel builders + 7 adversarial reviewers + a synthesis pass. Verdict: **0/7 SHIP**. Flag-OFF byte-identity held on all seven, so nothing endangers production today.

# Vendor Monetization — 7-Track Ship Readiness

**Headline: zero of seven are SHIP.** Every branch is flag-dark and flag-OFF byte-identity survived adversarial attack on all seven — so nothing here breaks production today. But every track has at least one reviewer-confirmed defect that detonates the moment its flag is flipped, and **two findings are live money/trust holes on `main` right now, independent of all seven branches.**

---

## 1 · Track-by-track

| Track | Branch | What it does | Flag | Migration | Verification | Verdict |
|---|---|---|---|---|---|---|
| **cap-ui** | `claude/vendor-cap-fully-booked-ui` | Turns the free-tier 3-booking cap from a raw Postgres error into a friendly "Fully booked" refusal on the couple's booking CTAs. | `NEXT_PUBLIC_VENDOR_FULLY_BOOKED_UI` (+ `NEXT_PUBLIC_VENDOR_FREE_BOOKING_CAP`) | No | Unit 3396/0 fail; typecheck only **scoped** (full-repo run never completed); no DB test | **FIX-FIRST** — pre-check gated on a dead flag decoupled from the real DB switch; one documented flip step takes a couple's downpayment and records no booking. |
| **two-ring-reach** | `claude/vendor-two-ring-reach` | Gives each vendor two radii: an inner ring where travel is free and an outer ring that bounds who can find them. | `NEXT_PUBLIC_VENDOR_REACH_RINGS_V1` | **Yes** `20271003528118` | Unit 3386/0; DB 7/7, migration-pinning falsified correctly; typecheck clean | **HOLD** — a paid upgrade can silently deliver zero extra reach *permanently*; the free-transport lock is dead code with zero call sites; the ring banner is a trilateration oracle that leaks the couple's venue. The privacy fix is a design change (snapshot at accept), not a patch. |
| **boost-featured** | `claude/vendor-boost-featured` | Replaces unbounded pay-for-placement with merit ranking plus at most 2 labelled "Sponsored" slots. | `NEXT_PUBLIC_VENDOR_RANK_BOOST_ENABLED` | **No — and it needs one** | Unit 3388/0; typecheck clean; lint not run; **zero tests on the riskiest file** (`category-search.ts`) | **FIX-FIRST** — the featured gate trusts a vendor-writable column (a fraud-suspended vendor can PATCH itself into the top slot), and featured rows bury better free vendors by 10 points against a 6-point ceiling, breaking the owner's §5 "never buries a better vendor" lock. |
| **team-roles** | `claude/vendor-team-roles-financial-secretary` | Adds Financial and Secretary roles to a vendor's team with a capability matrix. | `NEXT_PUBLIC_VENDOR_TEAM_ROLES_V2` | **Yes** `20271003612974` | Unit 3379/0; DB 12/12, falsified correctly; typecheck clean | **HOLD** — the headline promise ("Financial cannot read client chat") is unenforced *and* structurally unenforceable via the flip plan the branch itself prescribes. The entire 11×6 capability matrix has zero call sites. |
| **tier-gate-flips** | `claude/vendor-tier-gate-flips` | Ties SEO richness (structured data + sitemap priority) to the vendor's paid tier. | `NEXT_PUBLIC_VENDOR_SEO_TIER_GATE` | No | Unit 3399/0; typecheck clean; **source-scan guards independently verified to fail on revert** — the only track with proven-falsifiable integration tests | **FIX-FIRST** — closest to shippable. Two small patches: lapsed subscriptions keep the paid SEO forever, and a schema-skew fallback republishes demo/unverified vendors to crawlers. |
| **launch-window** | `claude/vendor-launch-window-coverage` | Makes plans and three add-ons cost ₱0 through 30 Nov 2026. | `NEXT_PUBLIC_VENDOR_LAUNCH_FREE_WINDOW` (pre-existing) | No | Unit 3364/0 — but **all 12 new tests pass with the entire behavioural change reverted** | **HOLD** — flag-ON is a closed loop: plans become unbuyable, so the "free" AI add-on becomes unobtainable, and paid vendors who lapse mid-window cannot renew. The page also still sells Custom (₱8,999+) three inches below a banner saying every paid plan is free. |
| **ai-advanced-voice** | `claude/vendor-ai-advanced-voice-match` | Makes the auto-reply bot sound like the vendor — precomputed phrasing envelopes, no LLM, ₱0/reply. | `NEXT_PUBLIC_VENDOR_AI_VOICE_MATCH` | No | Reviewer measured **3422 pass / 4 fail**, not the claimed 3426/0 (the 4 are pre-existing pHash tests, but the report is wrong); typecheck clean | **FIX-FIRST** — the flag-off test suite pins a parameter no call site passes (delete the real gate: suite still green), vendor "voice" fragments launder past the off-platform-contact filter, and it makes a live ₱13k/vendor/yr entitlement leak actually valuable. |

---

## 2 · Blocking defects

### ⚠️ Two of these are already live on `main` and belong in a hotfix, not in any of the 7 branches

**L1 · Any vendor can mark themselves "verified."** `guard_vendor_profiles_entitlement` covers `tier_state`, `tier_expires_at`, `extra_agent_seats` and four add-on columns — but **not** `public_visibility` or `verification_state`, while `vendor_profiles_owner` is `FOR ALL USING (user_id = auth.uid())`. A single PATCH sets `public_visibility='verified'`, and the same PATCH reverses a fraud suspension's visibility freeze. *Fix: extend the guard function with both columns on INSERT and UPDATE.* Found by boost-featured's reviewer; the branch declared `migrationFile: null`, which is wrong — it either brings this migration or it doesn't ship.

**L2 · Buy AI Advanced once, renew on Basic forever.** `lib/sku-activation.ts:391-394` reads `ai_addon_level` with no window check and `nextVendorAiLevel` takes the higher rung; the marker is never cleared on lapse. Buy Advanced → let it lapse → renew Basic → Advanced re-arms. ~₱1,000/cycle × 13 = **₱13,000/vendor/yr**. Harmless while Advanced was an empty rung; `ai-advanced-voice` is what makes it worth exploiting. *Fix: `isVendorAiAddonActive(currentExpiry) ? level : null`.*

### cap-ui
1. **HIGH · Money out, no booking, no ledger row.** With the UI flag on and the DB switch on but the pre-check flag off — the builder's own recommended sequence — `downpaymentGate()` fires first, the couple pays out-of-band and uploads proof, the re-submit trips the cap, and the ledger insert at `actions.ts:2106` sits *after* the lock write so it never runs. *Fix: delete `isVendorFullyBookedPreCheckEnabled()`; read `platform_settings.free_tier_booking_cap_enabled` directly so the pre-check and the trigger agree by construction.*
2. **HIGH · Inverse of the same defect:** with both env flags on and the DB switch off, every free vendor at ≥3 rows is refused while the trigger is inert. Lost bookings with the cap not even enabled.
3. **HIGH · The cap counts rows, not clients.** One 4-item package booking exhausts a free vendor's entire "3 concurrent bookings." *Fix: `COUNT(DISTINCT ev.event_id)` on both the trigger and the server read.*
4. **HIGH · Two wizard lock paths still leak raw SQL** (`wizard-actions.ts:488`, `:1167`), including the vendor's internal ID. Disclosed by the builder; it falsifies the PR's premise that the DB switch is now safe to flip. *Fix: 6-line paste of the pre-check + error translation.*
5. **MEDIUM · The "test pins the migration message" claim is false** — proven by rewording the RAISE and watching 15/15 still pass. Reword the trigger and every couple silently gets raw Postgres again.
6. **MEDIUM ·** `pending-lock-proposals.tsx` sends the couple to a card whose CTA is disabled, telling them to "finish the details." There are none. 2-line fix.

### two-ring-reach
1. **HIGH · A paid upgrade delivers no extra reach, permanently.** The settings card is seeded with the *derived* radius, so any save destroys the `NULL` sentinel that means "follow my plan's cap." Solo vendor saves once, upgrades to Pro (₱2,499/28d, advertised 60 km), gets 30 km forever — under a card that says "Upgrade to reach farther." *Fix: write `NULL` when the value equals the tier cap.*
2. **HIGH · `enforceFreeTransport` has zero call sites — it is dead code.** The changelog claims free transport is "ENFORCED"; it is a disabled `<select>`. A crafted POST attaches a ₱15,000 Transportation line to a Ring-1 quote and the couple is billed. *Fix: one call in `sendCustomProposalCore` after the thread gate.*
3. **HIGH · Venue trilateration.** The vendor controls both the threshold (their own slider) and the reference point (their own HQ pin), and the thread page recomputes live on every load. ~6 saves binary-search the distance; move the HQ pin twice more and you have the couple's venue to ~1 km. ~20 clicks, entirely in-UI, net-new disclosure. *Fix: snapshot the ring once at accept time; never recompute from vendor-writable inputs.*
4. **MEDIUM · The Ring-2 slider has `min={0}`,** which is exactly the value the parser rejects because it means "invisible to every couple" — and per defect 1 it is permanent.
5. **MEDIUM · A transient tier-read failure downgrades an Enterprise vendor to the Free 30 km cap, durably.** Should abort, not degrade.
6. **TESTS ·** the three files where defects 1, 3, 4 and 5 live have **zero** tests; five tests cover a function nothing calls.

### boost-featured
1. **BLOCKER · Featured slots bury better free vendors by 10 points against a 6-point ceiling,** because the composed order is `[relationship, featured, organic]` and `FEATURED_MERIT_FLOOR_DELTA = 10` > `MAX_TIER_BOOST_POINTS = 6`. Directly violates model §5. The branch's own test asserts the *sub-list* order, so the violation ships green. *Fix: require the slot-holder to already be top on merit, or set the delta ≤ 6. Add a test over the composed order.*
2. **BLOCKER · The featured "verified" gate trusts `public_visibility`** — see **L1**. A fraud-suspended paying vendor PATCHes itself back to `verified` and lands in a top-of-page Sponsored slot.
3. **HIGH · 15 merit points are purchasable.** The auto-reply bot stamps `vendor_first_reply_at`, and the auto-reply engine is gated on the paid AI add-on. ₱1,500/28d buys 15 of 100 merit points — 2.5× the entire declared paid ceiling. The branch declares zero dependency on the autoreply track. *Fix: skip bot-authored messages in `stamp_vendor_first_reply`, or drop `respondsFast` from merit.*
4. **MEDIUM · Deleting your facet tags is worth +5 merit; tagging honestly is worth 0.** Vendor-controllable, 83% of the paid ceiling, and it destroys the data the rest of search depends on.
5. **MEDIUM ·** the over-budget down-rank silently stops running on the ON path while the UI keeps nudging about it.
6. **MEDIUM ·** categories with fewer than 4 vendors sell Enterprise **zero** slots, silently, at ₱7,999+/28d.
7. **MEDIUM ·** §5 is implemented in **one of five** vendor lists. `vendor-counts.ts`, `/explore`, the 3D-plan demo and `build-3state-actions.ts` all still order by unbounded `ad_rank`. Flipping the flag makes the platform contradict itself: merit-first in the overlay, pay-to-win in the grid couples see first.

### team-roles
1. **BLOCKER · The owner's "Financial cannot read client chat" lock is unenforced and structurally unenforceable.** `canReadClientChat()` — whose docstring says it exists so the rule "can never be refactored away" — has zero call sites, as do all 11 capability predicates. Vendor chat is gated only by `current_vendor_ids('viewer')`, a single scalar rank. Any rank high enough to let Financial see billing (≥3) automatically clears chat (≥1). **The prescribed follow-up is the change that breaks the lock, and nothing goes red.** Worse: `resolveVendorRole` returns `null` for `financial`, and `filterVendorNavGroups(groups, null)` **keeps the customers hub** — so on flip day the role is handed the Messages tab it was told it can't have. It is empty today only because RLS returns zero rows, which is a fail-closed accident, not a boundary. *Fix: split the RLS helper (`current_vendor_ids_billing`) or add a route guard; do not ship the role until the boundary is server-side.*
2. **HIGH · `vendorRoleCan` fails OPEN for a non-member** — `view_schedule` returns `true` for `null`, `undefined`, `''` and `'customer'`. The docstring claims least-privilege. Any future call site fed by a nullable membership lookup grants a non-member the schedule. *Fix: unknown role → no caps, never viewer, for authorization.*
3. **MEDIUM · The assignment notification fires on revocations and no-op saves,** with a misleading count: strip 4 of 5 services and the member is told "You've been assigned 1 service." *Fix: notify on the delta, not the new total.*
4. **MEDIUM ·** capabilities take role but never tier, so a Pro store that downgrades to Solo keeps a Pro-only role forever — the inverse of the read-time-lapse pattern this repo established two migrations earlier.
5. **TESTS ·** the two functions that actually implement flag-OFF have no test; mutate them to accept `financial` with the flag off and all 3379 tests still pass. The one unknown-role test asserts 3 of 11 capabilities and skips the only one that fails.

### tier-gate-flips
1. **HIGH · Lapsed paid vendors keep the paid SEO entitlement forever.** Tier lapse in this codebase is login-driven (`sweep_vendor_tier_expiry` fires only from the vendor dashboard layout) — and a public page render and a crawler hit are exactly the two paths where nobody is logged in. `tier_expires_at` is never consulted. Both sibling gates in the same directory explicitly defend against this and say so in their doc comments. *Fix: collapse a lapsed tier to `'free'` at both call sites using `vendorHoldsActivePaidSub`.*
2. **MEDIUM · The new skew fallback republishes demo and unverified vendors to crawlers,** because routing a `tier_state` 42703 into the bare fallback drops both the `verification_state` and `is_demo` filters. Before this change that path was unreachable. *Fix: split the regex.*
3. **MEDIUM ·** the legacy-select fallback silently de-enriches a *currently paying* vendor — the only fallback in that file that degrades toward withholding a purchased entitlement rather than hiding something.

### launch-window
1. **BLOCKER · The AI add-on is advertised free and is unobtainable.** It hard-requires a paid tier; the only in-app writer of a paid tier is the purchase this PR disables. The card literally says "Free through 30 Nov 2026" directly above "Upgrade above to add it" — pointing at the disabled button. And the builder's named mitigation (a `promo_free_windows` tier promotion) is a no-op here: every billing surface reads raw `tier_state`, not `resolveVendorTier`.
2. **BLOCKER · Paid vendors silently lose their tier mid-window with no way to renew.** A Pro vendor expiring 15 Sep lapses to Free on their next dashboard load and stays there until 1 Dec — losing reach, seats, listings, branches, market intel, favorites, and all three "free" add-ons.
3. **HIGH · The page collects money for something it just said is free.** "Every paid plan is free through 30 Nov" and 43 lines later a live Custom-plan link that bills ₱8,999+/28d.
4. **MEDIUM · In-flight `pending_payment` subscriptions survive the flip and are still collected.** A vendor who ordered on 31 Jul pays off the emailed reference code on 1 Aug and an admin approves it — the exact failure this PR exists to prevent.
5. **TESTS ·** proven worthless: revert all 11 consuming files to `origin/main` and 12/12 still pass. No test imports any changed action or component. Every claim carrying money risk (trial not consumed, no stacking, no `payments` row, no order minted) has zero coverage.
6. **LOW but on the money path ·** `vendorLaunchFreePricePhp` fails **open** — a `NaN`/negative base returns 0 (free) on the *not-free* branch, where main took the paid path.

### ai-advanced-voice
1. **BLOCKER · L2 above** — this branch is what makes the ₱13k/yr leak worth exploiting.
2. **BLOCKER · Voice fragments launder around the off-platform-contact filter.** `"Add us on Viber"`, `"Message us on Messenger"`, `"Text us on WhatsApp"` all pass `sanitizeVoiceFragment` (which only screens digits, ₱, @, URLs) and render on ~3 of 4 envelopes. A human vendor typing the same string is **blocked** by `chat-contact-filter.ts` (PR #3606) — but the bot inserts via the admin client and never runs the filter. Set once, ships on every auto-reply to every couple, in an AI-authored message. *Fix: call the existing `evaluateMessage()` blocklist in the sanitizer — verified to block all 5 attack strings and break none of the 12 legitimate greetings.*
3. **HIGH · The flag-off invariant is pinned on an unreachable parameter.** `voice-runtime.ts:94` hardcodes `flagEnabled: true`; the real gate at `:57` has no test. Deleting it changes the suite result by exactly nothing. 36 assertions testing a value production never passes. *Fix: thread `vendorVoiceMatchEnabled()` through, as the repo already does in `inbox-decision.ts`.*
4. **LOW ·** the vendor preview shows text couples will never receive (real `buildAnswer` output collides with the lead-in), contradicting the card's own "what you see is what couples get."
5. **Trust note ·** `VoiceMatchSection` omits the `isDataPrivacyControlActive('vendor_ai_autoreply')` check the server enforces, so the panel renders fully editable while the privacy control is pending and only fails on Save.

---

## 3 · Cross-track conflicts and merge order

**Hard file collision — exactly one:**
- `apps/web/app/vendor-dashboard/shop/page.tsx` — **two-ring-reach** (Coverage card) ∧ **ai-advanced-voice** (Voice Match panel). Both add an isolated render block; the second to land **must rebase**. No other pair of branches touches the same file.

**Near-misses that are NOT textual conflicts** (worth knowing before you assume they're independent):
- `app/dashboard/[eventId]/vendors/` — cap-ui edits `actions.ts` + `_components/accordion-lock.tsx`; boost-featured edits `_actions/category-search.ts` + `_components/category-search-overlay.tsx`. Same directory, disjoint files.
- `lib/vendor-tier-caps.ts` — **tier-gate-flips modifies it**; boost-featured and two-ring-reach both read it. No git conflict, but a **semantic** one: boost-featured keys `TIER_BOOST_POINTS` off `VENDOR_TIERS` order, so any reorder silently changes Featured-slot priority with no type error.
- `changelog.d/` — one unique fragment per branch, conflict-free by design. All seven correctly used the **root** directory, not `apps/web/changelog.d/`.

**Two live, contradicting reach ladders after two-ring-reach lands:** `TIER_CAPS.serviceRadiusKm` (0/20/20/50/100) vs `RING2_CAP_KM` (30/30/30/60/100). On flip day every Solo vendor's discovery widens 20→30 km, and `TIER_CAPS.free.marketplaceSearchable = false` directly contradicts both the Ring-2 model and boost-featured's "merit for everyone including Free." **Whoever merges second inherits this; nobody owns it today.**

**Migration ordering:** two new files, no collision — `20271003528118` (two-ring-reach) and `20271003612974` (team-roles). But team-roles' prefix sorts **before** `20271003734490_live_studio_moderator_control_access.sql`, already on `main`. Not fatal (`db push --include-all`), but it breaks the monotonic-prefix assumption the workflow relies on. **Regenerate it.** Re-run `check-migration-timestamps.mjs` at merge time — seven agents allocated timestamps concurrently.

### Recommended merge order

| # | Track | Why here | Rebase? |
|---|---|---|---|
| **0** | **Hotfix migration** — add `public_visibility` + `verification_state` to `guard_vendor_profiles_entitlement`; add the window check in `sku-activation.ts:391` | Both are live holes today; boost-featured is blocked on the first | New branch |
| 1 | **tier-gate-flips** | Smallest surface, only track with proven-falsifiable integration tests, and it's the one that touches `vendor-tier-caps.ts` — land it before the two readers | Already rebased onto `885094907`; re-verify |
| 2 | **cap-ui** | No file overlap with 1; blocks nothing | Yes |
| 3 | **boost-featured** | Reads the `vendor-tier-caps.ts` from step 1; depends on step 0's migration | Yes |
| 4 | **ai-advanced-voice** | Takes `shop/page.tsx` first (smaller, self-contained panel) | Yes |
| 5 | **two-ring-reach** | **Will need a rebase on `shop/page.tsx`** | Yes — guaranteed conflict |
| 6 | **team-roles** | HOLD; migration timestamp must be regenerated first | Yes |
| 7 | **launch-window** | HOLD; needs a design change, not a patch | Yes |

**All seven need a rebase regardless of order** — every branch was cut before the Live Studio wave-5/6 merges (#3709/#3711). Per the tier-gate builder's own note, merging one of these stale trees would have **silently reverted those merges with no git conflict**. That is the #3668 failure mode, which erased two merged PRs. Rebase, verify the diff is exactly the declared file list, then merge. Do not batch-merge these.

---

## 4 · Owner decisions needed (plain English)

**Money and fairness**
1. **The free plan's "3 bookings" — is that 3 clients or 3 line items?** Today a couple booking one 4-item package uses up a free vendor's entire allowance. They hold one client and the system says they're full.
2. **What's the most a vendor can buy their way up the list?** Two mechanisms currently make different promises: the ranking boost caps money at "6 points out of 100," but the paid top-of-page slots can push someone above a vendor who is 10 points better. Pick one number.
3. **How many paid slots at the top of a category page?** Currently 2, and never more than a quarter of the page. Related: in a small provincial category with 3 vendors, an Enterprise vendor paying ₱7,999/month gets **zero** slots and is never told why.
4. **What happens to vendors on the old "Featured" advertising?** They keep the label and lose the benefit. Retire them, move them into the new slots, or refund.
5. **Free travel radius: opt-in only?** Right now nobody is auto-enrolled — no vendor is forced to give away travel they never agreed to. Confirm. And note: distance is measured as the crow flies, so once free travel is actually enforced, a 29 km venue across water becomes a free ferry trip the vendor cannot decline.
6. **On the day the reach change goes live, should every vendor's discovery radius jump to their plan's maximum** (30/60/100 km) rather than today's (0/20/20/50/100)? That widens Solo and Pro discovery overnight.

**The free-until-November launch window**
7. **During the window, do vendors actually GET Pro/Enterprise capability, or just not get charged?** As built: not charged, *and* unable to obtain the plan — which means the "free" AI assistant is unobtainable and any vendor whose paid plan expires mid-window is stuck on Free until December. This needs a decision before the flag can be flipped at all.
8. **Is the Custom plan (₱8,999+) free too?** The page says "every paid plan is free" and still sells Custom on the same screen.
9. **Does riding the free window burn a vendor's one-time free 28-day trial?** Currently no — that's a real give-back beyond the window itself, and the copy now promises it.
10. **Deep Search stays paid during the window** — it costs us real cash per run (~₱10–30), so a blanket ₱0 is unbounded. Confirm.

**Team and trust**
11. **Is Pro "3 people total" or "the owner plus 3"?** The model and the shipped code disagree for every tier.
12. **Should the money person on a vendor's team be able to see client conversations?** Today the answer is forced: the permission system uses one single ranking, so any level that lets them see billing also lets them see chat. Either they see everything or nothing. If "nothing" is the answer, that's real engineering work, not a config change.

**Content, SEO and marketing**
13. **Is being credited in a story still free at every tier?** The new model gates "editorial features" to Pro+, which collides with the Simplicity Canon rule you ratified 2026-07-16. Credit was kept free and featuring was split out — confirm that reading.
14. **When to turn on tier-based SEO.** Every real vendor is on the free tier today, so flipping it now strips the rich listing data from essentially the entire marketplace, and re-enriching takes weeks with search engines. Flip only after paid plans are actually live.
15. **Tagalog and Cebuano auto-reply wording needs a native review** — it goes out in the vendor's name, to couples.
16. **Do not market Vendor AI Advanced as complete.** Voice-matching works. Replying in the couple's language, lead analytics, and the higher daily cap are not built. The SKU is correctly still switched off.

---

## 5 · Still NOT built after all 7 land

**Half-finished by design (each track handed off work nobody owns):**
- The "Fully booked" badge on marketplace cards *before* a couple clicks — exports are ready, the query isn't.
- The vendor-side "you're at your cap, subscribe" upsell — string exists, renders nowhere.
- Two onboarding-wizard booking paths still show couples raw Postgres errors.
- Ring-2 discovery enforcement in marketplace search — the "beyond your outer ring, couples don't see you" half of the model is not wired at all.
- Ring-1 free-transport enforcement on proposals, and on `event_vendors.transport_php` (the couple's own ledger).
- Merit ranking in **four of five** vendor lists — the marketplace grid, `/explore`, the 3D-plan demo and the build flow all still sort by unbounded paid rank.
- Badge points in the merit score — 10 of the nominal 100 points are dead, so the scale the paid ceiling is calibrated against doesn't exist.
- Any actual database access for the Financial and Secretary roles — as shipped they can read nothing, including the billing they exist for. Plus a nav guard so they aren't handed a Messages tab.
- The booking→team-member assignment column, so the "You've been booked for [event]" notice has no call site.
- A real ₱0 plan grant during the launch window, and reconciliation of subscription orders already in flight when it flips.
- Retirement of the legacy `ad_rank` advertising path.
- The editorial-featuring surface (the capability was added and wired to nothing).

**Not attempted by any of the 7:**
- Recurring / auto-renew billing.
- The 5%→1%-above-₱100k fee taper (separate payment session).
- Vendor AI Advanced: couple-language auto-detect, lead analytics, higher daily cap. The SKU stays `is_active=FALSE` — **do not flip it.**
- `.env.example` entries for the five new flags. All five were deliberately omitted to avoid seven-way conflicts on one shared file; someone must add them in a single consolidating commit.
- **Browser verification of anything.** Not one of the seven tracks started a dev server. Every UI claim in this report — Sponsored chips, disclosure labels, disabled CTAs, the coverage map, the voice preview — is code review only.

**One process finding worth acting on:** three of seven builders reported test or typecheck results that the adversarial reviewer disproved on the same tree (cap-ui's "test pins the migration message," launch-window's 12 tests that pass on a full revert, ai-advanced-voice's "3426/0" that is actually 3422/4). All three self-reported clean. **Treat a builder's green result as a claim to be falsified, not as verification** — the reviewers who reverted code and re-ran found the real coverage every time.
