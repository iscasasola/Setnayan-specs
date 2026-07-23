# Event Onboarding Signals — All Event Types (2026-07-12)

> **What this is.** A PH-grounded research dive (8 parallel research agents, web-sourced) into *what information Setnayan must capture at onboarding* to produce the best deterministic output — matching, checklist/timeline, budget allocation, mood board, website/editorial, and in-app SKUs — for **every event type beyond weddings**. Reference/recommendation material for the onboarding + Event-Brief redesign; **not** owner-locked decisions.
>
> **Why it matters (Rule 1).** Setnayan AI is 100% deterministic — no LLM — so **output quality = brief richness × authored-rule richness**. The wedding flow captures a rich Event Brief; the **generic (non-wedding) onboarding captures almost nothing today** (it writes `style_preferences` + an empty `love_story`, no event-specific signals), so every non-wedding event runs the engines starved. This maps the signals that fix that, per type. Related: [[project_setnayan_ai_deterministic_free]], [[project_setnayan_event_type_strategy]], [[project_setnayan_event_anchor_model]].

---

## 0. The one-paragraph thesis

The wedding brief is anchored by **couple + faith + date**. Every other event replaces that anchor with its **own master signal** that must *branch the whole flow* — and across the 10 non-wedding types, seven **new capabilities** recur that the wedding flow doesn't need: **host≠honoree**, **surprise mode**, **recurrence**, **funding-mode (beyond single-payer)**, **program-as-object**, **roster-with-roles**, and **auto-computed deterministic delight**. Build those seven as reusable primitives and each event type becomes a thin branch on a shared spine.

---

## 1. The COMMON CORE spine (every event captures these)

Seven signals that transfer to *all* types (already mostly in the wedding Brief's Constraints/Priorities/Taste):

| Core signal | Layer | Powers |
|---|---|---|
| **Event date / window** (allow "not set yet" = itself a top task) | Constraint | checklist anchor, countdown, reminders |
| **Region + venue pin / city** | Constraint | vendor matching by reach, day-of |
| **Headcount** (+ age spread where relevant) | Constraint | catering/venue capacity, budget scale, seating |
| **Budget** (total → auto per-head) | Constraint | budget allocation, vendor tier filtering |
| **Who it's FOR / what makes it unforgettable** (host-keepsake vs guest-experience vs both) | Priority | ranks SKUs + budget emphasis; the exp-quiz "for whom" generalizes — only the *subject* changes |
| **Help level** (DIY / guided / concierge) | Priority | nudge cadence, checklist density |
| **Mood / theme / vibe** | Taste | mood board, website, decor matching |

Everything below is the **delta on top of this spine**.

---

## 2. The MASTER SIGNAL per event (what replaces "couple + faith")

The single field(s) that must be asked first because they branch the entire brief:

| Event | Master signal(s) | New capability it triggers |
|---|---|---|
| **Wedding** (baseline) | couple + faith + date | (baseline: church module, entourage/sponsors) |
| **Debut** | celebrant + **gender** (18=F / 21=M) · **which "18s"** (multi-select) · cotillion? | court-of-18 roster; coming-of-age STORY (not love story); program auto-built from the "18s" |
| **Birthday** | **turning age** → routes to *kids / debut / milestone* sub-flow · **theme** | age-branch; theme→palette auto-seed; kids-entertainer vendor class; **recurrence** |
| **Christening** | **faith/rite** (Catholic / Born-Again dedication / INC dedication) · **godparent roster** | church-requirements tracker; **cap-aware** godparent roster; frequent 1st-bday combo |
| **Gender reveal** | **reveal mechanic** · **who knows the result** | **secrecy / hide-from-owner**; reaction-capture as the deliverable; scan-gated short timeline |
| **Anniversary** | **milestone year** · **original wedding date** · **who hosts + is-surprise** | **surprise mode**; retrospective STORY as the climax; pooled-sibling funding |
| **Corporate** | **objective + audience + formality** · **the organization** | org identity + BIR invoicing/PO; production-heavy budget; **sponsorship/registration revenue offsets**; approval; recurrence |
| **Reunion / Grad / Celebration** | **who's gathered** · **honoree/purpose** · **recurrence** · **program** | roster-with-branches; **pooled dues/registration** funding; program-as-object; **auto-computed awards** |
| **Travel** | **destination** · dates+nights · group size | multi-day **itinerary** (not run-of-show); per-head **split**; no host/guest/venue |
| **Tournament** | **sport** · **format** · **online-vs-physical fork** | **bracket/schedule** generation; logistics-first (no Taste/Story); entry-fee |
| **Party** | **occasion** (+ theme) | none new — it's a **wedding-lite strip-down** (cheapest to ship) |

---

## 3. The seven CROSS-CUTTING new capabilities (the real product findings)

These matter more than any single event because each unlocks *several* types:

1. **Master-signal branching.** Replace the fixed "couple+faith" gate with an event-type-specific master signal that routes the flow (the wedding shell's `buildSequence` already has the branching machinery). — *all types*
2. **Host ≠ honoree.** The account owner is frequently not the celebrant: debut = **parents** (celebrant is a **minor** → guardian/consent), anniversary = **children**, christening = parents, corporate = an **org contact**, kids-birthday = parents. Needs a "who's filling this out" split. — *debut, christening, anniversary, corporate, kids-birthday*
3. **Surprise mode.** Hide event data from the honoree + suppress notifications. Extreme case: a gender reveal's **double-surprise must hide the RESULT from the account owner (the parents) themselves** — the platform withholds data from its own user, which nothing else requires. — *anniversary, gender reveal*
4. **Recurrence.** Persistent roster + "set next year's date" + host-rotation memory. — *birthday, reunion, alumni jubilee, corporate year-end* (aligns with the existing event date-anchor/recurs-toggle model)
5. **Funding-mode (beyond single-payer).** The budget UX must model **pooled dues** (reunion), **registration fees** (alumni), **per-head split** (travel), an **approved envelope + sponsorship/registration offsets** (corporate), and **pooled siblings** (anniversary). Reframe **E-gifts/Pabuya** as the collection tool. — *reunion, travel, corporate, anniversary, tournament*
6. **Program-as-object / run-of-show.** Capture the program beats (the "18s", awards, raffle/awarding, jubilarian walk, tribute AVP) to **deterministically generate the timeline + emcee-script skeleton**. Weddings treat the program as a fixed template; here it's a first-class captured object. — *debut, milestone-birthday, reunion, corporate, anniversary*
7. **Roster-with-roles (named people layer) + auto-computed delight.** A repeatable per-person object (role tier, contact, status, message-collection, remote/abroad flag): court-of-18 (debut), godparents (christening), family branches (reunion), entourage (wedding). It enables **deterministic delight** — e.g. reunion **awards** (farthest-traveled / oldest / biggest-family) computed straight from the roster, a zero-LLM "wow" that fits Rule 1 perfectly. — *debut, christening, reunion, wedding*

Plus two reuse notes: the wedding **faith/church module** transfers to christening + anniversary Mass (build once, branch by rite); and the **secrecy/result-custody trustee** (gender reveal) is a genuinely novel data-handling requirement.

---

## 4. Per-event condensed specs

### Debut (18th) — *the "second hero", wedding-scale*
- **Master:** celebrant + gender (18F/21M) · which "18s" (18 Roses/Candles/Treasures/Blue Bills/Shoes/Songs) · cotillion (adds choreographer + 4–8wk rehearsal + stage/dance-floor in 3D).
- **Must-ask deltas:** the "18s" multi-select (**generates the program timeline + emcee skeleton + which court roles to cast**); **court-of-18 roster** (named, per-ceremony, with collect-messages deadline); coming-of-age STORY (3–5 milestones + a dream — **replaces the love story entirely**); theme/motif (bolder/trendier than a wedding); cash-gift pref (→ Blue Bills / Pabuya).
- **Budget:** ₱150k intimate → ₱400–700k mid ball → ₱800k–1M+ grand; stylist + LED/lights + photo-video + catering dominate. **Lead:** 12mo venue → 6mo gown+cotillion+cast the 18s → cotillion rehearsal.
- **SKUs:** Papic ★, Pabuya (Blue Bills) ★, Live Studio (OFW) ★, AVP/reels ★, monogram, Pakanta, 3D (cotillion floor), photo wall.

### Birthday — *age is a branch point*
- **Master:** **turning age** → *kids (<13: entertainers/games) / debut (18/21) / milestone (50/60: tribute)* · **theme** (auto-seeds palette).
- **Kids delta:** #kids/#adults split; "combined with baptism?" (very common); a whole vendor class weddings lack — clowns/magicians/mascots/face-paint/bounce-house/food-carts/pabitin/palayok; loot bags.
- **Milestone delta:** formal-program? · tribute AVP · color motif · celebrant bio.
- **Recurrence** ("save theme/guests for next year"). **Budget:** ₱20–50k everyday → ₱100–500k+ blowout. **SKUs:** Papic ★ (all), Live Studio (milestone/OFW), monogram/"party logo", 3D (sit-down), photo wall, Pabuya (adult).

### Christening — *church module + cap-aware sponsors*
- **Master:** faith/rite (Catholic full flow / Born-Again dedication = no sponsors/paperwork / INC dedication = drop Catholic flow) · godparent roster.
- **Must-ask deltas (2 build items):** **Church-Requirements Tracker** (parish booking status + auto-generated doc checklist: PSA birth cert / parents' marriage or Catholic certs / out-of-parish endorsement / **pre-baptism seminar as a hard blocker**); **cap-aware Godparent Roster** (per-person: ninong/ninang, principal-vs-additional tier, contact, **confirmation-cert status**, remote/abroad flag, **warns at ~5-pair parish cap**). "Bundled with 1st birthday?"
- **Budget:** ₱25–60k intimate → ₱200k+; catering ~50–60%; **pakimkim flows IN** (offsets). **Lead:** 3–6mo post-birth, church-gated. **SKUs:** Live Studio ★, Pabuya (digital pakimkim) ★, Papic ★, monogram ★, photo wall, website/STD.

### Gender reveal — *secrecy is a product constraint*
- **Master:** reveal mechanic (cake/smoke/powder cannon/balloon box/pop/piñata/fireworks/digital) — routes the supplier, gates indoor/outdoor, triggers safety/eco advisory · **who knows the result** (nobody incl. parents = **double surprise** / parents know / guest-guess).
- **Must-ask deltas:** **result value + is-it-stored** (SENSITIVE — if double-surprise the app must **hide it from the parents' own dashboard**); **result trustee** (who holds the secret); **reaction subjects** (whose faces the cameras lock on); team-guess vote; remote/OFW family.
- **Budget:** small (₱35k package / ₱1–3k DIY); **photo-video is the #1 under-budgeted, most-regretted line**. **Lead:** scan-gated, weeks. **SKUs:** Papic ★ (reaction reel = THE deliverable), Live Studio ★ (remote), photo wall (team vote), reveal render, monogram (recolored). Skip 3D.

### Anniversary — *wedding-variant + surprise + retrospective*
- **Master:** milestone year (25 Silver / 50 Golden / 60 Diamond…) · **original wedding date** (derives years, powers "then & now") · **who hosts + is-surprise** (children often host a surprise).
- **Must-ask deltas:** **surprise mode** (hide from the couple, suppress notifications, honoree≠owner); **retrospective STORY** promoted to the climax (guided love-story-across-decades + children/grandchildren + old-photo solicitation — the long pole, start at onboarding); Mass + renewal-of-vows (symbolic, no license); pooled-sibling funding.
- **Budget:** ₱30–150k intimate → ₱300k–1M+ re-wedding; skews to **reception + AVP + coverage**. **Lead:** 2–6mo (weeks if surprise). **SKUs:** tribute AVP ★, Pakanta ★, Live Studio ★ (OFW kids), Papic, milestone monogram ("50"), website (their-love-story), photo wall, Pabuya.
- **≈70% transfers from the wedding brief** — model as a wedding variant + 3 fields (milestone_year, original_wedding_date, host_relationship+is_surprise) + promoted retrospective.

### Corporate — *most divergent; objective-driven, B2B*
- **Master:** **objective** (reward staff / impress-convert clients / launch-sell / recognize / educate / cohesion) + **audience** (employees / clients / press / mixed) + **formality** (casual↔black-tie) — replaces couple+faith+date. Sub-types: **PH Christmas party** (Monito-Monita, raffle, awarding, games, production numbers), conference, gala/awards, team-building, product launch.
- **Must-ask deltas:** **the ORGANIZATION** (company · industry · contact+role · **billing entity + TIN/BIR + PO + net-30**) — weddings never capture this; **AV/production needs** (stage/LED/lights/mics/livestream/registration+badges) = the biggest budget bucket; **program essentials** (emcee/awarding/raffle/exchange-gift/performers/sessions); **approved budget envelope** + variance; sponsors/exhibitors (revenue offset).
- **Budget:** ~₱2,500–6,000/head + **production (audience-independent, labor 30–50% of AV)**; canonical corporate line structure incl. contingency 10–15%. **Lead:** conferences/launches 6–12mo; PH Nov–Dec peak = book months ahead. **SKUs:** Live Studio ★ (hybrid), Papic (morale events), photo wall, monogram→**event branding**, website→**registration/badges/lead-capture**, 3D (seated gala/expo). Skip Pakanta/veil.

### Reunion / Graduation / Celebration — *the room is the star*
- **Master:** **who's gathered** (family-clan / school-batch / friends / colleagues / community) · **honoree/purpose** (graduate / balikbayan / promoted / jubilee-batch / matriarch / the new home / just-the-gathering) · **recurrence** · **program**.
- **Must-ask deltas:** **roster with branches/sections** (family branches or batch sections → auto-computed **awards** farthest/oldest/biggest-family, seating, Papic tagging); **matching shirts** (defining reunion ritual → collect sizes + print order); **program-as-object** (games/Larong-Pinoy, awards, jubilarian walk/alumni-walk, Mass, house-blessing, tributes, boodle-fight, raffle, pageant-fundraiser); **funding mode** (one host / pooled dues / registration fee / sponsors). Graduation → thanksgiving Mass + school/course; balikbayan → arrival-date-locked + compressed; housewarming → house blessing.
- **Budget:** **food × headcount dominant (50–65%)**; often at home = ~₱0 venue; lechon ₱8–15k each. Alumni run on **registration ₱350–750/head + sponsors**. **Lead:** weeks (balikbayan) → months → years (jubilee). **SKUs:** Papic ★ (arguably a *better* market than weddings), live photo wall ★, Pabuya-as-dues ★, Live Studio (diaspora), clan/batch monogram-crest, 3D (seat-by-branch), reels (nostalgia), website (persistent "clan/batch hub" for recurring series).

### Travel / Tournament / Party — *the outliers (minimal brief)*
- **Travel** — anchor = **destination** + dates+nights + group size + budget/head + vibe. Multi-day **itinerary** (not run-of-show); **per-head split** (no single payer); no venue/faith/RSVP/seating. SKUs: **Papic** + itinerary website only. (Maps to the future travel/guides vertical.)
- **Tournament** — anchor = **sport + format + online-vs-physical**. **Bracket/schedule** is a *computed* object (#games, #refs, duration); logistics-first (Taste/Story vanish); entry-fee off-platform. SKUs: **Live Studio ★** (broadcast at ~₱0 marginal), bracket website, monogram badge.
- **Party** — anchor = **occasion** (+ theme). **Wedding-lite strip-down** (reuse the wedding brief, strip faith/rites/entourage/seating/love-story). SKUs: nearly the full wedding set minus Pakanta/Live-Studio. **Cheapest to ship.**

---

## 5. In-app SKU fit — quick matrix

| SKU | Best-fit events |
|---|---|
| **Papic** (candid capture + QR tag) | **Universal** — strongest single funnel across every type; best-fit for reunions/gender-reveal/debut |
| **Live Studio** (livestream) | Debut/anniversary/christening/reunion (**OFW/diaspora**), corporate (hybrid), tournament (broadcast) |
| **Pabuya / e-gifts** | Debut (Blue Bills), christening (pakimkim), anniversary, reunion (**dues/registration**), birthday-adult |
| **Monogram / branding** | Debut, anniversary ("50"), christening, reunion (clan/batch crest), corporate (**event branding**) |
| **Pakanta** (custom song) | Anniversary ★, debut, milestone-birthday (tribute); low elsewhere |
| **AVP / tribute / reels** | Anniversary ★, debut (baby-to-18), milestone-birthday, reunion (nostalgia) |
| **3D plan / seating** | Debut (cotillion), sit-down milestone/anniversary/gala, reunion (by branch) |
| **Live photo wall** | Reunions ★, corporate, birthdays, gender-reveal (team vote) |
| **Website / editorial** | Universal; corporate → **registration/badges**; reunion → **persistent hub**; travel → **itinerary** |

---

## 6. Onboarding redesign recommendation

**Problem:** the generic onboarding captures ~nothing → every non-wedding event runs the deterministic engines starved. Fix = a per-event Event Brief.

**Architecture:** reuse the wedding shell's `buildSequence` branching. **Shared CORE spine (§1)** → **per-type BRANCH module (§2 master signal + §4 deltas)**. Build the §3 capabilities as **reusable primitives**, not per-event one-offs:
- **Faith/church module** → wedding + christening + anniversary Mass (branch by rite).
- **Roster-with-roles** → wedding entourage + debut court-of-18 + christening godparents + reunion branches (+ auto-computed awards).
- **Surprise-mode primitive** → anniversary + gender-reveal (incl. hide-from-owner).
- **Funding-mode / collection** (reframed Pabuya) → reunion + travel + corporate + anniversary + tournament.
- **Recurrence primitive** → birthday + reunion + corporate (persistent roster + set-next-date).
- **Program-builder** → debut + milestone-birthday + reunion + corporate + anniversary.

**Build priority** (PH value × reuse):
1. **Debut** — second hero, wedding-scale, exercises roster + program + story primitives.
2. **Birthday-1st + Christening** — flagship PH life events; christening reuses church + sponsor modules.
3. **Anniversary** — cheap wedding-variant (+3 fields + retrospective); exercises surprise mode.
4. **Corporate** — distinct & valuable; needs org-identity + BIR invoicing + production budget.
5. **Reunion cluster** — new roster/funding/program shapes; strong Papic/photo-wall market.
6. **Outliers** — travel/tournament (net-new anchor + output shape, low priority); **party = wedding strip-down (cheapest)**.

**Deterministic-delight wins (Rule-1-native, ship early):** reunion auto-awards from roster · debut program auto-built from the "18s" · christening church-requirements tracker · birthday theme→mood auto-seed · anniversary "then & now" from the original wedding date.

---

## 7. Method & sources
8 parallel web-research agents (2026-07-12), one per event cluster, PH-first. Full per-agent source lists (Wikipedia, Lume by Rob, Juan Carlo, EventNest, PSA Helpline, Smart Parenting, The Bayleaf, PNA/Philstar/PIA, Nurture, alumni-homecoming pages, group-travel/tournament guides, etc.) are in the session transcripts. Figures are indicative PH ranges for budget-model calibration, not quotes.
