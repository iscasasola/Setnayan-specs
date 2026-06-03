# Time & Money Saved Model — 2026-06-01

**Purpose.** Power the *"you've already saved ~₱X and ~Y hours — free"* lines on the onboarding **Your Plan** + **Congrats** screens (and reuse on `/pricing` + marketing). Every free Setnayan feature carries **(a)** a market-equivalent peso value (what a couple would pay elsewhere → *money saved*) and **(b)** a time-saved formula (*time saved*). This doc is the single source of truth for both totals.

**Scope note.** The peso values below are **market-equivalent guidance** — what the equivalent tool/service costs *elsewhere* — NOT Setnayan SKU prices (Setnayan gives these **free**). They are the owner-supplied basis for the *money-saved* calc and stay distinct from the locked `service_catalog` SKU prices. Design-lock · V1.x post-pilot · prototype + spec only.

---

## A · The 10 free features — money + time (owner-supplied)

| # | Free feature | What it is | Money value | Time saved | Flat / per-unit |
|---|---|---|---|---|---|
| 1 | **Advanced Filtering Planner** | filters the whole market down to your matches | ₱3,999 | 3 hrs **per category** *(+ display: "filtered N vendors for you")* | per category |
| 2 | **Basic Monogram** | a mark to represent your wedding | ₱999 | 8 hrs | flat |
| 3 | **Today's Focus** | guided vendor timeline + deadlines | ₱1,499 | 8 hrs **per category** | per category |
| 4 | **Basic Website** | triple site — RSVP · Event Site · Editorial | ₱12,999 | 350 hrs | flat |
| 5 | **Guest Planner** | guest list + seat-plan integration | ₱1,999 | 12 hrs | flat |
| 6 | **Budget Tracker** | live expenses · never miss a payment | ₱3,999 | 12 hrs | flat |
| 7 | **Vendor Comparison** | compare vendors side-by-side | ₱1,999 | 3 hrs **per vendor shortlisted** | per shortlist |
| 8 | **Dashboard** | the all-in-one wedding hub | ₱3,999 | 2 hrs **per day** (event-created → wedding) | per day |
| 9 | **Mood Board** | one styled board for the stylist + vendors | ₱2,999 | 2 hrs **per locked vendor who needs it** | per design vendor |
| 10 | **Marketplace** | every verified PH vendor — 50× one expo | ₱2,500 **per expo replaced** (50 vendors/expo) | 24 hrs **per 50 vendors searched** (per expo replaced) | per expo |

**Money total (flat items 1–9):** ₱34,491 · **+ Marketplace** ₱2,500 × expos replaced.

---

## B · Input variables (the app reads these from the couple's event)

| Variable | Source | Typical |
|---|---|---|
| `categories` — # of vendor categories they're planning | services picked in onboarding (the 10 parents / picked tiles) | 10 |
| `shortlisted` — # vendors saved/shortlisted | `event_vendors` + `couple_vendor_shortlists` | 15 |
| `runwayDays` — event-created → wedding date | `events.created_at` → `events.event_date` | 365 (12-mo) |
| `designVendors` — locked vendors who need the mood board | locked vendors in stylist/florist/cake/HMUA/lights/decor | 5 |
| `vendorsFiltered` — # vendors removed by filtering (display stat) | marketplace pool − matches, summed across categories | ~1,800 |
| `exposReplaced` — # expos the marketplace replaces | realistic couple attendance (cap ~4–5) | 4 |

---

## C · Additional time-savers (proposed — confirm the per-unit rates)

We know the **paid** apparatus (Papic, Panood, Save-the-Date video, etc.) saves cash; these are extra **time** savers worth crediting:

| Feature | Why it saves time | Proposed rate |
|---|---|---|
| **Inquiry fan-out (3 at once)** | one tap reaches 3 matched vendors vs DM-ing each | 1.5 hrs / category |
| **Smart recommendations (best-fit first)** | top matches surface vs scrolling the full list | folds into Filtering (see overlap note) |
| **One-place chat** | all vendor threads in one app vs Viber/Messenger/email | 0.5 hr / locked vendor |
| **Real reviews + verified-vendor safety** | no manual vetting / asking around / scam due-diligence | folds into Vendor Comparison (see overlap note) |
| **Day-of guest portal** | guests self-serve table + schedule vs you fielding it | 6 hrs (flat, day-of) |
| **Google Drive photo auto-sync** | photos land in your Drive vs manual download/organize | 5 hrs (flat) |
| **Multi-host co-planning** | parents/co-host see the plan vs you relaying everything | 1 hr / co-host / month |
| **Bring-your-own-vendor invite** | invite your own vendor vs onboarding them yourself | 1 hr / invited vendor |
| **Payment reminders** | never-miss-a-payment → no late fees | folds into Budget Tracker (also a *money* saver) |

**⚠️ Double-count caution.** Filtering (#1), Smart recs, Vendor Comparison (#7), and Reviews+Safety all touch **"choosing a vendor."** Don't stack all four on the same activity. Recommended: keep **Filtering** (per category) + **Vendor Comparison** (per shortlisted) as the two vendor-selection time buckets, and treat Smart recs + Reviews+Safety as *quality* benefits (not additional hours), to keep the total honest.

---

## D · The computation + worked example

**LOCKED (owner 2026-06-01):** Dashboard = **0.5 h/day** (not 2) · Filtering = **3 h/category** + show "filtered N vendors" as a display wow-stat (NOT 3h × every vendor removed) · **Today's Focus EXCLUDED** from the savings (it's the ₱1,499 paid SKU). None of the values change per guest — they key off categories / shortlisted / runway / design vendors / expos.

```
moneySaved = 31,993  +  (2,500 × exposReplaced)      // 32,992 flat MINUS Today's Focus ₱1,499 ... see table
timeSaved  = (3 × categories)          // filtering (3h/category)
           + 8                          // monogram
                                        // today's focus EXCLUDED
           + 350                        // website
           + 12                         // guest planner
           + 12                         // budget tracker
           + (3 × shortlisted)          // vendor comparison
           + (0.5 × runwayDays)         // dashboard (0.5h/day)
           + (2 × designVendors)        // mood board
           + (24 × exposReplaced)       // marketplace
```

**Worked example — typical couple** (categories 10 · shortlisted 15 · runway 365d · designVendors 5 · expos 4):

| Term | Money | Hours |
|---|---|---|
| Filtering (3×10) | ₱3,999 | 30 |
| Monogram | ₱999 | 8 |
| ~~Today's Focus~~ (excluded · paid SKU) | — | — |
| Website | ₱12,999 | 350 |
| Guest Planner | ₱1,999 | 12 |
| Budget Tracker | ₱3,999 | 12 |
| Vendor Comparison (3×15) | ₱1,999 | 45 |
| **Dashboard (0.5×365)** | ₱3,999 | **183** |
| Mood Board (2×5) | ₱2,999 | 10 |
| Marketplace (₱2,500×4 · 24h×4) | ₱10,000 | 96 |
| **TOTAL** | **≈ ₱42,992** | **≈ 745 hrs** |

**Headline (locked):** *"₱42,992 · 745 hours — saved, free."* (live-computed per couple; demo = typical couple above). **Additional time-savers** from §C (inquiry fan-out, one-place chat, day-of portal, Drive sync ≈ +30 h) are documented but **kept out of the headline** for credibility — they read as quality benefits, not extra hours.

**Headline candidates:** *"~1,400 hours and ~₱44,000 — saved, free."* (or rounded down for credibility: *"1,000+ hours · ₱40,000+"*).

---

## E · Flags / decisions

1. ✅ **RESOLVED (2026-06-01)** — Filtering = **3 hrs per category**; "filtered N vendors" is a display wow-stat, not a time multiplier.
2. ✅ **RESOLVED (2026-06-01)** — Dashboard = **0.5 hr/day** (≈183 hrs at 365-day runway). Tamed for credibility.
3. **Website (#4) = 350 hrs flat** — high but defensible (building 3 sites). Owner: kept. *(still confirm trim if desired)*
4. **Marketplace expos replaced** — capped at realistic couple attendance (**~4 expos** in the worked example), not the full 2,400-vendor pool.
5. ✅ **RESOLVED (2026-06-01)** — Today's Focus **EXCLUDED** from the free-plan savings (it's the ₱1,499 paid SKU; the DIY journey baseline stays free but isn't counted as a "saving").
6. **Per-couple vs fixed headline** — recommend **live** (variables exist). Prototype currently hardcodes the typical-couple demo (₱42,992 · 745 hrs · 48 vendors); production computes live.

**Per-guest note (owner asked 2026-06-01):** none of the savings change with guest count — they key off categories · shortlisted · runway · design vendors · expos. *(Open option: make Guest Planner pax-scaled — a 500-guest list/seating is more work than 50 — currently flat 12h.)*

---

## F · Where it surfaces
- **Onboarding → Your Plan** — the "you saved ₱X · Y hours" headline above the free list (animated count-up).
- **Onboarding → Congrats** — replaces the placeholder "200+ hrs" stat with the real computed number.
- **`/pricing` + marketing** — a fixed "couples save ~₱44,000 + ~1,400 hours" proof line.

## G · Cross-references
- `Onboarding_Blueprint_2026-05-30.md` §3.3 (the free-baseline list + the vs-elsewhere comparison) · `Vendors_Plan_Budget_Tab_Spec_2026-05-31.md` §6 (hours-saved benchmark open item, now resolved here).
- The free-baseline list is locked in CLAUDE.md (High Res Archive free-baseline + Google-Drive auto-sync rows, 2026-06-01).
- Iterations: 0001 guest list · 0006 vendors/marketplace · 0007 budget · 0008 seating · 0010 mood board · 0016 Today's Focus · 0021 dashboard · 0031 day-of guest.
