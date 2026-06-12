# Vendors Tab — "Plan + Budget Accordion" · Build Spec (locked 2026-05-31)

> **Self-contained handoff.** This doc + the design mock at [`Plan_Budget_Accordion_2026-05-31.html`](../06_Prototypes/Plan_Budget_Accordion_2026-05-31.html) are everything you need to build the couple-side **Vendors** tab. The mock is a throwaway vanilla-HTML prototype — the *interaction design is the deliverable*, NOT the code. Rebuild it as React in `apps/web` against real data.
>
> **Status:** design-locked, owner-approved as a **post-pilot V1.x iteration** (pilot launches 2026-06-01; this is not a pilot blocker). Two sub-surfaces (same-date competition signal + deadline nudges) are net-new product — they're flagged in §6 and were owner-approved in the same lock, so don't re-block them, but honor the guardrails.
>
> **Owning iterations:** couple dashboard ([0021](../0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md)) + vendors ([0006](../0006_vendors_management/0006_vendors_management.md)). Cross-refs in §7.

---

## 1. What this surface is

The Vendors tab is a **scroll-driven, sticky-header accordion** that fuses the couple's *plan* (which vendors they're considering / have locked per category) with their *budget* (committed total + projected range vs target). One screen does three jobs: shows where the money stands, drives the next decision, and celebrates progress.

It is **mobile-first** (the mock is a 393px phone frame). A desktop counterpart is sketched in §8 but not yet built.

Palette = **Clean Editorial** (locked 2026-05-29): Warm Alabaster `#FBFBFA` paper, Deep Obsidian `#1E2229` ink, Royal Champagne Gold `#C5A059` accent, Rich Mulberry `#5C2542` CTAs. Fonts: Cormorant Garamond (serif/display, italic), Manrope (body), DM Mono (mono/labels).

---

## 2. The three persistent + two scroll-state surfaces

### A. Top bar (sticky, always visible)
Two stacked figures on the left + budget guardrail on the right:
- **Chosen** `₱840K` — bold headline = firm total of every **locked-in pick** (`Σ catTotal`). Grows as categories finalize.
- **Range** `₱1.9M – ₱2.6M` — muted = cheapest→priciest span of *everything shortlisted* (`planRange`: finalized picks are fixed points; undecided multi-option children contribute min..max; empty contributes 0). Narrows toward Chosen as they decide.
- Right: **`of ₱[target]`** + status (`within budget` / `near your limit` / `over by ₱X`) + a meter. **Status + meter track the Range-high vs the target** (the "will my plan fit?" guardrail), NOT Chosen.
- Tap the bar → set / change the estimated budget.
- Numbers are short in the bar (precise figures live in the overview).
- **Budget model (iteration 0007):** a booked vendor's true cost is **3 lines — Package + Transportation + Crew Meal**; in-app/Setnayan services and the venue anchor have none. The card surfaces the Package price; **Chosen, Range, and the vendor detail must roll up all three.** (The prototype sums Package only — wire the full 3-line rollup.)

### B. Landing overview — "Where your day stands" (eyebrow: "Your budget & plan") (forward / motivating; must fit ONE screen, no internal scroll)
The default first view. Everything here drives *search / add / finalize more*. **Two states** — an empty cover (no picks yet) and the populated cover below.

> **⚠ Updated 2026-06-04 (shipped) — the populated cover is now DIRECTIVE, not just a scoreboard.** The Find→Shortlist→Lock loop used to be taught ONLY on the empty cover; the moment the couple had a single pick it vanished and they were dropped into bare rails not knowing what to do. The populated cover now LEADS with the next action and keeps the loop in view. (`NextAction` + `LoopLegend` + `AlsoComingUp` in `plan-budget-accordion.tsx`.)

1. **"Do this next" banner** — the action centerpiece. Promotes the **single most-urgent category** (`dueList[0]`, else the calm `upNext`) into a **tappable jump** to that category's rail (`#group-{id}`). Verb adapts: never-locked → **"Start with {category}"** · overdue → **"Lock your {category}"** · else → **"Choose your {category}"**. Sub-line = how many they've shortlisted there (`N shortlisted — compare & lock one` / `1 shortlisted — ready to lock` / `Find one to shortlist`) + the timeline (`Xd left` / `Xd overdue` / `time to start`). When nothing's pressing → a calm **"You're on pace — nothing's urgent, browse any category below."**
2. **Find → Shortlist → Lock legend** — a compact, always-present 3-step strip so the mechanic stays in view once the couple is working the rails (previously empty-state-only).
3. **Estimate · Chosen · Could-land** — a 3-box row (Estimate = budget target, set via the top bar · Chosen = Σ locked · Could-land = `₱lo–₱hi`) + the **Plan-vs-budget meter** (tracks Range-high vs target: On track / Getting close / Over budget).
4. **"Also coming up"** — the *remaining* due categories (`dueList[1..]`; the banner already owns the top one). Each row: category · `👀 X eyeing your date` · right-aligned `Xd left` (amber) / `Xd overdue` (red) / `Time to start`. Omitted entirely when the banner covers everything (the calm/empty cases) — so the deadline info is never shown twice.
5. **`Swipe up to view your services ↓`** (was "Scroll up to begin" / "Swipe to start viewing the services").

*(The empty cover — shown until the first shortlist — keeps its 3-step **Shortlist → Compare → Lock it in** explainer + "Add your first category".)*

### C. The accordion (scroll-driven)
- **10 parent categories** as sticky headers that pin/pile at the top (`top = i × headH`, headH = 32px). Header shows icon + name + the category's locked total.
- Tap a header = open/dock it; tap the open one again = close to overview; long-press = open the per-category sort sheet.
- Categories match the **2026-05-31 vendor-taxonomy shrink** (10 folders): Venue · Planning · Feast · Design · Program · Documentary · Look · Booths · Prints · Transport. See §7 dependency.

### D. Per-category rails (horizontal)
Each child category (and each named slot inside multi-slot children like Bride's Attire / Jewelleries) is a **horizontal rail**: an `+ Add` card followed by vendor cards.
- Cards **curve-zoom in**: vertical reveal is cheap 2D (translateY + scale + opacity) per row-block; horizontal is a 3D coverflow on the card's inner face.
- **Per-block lock**: each card fully clears the bottom nav *before* it locks (`lockTop = vh − cardHeight − 14px`) — tall cards lock higher, short cards lower, all end fully visible. A **gentle scroll-snap + haptic tick** fires only when a card rests within ~70px of its lock line (never a category-crossing yank — see "regression" note in §9).
- **Both axes buzz:** the horizontal coverflow also fires a haptic tick as the centered card changes; the vertical fires on the per-block snap. Both gentle, both best-effort (no iOS web vibration — §9).
- **Empty category** (no vendors yet) → not a rail; a slim one-line **`+ [Category] add`** row (its own reveal block) that opens the add-a-service search.
- **First-run coaching (2026-06-04):** the first time the couple has shortlisted something but locked nothing yet, a **dismissible coachmark** sits at the top of the category list (what the eye hits on swipe-up) — *Tap a card · Compare side by side · **Lock this pick** (updates your budget + notifies the vendor, changeable anytime)* — plus a one-time **Lock helper** line under the first lockable card. Both appear ONLY in that "I have cards, now what?" window, self-retire after the first lock, and remember dismissal (`localStorage 'pba_coach_v1'`). Gated by `recap.shortlisted > 0 && recap.finalized === 0`.

### E. Bottom recap — "Look how far you've come" (accomplishment; fills the bottom half)
Appears when all 10 categories are piled at the top (scrolled to the end). A **mulberry card** anchored to the bottom:
- `~[N] hours saved` finding & contacting vendors — out of `[M]+` in the market.
- **Searched · Shortlisted · Finalized** counts.
- Mock formula (transparent, tunable): `shortlisted = Σ vendor cards`, `searched = shortlisted×6 + 12`, `hours = round(searched×0.25 + shortlisted×1.5)`. **Replace with a real, defensible benchmark before this ships publicly** (see §6).

---

## 3. The vendor card (locked layout)

Top-to-bottom inside the card:
1. **Photo** (hero image).
2. **Vendor** — business name.
3. **Distance** — `Xkm from reception` / `Your 0km anchor` / `In-app service`.
4. **Badges** — small pills: `✓ Verified` (marketplace vendor) or `✦ Setnayan` (in-app service); `Coordinator incl.` where applicable; the recommended-reason (`Best review` / `Lowest price` / `Nearest`) when it's the top pick for the current sort.
5. **Star Reviews** — stars + rating + count (`★★★★★ 5.0 · 234 reviews`); in-app services show stars only.
6. **Price** — `₱X`, or `🔗 Linked · [parent vendor]` for a bundled option.
7. **"👀 XX also eyeing this date."** — same-date competition (§6).

Corner affordances: a `★ Chosen` badge (top-right) on the pick; a `×` remove (top-left, **tap-to-confirm**) on cards that are **not** chosen and **not** the anchor.

**Card rules:**
- **Vendor name honors hybrid-anonymity** ([[project_setnayan_vendor_hybrid_anonymity]]): Free + Verified vendors show their **screen name** (e.g. "Manila Wedding Photographer #4218") until they send their first chat reply, then the real business name reveals; Pro/Enterprise show the real name from day 1. The "Vendor" line must resolve through that rule, not read `business_name` directly.
- **Price reflects the 3-line model** (§2A): card shows the Package price; the detail screen breaks out Package + Transportation + Crew Meal. Linked options show `🔗 Linked · [parent]` instead of a price (their cost lives in the parent bundle).
- **Anchor (the couple's 0km venue):** never removable (no `×`), no competition signal, labeled "Your 0km anchor."
- **In-app/Setnayan services** render as ordinary cards *under their parent category* with a `✦ Setnayan` badge — never a separate "Setnayan" tile (per the 2026-05-31 taxonomy).

---

## 4. Interactions

| Gesture | Result |
|---|---|
| Tap card | Open the vendor detail screen (full; has "Remove from plan") |
| Long-press card | **Single-pick slot:** set as primary → finalize. **Keep-multiple slot (booths/transport/etc.):** toggle keep |
| ⇄ Compare (in child/slot header, only while still deciding) | Open the compare screen |
| Card `×` (tap → "Remove?" → tap) | Remove that vendor from the shortlist |
| `↩ Change pick` (on a collapsed finalized rail) | Reopen the shortlist to switch vendors |
| `+ Add` card / empty-row | Open the full-height add-a-service search screen (no bottom nav) |

### Finalize → collapse (key behavior)
Picking a vendor in a **single-pick** slot (long-press → primary) **collapses the rail to just that card** — the `+ Add` card and the rest of the shortlist are dropped, and the Compare button hides. The chosen card has **no `×`** (you *change* a decision, you don't delete it). A `↩ Change pick` card sits beside it to reopen the shortlist. Single-option categories (auto-picked) render collapsed from the start — consistent with how the deadline list + recap already treat them as "finalized." (Implementation note: the "set primary" action rebuilds the category so the collapse + ×-visibility update fire on the deciding tap.)

### Compare screen
Like-for-like, **scope-normalized** columns. Per column: Rating · Reviews · Distance · Listed price · scope-match row · **like-for-like total** (with best-value highlight). Two normalizations:
- **Linked vendor** (e.g. a coordinator that only comes bundled with a venue): valued at the parent bundle's full price; every standalone option gets the next-cheapest counterpart of the parent's category added, so columns compare *venue + coordinator* fairly.
- **Coordinator-bundle**: if one venue bundles a coordinator, every other column gets the cheapest comparable coordinator added.
Per column: **View details ›** (opens the vendor) + **Remove** (drops it; rebuilds compare with survivors, or closes if <2 remain). **Compare is evaluate-only — there is NO set-primary button here** (removed by design); you finalize from the rail (long-press) or the detail screen.

### Remove paths (three)
1. Card `×` (tap-to-confirm) — quick, in the rail.
2. Compare column **Remove** — cull while deciding.
3. Detail page **Remove from plan** — the deep path.
All call one `removeVendor()` that splices the vendor, fixes picks, refreshes the rail, and updates the top bar + deadline list + recap.

---

## 5. Decision-readiness data model

- **childState** per category: `empty` (no vendors) / `considering` (vendors, not every vendor-bearing slot picked) / `finalized` (every vendor-bearing slot has a pick).
- **Finalize deadline** per child: `lead` = days-before-wedding it must be locked (from the locked Setnayan AI hard-floor table — venue/caterer/photo earliest, day-of bits latest). `daysLeft = (days-until-wedding) − lead`. `<0` overdue · `0–20` due-soon · `>20` upcoming.
- **Competition (eyeing)**: mock uses a name hash. **Real = count of other couples' soft-holds on (this vendor, the couple's wedding_date), pre-downpayment.**
- **Tallies**: `vendorsSeen` (Σ cards = "shortlisted"), `finalizedTally` (locked vs touched).

---

## 6. The two NET-NEW product surfaces (owner-approved for V1.x — honor the guardrails)

These reuse already-locked data but add new display + notifications. Build them, but follow the rules:

### 6a. Same-date competition signal — "XX also eyeing this date"
- **Source:** `COUNT(soft-holds WHERE vendor = X AND wedding_date = mine AND status ∈ {considering, contracted} AND event ≠ mine)`. The soft-hold model is locked (see §7 Lock/delete/overlap Rule 3).
- **Aggregate count ONLY — never identities** (RA 10173).
- **Must be real — never fabricated.** Fake scarcity is a fineable dark pattern (EU fined Booking.com for exactly this) + erodes trust. Show it only when genuine, or not at all.
- **Hard scarcity escalation:** if another couple *downpays* that (vendor, date), the date is gone → "Booked for your date — here are 3 similar available" (ties to the soft-hold auto-release, Rule 4).
- **Notification:** when a *new* hold lands on a vendor the couple is already considering → in-app + throttled email nudge.
- **Cost:** an indexed `COUNT` on `(vendor_id, wedding_date)`. Evaluate lazily on render (no cron — corpus cron-strategy).

### 6b. Deadline nudges
- **Source:** the locked Setnayan AI per-card hard-floor table. `deadline = wedding_date − lead(category)`.
- Lazy-eval on dashboard render: overdue (`<0`, not finalized) + due-soon (`0–20`, not finalized) → surface in the overview's "What to lock next" + fire a throttled email nudge per 0028. If neither → "Next up" (nearest upcoming).

### Open items needing an owner decision before/at build
- The **"hours saved" benchmark** (the public claim) — pick a defensible number/formula.
- Competition: plain count vs threshold-gated display.
- Notification cadence/throttle for both 6a + 6b.
- The recap **"market pool"** number source.

---

## 7. Dependencies + cross-references

- **Vendor taxonomy shrink (10 folders / ~48 tiles)** — design-locked 2026-05-31 (see CLAUDE.md decision log + [`Vendor_Taxonomy_Shrink_2026-05-30.md`](Vendor_Taxonomy_Shrink_2026-05-30.md)), engineering pending. This tab is built on it; sequence them together.
- **Setnayan AI per-card hard-floor table** — locked 2026-05-24 (CLAUDE.md "Setnayan AI SKU lock" + "Home is the guide"). Source for the finalize deadlines.
- **Soft-hold model** — locked 2026-05-24 (CLAUDE.md "Lock/delete/overlap architecture", Rule 3 pre-downpayment overlap + Rule 4 auto-release). Source for the competition signal.
- **Data:** `event_vendors` (shortlist / picks / finalize / `status`), `vendor_profiles` (cards, badges, reviews, distance, compatibility, screen-name/anonymity per [[project_setnayan_vendor_hybrid_anonymity]]), marketplace search for "Add a service."
- **Email:** iteration [0028](../0028_email_notifications/0028_email_notifications.md) for the two new notification templates.
- **Palette/voice:** Clean Editorial (2026-05-29) + brand voice (no dev text, RA 10173).

---

## 8. Desktop counterpart (sketched, not built)

The mobile accordion maps to a desktop 3-zone layout: left rail = category list + the budget/deadline overview (persistent); center = the active category's vendor grid (cards in a wrap-grid instead of a horizontal rail); right = the compare/detail drawer. The recap becomes a footer band. Build mobile first; desktop is a follow-up.

---

## 9. Notes carried from the prototype

- **Haptics:** the snap buzz is best-effort — Android fires `navigator.vibrate`, **iOS Safari has no Vibration API**. Real haptics arrive with the native app (Capacitor Haptics, iteration 0052). Don't rely on web vibration.
- **Snap discipline:** the snap must be a *gentle settle* (≤~70px), never a big yank — a hard snap fights the category-dock and breaks tap-to-expand. (This was a real regression in the prototype; keep it gentle.)
- **Throwaway mock:** `Plan_Budget_Accordion_2026-05-31.html` is reference only. Don't ship it; rebuild in React.

---

## 10. Build sequence (recommended)

1. Confirm/seed the **10-folder taxonomy** (dependency).
2. Build the **accordion shell** + category headers + the landing overview + top bar (Chosen/Range) — read-only against `event_vendors`.
3. **Vendor cards** (the §3 layout) + the rail + curve-zoom + per-block lock + gentle snap.
4. **Interactions:** tap-detail, long-press-finalize (with collapse), Compare (with the two normalizations), the three remove paths, add-a-service full-height screen.
5. **Decision-readiness:** deadlines (6b) + the "What to lock next" overview block + the bottom recap.
6. **Same-date competition (6a)** — last, with the privacy + honesty guardrails + the notification.
7. Resolve the §6 open items with the owner.

---

## 11. Performance & data contract (owner-emphasized — "I do not want it to always load")

- **In-memory store, not a reload-per-action.** Hold the couple's plan (the per-category vendor lists + picks) in one client-side store (the prototype's `TAX`). The page renders from memory; it must feel instant on return, not re-fetch the world.
- **Incremental, per-category refresh.** Adding or removing a vendor **rebuilds only that one category** in place (the prototype's `refreshCat(ci)`) — never a full re-render. Set-primary / finalize also rebuilds just its category (so the collapse fires).
- **Add appends to that category's row; remove evicts from it.** No global reload on either.
- **Cache the vendor data behind the cards** so cards paint without per-card fetches; invalidate a vendor's cache entry when it's removed. (In React: TanStack Query + the corpus caching strategy — see `02_Specifications/Caching_and_Offline_Strategy.md`; mutations invalidate only the affected query keys.)
- **Deadlines + competition counts are lazy-eval on render** (no cron) — see §6.

---

## 12. Rules & invariants (do not violate)

A consolidated checklist of every decision/adjustment locked for this surface. If you're changing any of these, stop and confirm with the owner.

**Gesture grammar (locked — do not reassign):** tap card = open detail · long-press card = finalize (single) / toggle-keep (multi) · ⇄ = compare · card `×` = remove (tap-to-confirm) · `+ Add` / empty-row = full-height search.

**Remove / finalize:**
- A **chosen card has no `×`** — you *change* a decision, you don't delete it. Three remove paths exist: card `×`, compare-column Remove, detail "Remove from plan" — all via one `removeVendor()`.
- The `×` is **tap-to-confirm** ("× → Remove? → tap") — guards against a stray touch while scrolling the rail.
- **Finalize a single-pick slot → collapse the rail** to just the chosen card: drop the `+ Add` card + the rest of the shortlist, hide Compare, show `↩ Change pick` to reopen. Single-option (auto-picked) categories render collapsed from the start.
- **Keep-multiple categories** (booths, transport, HMUA, florist, etc.) **do NOT collapse**; their kept cards also have no `×` — long-press to un-keep first, then the `×` returns.
- The **anchor (0km venue)** is never removable, never shows competition, labeled "Your 0km anchor."

**Top bar:** show **Chosen** (firm Σ of locked picks) + **Range** (cheapest→priciest of the shortlist); status + meter track **Range-high vs target**, not Chosen.

**Landing overview ("Your Budget & Plan"):** must fit **one screen, no internal scroll**; forward/motivating only; "What to lock next" caps at **3** rows + a "+N more" line, with a "Next up" fallback when nothing's urgent.

**Bottom recap:** fills the **bottom half** once all categories pile up; accomplishment-framed — `~N hours saved`, market pool, Searched / Shortlisted / Finalized.

**Motion:** curve-zoom in (vertical 2D per-row-block + horizontal 3D coverflow) · per-block lock (card clears the nav before locking) · gentle snap **≤~70px only, never a category-crossing yank** · haptic on both axes, best-effort (no iOS web vibration — native app only).

**Budget:** 3-line cost per vendor (Package + Transportation + Crew Meal, iteration 0007); in-app services + anchor have none.

**Vendor identity:** card "Vendor" line resolves through **hybrid-anonymity** (screen name until first chat reply); Setnayan services are cards under their parent category, never their own tile.

**Same-date competition:** aggregate **count only** (never identities, RA 10173) · **never fabricated** (no fake scarcity) · real soft-hold counts.

**Platform guardrails (corpus-wide):** PHP centavos only, **no USD, no invented prices** · **no wallet UI** (order-and-pay) · **Clean Editorial palette** + **brand voice, no dev text** · responsive (mobile + desktop patterns).

**This is post-pilot V1.x** — owner-approved (incl. the two new surfaces in §6); don't re-block, but honor every guardrail above.

---

## 13. Data wiring & schema map (design → build ticket)

> ⚠️ **Verify-first caveat.** This maps against the **spec corpus** (iterations 0006 vendors · 0007 budget · 0034 payments · 0045 product catalogs · 0016 wizard) + the CLAUDE.md decision log — **NOT** the live `apps/web` migrations (that repo is not in this folder). **Before coding, verify every table/column name + existence against `supabase/migrations/` and `apps/web/lib/`.** Flags: ✅ likely exists · 🧮 computed at read · 🔌 reuse an existing action · 🆕 likely needs a migration / new code · ⚠️ unresolved, decide first.

### 13.1 Store ↔ tables
- The in-memory store (mock `TAX`) is hydrated from **`event_vendors`** (the couple's per-event vendor rows — *verify name: may be `event_vendor_relationships`*) joined to **`vendor_profiles`** (marketplace card data), plus the platform SKU catalog (`platform_retail_catalog_v2`) for Setnayan-service cards.
- mock **child category** ≈ **canonical_service** (the 10-folder tiles / 192-row taxonomy).
- mock **slot** for multi-item tiles (Ceremony Gown vs Reception Gown vs Shoes inside "Bride's Attire") → ⚠️ **unresolved**: the live taxonomy likely has no per-slot sub-key. **Decide:** add a `slot_key` to `event_vendors`, OR model each sub-item as its own canonical. Resolve this *inside the taxonomy refactor* (§7 dependency).
- mock `sl.v[]` (shortlisted) → `event_vendors` rows with `status='considering'`. mock `sl.picks` (chosen) → rows with `status` ≥ `contracted` (finalized) / `deposit_paid` (paid). mock **single-pick vs keep-multiple** → derived from the canonical's **saturation rule** (hard-single / soft-single vs multi-uncapped — locked 2026-05-09 + vendor-decision-logic), NOT a per-card flag.

### 13.2 Card fields → source

| Card field | Source | Flag |
|---|---|---|
| Vendor name | `resolveVendorDisplayName(vendor)` — screen-name until first chat reply | ✅ exists (`apps/web/lib/vendors.ts`, PR #673/#677) |
| Distance "Xkm from reception" | haversine(`vendor_profiles.lat/lng`, `events.venue_lat/lng`) | 🧮 + 🆕 helper · verify coords are populated |
| Badge · Verified | `vendor_profiles.verification_state = 'verified'` | ✅ |
| Badge · ✦ Setnayan | card is a platform SKU, not a `vendor_profile` | 🔌 needs a unified vendor-vs-SKU card adapter |
| Badge · Coordinator-incl | bundle relationship (§13.4) | 🆕 / ⚠️ |
| Badge · recommended reason | current sort (Best review / Lowest price / Nearest) | 🧮 client-side |
| Star Reviews (rating + count) | `vendor_review_stats` (avg + count) | ✅ likely — verify view name |
| Price (Package) | `vendor_services` / `vendor_packages` base price | ✅ likely |
| Price · 3-line (Package + Transport + Crew Meal) | the couple's per-vendor budget entries (iteration 0007) | ✅ schema · ⚠️ unset until the couple enters them |
| `🔗 Linked · [parent]` | bundle / linked relationship (§13.4) | 🆕 / ⚠️ |
| ★ Chosen | `event_vendors.status` ≥ `contracted` | 🧮 derived |
| 👀 XX eyeing this date | soft-hold COUNT (§13.4) | 🆕 query |
| Anchor "Your 0km anchor" | the booked reception venue rendered as a Venue card | 🧮 derived |

### 13.3 Interactions → server actions

| Interaction | Action | Flag |
|---|---|---|
| Add a service | insert `event_vendors` (`status='considering'`) | 🔌 existing add/lock action (wizard `completeVendorPickFromMarketplace` lineage) |
| Remove (×, compare, detail) | delete the `event_vendors` row | 🔌 `deleteVendor` exists (2026-05-27) |
| Finalize (long-press → primary) | `event_vendors.status` `considering → contracted` | 🔌 finalize/lock action |
| Change pick | `contracted → considering` | 🆕 small |
| Keep toggle (multi) | add/remove the row | 🔌 |
| Set / change budget | `events` estimated-budget column | ✅ |
| Compare | client-side read-only compute | 🧮 |

### 13.4 The two new backends (from §6)
- **Same-date competition count** — `SELECT count(*) FROM event_vendors ev JOIN events e ON e.id = ev.event_id WHERE ev.vendor_id = :v AND e.wedding_date = :d AND ev.status IN ('considering','contracted') AND ev.event_id <> :mine`. **Aggregate only** (RA 10173). Add an index on `(vendor_id)` + the `wedding_date` join. The soft-hold cap field `vendor_profiles.max_soft_holds_per_date` already exists (PR #550) — confirm. + new-hold notification (0028). 🆕
- **Deadline nudges** — a constant `LEAD[canonical] = days-before-wedding` (lift the values straight from the mock / the Setnayan AI hard-floor table in iteration 0016). `daysLeft = (wedding_date − today) − LEAD[canonical]`. Surface overdue + ≤20-day; nudge via 0028. 🆕 constant + template.

### 13.5 Prerequisites — what must exist before this renders on real data
1. **Taxonomy refactor (10 folders)** — categories don't exist in code yet (engineering-pending; §7). Resolve the `slot_key` question (§13.1) here.
2. **Distance helper** (haversine) + vendor coords populated.
3. **Soft-hold count query** + the `(vendor_id, wedding_date)` index.
4. **Bundle / linked model** — if you keep the Teem⊂Casa-Real + coordinator-bundle features; else drop them from the first cut.
5. **3-line budget wiring** (0007 entries surfaced on the card + detail).
6. **Setnayan-service card adapter** (render SKUs as cards alongside vendor cards).
7. **Two 0028 notification templates** (new-hold, deadline-nudge).
8. The **four product decisions** (§6 open items).

### 13.6 Lowest-risk first cut (recommended)
Ship the core without the new backends: read `event_vendors` + `vendor_profiles`, render cards with name · distance · Verified · reviews · package price, plus the full accordion · compare · remove · finalize-collapse · overview · recap. **Defer to a v1.1:** the bundle/linked normalization (§13.4), the same-date competition (§6a/§13.4), and the 3-line rollup. That lands the plan+budget surface with zero new backend, then the two flagged surfaces follow once the owner confirms the §6 decisions.
