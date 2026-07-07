# Crew-Meal Provider Marketplace — Supply Side & Match (2026-07-08)

> **Owner-defined 2026-07-08 (this session).** A new vendor-side capability: small local food vendors (carinderias, home kitchens, nearby restaurants) can offer **crew meals** for events at venues near them. Companion to `../0007_budget_expenses/0007_Crew_Meal_Line_Discovery_2026-07-08.md` (the couple-facing discovery + booking surface). This file is the **supply side + the proximity match**. It does **not** re-expand the archived `0006_vendors_management.md` stub — it is a newer dated sibling.
>
> **⚠ Owner sign-off still open on two things:** (1) the **new micro-category** lightly expands the 2026-05-31 10-folder taxonomy shrink; (2) the **default service radius** number. Both flagged inline below. The crew-meal **connection token rate** is owner-set too (see `0007` sibling § token gate).

---

> **⚠ SUPERSEDED IN PART — shipped-code reconciliation 2026-07-08 (see `../DECISION_LOG.md` same-day "Crew-Meal Marketplace — shipped-code reconciliation" row).** § 5's token model below was written against a token economy that does NOT match `origin/main`: there are **no free tokens on verification** (retired `20270110320020`), **no per-SKU/per-category rate** (the burn is per-region-band + per-tier; one burn covers all of a vendor's services per event), and **FREE-tier vendors can't accept in-app at all**. **Owner locked Option 1: crew-meal providers are treated as REGULAR vendors** — free listing, but accepting a connection requires Verified+ and burns the normal region-band token via the existing `acceptInquiry`→`unlock_vendor_event` path (no new token code, no low crew-meal rate, no tier bypass). Read § 5 as "the connect gate = the standard vendor gate," not the per-SKU-rate scheme described. Service-area radius reuses the existing vendor **branch pin** (`branch_radius_km`); the micro-category lands via the code-generated `apps/web/lib/taxonomy.ts`.

## 1. The model — proximity is the product

Crew meals are the one wedding cost where **being near the venue = being cheaper**. A kitchen already cooking near the venue adds crew meals at near-marginal cost — no separate delivery run, no second transport fee. So this whole feature is a **venue-proximity match**: the couple's reception venue is the fixed point, and the app surfaces food providers whose service area covers it, sorted so **nearest is cheapest**.

Two properties make it slot into the existing app cleanly:

- **Crew meals are already a first-class budget line.** Every booked vendor carries 3 cost lines — Package + Transportation + **Crew Meal** (iteration 0007) — and the Budget tool already auto-aggregates the expected crew count from each booked vendor's `crew_size` (a typical PH wedding = 15–25 crew).
- **Distance-from-venue is already computed and displayed.** Vendor cards already render `Xkm from reception` against the couple's "0km anchor" venue. The proximity match reuses that existing geo plumbing — no new distance engine.

**Decoupled from the main caterer — that's the novelty.** Today crew meals ride on whoever caters the guests (₱250–500/crew). This feature lets a *separate*, nearby kitchen supply **just the crew's food**, which is exactly where the savings live. It is not a replacement for the main caterer and must never double-count against a caterer whose package already includes crew meals (the couple-side source selector enforces this — see the `0007` sibling).

---

## 2. The micro-category — "Food Supply / Crew Meals"

⚠ **Taxonomy addition — owner sign-off required.** The 2026-05-31 vendor-taxonomy shrink collapsed vendors into 10 parent folders (Venue · Planning · Feast · Design · Program · Documentary · Look · Booths · Prints · Transport). Crew-meal supply is added as a **lightweight micro-category under Feast** (working name **"Food Supply / Crew Meals"**), NOT a new top-level folder.

Rationale for a distinct micro-category rather than just a tag on existing caterers:

- The target supply is **long-tail** — carinderias and home kitchens that would never register as a full "Feast/Catering" vendor. A low-barrier micro-category is the acquisition wedge; it gives a small kitchen a single, concrete reason to join.
- Existing Feast/catering vendors can **also** opt in (a caterer who wants to sell crew-meal-only orders near their base), so the micro-category is open to both.

Everything else about the vendor account (verification, hybrid-anonymity, logo, chat) is unchanged and inherited from 0006/0022.

---

## 3. The provider offer object (fixed price + menu)

A crew-meal offer is deliberately **tiny** and **transactional** — there is **no quotation step** (this is what makes it lighter than a normal vendor booking and lets the couple compare instantly).

| Field | Notes |
|---|---|
| `price_per_meal` | **Fixed ₱/meal.** Per-meal, not a package — because the crew count floats until Confirm, so cost = ₱/meal × final headcount. |
| `price_tiers` (optional) | Allow **1–2 tiers** (e.g. Standard ₱320 / Premium ₱420) if the provider wants a "better" option. Default is a single fixed price — never force tiers. |
| `menu[]` | The set of **complete packed meals** the provider can cook (e.g. "Chicken adobo · rice · egg · drink"). The provider defines what they *can* provide; the couple picks from this list at Confirm. 3–6 options is typical. |
| `min_order_qty` | Minimum number of meals (e.g. 10). Warned against the crew estimate at reserve time. |
| `lead_time_days` | Notice needed (e.g. 2 days). Drives the Confirm cutoff = `event_date − lead_time_days`. |
| `dietary_notes` (optional) | Free tags — "Veg option on request", "Halal", etc. |
| `service_base_geo` + `service_radius_km` | The geocoded base + radius that defines coverage (see § 4). Optional named-venue/city allowlist supplement. |

**Who chooses the meal:** the **couple (or coordinator) picks on the crew's behalf** at Confirm — one meal for everyone or a simple split ("12× adobo, 6× menudo"). Per-crew-member selection is explicitly **out of scope for V1** (crew meals are utilitarian; nobody builds a per-person RSVP for the video team's lunch). Per-crew choice is a V2 nicety at best.

---

## 4. The match logic

```
include provider  ⇔  venue.geo ∈ circle(provider.service_base_geo, provider.service_radius_km)
                       [ OR venue ∈ provider.named_venue_allowlist ]
sort by            :  distance_km ASC, price_per_meal ASC, rating DESC
savings shown      :  (current Crew Meal line estimate) − (price_per_meal × crew_count)
```

- **`venue.geo`** is the couple's 0km reception anchor (already geocoded for the existing "Xkm from reception" display).
- **Sort default is nearest-first** — because the whole pitch is "the closest kitchen is the cheapest to deliver." Price and rating are the tie-breakers.
- **The savings number is the hook.** Each result card shows the concrete peso savings versus the couple's current crew-meal estimate. That number, not the ₱/meal, is what sells the option.

⚠ **Default service radius = owner-set number.** Providers set their own radius, but the form needs a sensible default (candidate: ~15 km, tunable). Owner to confirm.

---

## 5. Token gate — the connection, not the listing

A token is what a vendor spends to **accept the gate that connects them to a customer** (owner's canonical model, [[project_setnayan_vendor_token_economy]]). Applied here, three distinct events with three distinct rules:

| Event | Cost | Why |
|---|---|---|
| **Listing** — appearing in the "near your venue" results | **Free.** Always. | Keeps the long-tail supply funnel open; consistent with free vendor registration. |
| **Connecting** — the couple reserves → the provider **accepts** and the chat/booking opens (Phase-1 Reserve) | **One token**, at a **low crew-meal category rate**. | This is the universal connect primitive. A couple connecting to a photographer costs the photographer a token; a couple connecting to a crew-meal provider is the *consistent* behavior — exempting it would be the anomaly. |
| **Settling** — paying for the food | **0% commission**, off-platform. | The token was never a cut of the transaction. Setnayan holds no money; the couple pays the provider directly. |

**Rate tuning is the one knob.** A crew-meal order is small-ticket (~₱3–7K) and high-frequency, unlike a ₱185K catering package, so a full-price connection token would be disproportionate. The **dashboard per-SKU connection rate is exactly the lever** — set the crew-meal category **low**. Combined with the **100 free-on-verification tokens** covering a new kitchen's early connections, both the recruiting funnel and the couple's savings survive contact with the gate (a low per-connection cost is negligible against the ₱/meal, so the provider won't price it back in).

⚠ **Crew-meal connection token rate = owner-set number.**

---

## 6. Optional monetization lever — premium placement

The organic "near your venue" list stays free and sorts on nearest/cheapest/rating. If a provider *wants* to sit at the top of that list, that is a discretionary **boost** they choose to buy — the existing **Boosted Ads / Sponsored Boost** mechanic (0022), applied to this listing. Legitimate because it's demand-side marketing spend, **never a gate on showing up**.

---

## 7. Open owner calls

1. **Micro-category** — approve "Food Supply / Crew Meals" under Feast (expands the 10-folder lock)? (§ 2)
2. **Default service radius** number. (§ 4)
3. **Crew-meal connection token rate** number. (§ 5)

---

## Cross-references

- `../0007_budget_expenses/0007_Crew_Meal_Line_Discovery_2026-07-08.md` — the couple-facing discovery surface + three-phase booking flow + source selector.
- `0006_vendors_management.md` — archived stub (original vendor-registry spec; recover full body via `git show 573a96c:0006_vendors_management/0006_vendors_management.md`).
- `../03_Strategy/Vendors_Plan_Budget_Tab_Spec_2026-05-31.md` — the 3-line budget model (Package + Transportation + Crew Meal) + the vendor-taxonomy 10-folder shrink this micro-category extends.
- `DECISION_LOG.md` 2026-07-08 — the 5 locked decisions.
