# Onboarding Blueprint — Customer + Vendor (locked 2026-05-30)

> Design lock for Setnayan's three conversion-funnel onboardings. This is the **design** source of truth; screen-by-screen copy is drafted next, engineering after. Built from the `app-onboarding-questionnaire` skill framework (Mob/Headspace/Noom archetypes), adapted to Setnayan's free-to-plan customer model and V2-publisher / token vendor model.
>
> **Status:** design locked · not yet built · engineering is a proper build (realistically post-pilot — pilot 2026-06-01 ships on the current signup → dashboard flow).
> **Register (owner pick):** full conversion-funnel *structure*, copy in Setnayan editorial voice, **soft paywalls** (every "paywall" is skippable; the free experience always continues).

---

## 1 · Scope

**Three onboardings — 1 customer + 2 vendor:**

| # | Flow | Trigger | Ends on |
|---|------|---------|---------|
| 1 | **Customer** | Customer signup | "Your Plan" — free services + matched paid boosters (soft) |
| 2 | **Vendor #1 · Signup** | Vendor signup | Starter **token bundle** + submit verification |
| 3 | **Vendor #2 · Verified** | Admin confirms the business is legit (verification approved) — days later, via first login / email deep-link | 100 free tokens + Verified/Pro/Enterprise plan choice |

Guests and admins do **not** get these funnels — they keep the lighter Driver.js guided tour (iteration **0030**). Separate, already specced.

**Folds in existing setup surfaces (owner pick: "absorb"):** customer flow absorbs event creation + the wedding-type picker (**0043**) + the mood mini-interview (**0010**) + first-vendor discovery (**0006**); vendor flow absorbs category + first package + the verification submit. It does **not** duplicate them.

---

## 2 · Cross-cutting principles

- **Soft paywall, always.** Customers keep the full free DIY experience on skip; vendors keep a free listing that still *receives* inquiries on skip. No hard gate — that would break the locked free-to-plan / Free-tier model.
- **Honest social proof.** Pre-launch = sample testimonials marked as samples now; swap for real pilot quotes after 2026-06-01. (Owner: "yes, we will change them.")
- **Setnayan editorial voice** even inside a funnel — no marketing clichés, honest comparisons, "would I say this to a friend?" test. No real dark patterns; the one "processing moment" is light anticipation, not a fake loader that lies.
- **Resumable.** Persist answers as the user goes (the skill's memory/state pattern) so a drop-off can resume.
- **One conceptual ask per screen** (Noom-style, high completion) — group only tightly-coupled micro-fields (e.g. both partners' names on one screen). *[defaulted — confirm]*
- **Account creation point:** run the personalization questions first (low friction, anonymous), then a soft account gate right before the value/plan output ("Create your free account to keep your plan"). Invest-then-gate. *[defaulted — confirm]*

---

## 3 · Flow 1 — Customer onboarding

*Reconciled to the live `events` schema 2026-05-30 (study of `apps/web/lib/events.ts` + the create-event flow + the 0043 picker). The personalization screens (**your list**) are the **customization data that actually improves results** — each writes a real column downstream surfaces read. The pain / tinder / social-proof / mood screens write **no** personalization data; they're an optional conversion layer, kept separate.*

### 3.0 · Canonical data map — what each personalization screen captures + drives

| Screen (your list) | Canonical column(s) | Captured today in | Drives |
|---|---|---|---|
| **Role** · Bride / Groom / Others | `event_moderators.role_subtype` | host membership / invite | multi-host (0048) · primary-host status · tailored framing |
| **Kind of wedding** · Religious · Civil · Mixed | sets the `events.ceremony_type` axis (Religious→faith · Civil→`civil` · Mixed→`mixed`) | create-event (0000 + 0043) | timeline + requirements + which vendors |
| **Religion / tradition** *(if Religious or Mixed)* | **`ceremony_type`** — Catholic live; Christian · INC · Muslim · Cultural "coming soon" → notify · `secondary_ceremony_type` for Mixed | create-event (0043) | religion-match vendor filtering · officiant auto-resolve · faith-aware copy |
| **Wedding name** | `events.display_name` | create-event | monogram · website slug · chrome |
| **Wedding date** | `events.event_date` + `event_date_precision` (year/month/day) | create-event / wizard | countdown · Today's Focus scheduling · vendor availability |
| **Region** *(not venue type)* | region/area — eng: lightweight `events.region` (or coarse `venue_address`); exact `venue_name`/coords set later | onboarding → settings | area / distance vendor matching before an exact venue exists |
| **Estimated pax** — 100 · 200 · 250 · 300 · 500 (+ Not sure) | `events.estimated_pax` | Today's Focus card #2 | caterer/venue sizing · recommendations |
| **Estimated budget** — ₱500k · ₱1M · ₱2M · ₱3M · ₱4M · ₱5M (+ Still figuring) | `events.estimated_budget_centavos` | Today's Focus card | recommendation ranking · shortlist budget |

**What the study changed (the fix):**
- **Kind of wedding → religion / tradition (two steps), owner-corrected 2026-05-30.** Couples first pick the *kind* (Religious · Civil · Mixed), then — for Religious/Mixed — the *faith* (Catholic live; others coming soon). Together they resolve `ceremony_type`. **`venue_setting` moves OUT of onboarding** — it's set later (event settings / wizard); onboarding asks **region** instead.
- **Pax + budget already exist** as `events.estimated_pax` / `events.estimated_budget_centavos` (today they're Today's Focus wizard cards). Onboarding **pulls them forward** so the first vendor demo sizes + ranks correctly.
- **Role = `event_moderators.role_subtype`** — "Others" = parent / planner / entourage (0048), not throwaway.
- **Region, not venue type (owner-corrected 2026-05-30).** Screen 7 asks the *region* (Metro Manila · CALABARZON · Cebu · Davao · …), not "types of venue." Early planners know their area before their exact venue. Eng note: needs a lightweight region field (or coarse `venue_address`); exact `venue_name` + coords captured later drive precise distance matching.
- **Account constraint:** an `events` write needs an authed user. **LOCKED — invest-then-gate:** answers held in client state, account created at "Customizing your plan…" (screen 11).

### 3.1 · Full sequence — **LOCKED (lean), 2026-05-30**

**Consolidated — 14 screens, one navigable file: `Onboarding_Customer_Flow.html`** (supersedes the split `Onboarding_Customer_01_Welcome.html` + `_Flow_PartA.html` + `_Plan.html`).

**Personalize** *(canonical data · before login)*
1 Welcome · 2 Role · **3 Kind of wedding** (Religious · Civil · Mixed) · **4 Religion / tradition** (Catholic live; others coming soon — skipped for Civil) · 5 Wedding name · 6 Wedding date · **7 Region** *(not venue type)* · 8 Estimated pax (100 · 200 · 250 · 300 · 500) · 9 Estimated budget (₱500k–₱5M)
**10 What would you love?** — service picker, **interest-only (no prices)** → builds the one-time package
**11 Customizing your plan… → create free account** — the **login moment** (invest-then-gate)

**Payoff** *(after login)*
12 Find your first vendor *(demo · tap to shortlist)* · 13 Your starting plan *(event + shortlist recap)* · 14 **Your Plan** *(§3.2)*

**Part B — Convert — CUT 2026-05-30.** Owner went lean: no pain / tinder / social-proof / mood. The data does the personalizing; notifications priming folds into the dashboard, not the funnel. *(Full plot: `Onboarding_Sequence_Map.html`.)*

### 3.2 · "Your Plan" — the end-screen (owner-designed)

Not a paywall, a **plan summary**. Free-first so trust is built before any price appears. Three stacked sections:

1. **Everything you get free** — dashboard, marketplace + your shortlist, free wedding website, mood board, guest list, Today's Focus DIY essentials. *"All of this is yours, ₱0."*
2. **Boosters matched to *your* wedding** — 2–4 paid add-ons chosen from their funnel answers, each with a one-line "why this fits you." Personalization rules (examples):
   - **Big church wedding + relatives abroad / high guest count** → Panood livestream + Today's Focus ("Catholic weddings carry the most paperwork — we map every deadline")
   - **Style-forward (mood-board heavy)** → Animated Monogram + Pro Website
   - **Budget-conscious / intimate** → Today's Focus + Save-the-Date video
   - **Young / social** → Papic + Patiktok
   - Today's Focus is the anchor for everyone ("keep the guidance going").
3. **Your package · 10% off, one payment** *(LOCKED)* — everything they picked, founder price, as a **pre-order**: live services unlock now, coming-soon ones unlock the day they ship, with a credit/refund if any is ever dropped. (Picker is interest-only — prices + the vs-elsewhere comparison reveal *here*.)
4. **Or get it all → Pro Bundle ₱24,999** (~50% off à la carte) — auto-steer here if their picks would total more than the bundle.

Quiet **"Continue with the free plan"** that never punishes the skip.

*Optional (parked):* one honest contrast line on this screen — *"A wedding planner charges ₱X+; your plan here starts free."* — owner to decide.

### 3.3 · Customer services — price comparison + the apparatus rule (owner data 2026-05-30)

The "what would you love?" picker (§3.1 screen 9 · interest-only) and "Your Plan" (§3.2) sell against a **"vs hiring elsewhere"** comparison — the customer-side equivalent of the vendor 0%-vs-15% gut-punch. Owner-supplied research (Kasal.com · Nuptials.ph · Bride and Breakfast PH · Prodigital · Kwyzer · EventNest · Vidlens · Gifty PH · Gear Rental PH).

**🔑 The apparatus rule — LOCKED, non-negotiable honesty.** Every paid service is a **Setnayan tool, NOT hired people.** The "elsewhere" price = hiring the person + crew + gear; the Setnayan price = the software that delivers the outcome — the couple brings their own people + phones. **Every service card + package line MUST carry the tool-not-people framing** ("this is the app, not a hired photographer/coordinator/crew"). It's what makes the "you save" number truthful and defensible. Lineage: the long-locked apparatus-pricing principle — *"the phone is not included, the crew is not included."*

| Service | Setnayan | Elsewhere | You save | Elsewhere = hiring… |
|---|---|---|---|---|
| Animated Monogram | ₱2,499 | ₱15,500 | ₱13,001 | designer + motion studio |
| Pro Website | ₱5,499 | ₱25,000 | ₱19,501 | freelance web dev |
| Panood (livestream/day) | ₱3,499 | ₱17,500 | ₱14,001 | livestream videographer |
| Custom QR per guest | ₱1,499 | ₱5,000 | ₱3,501 | invitation designer |
| Today's Focus | ₱1,499 | ₱20,000 | ₱18,501 | day-of coordinator (lightest) |
| Indoor Blueprint | ₱1,499 | ₱12,500 | ₱11,001 | floor-plan + seating service |
| Call-Time Escalator | ₱1,999 | ₱10,000 | ₱8,001 | OTD vendor-management fee |
| Patiktok | ₱2,499 | ₱18,000 | ₱15,501 | 360 / social video booth |
| Pabati | ₱999 | ₱12,000 | ₱11,001 | video guestbook booth |
| Pakanta | ₱2,499 | ₱12,500 | ₱10,001 | custom original song |
| Papic Guest | ₱2,999 | ₱32,000 | ₱29,001 | 20+ disposable cams + dev/scan |
| Guest Stories | ₱1,999 | *(no market equiv)* | — | ~₱500–1,000/guest manual |
| Thank You Video | ₱5,499 | ₱60,000 | ₱54,501 | 5-min cinematic highlight |
| SDE | ₱3,499 | ₱35,000 | ₱31,501 | same-day-edit videographer |
| Papic (5 seats) | ₱2,999 | ₱75,000 | ₱72,001 | 5 photographers × 5 hrs |
| Camera Bridge | ₱1,999 | ₱17,500 | ₱15,501 | extra DSLR operator |
| Live Venue Photo Wall | ₱2,499 | ₱18,000 | ₱15,501 | onsite live-slideshow team |
| Live Background | ₱2,499 | ₱20,000 | ₱17,501 | LED wall rental + crew |
| High Res Archive | ₱2,999/yr | ₱5,000 | ₱2,001 | USB + gallery delivery |

**Free baseline** (owner list — the "Everything you get free" block of "Your Plan"): another-bidder alerts · unlimited bids · compare quotes side-by-side · best-vendor recommendations · invite an off-platform vendor · chat + video-call vendors · scheduler · your wedding website · personal monogram · checklist · budget tracker · seat plan · inspiration board · guest-list maker · real reviews · Verified-badge safety.

**Live vs coming-soon (per `apps/web/lib/v2-catalog.ts` `BUILD_STATUS`, 2026-05-30):** only **Today's Focus** is `live`/buyable today; the rest are `partial`/`not_built`. "Your Plan" therefore **sells the comparison on live services**, and shows the rest as **"coming soon · notify me"** — the comparison is the teaser, no charge. Each flips to buyable automatically as the feature ships (the onboarding reads `BUILD_STATUS`, same as `/pricing`). Mockup of the screen: `Onboarding_Customer_Plan.html`.

### 3.4 · Admin onboarding manager — curate what's offered (owner request 2026-05-30)

A new admin surface lets the owner pick **which services appear in the onboarding** (picker §3.1 screen 9 + "Your Plan" §3.2) — manual curation **on top of** the automatic `BUILD_STATUS` filter. Lives in the admin console (iteration 0023, beside Add-on Management § 3.12). Single-admin authority · audit-logged · **plot: `Onboarding_Admin_Manager.html`**.

**The page** — every customer service as a row: `Service · Build status · Offer (toggle) · Order · Featured · Blurb override`. Drag to reorder · ★ to feature · toggle to offer · rewrite the picker card's one-liner inline.

**Composition (honesty preserved):**
- **On + `live`** → buyable in the package.
- **On + `coming-soon`** (`partial`/`not_built`) → shows as "notify me" (comparison teaser), **never charged**.
- **Off** → hidden entirely.

So the owner curates the onboarding **without a deploy** — push a service the day it's ready, pull one for a season, reorder, feature. The admin can *offer* anything, but `BUILD_STATUS` still decides what's *charged* — the apparatus + honesty rules hold.

**Schema:** small config table `onboarding_offerings` (`service_code` PK · `enabled` BOOL · `sort_order` INT · `featured` BOOL · `blurb_override` TEXT) — or a few columns on the catalog. The onboarding reads it × `BUILD_STATUS`. The service-by-service cards (§3.3 + the add-on review) are the **library** this page toggles from.

**Sequencing:** new admin surface = **V1.x post-pilot.** Pilot can ship with a hardcoded default offering (catalog × `BUILD_STATUS`); the manager lands as a fast follow.

### 3.5 · The add-on card library — canonical per-service cards (locked 2026-05-30)

The **library** the picker (§3.1 screen 9), "Your Plan" (§3.2), and the admin manager (§3.4) all read from. One canonical card per customer service — 19 total. Source of truth for prices + build status is `apps/web/lib/v2-catalog.ts`; comparison figures are §3.3. Visual gallery: **`Onboarding_Addon_Library.html`** (grouped Live / In build / Coming soon, each card rendered exactly as the couple + admin see it).

Each card carries **four canonical fields**: a **picker blurb** (interest-only, italic, no price — what shows on screen 9), a **what-it-is** apparatus line (the tool), a **tool-not-people** tag (the role the elsewhere-price hires), and the **comparison** (Setnayan → elsewhere → save) revealed on "Your Plan." Build status decides charged vs notify-me.

| Service (`code`) | Picker blurb | Setnayan | Elsewhere | Tool, not… | Build |
|---|---|---|---|---|---|
| **Today's Focus** (`TODAYS_FOCUS`) | "Never wonder what to do next." | ₱1,499 | ₱20,000 | a hired day-of coordinator | 🟢 Live |
| **Pro Website** (`PRO_WEBSITE`) | "Your wedding, on its own website." | ₱5,499 | ₱25,000 | a hired web developer | 🟡 In build |
| **Custom QR per Guest** (`CUSTOM_QR_GUEST`) | "One scan, and your guest finds everything." | ₱1,499 | ₱5,000 | a hired invitation designer | 🟡 In build |
| **Indoor Blueprint** (`INDOOR_BLUEPRINT`) | "Your whole venue, mapped and seated." | ₱1,499 | ₱12,500 | a hired layout service | 🟡 In build |
| **Animated Monogram** (`ANIMATED_MONOGRAM`) | "Your initials, drawn live." | ₱2,499 | ₱15,500 | a hired motion studio | 🟡 In build |
| **Panood** (`PANOOD_SYSTEM`) | "Family abroad watches it live." | ₱3,499/day | ₱17,500 | a hired livestream crew | 🟡 In build |
| **Patiktok** (`PATIKTOK_COMPILER`) | "A video booth guests run themselves." | ₱2,499 | ₱18,000 | a hired 360 / social-video crew | 🟡 In build |
| **Papic Guest** (`PAPIC_GUEST`) | "Every guest's phone, a candid camera." | ₱2,999 | ₱32,000 | 20 disposable cams + developing | 🟡 In build |
| **Papic · 5 Seats** (`PAPIC_SEATS`) | "Turn five friends into your photo crew." | ₱2,999 | ₱75,000 | 5 hired photographers × 5 hrs | 🟡 In build |
| **High Res Archive** (`HIGH_RES_ARCHIVE`) | "Keep every original, full quality." | ₱2,999/yr | ₱5,000 | a USB-and-delivery service | 🟡 In build |
| **Live Background** (`LIVE_BACKGROUND`) | "Design the screen behind your stage." | ₱2,499 | ₱20,000 | an LED wall rental + crew | 🟡 In build |
| **Pabati** (`PABATI`) | "A guestbook that talks back." | ₱999 | ₱12,000 | a hired booth + attendant | ⚪ Coming soon |
| **Pakanta** (`PAKANTA`) | "Your wedding's own song." | ₱2,499 | ₱12,500 | a hired composer + singer | ⚪ Coming soon |
| **Guest Stories** (`PAPIC_ADDON_STORIES`) | "Everyone gets their own highlight reel." | ₱1,999 | *no market equiv* | per-guest manual editing | ⚪ Coming soon |
| **Thank You Video** (`PAPIC_ADDON_THANK_YOU`) | "A cinematic thank-you, edited for you." | ₱5,499 | ₱60,000 | a hired cinematographer | ⚪ Coming soon |
| **Same-Day Edit** (`SDE`) | "A highlight reel before the night ends." | ₱3,499 | ₱35,000 | a hired SDE crew | ⚪ Coming soon |
| **Camera Bridge** (`CAMERA_BRIDGE`) | "Bring a DSLR — bridge it in." | ₱1,999 | ₱17,500 | a hired second shooter | ⚪ Coming soon |
| **Live Venue Photo Wall** (`LIVE_WALL`) | "Photos on the wall, live." | ₱2,499 | ₱18,000 | a hired onsite slideshow team | ⚪ Coming soon |
| **Call-Time Escalator** (`CALL_TIME_ESCALATOR`) | "Your vendors, reminded on the day." | ₱1,999 | ₱10,000 | a hired on-the-day manager | ⚪ Coming soon |

**Composition recap:** picker shows the blurb only (no price). "Your Plan" reveals the comparison; **Live → buyable**, **In build / Coming soon → "notify me"** (teaser, never charged). The admin manager toggles each row on/off and can override the blurb. As each `partial`/`not_built` SKU ships, it flips to buyable automatically — no copy change needed (onboarding reads `BUILD_STATUS`, same as `/pricing`).

**Pakanta price — RESOLVED 2026-05-30:** owner-confirmed **₱2,499** (matches v2.1 brief § 5 catalog + §3.3; supersedes the earlier ₱3,499 single-tier from CLAUDE.md fourth 2026-05-28 row). Still verify the live `platform_retail_catalog_v2` row matches at engineering time.

---

## 4 · Flow 2 — Vendor onboarding #1 (Signup)

*List free → create first package → token economics → starter token bundle → submit verification. Vendor is fully live on **Free** during the verification wait (listing up, receiving inquiries, can spend tokens to answer).*

**Mockup (12 navigable screens):** `Onboarding_Vendor1_Signup.html` — phone-frame walk-through with the live package-builder (screen 5) and the 0%-vs-15% kill-shot (screen 10).

| # | Screen | Funnel role | What it does in Setnayan |
|---|--------|-------------|--------------------------|
| 1 | Welcome | Hook | "Run your business, not your DMs." End-state: an inbox of ready-to-book couples. **List free** |
| 2 | HQ location | Personalize | City/province → location + radius (Free 10km) + screen-name ("Manila Wedding Photographer #…") |
| 3 | Years in weddings | Trust | Start year → "X years in weddings" badge |
| 4 | Primary category | Goal | Pick main service from the taxonomy |
| 5 | **Create first package** | Build | Name + price (or range) + inclusions + 3–5 photos → a **live marketplace listing** |
| 6 | Other services? | Tease | Add more categories (Free = 1; more with Verified/Pro/Enterprise) |
| 7 | Pain points | Empathy | "What's hard about getting wedding clients?" (ads, ghosting, DMs) |
| 8 | Tour of the free stuff | Value | Free listing + microsite + portfolio + chat + inquiries + **0% commission, ever** |
| 9 | Notifications priming | Permission | "Never miss an inquiry" |
| 10 | **Demo: answer an inquiry with a token** | Aha + economics | The 0%-vs-15% moment — see §4.1 |
| 11 | Profile live | Output | Their marketplace card + microsite preview |
| 12 | **Starter token bundle** *(soft)* | Convert | Token packs — see §4.2 + submit verification |

### 4.1 · The 0%-vs-15% pitch (vendor demo screen)

**Beat 1 — the inquiry lands:**
> *Maria & Juan are looking for a wedding photographer in Manila for Dec 18. They sent you an inquiry.*  →  **[ Reply · 1 token ]**

**Beat 2 — why that token is nothing:**
> ## Your sale is 100% yours.
> Other platforms take a cut of every booking — often **15%** — just for handing you a lead. On a ₱1,000,000 wedding, that's **₱150,000 gone.**
>
> We don't want a peso of your sale. You pay **1 token (₱250)** to answer an inquiry from a couple who's *actually looking to book*. That's the whole cost — even on a ₱1,000,000 booking, we ask for one token. It just helps us run the app.

**Kill-shot table:**

| On a ₱1,000,000 booking | Other platforms | Setnayan |
|---|---|---|
| Commission taken | −₱150,000 (15%) | **₱0** |
| Cost to reach the lead | (inside the 15%) | 1 token · ₱250 |
| **You keep** | ₱850,000 | **₱999,750** |

*Comparative-claim safety:* attribute "15%" to a category, not a named rival (*"platforms that take a cut of your sale charge up to 15%"*), or use a range (*"10–20%"*). The ₱1M math stays just as devastating.

### 4.2 · Starter token bundle (end-screen)

> ## Start with tokens.
> *Each token answers one inquiry — one real chance to get booked.*
>
> Token packs: **4 · 10 · 25 · 50 · 100** — per-token price drops as the pack grows (₱250 → ~₱180).
>
> **+100 free tokens** when you verify your business before launch.
>
> **[ Get started ]** · *Stay on the free plan*

Free skip is honest: a Free vendor still gets a listing and still *receives* inquiries — tokens just let you *answer* them.

**Do not sell Pro/Enterprise here.** Tokens are the only thing a vendor needs to start; the tier sell belongs in onboarding #2 (post-verification), when they've felt a real inquiry land.

---

## 5 · Flow 3 — Vendor onboarding #2 (Post-verification)

**Trigger (locked 2026-05-30):** loads automatically **the first time the vendor logs in after their business is verified** (12-doc verification approved by admin, 3–5 business-day SLA). It's a **one-time** flow — gated by a seen-flag on the vendor record (e.g. `verified_onboarding_seen_at`), so it shows once and never re-fires on later logins. The *"Your business is verified — see what's unlocked"* email/notification is the **nudge to come back and log in**; its deep-link routes into this same flow. If the vendor dismisses it, it stays reachable from the dashboard (*"What's unlocked"*) — never orphaned.

**Mockup (5 screens):** `Onboarding_Vendor2_PostVerification.html` — verified-seal + the 100-token wallet drop (screen 1), the good/better/best benefits cards (screen 3), and the monthly/yearly billing toggle (screen 4).

### Spine
1. **"You're verified."** Badge live + **drop the 100 free founder tokens into their wallet here** (the dopamine moment lands here, not at signup).
2. **What verification unlocked** — star ratings now show, 20km reach, up to 20 inquiries/week, up to 3 categories.
3. **"Want to go further?"** — the benefits comparison (§5.1).
4. **Billing choice** — monthly or annual, with the savings shown.
5. **"Stay Verified — free"** soft skip, always.

### 5.1 · Benefits screen — good / better / best (felt benefits, not a feature dump)

- **Verified · Free** — *"Get found and trusted."* Badge, star ratings, 20km, up to 20 inquiries/week, up to 3 categories, earn bonus tokens by recommending Setnayan services.
- **Pro · ₱2,499 / 28 days** *(or ₱24,999/yr — save ₱7,488)* — *"Run your business."* Your name shown in browse, **unlimited inquiries**, 50km, video calls, **all** reviews visible, your own website + slug, file sharing, specialized tools, bundle maker, share-inquiry links, **3 team logins**.
- **Enterprise · ₱5,499 / 28 days** *(or ₱54,999/yr — save ₱16,488)* — *"Run it at scale."* Everything in Pro, plus **your whole team (unlimited logins)**, **unlimited categories**, **unlimited daily bookings**, **100km reach**. For studios, multi-branch, high-volume vendors.

The real Pro→Enterprise jump (§6) is **team + scale + volume**, never just radius.

---

## 6 · Canonical vendor tier matrix (reconciled from owner spreadsheet 2026-05-30)

> This supersedes the partial matrix in CLAUDE.md's V2.1-amendment-#2 row, which was **missing the team-accounts and daily-capacity rows.** The owner's spreadsheet is now source of truth; the v2.1 brief + iteration 0022 should be reconciled to match (queued).

| Feature | Free | Verified | Pro | Enterprise | Booster (tokens) |
|---|---|---|---|---|---|
| Reach radius | 10km | 20km | 50km | 100km | 4 |
| Create packages | ✓ | ✓ | ✓ | ✓ | 10 |
| Chat | ✓ | ✓ | ✓ | ✓ | 25 |
| Categories | 1 | up to 3 | up to 3 | **Unlimited** | — |
| Team accounts | 1 | 1 | **3** | **Unlimited** | — |
| Video call | — | — | ✓ | ✓ | 50 |
| Scheduling | Manual | Hybrid | Hybrid | Hybrid | 100 |
| Vendor name | Hidden until first reply | Hidden until first reply | **Shown** | **Shown** | — |
| Daily capacity | — | — | up to 2/day | **Unlimited** | — |
| Inquiries (bids)/week | 10 | 20 | **Unlimited** | **Unlimited** | — |
| Token bonus qualified | — | ✓ | ✓ | ✓ | — |
| Portfolio | ✓ | ✓ | ✓ | ✓ | — |
| Editorial tagging | — | — | ✓ | ✓ | — |
| Show star ratings | — | ✓ | ✓ | ✓ | — |
| Show all reviews | — | — | ✓ | ✓ | — |
| Website | Basic | Custom (name hidden) | Custom | Custom | — |
| Custom slug | — | — | ✓ | ✓ | — |
| Inquire on website | ✓ | ✓ | ✓ | ✓ | — |
| Onboarding bundle maker | — | — | ✓ | ✓ | — |
| Specialized tools | — | — | ✓ | ✓ | — |
| File sharing | — | — | ✓ | ✓ | — |
| Bring in outside clients | ✓ | ✓ | ✓ | ✓ | — |
| Share inquire link | — | — | ✓ | ✓ | — |
| Recommend Setnayan services | — | ✓ | ✓ | ✓ | — |
| **Price** | ₱0 | ₱0 | **₱2,499 / 28 days** | **₱5,499 / 28 days** | — |

*Reading notes:* "Token bonus qualified" = earn free tokens by recommending Setnayan services to your booked couples. "Onboarding bundle maker" = a vendor's own custom couple-intake tool (distinct from these three onboardings). Booster column = token cost to temporarily boost that feature for a window.

---

## 7 · Token economics (reference)

- **1 token = ₱250** baseline (cheaper per token in bigger packs, down to ~₱180).
- **1 token = answer / engage 1 inquiry** — unlocks chat + reveals your name + video + quote.
- **0% commission** on bookings — the token is the *only* per-engagement charge, flat regardless of booking size (₱250 on a ₱1M booking).
- **Earn** bonus tokens (not just buy) via "Recommend Setnayan services" (Token Bonus Qualified, Verified+).
- **100 free founder tokens** on verification before launch — delivered in onboarding #2.

---

## 8 · Open / defaulted decisions + drift flags

| Item | State |
|---|---|
| Soft vs hard paywall | **Soft**, locked |
| Customer end = personalized bundle (free + paid boosters) | Locked |
| Social proof | Sample now, real later — locked |
| Keep both Pro + Enterprise | **Yes**, locked (matrix §6 differentiates them) |
| Account-creation point | Defaulted: questions first, gate before output — *confirm* |
| Screen granularity | Defaulted: one concept/screen — *confirm* |
| Customer "Your Plan" contrast line | Optional — *owner to decide* |
| **Verified price** | **₱0 — RESOLVED 2026-05-30.** Verified is genuinely free (no one-time badge fee). Onboarding #2's "stay Verified — free" line is accurate. |
| **Pro/Enterprise cadence** | **28-day prepaid block — RESOLVED 2026-05-30.** Shown as "₱2,499 / 28 days" + "₱5,499 / 28 days." Annual ₱24,999 / ₱54,999 (savings ₱7,488 / ₱16,488 = ~3 cycles, already computed on 13 blocks/yr). |
| **Pakanta price** | **₱2,499 — RESOLVED 2026-05-30** (owner-confirmed; matches catalog + §3.3). Still reconcile vs the live `platform_retail_catalog_v2` row at engineering time. Other booster + token-pack prices still pulled from `v2-catalog.ts` / `Pricing.md` at copy-draft time. |

---

## 9 · Cross-iteration impact

Touches: **0000** (signup/shell), **0006** (vendors/marketplace), **0010** (mood), **0015** (marketing/conversion voice), **0016** (Today's Focus), **0021** (couple dashboard), **0022** (vendor dashboard/tiers), **0030** (guided tour — stays separate), **0043** (wedding-type picker), plus the V2 token model + v2.1 tier model.

**Corpus reconciliation owed (queued):** update the vendor tier matrix in the v2.1 brief (`CLAUDE-CODE-BRIEF-v2.1_2026-05-28.md` §3) + iteration `0022` to add the **team-accounts** and **daily-capacity** rows from §6 above, so the corpus stops trailing the owner's spreadsheet.

---

## 10 · Next steps

1. Owner confirms the §8 flags (Verified price, cadence, the two defaults).
2. Draft screen-by-screen **copy** word-for-word (skill Phase 4) — start with the two end-screens (highest-leverage): Customer "Your Plan" + Vendor #1 token bundle + Vendor #2 benefits.
3. Engineering build (skill Phase 5) — sequence per owner; realistically post-pilot. Strong candidate for one shared onboarding engine (progress bar + answer persistence + screen framework) driving three content configs.
