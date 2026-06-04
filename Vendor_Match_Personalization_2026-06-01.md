# Vendor Match Personalization — Per-Category Preference & Sort (design lock 2026-06-01)

> **Design source-of-truth** for how the wedding onboarding captures preferences (basics + per-category) and how those preferences **sort** the vendor search so a couple's best-fit vendors surface first. Amends the locked **Onboarding Blueprint (2026-05-30)** and extends the shipped **Category Search overlay (PR #711)** + the **`/vendors` marketplace** + the **Plan + Budget accordion**.
>
> **Status:** design-locked · **V1.x post-pilot engineering** (pilot 2026-06-01 ships current behavior unchanged · this is a proper build after pilot stabilizes).
> **Scope:** wedding only (matches the 10-parent taxonomy shrink · 2026-05-30/31). Other event types get their own preference sets when they activate.
> **Owner brief (2026-06-01):** "for each category, create an ideal way to sort that category even further" + basics-as-filters (available-on-date / serves-area / accommodates-pax) + an "Expand search" button for the filtered-out + a verified-only vs all-types preference + a Home "Personalized Customization" surface they can edit/delete + "the most comprehensive personalization that they can deactivate by demand."

---

## 0 · How this fits what's already locked

| Already locked / shipped | This doc adds |
|---|---|
| Onboarding basics: **date · region · pax · budget** (Blueprint §3.0) | Promotes them to **hard filters** (date/area/pax) + soft sort (budget), per category |
| Blueprint moved **`venue_setting` OUT** of onboarding, asks **region** instead | **Reconciles:** region stays the *area* hard-filter basic; **venue type returns as the VENUE-category *preference*** (a soft sort), not a top-level basic. Both coexist. |
| Taxonomy shrink **§4 facet dimensions** (religion · dietary · rental · tradition · shoot-type · cart/booth-type · service-type · accessories) | These **are** the per-category preference dimensions. This doc maps each tile → its dimension + adds a few new ones (venue-type, cuisine, photo-video-style, music-vibe). |
| Category Search overlay **6-tier sort** (Favorites → Boosted → Top-rated → Nearest) + verified-only toggle + distance chips (PR #711) | The preference sort **partitions above** that ladder; Expand Search slots **below** it. Backward-compatible — no preference → pure ladder (today's behavior). |
| Mood mini-interview (0010) folded into onboarding | **Aesthetic preferences (stylist · florist · cake · bride's gown) derive from the mood board** — not re-asked. |
| `ceremony_type` from the wedding-type picker (0043) | **Dietary + religion filters pre-set from faith** — not re-asked. |

**The one-line reconciliation of the Blueprint:** onboarding still asks **region** (the hard area filter). Venue *type* is no longer a "basic" — it's the first of the **per-category preferences** (the couple's flagship example). This doc is an explicit, owner-directed amendment to Blueprint §3.0.

---

## 1 · The matching model — three layers + Expand Search

Every category's vendor list is built the same way. The preference is **purely additive**: with no preference captured, this degrades exactly to today's shipped ladder.

```
ALL VERIFIED VENDORS in this category, in the couple's region
   (the marketplace is verified-only — unverified vendors aren't in the pool at all · §5)
        │
        ├─ LAYER A · HARD FILTERS  →  splits into AVAILABLE vs EXCLUDED
        │     · serves the couple's area            (always)
        │     · available on the wedding date        (always · or candidate-set-resolvable · §2)
        │     · accommodates the guest count         (capacity-bound categories only)
        │     · religion-compatible                  (default-ON per faith · "show all faiths" relaxes · §5b)
        │     · required certifications              (couple-opted · HALAL pre-set for Muslim weddings · §5b)
        │
        ├─ LAYER B · PREFERENCE SORT  (within AVAILABLE)
        │     Group 1 "Matches your preference"  — vendor's facet tags match this category's captured preference
        │     Group 2 "More to consider"         — available but no preference match
        │     (no preference captured → Group 1 empty → straight to the ladder)
        │
        └─ within each group: the existing 6-tier LADDER
              Favorites → Boosted (ad_rank) → Top-rated (Top-10 by review/rating) → Nearest (haversine)
              budget = soft tiebreaker (in-budget nudged up) + a display chip, never an excluder

    ─────────────  end of the offer  ─────────────
    [ Expand search ]  →  LAYER C · the EXCLUDED set, grouped + labeled by reason
                          "Not available on your date" · "Doesn't cover your area" · "Below your guest count"
                          · "Not {faith}-compatible" · "Missing {cert} (e.g. HALAL)"  (same ladder)
                          (no "unverified" bucket — the whole pool is already verified)
```

- **Hard filters exclude → Expand reveals.** "Available on date / serves area / accommodates pax" are objective *can-they-even-do-my-wedding* checks. Failing one hides the vendor from the default offer; **Expand search** brings them back, each labeled with the reason.
- **Preferences sort, never exclude.** Style/type preferences (garden venue, photojournalistic photo, OPM band) only **float matches to the top** — non-matching available vendors stay right below, no click needed. This is the owner's "it will start with those first."
- **The marketplace is verified-only (owner 2026-06-01).** Verification is a **hard gate upstream of search** — an unverified vendor isn't in the pool at all, so there's no per-couple "all vs verified" toggle (that onboarding screen was removed). Every vendor a couple sees has passed Setnayan's verification. See §5.
- **Religion + certifications are specialized hard filters** (§5b) — faith-compatibility (the shipped `?match=`) plus required certs like **HALAL**, health permits, or a drone/pyro permit. Faith pre-sets them; the couple can relax or require any. Unmet → Expand, with the reason named. These are finer-grained than the baseline verified badge (a vendor can be Verified but not HALAL-certified).
- **Graceful degrade.** Delete a preference, or hit "deactivate all personalization" → Group 1 empties → pure ladder. This is exactly today's Category Search overlay behavior, so the build is additive, not a rewrite.

---

## 2 · The basics as hard filters (+ budget as soft)

The four onboarding basics already exist (`events.event_date` · region · `events.estimated_pax` · `events.estimated_budget_centavos`). This promotes them to per-category matching signals:

| Basic | Applies as | Where it bites | Notes |
|---|---|---|---|
| **Wedding date** | HARD filter (available-on-date) **OR** candidate-set resolution | every category | **2 modes (owner 2026-06-01, merged from 3).** *Specific dates* (`date_candidates DATE[]`, **1–4**, clustered within a live-shrinking ±90-day window · 1 date = the old exact case) **and** *Flexible window* (`date_window_start…date_window_end`, ≤30 days inclusive): the date isn't fixed — a vendor passes if free on **any** candidate day (the 1–4 discrete dates, or any day in the span), and the wedding date *converges* on the candidate all the couple's chosen vendors share (see note). A single specific date behaves like a hard available-on-date filter. Vendors with no calendar data are treated as available (don't punish unset). |
| **Reception proximity** *(was "Region / area")* | HARD filter (serves-area) | every category | **`haversine(area, vendor_base) ≤ service_radius` OR `area ∈ vendor served-area tags`** (HYBRID — radius tier-bound Free 10km … Enterprise 100km is the local default; explicit tags carry declared far coverage, per service), anchored on the chosen **reception venue's coords** (§2a). **Auto-derived region membership is never the filter** — see §2b (2026-06-04 · hybrid amended same day). |
| **Estimated pax** | HARD filter (accommodates-pax) | **capacity-bound categories only** | Reception venue (seats ≥ pax), Catering (caters ≥ pax), Stations (servings), Guest Shuttle (seats), Lights & Sound (room scale). Ignored everywhere else (a monogram designer has no headcount limit). |
| **Target budget** | SOFT sort + display | every category | only the *total* budget is captured (no per-category allocation in V1.x), so budget **nudges in-budget vendors up** as a tiebreaker and shows an "in your range" chip — it never excludes. (Per-category budget allocation is a later refinement; it would also wire the Plan + Budget accordion's range math.) |

**"Capacity-bound" is a per-category flag** (see the matrix §3 "Cap?" column). Only flagged categories run the pax hard-filter.

**Candidate-set date resolution — specific dates (1–4) OR a window (owner 2026-06-01).** When the couple gives **1–4 specific dates** or **a flexible window** (≤30 days) instead of a single fixed day, the actual wedding date is **chosen by vendor availability, not preference** — *"when they decide to choose a date, it will not be based on what date they want but on what date all their chosen vendors are all available · this will highly sync to our vendors as their schedules fill up."* The **two date modes** (merged from three) feed **one resolver** over a **candidate-date set**: *specific* = the 1–4 discrete dates (1 date behaves like a hard available-on-date filter) · *window* = the contiguous span (its day-list). **Live-shrinking cluster (specific mode):** the picks must sit within a ±90-day window of each other (`[max(picked)−90d, min(picked)+90d]`), shrinking as the set spreads, locking at 4 — so the candidate set is always tight enough that a single vendor's calendar can plausibly cover them. Mechanics: (a) a vendor surfaces in search if their calendar has **≥1 free candidate day**; (b) as the couple shortlists/locks vendors, the system intersects each chosen vendor's free candidate days → the **feasible-date set**; (c) the wedding date settles on a date in that intersection (prefer Saturdays, then the couple's stated lean/order). If the intersection narrows to empty as more vendors lock, the couple is nudged to add a candidate / widen the window / swap the conflicting vendor (ties to the soft-hold/lock + change-flow models). **Onboarding date nuggets** preview this to the couple by surfacing what their candidates share — all Saturdays / all weekends / same month / same season / numerology / cluster span — each framed around vendor scheduling ("a vendor only needs one open slot · as schedules fill, we lock the one they all share"). The onboarding screen-13 demo and the Plan + Budget accordion both render the convergence; the candidate set stays editable in the Personalized Customization surface (§6) until a date locks. Schema: `events.date_mode` (`specific`/`window`) + `date_candidates DATE[]` (specific, 1–4) + `date_window_start`/`date_window_end` (window), with `event_date` NULL until resolution stamps the final `event_date`.

---

## 2a · Reception is "ground 0" for distance + area — SHIPPED (directive 3 · 2026-06-02 · PR #786)

*"Reception will be ground 0 for the distance of other vendors."* (owner 2026-06-02) — the **Nearest** ladder tier (§1 Layer B) + the **serves-area** hard filter (§2 region row) anchor proximity on the **reception's coordinates** (`events.venue_latitude/longitude`), not the region centroid. **Shipped** in `apps/web/lib/events.ts` (`resolveReceptionAnchor` / `recomputeReceptionAnchor`), wired into `saveVendorToPicks` + `finalizeVendor` + `deleteVendor`.

- **Anchor precedence:** locked reception → oldest-'considering' reception (stable first-saved-wins, so the anchor doesn't thrash while the couple explores) → region centroid / onboarding fallback (never blanked). Coords resolve from `vendor_profiles.hq_*` (marketplace) OR `venue_directory.hq_*` (admin-seeded).
- "Nearby" then means **near the party** — the metric that drives vendor logistics + the 0007 Transportation budget line.
- **The other half of directive 3 — reception availability *gating the candidate dates* — is the deferred find-date build** ([Schedule_Matrix_and_Date_Finder_2026-06-02.md](Schedule_Matrix_and_Date_Finder_2026-06-02.md) §5a), kept separate so the shipped distance-anchor didn't touch the date-finder on a live pilot.

---

## 2b · Region is a display label, not the filter — CORRECTION (owner-asked · 2026-06-04)

**Supersedes** the earlier framing in §2 (region row) + the Onboarding Blueprint that treated **`events.region` as the area hard-filter** ("derive region so the area-filter works"). The actual area gate is **proximity to the reception anchor** (§2a):

- **Coverage = proximity OR declared service-area tag (HYBRID · amended 2026-06-04 PM, owner-asked):** a vendor serves the couple's area **C** iff **`haversine(C, vendor_base) ≤ vendor.service_radius`** (Free 10km … Enterprise 100km — the *local* default) **OR** **C (or C's region) ∈ the vendor's explicit served-area tags** (`service_regions`, extended to city grain). The radius auto-covers nearby cities so vendors needn't enumerate them; the tags carry **declared coverage beyond the radius** — e.g. a caterer **based in La Union who serves Quezon City tags "Quezon City,"** and a QC couple matches **via the tag** even though the straight-line distance exceeds every radius tier. Coverage is declared **per service** (a vendor's catering service may tag different areas than their other listings). This is **not** a return to region-membership matching: only the vendor's *explicit* tag counts — region is **never auto-derived from the vendor's HQ as a bucket** — so it's vendor-asserted coverage layered on top of distance. The couple's region is otherwise just a **display label** (the "Metro Manila" chip).
- **The reception venue is the stored anchor.** `events` persists the chosen **reception venue identity + `venue_latitude`/`venue_longitude`**. Onboarding's **"pick up to 2 areas" is transient** — it scopes the *reception-venue search* only and is **not stored** and **not a hard filter**. Once a reception venue is chosen, its coords are the anchor; the areas are discarded.
- **Two implementation calls (easy to revisit):**
  1. **Distance = straight-line (haversine)** — free + instant. **Drive-time / road distance is a V2 upgrade**, not V1.
  2. **Out-of-range vendors are hidden with a count + names** — surfaced as "N vendors outside range: …" (mirrors the §6 "Expand search" affordance), **not greyed in place**.

Until a reception venue is chosen, the anchor falls back per §2a precedence (locked reception → oldest-considering reception → region centroid / onboarding fallback — never blanked), so proximity sort still works pre-anchor.

---

## 3 · Per-category preference matrix — the ideal sort for every tile

The full 10-parent / ~48-tile taxonomy. **Capture mode legend:**
🅐 **Ask** — an onboarding question (the lean set, §4) · 🅓 **Derive** — from mood board (0010) or faith (`ceremony_type`) · 🅒 **Custom** — Personalized Customization surface + inline "refine" chips when browsing (not onboarding) · 🅑 **Basics-only** — no style preference; hard filters alone. **Cap?** = pax is a hard filter for this tile.

> Sort behavior is the canonical §1 model for *every* row — preference-match floats to top, ladder within. The matrix only specifies **what the preference is** + **its source facet** + **how it's captured**.
>
> **Religion-compatibility + certifications (HALAL, health permits, drone / pyro permits, insurance) are a cross-cutting filter layer — see §5b.** They apply across many tiles (especially Feast, Venue, aerial Photo, Fireworks, Coordinator) and aren't repeated per-row here.

### VENUE
| Tile | Preference dimension | Options (representative) | Source facet | Capture | Cap? |
|---|---|---|---|---|---|
| **Reception** | **Venue type** | Hotel ballroom / function hall · Events place / pavilion · Convention / exhibition center · Garden · Beach / waterfront · Resort / destination · Heritage / hacienda · Restaurant / private dining · Tent / open-field · Clubhouse | `venue_setting` *(extend enum — §10)* | 🅐 | ✅ |
| | + Indoor / outdoor / either | indoor · outdoor · either | new attribute | 🅐 (same screen) | |
| **Ceremony** | Ceremony setting | Church · Garden · Beach · Civil registrar · Same as reception | `ceremony_type` + ceremony-venue attr | 🅓 (faith) | |

### PLANNING
| Tile | Preference dimension | Options | Source facet | Capture | Cap? |
|---|---|---|---|---|---|
| **Coordinator / Planner** | Service level | Full planning · Partial · On-the-day / day-of · Month-of | service-type | 🅐 *(lean-optional)* | |
| *(Concierge ★)* | — Setnayan first-party, not a preference target | | | | |

### FEAST
| Tile | Preference dimension | Options | Source facet | Capture | Cap? |
|---|---|---|---|---|---|
| **Catering** | **Cuisine** + **service style** + dietary | Filipino · International · Asian fusion · Spanish/Kapampangan · Halal *(auto)* ··· Plated · Buffet · Family-style · Food-stations | new *cuisine* + *service-style* facets + `dietary` *(faith-preset)* | 🅐 (cuisine) · 🅓 (dietary) | ✅ |
| **Cake** | Style | Classic tiered · Naked · Modern minimalist · Themed · Floral | derive from mood board; *cake-style* facet | 🅓 / 🅒 | |
| **Stations** | Station type | Carving · Pasta · Sushi · Grazing · Lechon | cart/booth-type | 🅒 | ✅ |

### DESIGN
| Tile | Preference dimension | Options | Source facet | Capture | Cap? |
|---|---|---|---|---|---|
| **Stylist / Decorator** | **Aesthetic / theme** | (palette + style from the mood board) | tradition/style facet, matched against `palettes`/mood (0010) | 🅓 | |
| **Florist** | Floral style | Garden / wild · Classic / structured · Minimalist · Tropical | derive from mood board; *floral-style* facet | 🅓 | |
| **Lights & Sound** | Production scale | Intimate · Standard · Full production | scale attr | 🅒 | ✅ |
| **Dance Floor · Outdoor · Fireworks · LED Wall** | type/spec facets (LED size · pyro type · tent vs sailcloth) | | facet | 🅑 / 🅒 | |
| *(Pailaw ★ · Monogram ★)* | Setnayan options under LED Wall / Stylist — not preference targets | | | | |

### PROGRAM
| Tile | Preference dimension | Options | Source facet | Capture | Cap? |
|---|---|---|---|---|---|
| **Live Band · DJ · Choir · Orchestra · Wedding Singer · Performers** | **Music vibe / genre** | Acoustic · Pop / Top 40 · OPM · Jazz / lounge · Classical / strings · Showband / hype | new *music-vibe* facet + ensemble-type | 🅐 (one "music vibe" question covers the cluster) · 🅒 (refine per tile) | |
| **Host / MC** | Hosting style | Formal · Fun / hype · Bilingual (TL/EN) | style attr | 🅒 | |
| **Choreographer** | Routine type | Entourage · First-dance · Both | type facet | 🅒 | |
| *(Pakanta ★ · Panood ★)* | Setnayan options under Program / Documentary | | | | |

### DOCUMENTARY
| Tile | Preference dimension | Options | Source facet | Capture | Cap? |
|---|---|---|---|---|---|
| **Photo & Video** | **Style** + **coverage** + shoot add-ons | Classic / timeless · Editorial / fashion · Photojournalistic / candid · Fine-art / film · Cinematic / dramatic ··· Photo-only · Video-only · Both ··· +Prenup · +SDE · +Drone | new *photo-video-style* + *coverage* facets + `shoot-type` *(shipped)* | 🅐 (style) | |
| **Editorial · Livestream** | mostly Setnayan-option + basics | | | 🅑 | |

### LOOK
| Tile | Preference dimension | Options | Source facet | Capture | Cap? |
|---|---|---|---|---|---|
| **Bride's Attire** | Acquisition + tradition + silhouette | Custom / made-to-measure · Rental · Ready-to-wear ··· Filipiniana / Terno *(prominent facet)* ··· silhouette (derive from mood) | `rental` + `tradition` *(shipped)* + derive | 🅒 (acquisition) · 🅓 (silhouette) | |
| **Groom's Attire** | Acquisition + tradition | Custom · Rental ··· Barong *(prominent facet)* | `rental` + `tradition` | 🅒 | |
| **Women's / Men's Attire** | Acquisition + role | Custom · Rental ··· role (bridesmaid / mother / ninang · groomsman / ninong / father) | `rental` + role facet | 🅒 | |
| **Filipiniana & Barongs** | cross-tile *view* (tradition facet over the 4 attire tiles) — not a separate preference | | `tradition` | derived | |
| **HMUA · Grooming · Wellness & Fitness · Jewelleries & Accessories** | service/role/rental facets (hair vs family vs touch-up · rental jewellery · accessory type) | | facets | 🅒 | |

### BOOTHS
| Tile | Preference dimension | Options | Source facet | Capture | Cap? |
|---|---|---|---|---|---|
| **Photo Booth** | Booth type | Classic · 360 · GIF · Polaroid · Magic mirror | cart/booth-type | 🅒 / inline | |
| **Mobile Bar · Coffee · Mocktail · Food Truck · Dessert · Food Cart** | sub-type / dietary (sorbetes · halo-halo · donut wall · espresso · whiskey · alcohol-free *auto*) | cart/booth-type + `dietary` | 🅒 / inline | ✅ (servings) |
| **Massage Chair · Perfume Bar · Arcade · Henna/Tattoo · Mini Nail Bar · Tarot · Caricature/Calligraphy · Engraving/Embroidery** | the tile *is* the choice; cultural style = filter | facet | 🅑 / inline | |
| *(Patiktok ★)* | Setnayan option under Booths | | | | |

### PRINTS
| Tile | Preference dimension | Options | Source facet | Capture | Cap? |
|---|---|---|---|---|---|
| **Printing** | Item + style | Invitations · Save-the-date · Signage · Programs/menus ··· style (derive from mood) | print-item facet + derive | 🅒 / 🅓 | |
| **Souvenir / Giveaways** | type | Edible · Keepsake · Eco · Pasalubong | facet | 🅒 | |

### TRANSPORT
| Tile | Preference dimension | Options | Source facet | Capture | Cap? |
|---|---|---|---|---|---|
| **Bridal Car** | Vehicle type | Classic / vintage · Luxury sedan · SUV · Specialty (carriage · yacht) | vehicle-type facet | 🅒 | |
| **Guest Shuttle** | — capacity only | | | 🅑 | ✅ (seats) |
| **Escort** | — basics only | | | 🅑 | |

**Read:** roughly a third of tiles carry a real style/type preference; the rest are governed by hard filters + the ladder. Aesthetic-heavy categories (stylist, florist, cake, bride's gown, prints) **derive from the mood board** so the couple isn't asked twice. Faith pre-sets dietary + religion. Everything not asked in onboarding is still capturable in the Personalized Customization surface or via inline "refine" chips while browsing — *"any information they can provide will be used for filtering."*

---

## 4 · What onboarding asks (lean) vs derive vs customize

Onboarding must **not** balloon into 48 questions. It captures the **highest-signal preferences for the categories couples book first**, derives the rest, and leaves the long tail to the Customization surface.

**🅐 Onboarding asks (≈4–6 lean questions, folded in after the "What would you love?" picker §3.1 screen 10):**
1. **Reception venue type** (the owner's flagship) — VENUE
2. **Cuisine style** — FEAST › Catering
3. **Photo & Video style** — DOCUMENTARY
4. **Music vibe** — PROGRAM (one question covers the whole music cluster)
5. **Coordinator service level** — PLANNING *(lean-optional — include only if completion data supports it)*

*(The old "vendor pool: all types vs verified only" ask is removed — the marketplace is verified-only by rule, §5.)*

Each is **skippable** (skip → no preference for that category → pure ladder). Each is shown **only if the couple expressed interest** in that category on the picker (don't ask about catering preference if they didn't pick catering).

**🅓 Derived (no extra question):**
- Aesthetic / style for Stylist · Florist · Cake · Bride's gown silhouette · Prints → from the **mood mini-interview / mood board (0010)**.
- Dietary (halal / alcohol-free) + religion filter → from **`ceremony_type` (faith)**.
- Ceremony setting → from faith.

**🅒 Customization surface + inline refine (post-onboarding):**
- Everything else: attire acquisition, booth sub-types, bridal-car vehicle type, hosting style, station types, etc.
- Captured when the couple opens the **Personalized Customization** surface (§6), or via a **"refine" chip row** inside the Category Search overlay while browsing that category (writes back to the same store).

This is the progressive-capture model the Blueprint already implies ("any information they can provide"): a few high-value asks up front, the rest gathered over the planning runway, all editable in one place.

---

## 5 · The marketplace is verified-only (owner 2026-06-01)

**There is no all-vs-verified choice.** A vendor must pass Setnayan's verification **before any of its services appear on the marketplace.** Until then the vendor has a full dashboard but **zero marketplace presence** — not in browse, not in search, no public `/v/[slug]`, can't receive couple inquiries/bids. This replaces the earlier "vendor pool" couple-setting (the onboarding screen + `events.vendor_pool_preference` are both **retired**) and supersedes the 2026-05-15 "coming_soon — unverified vendors show as muted cards" decision: unverified vendors are simply **not on the marketplace at all**.

### 5.1 · Vendor lifecycle + tiers (REMODELLED)

Verification is now a **lifecycle gate**, not a marketplace tier. The model is a *state* (pre-verification) + **three marketplace tiers** (all of which require verification first):

| | **Registered (unverified)** | **Verified** | **Pro** | **Enterprise** |
|---|---|---|---|---|
| **What it is** | the state on signup | free marketplace floor | paid upgrade | paid upgrade |
| **Marketplace presence** | ❌ none — dashboard only | ✅ listed | ✅ listed | ✅ listed |
| **Dashboard** | ✅ full (build profile · packages [draft] · portfolio · calendar · settings) | ✅ | ✅ | ✅ |
| **Radius** | — | 20km | 50km | 100km |
| **Categories** | (draft) | multiple | multiple | multiple |
| **Vendor name** | — | hidden until first chat reply | shown | shown |
| **Bid quota** | — | 20 / wk | unlimited | unlimited |
| **Show star ratings** | — | ✓ | ✓ | ✓ |
| **Recommend Setnayan Services / token-bonus** | — | ✓ | ✓ | ✓ |
| **Video call · per-day capacity · editorial tagging · all reviews · custom slug · onboarding bundle maker · specialized tools · file sharing · share-inquire-link** | — | — | ✓ | ✓ |
| **Website** | draft (not public) | standard (live) | custom + slug | custom + slug |
| **Team accounts** | 1 | 1 | 3 | unlimited |
| **Price** | ₱0 | ₱0 *(+ verification — fee TBD, see flag)* | ₱2,499 / 28 days | ₱5,499 / 28 days |

- **The old "Free" tier is retired.** Its two roles split: the *dashboard-only, nothing-public* identity becomes the **Registered (unverified) state**; the *free-floor-on-the-marketplace* role is now **Verified**. There is no longer an anonymized-Free vendor floating in browse.
- **Pro / Enterprise are offered post-verification** — the vendor onboarding's second phase (post-verification) is where the upgrade is pitched. You can't buy marketplace boosters before you're on the marketplace.
- **Hybrid-anonymity simplifies:** the name-hidden-until-first-reply rule now applies to **Verified** (the lowest marketplace tier); **Pro+ show real name from day 1**; the venue exception (always real name) still holds. (Was "Free + Verified hidden" — Free is gone from the marketplace.)
- **`vendors.public_visibility` default** flips from `coming_soon` → **`unverified`** (dashboard-only, not surfaced); `verified` (live) · `hidden` (admin suspension) · `archived` (terminal). The `coming_soon` "muted card on marketplace" state is **retired**.
- **`verified_vendor_count`** (Section-3 stats gate · boost-service launch gate) still counts `public_visibility='verified'` — but the prior "coming_soon vendors are visible yet uncounted" caveat is gone (nothing visible is uncounted).
- **DIY "Verified only" browse toggle (2026-05-15) is retired** — moot when everything is verified.

**Verification fee — UNCHANGED here (flagged open item).** Whether Verified is truly ₱0 or carries the one-time ₱1,499 badge fee is the still-open pricing question (CLAUDE.md 2026-05-30 amendment #2 + the onboarding drift flag). This remodel does **not** decide it.

---

## 5b · Religion & certifications — specialized filtering

Three distinct dimensions, often conflated. All are **couple-opted / faith-preset HARD filters** in Layer A (unmet → Expand search with a named reason, never a silent drop):

**(1) Religion compatibility** — *can this vendor serve my faith's wedding?* Already shipped as `vendor_profiles.compatible_ceremony_types[]` + the religion-default-on filter (`?match=`, PR #305). Pre-set from the couple's `ceremony_type`; "show all faiths" relaxes it. Applies **broadly, not just to food**:
- Coordinator experienced with Muslim / INC / Catholic protocols · gender-separated reception capability · mahr coordination.
- Caterer that's alcohol-free (INC) or HALAL (Muslim).
- Attire that's modest (Muslim / INC).
- Photographer that respects gender protocols (Muslim weddings).
- Music: kulintang / cultural ensembles · decor: Maranao Okir.
- Officiant compatibility — auto-resolved from the ceremony venue (Card 04).

**(2) Dietary certifications** — *HALAL (flagship), Kosher, etc.* Distinct from "compatible": **HALAL-certified** = holds a certificate from a recognized Philippine halal-certifying body (e.g. IDCP, accredited under RA 10817), Setnayan-verified; **HALAL-capable** = cooks halal on request, no formal cert. The couple chooses which they need. HALAL is **pre-set ON for Muslim weddings** but any couple can toggle it (a non-Muslim couple hosting Muslim guests). Applies to Catering · Food Cart · Mobile Bar · Dessert · Stations · Cake.

**(3) Category compliance certifications** — *the legal / safety creds a vendor in that category must hold.* Trust + legality signals Setnayan confirms during that category's verification, shown as badges, and filterable:

| Category | Relevant certifications / permits |
|---|---|
| Catering · Food Cart · Mobile Bar · Stations · Dessert | HALAL cert · health / sanitary permit · food-handler's certificate · alcohol-free (INC) |
| Reception / Ceremony Venue | occupancy permit · fire-safety inspection certificate · liability insurance |
| Photo & Video (aerial / drone) | CAAP drone registration / pilot permit |
| Fireworks / Pyro | PNP pyrotechnics permit · licensed pyrotechnician |
| HMUA · Grooming · Wellness | sanitation / health certification · professional license (derm / dental) |
| Coordinator / Planner | industry accreditation · liability insurance · faith-protocol experience |
| Bridal Car · Guest Shuttle | LTO registration · LTFRB franchise (for-hire) · insurance |

> The **Verified badge** (Setnayan confirmed the business is real — DTI / BIR / Mayor's permit, the 12-doc verification) is the *baseline*. **Certifications are finer-grained, category-specific** creds layered on top — a vendor can be Verified but not HALAL-certified. Cert filtering is therefore finer-grained than the baseline verified gate (§5).

**Behavior.** A couple-required cert becomes a Layer-A hard filter — vendors lacking it move to **Expand search** (reason: "No HALAL on file" / "No drone permit on file"). HALAL + religion-match pre-set from faith; both relaxable. Captured as `event_vendor_preferences` rows (`dimension_key='required_certs'` or faith-derived), editable + deletable in the Personalized Customization surface like every other preference. **Vendor-held certs are a *verified* attribute, not a self-claim** — confirmed during that category's verification, so a HALAL / health / drone badge attests a real, checked certificate. Match = the couple's required cert set ⊆ the vendor's verified cert set.

---

## 6 · Personalized Customization surface (Home)

The owner's "Home → Personalized Customization button" — the single **editable store** of every preference, the management home for everything onboarding captured plus everything captured since. The couple-side counterpart to the admin Onboarding Manager (Blueprint §3.4).

**Entry:** a **"Personalize my matches"** button on the dashboard event-home (Home), persistent. (Distinct from the Today's Focus wizard — this is the *preference store*, not the task guide.)

**Sections:**
1. **Your basics** — date · region · pax · budget. Edit any. (These also live in event settings; this is a convenience editor.)
2. **Your preferences, by category** — organized by the 10 folders. Each captured preference shows as a chip/row: *Reception · Garden, outdoor* → **Edit** / **Delete**. Categories with no preference show a quiet "No preference yet — add one" so the couple can deepen any category on demand.
3. **What you love** — the "What would you love?" picker selections (the package interest), editable.

*(No "vendor pool" toggle here — the marketplace is verified-only by rule, §5.)*

**Per-row actions:**
- **Edit** → re-pick the preference for that category.
- **Delete** → clears that one preference → that category reverts to the pure ladder (the owner's "delete any information they no longer want").

**Master control:**
- **"Deactivate all personalization"** toggle → all categories sort by the pure ladder (Favorites / Boosted / Top-rated / Nearest), no preference boost, hard filters still apply. The owner's "comprehensive personalization that they can deactivate by demand." Flipping it back restores every saved preference (deactivate ≠ delete).

**Multi-host (0048):** preferences are **event-shared** (any host edits the shared store) — they describe the wedding, not personal taste. (Contrast: vendor *favorites* are per-user. See the 2026-05-29 vendor-discovery lock.)

---

## 7 · Expand Search — the filtered-out, with reasons

At the bottom of every category offer (the Category Search overlay + the marketplace folder + the accordion "Find more"):

> *Showing 14 vendors that fit your wedding.*
> **[ Expand search → see 23 more ]**

Tapping it appends the **hard-excluded** set, grouped + labeled by **why** each was held back — never a silent dump:

| Exclusion reason | Copy on the group header |
|---|---|
| date conflict | "May not be available on **Dec 18**" |
| out of area | "Outside your area — **may not cover {Region}**" |
| over capacity | "Built for smaller events — **may not fit {pax} guests**" |
| not faith-compatible | "**May not be set up for {faith} weddings**" |
| missing required cert | "**No {cert} on file** — e.g. HALAL · health permit · drone permit" |

*(No "unverified" group — every vendor in the pool is already verified, §5.)*

- Each expanded vendor still carries its normal card; the **reason chip** sits on it so the couple understands the trade-off (e.g., "great fit but books out — message early").
- The **preference sort + ladder still apply within** the expanded set (a preferred-style vendor that's out-of-area still floats above a non-preferred one).
- Expand is **per-reason collapsible** so a couple can, say, see the over-capacity ones but keep date-conflicts hidden.
- One global "Expand search" is the V1.x scope; per-reason toggles are a polish follow-up.

---

## 7b · Inquiry fan-out + fair exposure — every verified vendor's chance

### 7b.1 · The inquiry fan-out (locked: 3)

After onboarding, each category's curated top set surfaces a small **"send an inquiry to N"** action. **Default = 3** (owner-locked 2026-06-01), pre-checked, **couple-adjustable 1–5**.

- The 3 pre-checked are the **top of the fairness-blended rank** (§7b.2) — not a forced "charity slot," so the couple's inquiries still go to genuine best-fits, with under-exposed-but-fitting vendors elevated on merit.
- **Available-only**: only vendors free on the couple's date(s) are pre-checked (candidate-date convergence) — never burn an inquiry on a vendor who can't do the wedding.
- The couple can swap any of the 3, add up to 5, or drop to 1.
- **Send model = one-tap confirm (owner 2026-06-03).** The best-fit set is **pre-filled**; the couple sends with a **single tap** — per category, or one "send all" for the whole picker. From the couple's side it's near-instant *"we've reached out for you"* seeding, but it stays **consent-gated by that one tap** — *not* fully automatic, *not* a multi-step form. This **pins down** the earlier "explicit send (no auto-send)" lock rather than reversing it: the tap is the explicit act.
- **What gets seeded = the dashboard Services list.** The fan-out only offers the categories the couple **picked in onboarding** (screen 10); those same picks are exactly what the dashboard **Services** section lists (add-more always enabled, §6). A one-tap send turns the couple's chosen categories into live inquiries the moment they land on the dashboard.
- **Deleting a seeded inquiry is gated** — a couple can't instantly drop a vendor we just reached out to; the **7-day stale + nudge** rule governs removal (see [Service_Schedule_and_Quotation_Flow_2026-06-02.md](Service_Schedule_and_Quotation_Flow_2026-06-02.md) §T1.6). The same fan-out runs from the dashboard later; onboarding just seeds the first round.

### 7b.2 · Why the curated set isn't "all vendors" — and how every vendor still gets a chance

**Can all ~2,400 vendors show on the initial recommendations? No — and on purpose.** Showing every fitting vendor up-front re-creates the exact overwhelm the curated top set exists to kill (the couple came to be *helped to decide*, not handed a directory). But "curated" must not mean "the same entrenched few hoard every lead while new vendors starve." Fairness is engineered **into the rank**, plus a guaranteed exposure floor + a paid path + a direct path:

| Mechanism | What it does | Status |
|---|---|---|
| **Fairness baked into the rank (not a charity slot)** | An **exposure-deficit dampener** — among comparable-quality fitting vendors, those with **fewer recent inquiries** float up, so leads **spread** instead of winner-take-all. Good-but-under-exposed vendors rise into the top set + pre-checked-3 **on merit**, never by forcing a weak fit on the couple. | V1.x — new ranking factor |
| **New-vendor welcome boost (cold-start)** | A freshly-verified vendor with 0 reviews would otherwise never rank. A time-boxed boost (first ~30 days / first ~N leads after verification) lifts them into rotation to earn their first leads + reviews; after the grace, they rank on merit. | V1.x — new ranking factor |
| **Reserved rotating "fresh chance" slot** | Of the shown set, one slot is reserved for a **rotating fitting vendor who wouldn't yet make the merit cut** — pure exposure for newcomers (shown + addable; not auto-pre-checked for the inquiry). | V1.x — slot rule |
| **Preference diversity** | Already in the system — different couples' prefs (style · faith · region · sub-tags) surface **different** tops, so exposure naturally distributes (a boho-Cebu specialist tops for those couples even if not globally #1). | Built (this doc) |
| **Boosted / Sponsored (the paid opportunity)** | Any verified vendor can **buy visibility** (Boosted Ads / Sponsored Boost · Tier 3 of the ladder · token/peso-funded). The explicit, self-serve "I want more chances" lever — and the revenue engine. | Locked (region-tiered monetization) |
| **Expand search ("see all that fit")** | Every fitting verified vendor is **reachable** to any couple who taps Expand — the full pool is one click away even though it's not the default. | Built (§7) |
| **Direct / by-name inquiry** | A couple who already knows a vendor (or finds one via Expand/search) can inquire them **directly by name** — token-activated (§7b.3) — **regardless of rank**. The instant a couple *wants* a vendor, that vendor has a chance, ranking aside. | This row (§7b.3) |

**Net:** the curated top stays curated for the couple's sake, but **every verified, fitting vendor gets a real, recurring chance** — over time + across couples (fairness-rank + rotation + cold-start boost + preference diversity), on demand (Expand + by-name), and on purchase (Boosted). No vendor is permanently buried; none is forced on a couple.

> **Honest vendor-facing framing:** *"You won't always be in a couple's top picks — but you're always reachable, you cycle into the spotlight as leads spread, new vendors get a welcome boost, and you can boost your visibility anytime."* (Not "everyone's always on top," which is impossible + dishonest.)

### 7b.3 · BYO / by-name → token-activated inquiry (owner 2026-06-01)

The "Add your own vendor" affordance (the BYO card) is **dedup-aware**:

- **If the named vendor is already listed on Setnayan** (matched by business name / email / phone against existing verified listings), the "add + invite" becomes a **real inquiry sent to that existing listing** — flowing through the standard token economy: the request reaches the vendor as a lead, and **engaging it activates the vendor's tokens** (the region-weighted burn, same as any marketplace inquiry). No duplicate cold-invite; the couple is connected to the real listing. *(Owner: "if their vendor is already listed and they invited, request will also be sent with activation of tokens.")*
- **If the named vendor is NOT on Setnayan**, it's the cold **`vendor_invites`** flow (claim landing `setnayan.com/vendor/claim/{token}`): they onboard → verify → and only **then** do inquiries (and the token mechanic) flow.

This makes the BYO/by-name path a **first-class discovery channel that bypasses the ranking entirely**: a couple naming a specific vendor is the **warmest, highest-intent lead** there is — so an existing vendor outside the couple's top set still gets a token-activated request the moment the couple wants them by name. It is the cleanest answer to "how does every vendor get a chance" — *any* listed vendor is directly inquirable, and that inquiry is a paid (token-activated) lead like any other.

---

## 8 · Data model

No change to the four basics (already on `events`). New:

```
-- (events.vendor_pool_preference RETIRED — marketplace is verified-only by rule, §5)
events.personalization_active  BOOL NOT NULL DEFAULT TRUE   -- master deactivate (§6)

-- vendor side: verification gate (the marketplace floor) — see §5.1
-- vendors.public_visibility default flips coming_soon → 'unverified'
--   'unverified' (dashboard-only · not surfaced) · 'verified' (live) · 'hidden' (suspended) · 'archived'

-- the editable per-category preference store
event_vendor_preferences (
  event_id        UUID  REFERENCES events,
  tile_key        TEXT,            -- e.g. 'reception','catering','photo_video'
  dimension_key   TEXT,            -- e.g. 'venue_type','cuisine','service_style'
  values          TEXT[],          -- multi-select (OR within a dimension)
  source          TEXT  CHECK (source IN ('onboarding','customization','inline','derived')),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (event_id, tile_key, dimension_key)
)
-- RLS: event hosts (0048) read/write their event's rows; event-shared, not per-user.
```

- **Vendor side** already carries the facet tags the preference matches against — most are the taxonomy-shrink §4 dimensions (`compatible_ceremony_types[]` shipped; dietary/rental/tradition/shoot-type/cart-type/etc. land as `canonical_service_schemas` attributes per the deferred 0044 follow-up). The **new** facets this doc introduces — `venue_setting` (extend), `cuisine`, `service_style`, `photo_video_style`, `coverage`, `music_vibe` — need adding to the vendor schema + onboarding so vendors can tag themselves.
- **Match = array overlap** between `event_vendor_preferences.values` and the vendor's facet tags (`&&`), per dimension. A vendor matches Group 1 if it overlaps **any** captured dimension for that tile (tunable to "all dimensions" later if Group 1 gets too broad).
- **Derived preferences** (mood board, faith) are written as `source='derived'` rows so the Customization surface can show + let the couple override them.
- **Certifications (§5b) are a *verified* vendor attribute, not a self-claim** — a `vendor_certifications (vendor_id, cert_key, status, verified_at, expires_at)` set, each confirmed during that category's verification so a HALAL / health / drone badge attests a real, checked certificate. A couple's *required* certs are `event_vendor_preferences` rows (`dimension_key='required_certs'`); religion-match stays the shipped `compatible_ceremony_types[]` + `?match=` filter. **Cert match = the couple's required cert set ⊆ the vendor's verified cert set** (and the vendor's `compatible_ceremony_types[]` ∋ the couple's faith for religion-match). Cert `expires_at` lets a lapsed permit drop the badge + the match automatically.

---

## 9 · How it threads into the shipped surfaces

| Surface | Change |
|---|---|
| **Category Search overlay (PR #711)** | The current 6-tier sort becomes the **intra-group ladder**; add the Layer-B preference partition above + the Layer-C Expand Search below. The overlay's distance chips become the **inline mirror** of the persisted settings (and a place to refine the preference for that category, writing to `event_vendor_preferences`). *(The overlay's verified-only toggle is retired — the marketplace is verified-only by rule, §5.)* |
| **`/vendors` marketplace** | Same partition + Expand on each folder's vendor list. The existing `?match=` (religion) + `?venue=` (venue_setting) URL filters compose with the new preference sort — they're the hard/derived end of the same system. |
| **Plan + Budget accordion** | "Find more" per category opens the overlay with the preference sort applied; the budget-soft signal cross-references the accordion's range math. |
| **`fetchWizardVendorRecommendations`** (the canonical ranked query) | Gains the preference-partition + capacity/date/area hard-filter params + the Expand (return-excluded) flag. This is the single place the sort lives — overlay, marketplace, and Today's Focus vendor cards all call it. |
| **Today's Focus wizard vendor-pick cards** | Inherit the same preference sort automatically (they already call the canonical query). |

---

## 10 · `venue_setting` enum reconciliation

Owner's reception list (events place · hotel function hall · convention center · garden · destination) is **richer** than the current `venue_setting` enum (`banquet_hall · garden · beach · destination · heritage · outdoor_tent · civil_registrar`). Proposed reconciled **reception** venue-type set:

`hotel_ballroom` · `events_place` *(new)* · `convention_center` *(new)* · `garden` · `beach` · `resort_destination` *(= destination)* · `heritage_hacienda` *(= heritage)* · `restaurant_private` *(new)* · `tent_open_field` *(= outdoor_tent)* · `clubhouse` *(new)*

- `civil_registrar` is a **ceremony** setting, not reception — keep it on the ceremony axis.
- This **extends** the enum that already drives the shipped `?venue=` filter (PR #311), so it's an additive migration + a richer onboarding picker + vendor self-tagging against the new values.
- Flag: needs an enum migration + backfill (existing `banquet_hall` rows → `hotel_ballroom`/`events_place` split is a judgment call — default `banquet_hall` → `events_place`, let hotel vendors re-tag).

---

## 11 · Flagged decisions (owner to confirm / override)

| # | Decision | Recommended default | Why |
|---|---|---|---|
| 1 | ~~Vendor-pool default when skipped~~ → **RESOLVED (owner 2026-06-01): verified-only marketplace** | — | Removed. A vendor must verify before any service lists; there is no all-vs-verified choice (§5). Cold-start tradeoff (thinner early marketplace) accepted by the owner. |
| 2 | **Budget: hard or soft** | **Soft** (sort + chip, never excludes) | Only total budget is captured, no per-category allocation. Per-category budget hard-filter is a later refinement (it would also feed the accordion range math). |
| 3 | **Preference: labeled groups vs blended boost** | **Labeled groups** ("Matches your preference" / "More to consider"), Expand for hard-excluded | Matches the owner's "start with those first" + keeps non-matches one scroll away (no click). |
| 4 | **Onboarding preference question count** | **Lean 4–6** (§4), shown only for picked categories; rest in Customization | Avoids a 48-question funnel; respects the Blueprint's lean lock. |
| 5 | **Pax hard-filter scope** | **Capacity-bound tiles only** (the "Cap?" column) | A monogram designer has no headcount; only venue/catering/stations/shuttle/L&S gate on pax. |
| 6 | **`venue_setting` enum extension** | **Adopt the §10 reconciled list** | Owner's list is richer than the shipped enum; needs a migration + vendor re-tag. |
| 7 | **"on the vendor app" interpretation** | The **couple-side vendor search** (marketplace + overlay + accordion) | Read conservatively. A separate "vendors see aggregate demand in their area" feature (e.g., *"couples near you are searching for garden venues"*) is a promising but distinct future item — not in this scope. Flag if the owner meant that. |
| 8 | **Religion-match default** | Default-ON per faith ("show all faiths" relaxes) | Already the shipped behavior (`?match=`, PR #305) — confirm it stays the default for this system. |
| 9 | **Who attests a certification** | **Setnayan verifies** the cert during category verification — a badge = checked, not self-claimed | Keeps HALAL / health / drone badges trustworthy. Alternative: self-declared + an "unverified cert" chip (weaker trust, lighter verification load). Owner's call. |
| 10 | **HALAL-certified vs HALAL-capable** | Surface **both** as separate filters | "Certified" (holds the cert) vs "capable" (cooks halal on request) are genuinely different couple needs; collapsing them over-promises to a couple who needs the real certificate. |
| 11 | ~~Inquiry fan-out count~~ → **RESOLVED (owner 2026-06-01): 3**, pre-checked, couple-adjustable 1–5 · **send model RESOLVED (owner 2026-06-03): one-tap confirm** (pre-filled best-fit set, single-tap send · not fully-auto) | — | §7b.1. Pre-checked = top of the fairness-blended rank; available-only. Couple-side removal of a seeded inquiry is gated by the 7-day stale + nudge rule (Service_Schedule §T1.6). |
| 12 | **Fair-exposure model** → **locked (this doc, §7b.2)** | rank-fairness (exposure-deficit dampener + new-vendor welcome boost) + rotating fresh slot + preference diversity + Boosted + Expand + by-name | — | The specific ranking *weights* (how strong the dampener / how long the welcome boost / how often the fresh slot rotates) are a V1.x tuning detail, owner-set on real lead-flow data. |
| 13 | ~~BYO already-listed vendor~~ → **RESOLVED (owner 2026-06-01): token-activated inquiry** | — | §7b.3. Already-listed → real inquiry, vendor tokens activate on engage; off-platform → `vendor_invites` cold flow first. |

---

## 12 · Cross-references + sequencing

**Amends / extends:** Onboarding Blueprint (2026-05-30, §3.0 venue-out-of-onboarding reconciled here) · Vendor Taxonomy Shrink (2026-05-30/31, §4 facets = the preference dimensions) · Category Search overlay (PR #711) · `?match=`/`?venue=` marketplace filters (PR #305/#311) · the 6-tier recommendation ladder + favorites Tier-0 (2026-05-24 / 2026-05-29) · Plan + Budget accordion (2026-05-31) · vendor hybrid-anonymity (**now simplified — Verified-tier hidden-until-first-reply, Pro+ shown, venue exception holds; the Free-tier half is gone with the Free tier**). **Supersedes:** the 2026-05-15 vendor public-visibility "coming_soon default / muted cards" + DIY "Verified only" toggle; the 4-tier matrix's Free column (the 2026-05-30 amendment #2); `events.vendor_pool_preference`.

**Owning iterations:** **0006** (vendors/marketplace + facet schema) · **0016** (Today's Focus capture + wizard cards) · **0021** (couple dashboard — the Personalized Customization surface + Home button) · **0043** (wedding-type picker — faith-derived dietary/religion) · **0010** (mood board — aesthetic-derived) · **0044** (per-category schema attributes — the facet store) · **0048** (multi-host — event-shared preferences).

**Engineering dependencies:** the deferred taxonomy-shrink DB follow-ups (0044 facet attributes on `canonical_service_schemas`, vendor re-tag) are the substrate the preference-match reads — this work should land **after or with** that DB cleanup, since "Matches your preference" needs vendors to carry facet tags.

**Sequencing:** design lock only — **zero code, zero migration, zero SKU/price change** this row. Pilot 2026-06-01 ships current behavior. V1.x build sequence: (a) extend `venue_setting` + add the new facets to the vendor schema/onboarding so vendors self-tag → (b) `event_vendor_preferences` table + the basics-as-hard-filters + preference partition in `fetchWizardVendorRecommendations` → (c) Expand Search in the overlay/marketplace → (d) the onboarding lean asks → (e) the Personalized Customization surface on Home → (f) the **fair-exposure ranking factors** (exposure-deficit dampener + new-vendor welcome boost + rotating fresh slot — needs vendor lead-history data) + the **inquiry fan-out** (default 3, §7b.1) + the **BYO dedup → token-routing** (§7b.3, matches a BYO-named vendor against existing listings → token-activated inquiry vs cold `vendor_invites`). **(0) Verification gate first:** unverified vendors stay off the marketplace (`public_visibility` default `unverified`) — the §5.1 lifecycle gate is the precondition for the whole match system (a vendor must be verified to be in the pool at all). Each is its own PR; (a)+(b) are the foundation everything else reads.
