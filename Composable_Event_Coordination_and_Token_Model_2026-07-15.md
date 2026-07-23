# Composable Event · Coordination Service · Token Multiplier (2026-07-15)

> Vision captured from the owner design session 2026-07-15. This is the strategic model the home/marketplace/vendor work should build toward. A file-grounded **adjustment map** (data · code · pages · control · mapping) is being produced separately against `apps/web`.

## The one idea

**An event is a container that assembles its full stack, and Setnayan's product is the *coordination* that makes the pieces converge at a place and time.** Not a booking site, not a vendor directory, not a photo app — the one place an event pulls together everything it needs, where every asset already collected (location, dates, guest list, People graph, memories) makes the next layer smarter.

## Four building-block classes (by geometry + money model)

| Class | You… | Unit | Money to Setnayan |
|---|---|---|---|
| **Reservation** — lodging · dining | hold a fixed slot | room × **nights** · table × **meal-timeslot × party-size** | settle **on-site** · **₱0** |
| **Service** — catering · coordination · HMUA · floral styling · vendors | book a vendor to **perform** | the engagement | **off-platform** · **0% commission** |
| **Goods** — gifts · souvenirs · rings · crafts · toys · bouquets | order **items** (single or bulk) | quantity | **off-platform** · **0% commission** |
| **In-app** — Papic · Live Studio · Animated Monogram · Life-Flash | buy **Setnayan's own** product | the SKU | **PHP apply-then-pay = the revenue** |

Three of four are ₱0 doorways; the fourth is the paid product. "Flowers" straddles: *styling* = service (anchored), *bouquet/giveaway* = goods — the **item** you get decides the class, not the shop.

## Coordination = the product

A **reserved slot (room / table) is the ANCHOR** — a fixed *where + when*. Goods and services are **routed to it and timed to it**: flowers delivered to Room 214 before the 3pm check-in; gifts staged at the dinner table before the party sits.

- **Setnayan is the conductor of *information*** (the where + when), NOT a mover of things. **No commute / no logistics** — the florist delivers; Setnayan only shares the anchor.
- **Holds no money** — each party settles directly. The product is the orchestration, which is ₱0 to run.
- **The moat:** a standalone florist never knows you'll be in Room 214 at 3pm on your monthsary. Setnayan does — it owns the reservation *and* the occasion. No single app holds the anchor.
- **The real seam:** the venue/restaurant must *accept* the coordinated drop (in-room setup, staged gift). So the job is "share where+when → **confirm-back** each party → surface the plan." Design around cooperation; never promise a delivery Setnayan can't physically make.
- **Works for any anchor:** couple's monthsary getaway, friends' overnight, friends' timed lunch/dinner — same engine, different reserved slot.

## Event-type shaping (the food layer is NOT interchangeable)

- **Personal-only types** (never community): wedding · debut · christening · gender reveal · birthday · personal anniversary · graduation. → original personal create flow.
- **Community-eligible types**: simple event · community anniversary · corporate · travel · celebration/lifestyle (+ tournament · reunion pending). → created inside / filed under a Samahan; a community's Events tab is a **filtered list**.
- **Anchored events** (a venue is fed) → **catering** (food *to* the venue; same family as crew_meals / food_cart / food_truck).
- **Roaming events** (travel/lifestyle) → **timed dining reservations** (you go *out* to eat). *Catering is the wrong geometry for travel — the two never swap.*

## Token multiplier (how the ₱0 doorways still earn)

Vendor-side token economy (unchanged): a vendor **burns a token to unlock a lead/event** (flat ₱100/token · **hold-and-release**, refund on ghost per the fake-inquiry protection · **0% commission** · **customers never see tokens**). Setnayan earns on **access**, never the deal. *(⚠ Correction 2026-07-15, from the code audit: the old "100 free tokens on verification" grant was **RETIRED** — owner 2026-06-17, migration `20270110320020`. Tokens now come only from admin grants, subscription bundles, and purchases. Corpus `CLAUDE.md` still repeats the stale "100 free" line — flag to fix.)*

- Each new layer = a **new vendor category** buying tokens to reach events.
- **One coordinated plan = multiple category leads = multiple token unlocks.** "Flowers + gifts in the room" is a live lead in *lodging + florist + gifts* at once → three unlocks. Setnayan monetizes the **convergence** at ~99% margin / ₱0 marginal.
- Grow revenue by growing *how many vendor types want to converge on an event* — costs nothing to run.

## Hard boundaries (locks)

- **₱0 marginal cost** — no per-minute/per-transaction infra. (Owner 2026-07-15.)
- **No commute / logistics** — reservations + connections only; Setnayan moves information, not things.
- **No in-app store for goods** — connect + order + **settle/fulfill off-platform**; an in-app checkout/shipping engine would break ₱0.
- **Off-platform settlement, 0% commission** on lodging/dining/goods/vendors; Setnayan holds no money.
- **Tokens are vendor-side only.**

## Status

Vision captured (this file). **Next:** a file-grounded adjustment map across **data · code · pages · control · mapping**, produced from `apps/web` (main checkout is ~600 commits stale — verify against a fresh pull before building). Then formalize the load-bearing pieces into `DECISION_LOG.md`. See [[project_setnayan_home_redesign_people_model]] for the home/People/Communities context.
