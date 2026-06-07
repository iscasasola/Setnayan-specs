# SETNAYAN Wedding Onboarding — Conversion Remodel

### "The wedding website that builds itself while you fall in love with it."

> **Status:** Buildable remodel · 2026-06-08. Synthesizes the conversion, desire, money, and website-capture lenses into one spine, then applies every valid fix from the brand-lock/ethics audit and the conversion-rigor stress test. Built on the canonical 7-beat adaptive flow (`Onboarding_Wedding_Adaptive_Redesign_2026-06-07.md` §12) and its locked covert love-story rules.
>
> **Worked couple throughout:** **Liza Mercado ♥ Marco Villanueva** · 150 guests · Tagaytay/Cavite · Dec 2026 · ₱650K · Catholic.
>
> ⚠ **All prices below are ILLUSTRATIVE** (flagged `*`). They must come from the vendor SKU template at build, never be hardcoded, and need owner sign-off. See §4 + §7.

---

## 1 · What changes & why it converts

Today the flow **collects beautifully but sells nothing on the way through.** The magic real-preview fires once, the reveal is six emoji tiles, ~20 website inputs are punted to an editor nobody opens, and the only money beat is a single cold bundle at the end. The remodel makes three structural moves:

**1. The whole flow becomes one visible act of creation.** A persistent live preview — **"the Mirror"** — is *born at the monogram screen* (screen 3–4, not screen 10) and accretes **one real element with every answer** (names → monogram → love story → countdown → venue → palette → vendors → hero photo). The flow reads as *building your real wedding website, live* — not filling a form. Because the personalization is **real data only**, Setnayan does the one thing Cal-AI's fake-personalization theater structurally can't: it cashes the payoff for real.

**2. The reveal is restaged as the climax, and it's full — not empty.** A new **Beat 4.5 ("Make your site yours")** captures the ~20 stranded website inputs *inside the desire window*, so the reveal blooms into a near-finished, scrollable RSVP site the couple is proud to share — turning desire into a social act ("Show Marco · Copy your link").

**3. Money is spread across five staged beats, value-anchored before any price, and the paywall stays genuinely soft.** Value is manufactured in three currencies (pesos · hours · % of their own budget) and **re-surfaced at the offer** so the bundle reads as a rounding line, not a new expense. The offer ladder is value-anchor → account → small-first SKU → bundle climax → second-chance. The locked **"continue free to a working dashboard"** promise is literally true and alive beneath every offer card — converting the playbook's biggest liability (bait-and-switch) into Setnayan's deepest trust advantage. A new **honesty beat** states exactly how manual PHP payment works, pre-empting disputes before they start.

**Conversion read:** the funnel converts because the soft paywall is genuine and the reveal is satisfying. Endowment + sunk-cost peak at the offer because the couple has watched ~12 real elements of *their* wedding assemble in their own hands; leaving means abandoning something visibly theirs and half-built. The offer then reads as *"complete the magic,"* not *"give us money."*

---

## 2 · The remodeled flow — screen by screen

**Conventions.** `NEW` = net-new screen/stage · `CHANGED` = exists, reworked · `KEPT` = unchanged function. Techniques: `affirmation · stat · why-hook · market-research · honesty · real-preview · climax`. Internal IDs (`s1payoff` etc.) are engineering-only — **couple-facing screens use friendly stage names** ("Your Dream Venue," "Make It Unforgettable"), never "Stage 4 · s4boost."

### Beat 1 — Hook

| Screen | State | What it does (convert / delight / capture) | Technique | Example copy | Website-input captured |
|---|---|---|---|---|---|
| `intro` | **CHANGED** | Opens on identity + kilig, not workload. One emotional tap creates ownership, silently seeds the covert editorial Scale/Spend voice, and plants the Mirror promise. A lightweight RA 10173 transparency line rides the same screen (no modal). | why-hook + real-preview (promise) | "Before anything else — what do you want your wedding to feel like? · Effortless · Unforgettable · Just the two of us · All-out celebration. No wrong answer — it just tells us where to start. → Let's build your wedding website, together. Free to start, always. · We'll learn what matters to you to find the perfect vendors — and keep your data private." | `feel` seed (→ covert Scale/Spend + theme tilt); silent UTM/referrer/landing capture begins |

### Beat 2 — Identity (the Mirror is born)

| Screen | State | What it does | Technique | Example copy | Website-input captured |
|---|---|---|---|---|---|
| `role` → `helper` → `couple` | **KEPT** (fn) / **CHANGED** (copy) | Easiest, most delightful asks first — builds momentum + sunk-cost. On both surnames, warm kilig echo + silently mint the "the [Surname] wedding" identity string used at the reveal. | affirmation | role: "First, let's get to know you. Who's saying 'I do'?" · couple echo: "Liza Mercado ♥ Marco Villanueva — the start of the Villanueva–Mercado wedding." | `bride_name`/`groom_name`, display name (→ masthead, RSVP header); helper identity (→ `event_moderators`) |
| `monogram` | **CHANGED** (key structural move) | The live self-drawing monogram is the first "answers become beauty" proof. On commit it **flies into a small site-header preview card pinned to the top of the viewzone for the rest of the flow** — the Mirror is mounted here (screen 3–4), cashing the hook immediately. | real-preview | "Your monogram, drawn live. Tap to restyle — it heads your invites, your QR, your whole site." → toast: "That's your wedding page. It fills in with every answer." · caption: YOUR WEDDING WEBSITE · BUILDING LIVE ✨ | `monogram_*` (frame/font/style → hero, QR center, save-the-date, collateral) |

### Beat 3 — Your wedding website story (covert love spine — covertness verbatim)

| Screen | State | What it does | Technique | Example copy | Website-input captured |
|---|---|---|---|---|---|
| `love_intro` → `love_met` → `love_proposal` → `love_tone` | **KEPT** (covert spine, verbatim rules) | Highest-emotion content right after identity, before any money. **Covertness preserved exactly** — names ONLY "your wedding website story"; never editorial/newspaper/song/Pakanta/lyrics. Each answer drops a real line into the SAME Mirror — "Our Love Story" appears in their chosen voice. RECOMMENDED + skippable; min-to-continue = how_we_met + proposal + tone. | real-preview | love_intro: "Three quick moments — the heart of your wedding website. Your guests will love this part. [Start] / [Add it later]" · love_met hint: "Opens your wedding website story." · love_tone badge: "● Appears as 'Our Love Story'" sub: "We'll write your website copy in your voice — change it anytime." | `love_story` JSONB · `story_tone` · `story_language` (silent). Covertly seeds RSVP "Our Love Story" (visible), editorial spine (hidden), Pakanta lyric seed (hidden) |

### Beat 4 — Shape the day (Layer-0 filters → each a Mirror payoff)

| Screen | State | What it does | Technique | Example copy | Website-input captured |
|---|---|---|---|---|---|
| `kind` → `tradition` | **KEPT** / **CHANGED** (honest stat) | Each say-eyebrow carries ONE honest, defensible stat (already shipped on `kind`). | stat | kind: "In 2023, 414,213 Filipino couples married — every faith, every kind." | `ceremony_type`/`secondary_ceremony_type`/`is_mixed_ceremony` (→ RSVP messaging; auto-sets dietary defaults) |
| `date` | **CHANGED** | Births the live countdown on the Mirror ("your guests will see this") + a 1.2s affirm-then-advance micro-beat (reuse `.say.is-react`) — no new screen. | affirmation | affirm: "December 2026 — a 16-month runway. Plenty of room, zero rush." · Mirror caption: "142 days until you become the Villanuevas · COUNTDOWN · LIVE." | `date_mode`/`date_candidates`/`date_window_*` (→ countdown, RSVP deadline). `event_date` stays null |
| `location` | **CHANGED** | Dateline + map pin bloom on the Mirror. | real-preview | "Tagaytay · December 2026 — your guests will get directions straight from your site." | region + `search_areas` + venue lat/long from area centroid |
| `pax` | **CHANGED** | Reframed from capacity to people who love you. | stat | "How many people will be there to love you on the day? · Most Cavite couples plan for ~150 — we'll size every quote to yours." | `estimated_pax` (→ capacity filter, covert editorial Scale axis) |
| `budget` | **CHANGED** | Locked warm PH-celebratory affirmation that lowers post-choice anxiety AND plants the first covert value-anchor (pesos + relative-cost) so the bundle later reads as a rounding line. | affirmation | "₱650,000 for 150 guests in Cavite is a beautiful, very doable wedding — we'll make every peso count. The Setnayan touches that make it unforgettable run about ₱15,000 of that — roughly 2.3% of your budget — and replace an ₱80,000+ coordinator." | `budget_band` + `estimated_budget_centavos` (→ vendor price filter, covert editorial Spend axis) |

### Beat 4 (cont.) — Your venue = ground 0 (first hard proof-of-value)

| Screen | State | What it does | Technique | Example copy | Website-input captured |
|---|---|---|---|---|---|
| `s1edu` → `s1type` → `s1search` (+BYO) | **KEPT** | Education justifies the ask; reception type → search/shortlist/BYO as the distance ground-0 anchor. On shortlist, the venue slots as a real card INTO the Mirror's "Your reception" section. | real-preview | s1edu: "A florist in Cebu can't serve a Tagaytay reception — your venue anchors everything." | `venue_setting` · `event_vendors` 'considering' · `recomputeReceptionAnchor` → `venue_latitude/longitude` |
| `s1payoff` | **CHANGED** | Lead with the felt win → the defensible saved-hours number (`computeOnboardingSavings`, must compute from search depth + category count + radius, not a flat constant) → ONE conservative social-proof line → soft account nudge framed as **saving** what they built ("save to your phone," not "create an account"). **Account = L1 = durability switch** + precondition for purchases to persist. | stat + real-preview | "Look how far you already are — your monogram, your love story, a live countdown, and a venue we matched. Out of 240 Tagaytay reception venues, we found you 8 — about 6 hours you didn't spend searching. Want to save this to your phone? [Continue with Google] · I'll do this later." | venue card render confirmed; account activation (durable cross-device save) |

### Beat 4.5 — Make your site yours · **NEW STAGE** (the website lens's core fix)

> A short, fixed, **skippable, Recommended-tier** stage that captures the ~20 website inputs deferred today to a cold editor — relocating the *moment of capture* into the desire window. **Each beat is one no-scroll screen with a "pick a beautiful default" escape** so it never feels like work; commit-then-patch persistence unchanged. ⚠ **Owner sign-off gate:** confirm this stage's placement in the canonical §12 spine (sits between the venue payoff and the reveal).

| Screen | State | What it does | Technique | Example copy | Website-input captured |
|---|---|---|---|---|---|
| `site_hero` | **NEW** | Upload a couple photo/clip for the scrub-video hero (or a tasteful regional default); monogram redraws over it live. | real-preview | "Give your page a face." | `landing_page_hero_video_r2_key` / `our_photos` |
| `site_welcome` | **NEW** | Greeting + short note — the page "speaks." Re-homes `special_message` off the deleted `love_note`. | real-preview | "Say hello to your guests." | `greeting` · `special_message` |
| `site_schedule` | **NEW** | 4-row quick schedule (Ceremony / Cocktails / Reception / Send-off) — lights the schedule + powers day-of live mode. | real-preview | "How will the day flow?" | schedule blocks / `event_details` times |
| `site_guestinfo` | **NEW** | Dress-code chips + what-to-bring/registry chips + 2–3 FAQ toggles (Kids? Parking? Livestream?). The "stop the 2 a.m. group-chat questions" beat. | real-preview | "Answer the questions before they ask. · Gifts of cash are welcome." | `what_to_wear` · `what_to_bring` · `rsvp_form_config`/FAQ |
| `site_music` | **NEW** | Upload a track OR "Have Setnayan compose your wedding's own song" (covert-safe Pakanta entry, on its own merits, NOT adjacent to the story harvest) OR none. Plays a 5s placeholder snippet so "your page's own song" is *heard*, not described. | real-preview | "Set the mood." closing checkpoint: "Your site looks beautiful, Liza — want Setnayan to match your vendors too, or jump in?" | `site_bg_music_source` |

### Beat 4 (cont.) — Setnayan AI + services

| Screen | State | What it does | Technique | Example copy | Website-input captured |
|---|---|---|---|---|---|
| `aigate` | **CHANGED** | Named for the benefit. **Both branches reach the boost + paywall** — declining must NOT drop them out of the money funnel. The No-path routes through a brief DIY-finder checkpoint (3 options: browse later · just the basics · actually, match me) instead of jumping straight to paid services. | stat | "Want us to handpick your vendors? We score every vendor against your date, budget, faith, pax and style — the part couples pay matchmakers for. Free either way. [Yes, match my vendors] / [I'll browse myself]." | AI intent (behavioral signal; matched vendors → "your team") |
| `s2pick` → `refine_basic` → `s3pick` → `refine` | **KEPT** (instrumented as buy-intent) | Each picked leaf shows exactly ONE Layer-1 refinement chip-row (8 leaves → 8 taps, not 56). **Refinement opens as a modal/popover, not a full screen,** to keep pacing tight. Every pick drops a chip into the Mirror's "Our team" row (progression visualized) AND silently aims which boost SKU / bundle leads at the climax. | real-preview | refine_basic (Catering): "What should the table taste like? Filipino · Spanish-Filipino · Plated · Buffet · Halal — we'll match the rest." | `interested_categories[]` · `event_vendor_preferences` (6-dim leaf match) |

### Beat 6 — The reveal (restaged as the climax)

| Screen | State | What it does | Technique | Example copy | Website-input captured |
|---|---|---|---|---|---|
| pre-reveal transition (~2s) | **NEW** | Real labor-illusion that resolves into a genuine artifact (monogram strokes draw in). | climax | "Assembling your wedding…" | — |
| `dashboard` reveal | **CHANGED** (6 emoji tiles → full-screen scroll-to-explore REAL site) | The persistent Mirror blooms full-size: a scrollable, **near-finished** RSVP site (animated monogram · ticking countdown · "Our Love Story" in their voice · matched venue + map · their schedule, greeting, dress code · palette · vendors) — full *because Beat 4.5 filled it.* **Skipped stages render a graceful placeholder** (e.g. generic "Our Love Story" that auto-fills on later edit), never an empty gap. Leads with identity payoff, ends on pride/shareability. Privacy one-liner + soft account nudge land at peak value. | climax + real-preview | "Set na 'yan. ✨ This is the Villanueva–Mercado wedding — and it already exists." → full scroll-preview → "[Show Marco 💍] · [Copy your link · setnayan.com/liza-marco] · 142 guests will see this page." Privacy: "Your guest list and details stay private — only you and the vendors you choose ever see them." → Take me in → | none new — renders everything captured; share link / visibility surfaced |

### Beat 7 — The offer (soft paywall · five-beat money ladder)

| Screen | State | What it does | Technique | Example copy | Website-input captured |
|---|---|---|---|---|---|
| `s4boost` | **KEPT** / **CHANGED** (foot-in-the-door small-first SKU) | The couple's FIRST real peso "yes" before the bundle. À-la-carte cards (Animated Monogram, Save-the-Date, Pakanta), each framed as "lighting up a section of YOUR site," with a real wedding photo + per-card "worth" micro-anchor. **Selecting a card animates that element in the Mirror** (monogram micro-loop; song snippet). **Pakanta lives HERE on its own merits — never adjacent to the love-story harvest.** A collapsible "How Setnayan works" sits under the heading (the honesty disclosure, internalized before checkout, not sprung at payment). | climax (small-first) | Pakanta (no back-reference): "New · Pakanta — Your wedding's own song. A custom song for your day, yours alone, playing across your site. Setnayan AI composes it. from ₱1,999*." · Monogram: "Animated Monogram — your mark, brought to life on your hero. ₱2,499*." | `interested_services` (→ animated hero, live photo wall, page song) |
| `s5honesty` | **NEW** (required, 1 no-scroll screen) | The under-promise screen — load-bearing because PHP is reconciled **manually** (disputes = real cost). States what's included, that pricing is first-purchase only, that activation is within 24h *after payment is confirmed by a person*, that a BIR receipt comes with every purchase, and that continuing free is genuinely real. Structurally pre-empts bait-and-switch + chargebacks. Added to canonical §12 between Survey and Settlement. | honesty | "Here's exactly what happens: choose a package → payment instructions with your reference code → pay via BDO or GCash → we confirm and activate within 24 hours. You'll get a BIR receipt for every purchase — keep it for your records. First-purchase pricing is one-time. And if you'd rather not — your dashboard already works, free, forever. Nothing is locked." | none |
| `s4bundle` → `s5paywall` | **CHANGED** (the designed climax) | Opens with a single honest reframe line above the cards (see below) so the offer reads as *additions, not gates.* Leads with the LOWER package as primary (small-first) + comprehensive as "★ best value." Struck-through auto-summed "worth" + save pill + **line-item JTBD-grouped rows** (Plan it · Capture & celebrate · Remember & share) + ONE conservative social-proof line + a genuine 30-min first-purchase timer (reverts to full price on expiry — only the *discount* is lost, never a feature, never the dashboard). Which bundle leads is personalized from the couple's own s2pick/s3pick signals. **The value-anchor is re-surfaced here** ("Setnayan's tools run about ₱15,000 — ~2.3% of your budget"). **"Or keep planning free →" is alive beneath both cards the entire time** and after expiry. | climax | reframe: "You already have a working RSVP site — save it free, forever. The packages below just add some pro touches. Either way, no paywall, ever." · "Build the wedding once — let Setnayan run it. First-purchase price ends in 29:13. · Set Essentials ₱14,999* ~~₱24,500~~ save ₱9,501 · 39% off — 6 included. · Set Complete ★ Best value ₱29,999* ~~₱48,400~~. Or keep planning free — your dashboard stays exactly as it is." | `bundle` + `bundlePromo` (frozen price) · `paid` (→ website tier: Basic RSVP vs Pro w/ Event/Editorial) |

### Beat 5 (placed post-reveal per give-before-take) — Attribution + settlement

| Screen | State | What it does | Technique | Example copy | Website-input captured |
|---|---|---|---|---|---|
| `survey` | **KEPT** (single extractive tap, post-reveal, optional) | Embedded market research at peak delight; doubles as money + product signal (vendor referral → recommend-earn token credit; friend's wedding → viral coefficient). | market-research | "One last thing — how did you find us? A friend's wedding · A vendor told me · Facebook group · Google · Wedding fair · Somewhere else. Optional — it just helps us thank whoever sent you. [Skip]" | attribution field (→ recommend-earn, ad allocation, supply intelligence) |
| `settle` | **CHANGED** (second-chance, money beat #5) | Free-path couples are offered a genuinely free **Editorial page** — *explained as a value* (a magazine-style wedding keepsake Setnayan writes from their photos, guest reactions, and vendors), not a bare upsell. Accepting re-opens checkout where the bundle + à-la-carte SKUs are one tap away, and surfaces the vendor-direct-pay rail (Setnayan Pay 3% transparent line; vendor receives full amount). Paid couples get the same free Editorial as thanks. Recommend-earn loop surfaced here (give-before-take). Either way → account-activate + working hub. | honesty + climax (second-chance) | Free: "Before you go — we'd love to make you a keepsake: an Editorial page, your wedding as a magazine, free on us. Setnayan writes it from your photos, your guests' reactions, and the vendors who made it happen. [Add it free] / [Just take me to my dashboard]." · Paid: "Done — and here's a free Editorial page as a thank-you. Welcome in, Liza & Marco." | settlement path · vendor-pay rail intent · recommend-earn opt-in |

---

## 3 · The real-preview reveal mechanic (the emotional + monetization engine)

The single central move: **mount a persistent live preview — "the Mirror" — from the monogram screen onward**, occupying the upper **viewzone** of every screen (controls stay in the lower **tapzone** — golden-rule clean). It is **born** at `monogram` (screen 3–4) and **accretes exactly one real element at every subsequent answer**, each with a one-line payoff caption:

| Answer | Mirror gains | Caption |
|---|---|---|
| names | site header | "↑ That's your website header now." |
| monogram | hero nameplate + URL | "Your wedding page — it fills in with every answer." |
| love story | "Our Love Story" block (their voice) | "Your story is now live on your site." |
| date | ticking countdown | "142 days until you become the Villanuevas." |
| location | dateline + map pin | "Tagaytay · December 2026." |
| budget/style | palette bloom | (theme tints the preview) |
| venue | "Your reception" card | "↑ Your venue, with a map, is on your page." |
| services | "Our team" chips | (each pick drops a chip live) |
| Beat 4.5 | hero photo, greeting, schedule, dress code | "↑ Your hero just came alive." |
| boost (selected) | monogram animates / song plays | (micro-loop + 5s snippet) |

**Why it's the conversion fix:** the hook promised "watch it build" — the Mirror must materialize *visibly after every answer from screen 3–4*, not be copy. This converts Cal-AI's *personalization theater* (fake plan + artificial loading) into Setnayan's **honest, real-data magic** — the one thing a competitor structurally can't copy.

**Why it's also the monetization engine:** by the offer, the couple has watched ~12 real elements of THEIR wedding assemble in their own hands. Endowment + sunk-cost are maximal; leaving means abandoning something visibly theirs and half-finished. The offer reads as *"complete the magic"* (Animated Monogram → the hero animates; Papic → a live photo wall on the day; Pakanta → your page gets its own song) — not *"give us money."* Every preview element is **real captured data only**, so the magic is earned, never manufactured. The **Reveal** is not a separate artifact — it's the Mirror blooming to full screen.

---

## 4 · Money architecture + soft-paywall climax

**Five money beats along one emotional arc** (each later beat converts better because the earlier one warmed it):

1. **Value-anchoring during capture (no charge).** Manufactures willingness-to-pay in three currencies, NO price attached until the climax: **pesos** (a coordinator costs ₱80K–150K), **hours** (~200 to plan; ~6 saved per search via a *real, computed* `computeOnboardingSavings` — not a flat constant), **relative-cost** (the ~₱15K of extras is ~2.3% of a ₱650K wedding). Planted in the budget affirmation **and re-surfaced at the bundle** so it never goes stale.
2. **`s1payoff` account conversion (L1).** Anonymous → account is the durability switch — the precondition for any purchase to persist cross-device. Phrased "save to your phone," not "create an account." First conversion KPI; the peso ask comes later, warmer.
3. **`s4boost` foot-in-the-door SKU.** A low first "yes" (Animated Monogram ₱2,499* / Pakanta from ₱1,999*) makes them a *paying customer* before the big ask — paid users escalate to the bundle far more readily (commitment-consistency). The Mirror animates the purchased element so the SKU reads as *completing what they started*, not adding a feature.
4. **`s4bundle` climax (most revenue).** Two Bundle-Builder packages, **small-first-led**: Set Essentials ₱14,999* primary + Set Complete ₱29,999* "★ best value" upsell. **Line-itemed** (each bundle lists its included SKUs) so the struck-through "worth" isn't arbitrary, JTBD-grouped, save pill, ONE conservative social-proof line, genuine 30-min first-purchase timer (reverts to full price; only the discount expires). The `s5honesty` beat sits one screen earlier so the timer never reads as fake scarcity.
5. **`settle` second-chance.** Recovers walk-pasts with a *clearly explained* free Editorial carrot that re-opens checkout, opens the vendor-direct-pay rail (Setnayan Pay 3% transparent line), and surfaces the couple-side recommend-earn credit loop.

**Soft-climax offer (LOCKED).** "Continue free" is alive beneath every offer card *and after the timer expires* — the locked "Start planning · free" promise. A single honest reframe line sits above the bundle cards: *"You already have a working RSVP site — save it free, forever. The packages below just add some pro touches."* The discount expires; the dashboard, the RSVP site, the sharing, the guest list never do.

**Upsell ladder:** single signature SKU → lower bundle → comprehensive bundle → (post-onboarding) per-service vendor bookings via Setnayan Pay + recommend-earn token loop.

> ⚠ **All prices ILLUSTRATIVE — owner sign-off required.** In-app SKU prices come from the **vendor template, never an admin SKU editor**, and should be queried live from `service_catalog` at render, not hardcoded in HTML. Every bundle + à-la-carte card carries a small "(illustrative pricing)" line until locked, so copy stays honest when prices update without a rebuild.
>
> **Surface, don't bake — four owner gates:**
> 1. **Bundle SKUs don't exist on the live catalog.** Set Essentials ₱14,999 / Set Complete ₱29,999 are net-new. Reconcile + add to `Pricing.md § 0.B` once locked, with line-item contents.
> 2. **Pakanta tier ladder (₱1,999 / ₱3,999 / ₱9,999 spec) vs single AS-BUILT SKU (₱2,499).** The song step's intake design depends on this — if single SKU, drop the tier picker; if tiered, update `Pricing.md`. Blocks the `site_music` + `s4boost` Pakanta pricing.
> 3. **0% vs 5% commission contradiction** (homepage/pricing 0% vs /for-vendors 5% Setnayan Pay) must be settled before the `settle` vendor-pay fee line ships.
> 4. **Setnayan AI price** (₱8K/₱10K illustrative) — confirm.

---

## 5 · Complete website-data capture checklist

| Website input | Captured at beat | Status vs today |
|---|---|---|
| Couple names + display name | B2 `couple` | KEPT |
| Monogram design | B2 `monogram` | KEPT |
| Helper identity | B2 `helper` | KEPT |
| Love story (met/proposal/years) | B3 `love_met`/`love_proposal` | KEPT (covert) |
| Story tone + language | B3 `love_tone` | KEPT (covert) |
| Wedding date / window | B4 `date` | KEPT |
| Location/region (≤2) | B4 `location` | KEPT |
| Ceremony kind + faith | B4 `kind`/`tradition` | KEPT |
| Guest count | B4 `pax` | KEPT |
| Budget band + amount | B4 `budget` | KEPT |
| Reception setting/type | B4 `s1type` | KEPT |
| Shortlisted / BYO venues + anchor | B4 `s1search` | KEPT |
| In-house catering flag | B4 `s1search` (implied) | KEPT |
| **Hero media (photo/video)** | **B4.5 `site_hero`** | **MOVED EARLIER (was post-onboarding editor)** |
| **Greeting** | **B4.5 `site_welcome`** | **MOVED EARLIER** |
| **Special message / note to guests** | **B4.5 `site_welcome`** | **MOVED EARLIER (re-homed off deleted `love_note`)** |
| **Wedding schedule / timeline** | **B4.5 `site_schedule`** | **MOVED EARLIER** |
| **What to wear (dress code)** | **B4.5 `site_guestinfo`** | **MOVED EARLIER** |
| **What to bring / registry** | **B4.5 `site_guestinfo`** | **MOVED EARLIER (NET-NEW field)** |
| **RSVP FAQ / form config** | **B4.5 `site_guestinfo`** | **MOVED EARLIER (partial)** |
| **Looping background music intent** | **B4.5 `site_music`** | **MOVED EARLIER** |
| Style palette / mood-feel | B1 `feel` + B4 budget/style (covert) + theme bloom | STRENGTHENED (seeded at hook, was implicit only) |
| AI matching intent | B4 `aigate` | KEPT |
| Service picks (basics + extras) | B4 `s2pick`/`s3pick` | KEPT |
| Service refinements (Layer-1) | B4 `refine_basic`/`refine` | KEPT |
| Setnayan in-app services à la carte | B7 `s4boost` | KEPT |
| Pakanta / page song | B4.5 `site_music` + B7 `s4boost` | KEPT (covert-safe, decoupled) |
| Bundle choice + promo lock | B7 `s4bundle` | KEPT |
| Payment decision | B7 `s5paywall` | KEPT |
| Attribution | B5 `survey` | KEPT (post-reveal) |
| Account activation (durable save) | B4 `s1payoff` (soft) / B5 `settle` (required) | KEPT |
| Guest list base (couple seeded) | B2 (auto) | KEPT |
| Save-the-Date video | B7 `s4boost` (intent) | KEPT |
| Hashtag / slug / visibility | B6 reveal (share link surfaced) + dashboard editor | DEFERRED (acknowledged — light-touch at reveal) |

**Net effect:** the ~20 inputs the audit found stranded in a post-onboarding editor are now captured inside the desire window (Beat 4.5), so the Reveal renders a *full* site — closing the audit's #1 finding (onboarding built a vendor plan + an empty website shell).

---

## 6 · Lock + ethics guardrails

- **Soft paywall (LOCKED).** "Or keep planning free → your dashboard stays exactly as it is" is alive beneath every offer card and persists after the timer expires. The climax is a first-purchase OFFER (two bundles + genuine 30-min timer), never a gate. No feature is ever locked — only the discount expires. A hard pay-to-finish gate would be brand repositioning → **flagged for owner, not baked in.**
- **Covert love story (LOCKED).** The `love_intro→love_met→love_proposal→love_tone` spine names ONLY "your wedding website story"; zero "editorial/newspaper/song/Pakanta/lyrics" on any couple-facing screen, badge, hint, or wire/state field (`storyTone`/`storyLanguage`). Pakanta sells at `s4boost`/`site_music` on its own merits, 6+ screens after the harvest. *Remaining aesthetic risk:* the song-step pre-fill is reverse-engineerable — frame it as *"Based on your wedding details, here are some themes for your song"* (mood boards derived from vibe + date + venue), so it feels like clever AI, not data-recycling.
- **No-scroll golden rules (LOCKED).** Every screen stays a 375px no-scroll ~665px frame: Mirror in the upper **viewzone**, controls in the lower **tapzone**; SETNAYAN brand always visible; minimal words; preloaded/instant. New affirmation/honesty beats are 1.2s micro-beats or single screens. Beat 4.5's five beats are one no-scroll screen each + "pick a default" + Skip. ▸ **QA gate:** verify all five Beat 4.5 screens render no-scroll on iPhone SE (375px) in-browser before ship.
- **PH-first voice (LOCKED).** EN-primary, warm/premium Clean Editorial, kilig welcome; every stat is honest/defensible (manual PHP reconciliation = real disputes), so social proof stays conservative and the saved-hours number stays computed, not invented.
- **Give-before-take (LOCKED).** The only extractive question (attribution) stays post-reveal, optional, one tap. Silent UTM/behavioral capture costs zero UX. RA 10173 transparency line rides the Intro hook (purpose-limitation, no modal); ▸ **legal review gate:** confirm silent-behavioral-capture + post-reveal attribution + min-N aggregate path is RA 10173-compliant, and that the privacy policy covers retention windows + subprocessors (Supabase, PostHog, recommend-earn loop).
- **Adaptive staged spine (LOCKED).** Every stage is a finish line — any checkpoint lands on a working hub; the new Beat 4.5 is Recommended + fully skippable; commit-then-patch persistence unchanged; account = L1 (durable), pay = L2 (unlock).
- **Manual PHP honesty (NEW guardrail).** `s5honesty` is required (no Skip), states the 24h human-confirm activation + BIR receipt, and a post-purchase toast sets expectation it's not instant — reducing chargeback risk inherent to manual reconciliation.

---

## 7 · Build next — prioritized

**P0 — owner sign-off gates (block build):**
1. Confirm **Beat 4.5 ("Make your site yours")** belongs in the canonical §12 spine + its placement (venue payoff → reveal).
2. Lock **bundle SKUs + line-item contents** (Set Essentials / Set Complete) and add to `Pricing.md § 0.B`, or swap to real SKUs.
3. Resolve **Pakanta: single SKU vs 3-tier ladder** (drives the `site_music`/`s4boost` intake design).
4. Settle **0% vs 5% commission** (blocks the `settle` vendor-pay fee line).
5. Add **`s5honesty`** to the canonical §12 flow (between Survey and Settlement, required).

**P1 — highest-leverage build (do first):**
6. **The Mirror** — persistent sticky preview card, born at `monogram`, accreting one real element per answer (table in §3). This is the single highest-leverage change; it cashes the hook and is the monetization engine. Nearly free UX (golden-rule fit).
7. **Reveal restage** — full-screen scrollable real RSVP site + graceful placeholders for skipped stages.
8. **Beat 4.5 capture screens** ×5 with "pick a default" escapes (depends on PR #1060 / migration `20260910000000_wedding_website_lifecycle_foundation.sql` for the new columns — apply before commit).

**P2 — money + trust polish:**
9. Five-beat money ladder wiring: re-surfaced value-anchor at `s4bundle`; small-first `s4boost` with Mirror animation; line-itemed bundles; genuine timer; "or keep free" reframe line.
10. Validate **`computeOnboardingSavings`** computes from real signals (search depth + category count + radius), not a flat "6 hours."
11. `s5honesty` screen + post-purchase manual-reconciliation toast + BIR-receipt line.
12. Couple-facing friendly stage names in UI (never internal IDs).

**P3 — risk reducers:**
13. No-AI path DIY-finder checkpoint (re-offer matching; prevent 15–25% gate drop-off).
14. RA 10173 transparency line at Intro + legal review of capture path.
15. Recommend-earn couple-side loop surfaced at `settle` + documented in `Pricing.md`.
16. iPhone SE (375px) no-scroll QA on all Beat 4.5 screens.

---

### Files this remodel builds on (all absolute)
- Canonical spine: `/Users/icecasasola/Documents/Claude/Projects/Setnayan/Onboarding_Wedding_Adaptive_Redesign_2026-06-07.md` (§12 flow, §2.5/§2.5a covert rules, §13 capture inventory, §14 refinements)
- Love-story handoff: `/Users/icecasasola/Documents/Claude/Projects/Setnayan/HANDOFF_to_Onboarding__LoveStory_Stage_2026-06-07.md`
- Money mechanics prototype: `/Users/icecasasola/Documents/Claude/Projects/Setnayan/Onboarding_Bundle_Builder_2026-06-07.html`
- Working flow prototype (covert-clean, canonical screen IDs): `/Users/icecasasola/Documents/Claude/Projects/Setnayan/Onboarding_Wedding_Adaptive_Flow_2026-06-07.html`
- Shipped code to extend: `apps/web/app/onboarding/wedding/{types.ts, actions.ts, _components/onboarding-shell.tsx}`; Beat 4.5 schema lands in PR #1060 / migration `20260910000000_wedding_website_lifecycle_foundation.sql` (apply before commit).
