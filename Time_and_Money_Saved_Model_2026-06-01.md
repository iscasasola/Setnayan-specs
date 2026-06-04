# Time & Money Saved Model — 2026-06-01

**Purpose.** Power the *"you've already saved ~₱X and ~Y hours — free"* lines on the onboarding **Your Plan** + **Congrats** screens (and reuse on `/pricing` + marketing). Every free Setnayan feature carries **(a)** a market-equivalent peso value (what a couple would pay elsewhere → *money saved*) and **(b)** a time-saved formula (*time saved*). This doc is the single source of truth for both totals.

**Scope note.** The peso values below are **market-equivalent guidance** — what the equivalent tool/service costs *elsewhere* — NOT Setnayan SKU prices (Setnayan gives these **free**). They are the owner-supplied basis for the *money-saved* calc and stay distinct from the locked `service_catalog` SKU prices. Design-lock · V1.x post-pilot · prototype + spec only.

> **⚠️ FINALIZED 2026-06-03 — §H + §I are now authoritative (they supersede the §A–§F time values).** The §A–§F 10-feature model (headline ₱42,992 · 745h) was reconciled to the owner's full **33-item** list, **practical-time-audited**, and **locked** (owner 2026-06-03): the 4 new tools approved (Songlist Maker · Wedding Date Aligner · Food Planner · Contract Compiler), the inflated time trimmed (Website 350→50h · Dashboard 0.5→0.25h/day · etc.). **Final headline (typical couple): computed ~₱63,500 · ~295 hours → marketing round-down _"₱60,000+ · 250+ hours — saved, free."_** *(money values raised to defensible market-equivalents 2026-06-03 — see §H.4; time unchanged.)* See §H (final master + formula), §I (audit, applied), and the closing **Final locked values** table.

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

---

## H · Reconciled 33-item master — FINAL (owner-locked 2026-06-03)

The owner's free-tools list = **33 labels**, de-duplicating to **~16 value drivers**. All values below are **locked (owner 2026-06-03)** — the four new tools approved, the §I time-trims applied, money confirmed. Status key: ✅ locked · ◻︎ quality / no-hours (anti-double-count) · ⊘ vendor-side, excluded from the couple total.

> **Two label corrections (owner 2026-06-03):** #33 is **Contract Compiler** (not "Contact"); **Food Planner** = a Songlist-style **menu + dietary builder for caterers** (owner: *"like the songlists but for caterers"*). Both now have **spec homes (2026-06-03):** **Food Planner** → [Vendor_Compatibility_and_Master_Songlist §7](Vendor_Compatibility_and_Master_Songlist_2026-06-03.md) (the catering twin of the master song list); **Contract Compiler** → [Contract_Compiler_2026-06-03.md](Contract_Compiler_2026-06-03.md). **Songlist Maker** already lives in that compatibility doc (the couple `event_song_picks` picker); **Wedding Date Aligner** in [Schedule_Matrix_and_Date_Finder](Schedule_Matrix_and_Date_Finder_2026-06-02.md). **Free/paid boundary kept clean:** the free Contract Compiler **organizes** contracts (upload · key terms · e-sign status · payment/renewal deadlines); the paid **0032 Contract Intelligence** AI clause-analysis (₱199/contract) stays paid. The free Food Planner is a **preference list**; the paid vendor **Professional Catering** constraint-solver stays paid.

### H.1 · The 33 labels → value drivers (final · money raised 2026-06-03)

| # | Label | Driver | Money | Time | Scales by | |
|---|---|---|---|---|---|---|
| 1 | Setnayan AI | (AI layer) | — | — | — | ◻︎ powers monogram + recs + dates |
| 2 | Planner | Advanced Filtering Planner | **₱4,999** | 3h | **per category** | ✅ ↑ |
| 3–5 | RSVP + Event + Editorial | Website (triple) | **₱14,999** | **50h** | flat | ✅ ↑ (still < ₱25K Pro) |
| 6 | Songlist Maker | Songlist Maker | **₱1,499** | 3h | flat | ✅ ↑ |
| 7 | Mood Board | Mood Board | **₱3,999** | **5h** | flat | ✅ ↑ |
| 8 | Seat Plan | Guest Planner (seat + list) | **₱2,999** | 12h | flat | ✅ ↑ |
| 9 | Budget + Payment Reminders | Budget Tracker | ₱3,999 | 12h | flat | ✅ held (+ late-fee savings) |
| 10–11 | Scheduler · Checklist | → Dashboard | — | — | — | ◻︎ fold into Dashboard |
| 12 | Mood Board *(dup)* | = #7 | — | — | — | ◻︎ counted once |
| 13 | Monogram | Basic Monogram | **₱1,499** | **4h** | flat | ✅ ↑ (< ₱2,999 paid bespoke) |
| 14 + 17 | Recommended + Unlimited Bidding | Marketplace (vs expos) | ₱2,500 | **10h** | **per expo replaced** | ✅ held (×expo) |
| 15 | Wedding Date Aligner | Date Aligner | **₱1,499** | 3h | flat | ✅ ↑ |
| 16 | Comparison | Vendor Comparison | **₱2,499** | **1h** | **per shortlisted** | ✅ ↑ |
| 18 | Chat Service | One-place chat | — | 0.5h | per locked vendor | ✅ |
| 19 | Video Call | (quality) | — | — | — | ◻︎ |
| 20 | Invite Outside Vendors | BYO-vendor invite | — | 1h | per invited vendor | ✅ |
| 21–24 | Verified Badge · Reviews · Real Weddings · Collision Alert | Trust | — | — | — | ◻︎ quality |
| 25 | Custom Taxonomy | (vendor-side) | — | — | — | ⊘ excluded |
| 26 | Drive Sync | Drive media sync (permanent copy) | ₱5,000 | 5h | flat | ✅ held (at corpus ₱5K) |
| 27 | Dashboard | Dashboard hub | ₱3,999 | **0.25h** | **per day to wedding** | ✅ held |
| 28 | Day-of Guest Portal | Day-of portal (0031) | **₱1,999** | 6h | flat | ✅ ↑ |
| 29 | QR Code | Free branded / invite QR | ₱999 | 2h | flat | ✅ held (< ₱1,499 paid Custom QR) |
| 30 | Inquiry Fan-Out | Inquiry fan-out | — | **0.5h** | **per category** | ✅ trimmed 1.5→0.5 |
| 31 | Payment Reminders | (in Budget #9) | *late fees* | — | — | ✅ |
| 32 | Food Planner | Food Planner (caterer prefs) | **₱1,499** | 4h | flat | ✅ ↑ approved |
| 33 | Contract Compiler | Contract organizer | **₱1,999** | 3h | flat | ✅ ↑ approved |

*↑ = money raised to a defensible market-equivalent (2026-06-03); **held** = already at an honest ceiling or capped by a paid SKU. Time values untouched — the §I audit stands. Rationale in §H.4.*

### H.4 · Money raised to defensible market-equivalents (owner 2026-06-03)

Owner: *"you can price them higher if possible."* Raised **only** where the PH market honestly supports a higher "what you'd pay elsewhere" figure; **held** where we are already at an honest ceiling or capped by a paid SKU. (Money only — time is the §I-audited set and does not move.)

| Item | Was | Now | Basis |
|---|---|---|---|
| Filtering Planner | ₱3,999 | **₱4,999** | vendor-sourcing is a core wedding-planner deliverable |
| Website (triple) | ₱12,999 | **₱14,999** | corpus cites **₱25K** elsewhere for the *Pro* site; free basic = 3 surfaces, kept below Pro |
| Guest Planner | ₱1,999 | **₱2,999** | guest management + a real seating-chart deliverable |
| Mood Board | ₱2,999 | **₱3,999** | a stylist design concept / styling consult |
| Comparison | ₱1,999 | **₱2,499** | quote-vetting across shortlisted vendors |
| Monogram | ₱999 | **₱1,499** | a designer monogram — kept under the ₱2,999 paid bespoke |
| Songlist · Food · Date Aligner | ₱999 ea | **₱1,499 ea** | per-area planner consult (music / menu / date) |
| Day-of Portal | ₱1,499 | **₱1,999** | a slice of day-of guest coordination |
| Contract Compiler | ₱1,499 | **₱1,999** | contract organization / review |
| **Held** | — | — | Budget ₱3,999 · Dashboard ₱3,999 (no clean "elsewhere" equiv) · Drive ₱5,000 (at corpus figure) · Marketplace ₱2,500/expo (×expo amplifies) · QR ₱999 (must stay **below** the ₱1,499 paid Custom QR) |

**Credibility check:** the new typical total **~₱63,500** is still **less than a single mid-tier PH wedding-planner fee** (₱50K–150K) — so "you saved ₱60K+ in tools/services you'd otherwise pay for" reads as conservative, not inflated.

### H.2 · Parameterized formula (final · trims applied · money raised)

```
moneySaved = 38,992                    // 8 flat drivers, RAISED (Filtering 4,999 + Website 14,999 + Guest 2,999
           //                              + Budget 3,999 + Monogram 1,499 + Comparison 2,499 + Dashboard 3,999 + Mood 3,999)
           + 2,500 × exposReplaced     // Marketplace (held)
           + 5,000                     // Drive Sync #26 (held)
           +   999                     // QR free #29 (held)
           + 1,499  // Songlist #6   +  1,499  // Date Aligner #15  +  1,999  // Day-of #28
           + 1,499  // Food Planner #32  +  1,999  // Contract Compiler #33
        //  = 53,486 + 2,500 × exposReplaced

timeSaved  = 3    × categories     // Filtering            (unchanged — the money raise does not touch time)
           + 0.5  × categories     // Inquiry fan-out      (trimmed 1.5→0.5)
           + 1    × shortlisted    // Vendor Comparison    (trimmed 3→1)
           + 10   × exposReplaced  // Marketplace          (trimmed 24→10)
           + 0.25 × runwayDays     // Dashboard            (trimmed 0.5→0.25)
           + 0.5  × lockedVendors  // Chat        (~8 typ.)
           + 1    × invitedVendors // BYO invite  (~2 typ.)
           + 109  flat             // Website 50 + Guest 12 + Budget 12 + Monogram 4 + Drive 5 + QR 2 + Day-of 6 + Mood 5 + Songlist 3 + Date 3 + Food 4 + Contract 3
```

*Mood Board moved to the flat bucket (build-once, share-free), so `designVendors` no longer drives time. Time is unchanged by the money raise.*

### H.3 · Scenario range (final · per couple)

| Couple | cat / short / runway / expo | Money | Time |
|---|---|---|---|
| Lean | 5 / 8 / 180 / 2 | **~₱58,500** | **~205h** |
| **Typical** | 10 / 15 / 365 / 4 | **~₱63,500** | **~295h** |
| Big wedding | 14 / 25 / 540 / 5 | **~₱66,000** | **~380h** |

**Headline (typical):** computed **~₱63,500 · ~295 hours** → **marketing round-down for credibility: _"₱60,000+ · 250+ hours — saved, free."_**

---

## I · Practical-time audit (2026-06-03) — applied

The audit that produced the trims now live in §H. **Money is market-equivalent (raised 2026-06-03 per §H.4); the original *time* headline (745h) was inflated** — it exceeded the ~200–500h a whole DIY wedding takes, with Website 350h + Dashboard 183h = **72%** of it. **Owner approved all trims 2026-06-03.**

| Feature | Was | Now ✅ | Why |
|---|---|---|---|
| Website (triple) | 350h | **50h** | 350h = ~9 FT weeks; a DIY 3-site build is ~40–60h. |
| Dashboard | 0.5h/day (183h) | **0.25h/day (~91h)** | Weddings plan in bursts, not daily; key off ~150 active days. |
| Vendor Comparison | 3h/short (45h) | **1h/short (15h)** | ~1h to gather + normalize a quote. |
| Marketplace / expos | 24h/expo (96h) | **10h/expo (40h)** | A real expo is ~6–8h incl. travel. |
| Inquiry Fan-Out | 1.5h/cat (15h) | **0.5h/cat (5h)** | Messaging 3 vendors ≈ 20–30 min; overlaps Filtering. |
| Mood Board | 2h/design (10h) | **5h flat** | Build once, share free — stop double-counting the build. |
| Monogram | 8h | **4h** | The free mark auto-generates instantly. |
| Filtering · Guest · Budget · Drive · QR · Chat · Invite · Day-of | — | **kept** | Already modest + believable. |

**Net:** time headline **745h → ~295h** (typical); money **raised to market-equivalents (§H.4) → ~₱63,500**. Lead with the round-down **"₱60,000+ · 250+ hours."**

---

## ✅ Final locked values (owner 2026-06-03)

| Item | Money | Time | Note |
|---|---|---|---|
| Songlist Maker (#6) | ₱1,499 | 3h | music must-play / do-not-play list for DJ/band |
| Wedding Date Aligner (#15) | ₱1,499 | 3h | candidate-date ↔ vendor-availability convergence |
| Drive Sync (#26) | ₱5,000 | 5h | full credit — the Drive copy is permanent (held) |
| Day-of Portal (#28) | ₱1,999 | 6h | guests self-serve table / schedule / photos |
| QR Code (#29) | ₱999 | 2h | free branded/invite QR — held below the ₱1,499 paid SKU |
| **Food Planner (#32)** | ₱1,499 | 4h | menu + dietary/allergy/halal prefs for the caterer · spec'd in [Vendor_Compatibility §7](Vendor_Compatibility_and_Master_Songlist_2026-06-03.md) (catering twin of the song list) |
| **Contract Compiler (#33)** | ₱1,999 | 3h | organize vendor contracts (≠ paid 0032 AI analysis) · spec'd in [Contract_Compiler_2026-06-03.md](Contract_Compiler_2026-06-03.md) |
| Money raise (§H.4) | ↑ applied | — | Filtering 4,999 · Website 14,999 · Guest 2,999 · Mood 3,999 · Comparison 2,499 · Monogram 1,499 — held: Budget · Dashboard · Drive · Marketplace · QR |
| §I time trims | — | applied | Website 50 · Dashboard 0.25/day · Comparison 1/short · Marketplace 10/expo · Inquiry 0.5/cat · Mood 5 flat · Monogram 4 |
