# Setnayan — Onboarding Design Brief

**Date:** 11 August 2026 · **For:** design partner working on the look and feel of onboarding
**Prepared by:** engineering, from the live site, the live database and the shipped code — not from older documents.

---

## 0 · What we want from you

Our onboarding **works** but it does not **feel** enticing. People answer questions; they do not feel
courted. We want the look and feel lifted — not the flow re-planned.

**The wedding onboarding is the most complex one and the one to design first. Everything else is
simpler and should feel like the same product, smaller.**

Two things to hold onto:

1. **Do not redraw what already ships.** Every screen listed here exists and is live today. Show us
   the delta — new styling, new rhythm, new imagery — against the real screens, not a fresh concept.
2. **The palette is locked** (below). The typography and layout are open.

### The locked palette

| Role | Value | Note |
|---|---|---|
| Page | `#FDFBF7` cream | the only mode — there is no dark mode |
| Text | `#2C2A29` ink | 13.8:1 on cream |
| Primary button | `#C24E25` terracotta | cream label on it |
| Gold accent | `#A9834B` | UI accents and the wordmark only — never body text |
| Link | `#3B4E67` | 8.2:1 |

Type today: a serif italic (Cormorant) for the question, a small mono kicker above it, sans for
options and helper text.

---

## 1 · What we saw when we walked it (the actual problem)

Walk these two yourself — they are public, no account needed:

- Wedding: `https://www.setnayan.com/onboarding/wedding`
- Birthday: `https://www.setnayan.com/onboarding/birthday`

**They are two different products.**

**The wedding flow is the good one.** Rounded card floating on a warm ground, a small gold kicker
("ABOUT YOU") above a serif-italic question, a real photograph of a Filipino wedding on the left, the
answers on the right, one wide button along the bottom. It reads as a premium product.

**Everything else is a plain form.** Same brand colours, none of the craft:

| | Wedding | Every other event |
|---|---|---|
| Frame | a card on a warm ground | nothing — text on a flat page |
| Kicker above the question | present, gold | **missing on every screen** |
| Imagery | real photography, per screen | **one emoji, only on screen 1** |
| Answer options | styled rows with a selector | plain white boxes |
| Layout | two columns, balanced | one column, left of centre, **half the screen empty** |
| Bottom bar | full-width primary action | small pill, floating right |

The missing kicker is not a copy gap. The words exist for every screen ("The basics", "The fun",
"The look", "The keepsake") — the element that shows them renders nothing. So screens that were
designed as *kicker → question → helper* arrive as a bare question.

**Other things worth your eye:**

- On a laptop the wedding photograph is cut off by the bottom action bar.
- The primary button sits grey/disabled until an answer is picked, on a screen where nothing signals
  that. It reads as broken rather than as waiting.
- Progress is a hairline at the very top. In the wedding flow it advances **1/26th at a time** — a
  person cannot feel movement.
- There is no moment of delight anywhere in the non-wedding flows. The wedding flow has a persona
  reveal near the end; the others have the same reveal with none of the staging.

---

## 2 · The events we have — 16, all live

All sixteen are switched on and can be planned today.

| # | Event | Vendors? | Runs over several days? |
|---|---|---|---|
| 1 | 💍 Wedding | yes | yes |
| 2 | 👑 Debut | yes | no |
| 3 | 🎈 Gender Reveal | yes | no |
| 4 | 🎂 Birthday | yes | no |
| 5 | 🥂 Celebration | yes | no |
| 6 | ✈️ Travel | yes | yes |
| 7 | 🏢 Corporate | yes | yes |
| 8 | 🏆 Tournament | yes | no |
| 9 | 🕯️ Christening | yes | no |
| 10 | 💞 Anniversary | yes | no |
| 11 | 🎓 Graduation | yes | no |
| 12 | 🤝 Reunion | yes | yes |
| 13 | 🌟 Gala Night | yes | no |
| 14 | 📅 Simple Event | **no — deliberately vendor-free** | no |
| 15 | 💕 Date | yes (6 categories) | no |
| 16 | 🍿 Hangout | yes (4 categories) | no |

Wedding has its own dedicated wizard. The other fifteen share one flow whose questions change by
type.

---

## 3 · The complete question list

### 3A · Wedding — 26 screens (measured on the live site)

In order. Two forks shorten it: choosing a **civil** ceremony removes the tradition screen, and
choosing **"add it later"** on the love story removes six screens (a 19-screen minimum).

| # | Screen | The question |
|---|---|---|
| 1 | Role | **Who are you in this wedding?** — Bride · Groom · Someone helping |
| 2 | Kind | Which kind of wedding (church / civil / mixed traditions) |
| 3 | Tradition | **Your ceremony tradition** — Catholic, Christian, Muslim, Hindu, Sikh, Buddhist, Orthodox *(skipped for civil)* |
| 4 | Names | Both first and last names — this is also where the monogram is previewed |
| 5 | Date | A specific date, or a window if undecided |
| 6 | Love story — intro | The fork: tell it now, or add it later |
| 7 | Love story — the spark | How you met |
| 8 | Love story — almost | The near-misses |
| 9 | Love story — the proposal | How it happened |
| 10 | Love story — milestones | First date, engagement, etc. |
| 11 | Love story — tone | How the story should be told |
| 12 | Love story — preview | "This is us" — the story played back |
| 13 | Region | Where in the Philippines |
| 14 | Guests | Roughly how many |
| 15 | Budget | Which band |
| 16 | Experience 1 | **What would make the day unforgettable?** — Our private memory · Our guests' experience · Both, equally |
| 17 | Experience 2 | **How big does it feel?** — Intimate & personal · Mid-size & warm · Grand & full-house |
| 18 | Experience 3 | **What's the energy of the day?** — Calm & romantic · Joyful & lively · Elegant & refined |
| 19 | Experience 4 | **Where does your wedding lean?** — Rooted in tradition · Modern & fresh · A blend of both |
| 20 | Experience 5 | **How much do you want to do?** — Keep it simple · A balanced plan · Go all out |
| 21 | How we'll help | **How much do you want us to do?** — Build it all for me · Give me options · I'll look myself |
| 22 | Your vendors | **Where should your vendors come from?** — Find them on Setnayan · I'm bringing my own · Both |
| 23 | Reception | **What setting do you love?** |
| 24 | Find | Venue search near the chosen region |
| 25 | Account | Create an account |
| 26 | Congrats | The plan reveal → into the dashboard |

**Two facts that matter to the design:**

- Screens 16–20 resolve to a **named persona** — The Keepsake · The Grand Celebration · The Best of
  Both · Intimate & Personal · The Modern Statement · Rooted in Tradition — each with its own line
  ("A wedding built to be relived — your film, your song, your forever keepsakes"). **That reveal is
  the emotional peak of the whole flow and it is currently under-designed. This is the single biggest
  opportunity in this brief.**
- **There is no paywall in onboarding.** It ends free. Nothing is sold until the dashboard. Design
  accordingly — this is courtship, not checkout.

### 3B · Every other event — the shared shape

Same skeleton every time, roughly 18 screens:

| Screens | What |
|---|---|
| 1 | Welcome — "A few quick questions and we'll shape a plan made for your celebration." |
| 2 | **What should we call your [event]?** |
| 3 | **Who are we celebrating?** *(birthday · debut · christening · graduation · gender reveal)* |
| 3 | **What date are you marking?** *(anniversary only — the day it commemorates)* |
| 4 | **When is it?** / **When are you celebrating?** |
| 5 | **Is this a yearly thing?** *(travel · celebration · corporate · gala night · reunion · tournament)* |
| 6 | **About how many guests?** |
| 7 | **Where is it happening?** |
| 8–11 | 3–4 **signature questions** unique to the event type (§ 3C) |
| 12 | **A few details that make it yours** — one optional screen holding the type's detail fields (§ 3D) |
| 13–17 | The same five experience questions as the wedding, in neutral wording |
| 18 | The persona reveal |
| 19 | Congrats → dashboard |

The five shared experience questions, non-wedding wording:

1. **What would make the day unforgettable?** — Our private memory · Our guests' experience · Both, equally
2. **How big does it feel?** — Intimate & personal · Mid-size & warm · Grand & full-house
3. **What's the energy of the day?** — Calm & relaxed · Joyful & lively · Elegant & refined
4. **Where does your celebration lean?** — Rooted in tradition · Modern & fresh · A blend of both
5. **How much do you want to do?** — Keep it simple · A balanced plan · Go all out

### 3C · The signature questions, by event

Every option quietly adds the right vendor categories to the plan, so these are not decoration.
**Four events have none at all and go straight from "where" to the generic quiz — they feel the
thinnest: Gala Night, Simple Event, Date, Hangout.**

<details open>
<summary><b>Birthday</b> — 4 questions</summary>

- **The fun · Any special touch?** — Photo booth · Games corner · Mobile bar · Dessert spread · Just the essentials
- **The celebrant · Who's the birthday for?** — A kids' party · A milestone (18 / 21) · An adult birthday · A golden one (50+)
- **The look · What's the vibe?** — Themed & playful · Elegant & polished · Casual & chill
- **The food · How do you want to feed everyone?** — Full catering · Food carts & stations · Dessert-forward · A drinks bar
</details>

<details open>
<summary><b>Debut</b> — 4 questions</summary>

- **The moment · Your debut's centerpiece?** — Cotillion dance · Production number · 18 roses & candles · Keep it elegant
- **The court · Who stands with you?** — Classic 18s · A cotillion court · A small, close court
- **The look · How polished is the styling?** — Full glam · Styled & decorated · Keep it simple
- **The party · How do you keep the energy up?** — A live band · DJ & dance floor · Special performers · Keep it mellow
</details>

<details open>
<summary><b>Gender Reveal</b> — 4 questions</summary>

- **The reveal · How will you reveal?** — Smoke or pyro · Cake cut · Balloon & confetti · On camera
- **The guest list · How big is the gathering?** — Family only · A full party
- **The keepsake · How do you want to remember it?** — Photo & video · An editorial feature · Snaps are enough
- **The treats · Anything sweet or special?** — Cake & dessert · A mocktail bar · Balloon styling · Nothing extra
</details>

<details open>
<summary><b>Christening</b> — 4 questions</summary>

- **After the rite · What follows the ceremony?** — Garden reception · Intimate lunch · Full party · Just the blessing
- **The gathering · How big is the celebration?** — Close family · A full celebration
- **The keepsakes · How do you mark the day?** — Photo & video · Souvenirs (for ninongs & ninangs) · An editorial story · Nothing extra
- **The little ones · Anything for the kids?** — A play area · A host & program · A dessert table · Not needed
</details>

<details open>
<summary><b>Corporate</b> — 4 questions</summary>

- **The format · What kind of corporate event?** — Awards night · Conference · Product launch · Team celebration
- **The headcount · About how many attendees?** — Under 50 · 50–200 · 200+
- **The production · How produced should it feel?** — Full AV & staging · Livestream / hybrid · A host / emcee · Keep it lean
- **The catering · How are you feeding the room?** — Plated meal · Food stations · Cocktails & canapés · A coffee cart
</details>

<details open>
<summary><b>Tournament</b> — 4 questions</summary>

- **The priority · What matters most?** — Awards & medals · Livestream coverage · Food for players · Hype & emcee
- **The scale · How big is the meet?** — Local / small · Regional · Major
- **The coverage · How do you capture it?** — Photo & video · Livestream · Scoreboard / LED wall · Not a priority
- **On-site · Anything for players & crowd?** — Food trucks · Food carts · Wellness & recovery · Nothing extra
</details>

<details open>
<summary><b>Travel</b> — 3 questions</summary>

- **The trip · What do you need most?** — Documented · Group logistics · A keepsake site
- **The group · Who's travelling?** — Just us · A family group · A big group
- **The memories · How do you capture the trip?** — A photo & video team · A content creator · We'll shoot our own
</details>

<details open>
<summary><b>Celebration</b> — 4 questions</summary>

- **The fun · Any special touch?** — Photo booth · Live music · Mobile bar · Dessert spread · Just the essentials
- **The gathering · How big is it?** — An intimate dinner · A big party
- **The energy · How do you set the mood?** — A live band · DJ & dancing · Performers · Keep it mellow
- **The keepsake · How do you remember it?** — Photo & video · A photo booth · An editorial page · Nothing extra
</details>

<details open>
<summary><b>Anniversary</b> — 4 questions</summary>

- **The moment · How will you mark the years?** — Thanksgiving Mass + renewal · A renewal of vows · Just a grand reception · Keep it intimate
- **The tribute · The "then & now" moment?** — A tribute video · A live performance · Messages from the family · Keep it simple
- **The look · How styled is the celebration?** — Grand & formal · Warm & intimate · Recreate our wedding · Effortless
- **The food · How do you want to feed everyone?** — Full catering · A family feast · Dessert & coffee · A toast bar
</details>

<details open>
<summary><b>Graduation</b> — 4 questions</summary>

- **The milestone · How will you give thanks?** — A thanksgiving Mass · A program with messages · Just a family feast · Keep it simple
- **The feast · How do you want to feed everyone?** — Lechon & full spread · Food carts & stations · Buffet catering · Dessert & drinks
- **The memories · How do you want to remember it?** — Photo & video · A photo booth · A tribute AVP · Keep it candid
- **The look · What is the vibe?** — Celebratory & lively · Warm & family · Casual & chill
</details>

<details open>
<summary><b>Reunion</b> — 4 questions</summary>

- **The gathering · Who is coming together?** — The whole family / clan · A school batch / alumni · Friends / barkada · Colleagues
- **The program · What is on the program?** — Games & Larong Pinoy · Awards & recognitions · A talent show · Just food & catching up
- **The feast · How do you want to feed everyone?** — Lechon & boodle fight · Food carts & stations · Full buffet catering · Keep it simple
- **The extras · Any special touch?** — Matching shirts & souvenirs · A photo booth · Live music / karaoke · Just the essentials
</details>

### 3D · "A few details that make it yours" — one optional screen per event

All optional, all skippable. This screen is currently a stack of plain form fields and is the
**second biggest design opportunity** — it is where the product proves it understands a Filipino
celebration, and right now it looks like a tax form.

| Event | Fields | The detail that shows we understand |
|---|---|---|
| **Wedding** | 15 | An **uncapped** Ninong & Ninang roster — plus secondary sponsors, abay, bearers & flower children, the 13 arrhae, the yugal, the rite, the motif |
| **Debut** | 11 | 18 Roses · 18 Candles · 18 Treasures, each a named list; the father-daughter waltz partner, with room for a father figure |
| **Christening** | 9 | Principal and secondary godparents, both uncapped — a Filipino baptism has dozens |
| **Birthday** | 8 | Turning what · the milestone ladder (1 · 7 · 18 · 21 · 60) · **palabunutan** raffle and its prizes · the food centrepiece |
| **Anniversary** | 8 | The original wedding date, renewal of vows, the tribute programme |
| **Reunion** | 8 | The **balikbayan** flying home · the matching reunion shirt · in-memoriam · patriarch/matriarch honoured |
| **Gender Reveal** | 7 | The **secret-keeper** · Team Boy vs Team Girl · whether it doubles as a baby shower |
| **Graduation** | 7 | Honours and distinction · **"para kay…"** the dedication |
| **Gala Night** | 7 | Filipiniana dress code (barong / terno) · table sponsors · the beneficiary |
| **Tournament** | 7 | Divisions, teams, the opening parade, the awards |
| **Travel** | 7 | The shared **ambag** kitty per head · the **pasalubong** list |
| **Corporate** | 6 | Christmas-party raffle · department production numbers · the blessing and ribbon cutting |
| **Celebration** | 4 | **Pasasalamat** and **despedida** as first-class occasions |
| **Simple Event** | 4 | Deliberately light — a genuinely one-tap path |
| **Date · Hangout** | none | Nothing is asked. |

---

## 4 · What vendors can be included

**The taxonomy is three levels deep, and the depth is the point.**

```
15 folders   →   69 tiles   →   276 kinds of vendor   (246 shown to customers, 30 held back)
  "Look"          "Bride's Attire"    Terno · Maria Clara · Balintawak · Maranao ·
                                      Tausug · Yakan · Qipao · Sari/Lehenga ·
                                      modest Muslim bridal · modest INC bridal ·
                                      custom gown · gown rental
```

A folder is a shelf. A tile is what a couple taps. **A kind is what a vendor actually is** — and
that bottom level is where the whole product's Filipino fluency lives. Any design that shows only
the 69 tiles throws away the thing that makes us different.

**The kinds, cut a different way:**

| | Count | Examples |
|---|---|---|
| Faith-specific | **43** across **17 faiths** | Catholic · Christian · Born Again · Aglipayan · INC · SDA · JW · LDS · Orthodox · Muslim · Hindu · Sikh · Buddhist · Jewish · Chinese · Cultural · Civil |
| Cultural / traditional | **30** | mandap décor · tea-set styling · double-happiness décor · Maranao okir · chuppah · lion dance · kulintang ensemble · rondalla |
| Distinctly Filipino | **46** | lechonero · sorbetes cart · halo-halo station · mini-lechon station · pamamanhikan coordinator · pasalubong box · ninong & ninang attire · sponsor corsage · capiz native décor |
| Rentals rather than services | 15 | gown rental · barong rental · bridal jewellery rental · tent · generator · mobile restroom |
| Dietary | 4 | halal catering · Chinese lauriat · mocktail-only caterer |
| Setnayan's own products, listed alongside vendors | 10 | Papic · Pakanta · Patiktok · Pabati · Panood · Custom Monogram · Pailaw · AI-edited highlight · Save-the-Date film · Concierge |

### The full taxonomy

| Folder · tile | The kinds beneath it |
|---|---|
| **VENUE** | |
| Reception · 6 | Reception venue · Function hall · Hotel ballroom · Garden reception · Resort reception · Events place |
| Ceremony · 17 | Catholic church · Christian church · Born Again church · Aglipayan church · INC kapilya · SDA church · Kingdom Hall · LDS temple · Orthodox church · Mosque · Hindu temple · Gurdwara · Buddhist temple · Synagogue · Cultural ceremony site · Civil ceremony venue · Ceremony venue booking |
| Accommodation · 5 | Hotel stay · Resort stay · Guesthouse / homestay · Vacation rental · Accommodation |
| **PLANNING** | |
| Coordinator / Planner · 12 | Wedding planner (partial) · Wedding coordination · Day-of coordinator · Destination specialist · Religious-venue coordinator · INC wedding coordinator · Gender-separated reception coordinator · Mahr coordination · Pamamanhikan coordinator · Sponsor coordinator · Despedida planner · Setnayan Concierge |
| Date & Feng-shui · 1 | Date & feng-shui consultant |
| **FEAST** | |
| Catering · 4 | Catering · Lechonero · Halal catering · Chinese lauriat caterer |
| Cake · 1 · Stations · 1 · Crew Meals · 1 | Wedding cake · Live cooking station · Crew meal supply |
| **DESIGN** | |
| Stylist / Decorator · 9 | Stylist / decorator · Decorator (general) · Capiz native décor · Hacienda heritage décor · Maranao okir décor · Double-happiness décor · Tea-set styling · Mandap décor · Chuppah rental |
| Florist · 4 | Florals · Bridal bouquet specialist · Garden-wedding florist · Beach-wedding florist |
| Outdoor · 9 | Tent rental · Generator rental · Mobile restroom · Outdoor lighting · Outdoor sound · Cooling fans & misters · Bug-repellent station · Parasol & hat rental · Wedding-day weather forecaster |
| Digital Services · 3 | Setnayan Custom Monogram · Setnayan Pailaw · Setnayan Pakanta |
| Lights & Sound · 1 · Dance Floor · 1 · Fireworks · 1 · LED Wall · 1 | Lights & sound · LED dance floor · Fireworks & pyro · LED video wall |
| **PROGRAM** | |
| Performers · 6 | Wedding entertainment · Acoustic performer · Folk performer · Rondalla ensemble · Kulintang ensemble · Lion dance troupe |
| Choreographer · 3 | First-dance choreographer · Entourage choreographer · Pre-Cana dance trainer |
| Live Band · 2 · Host / MC · 2 | Live band · Band / live music · Host & emcee · Tea-ceremony master |
| Choir · 1 · Orchestra · 1 · Wedding Singer · 1 · DJ · 1 · AV/Production · 1 · Speakers · 1 · Kids' Entertainer · 1 | Choir & string quartet · Orchestra · Wedding singer · DJ · AV / production · Speaker / talent · Kids' entertainer |
| **DOCUMENTARY** | |
| Photo & Video · 15 | Photography · Videography · Drone · Drone videographer · Pre-nup photographer · Pre-nup shoot locations · Engagement photographer · Boudoir photographer · Studio portrait · Family day-2 photographer · Same-day edit · Highlight-reel specialist · Setnayan Papic · Setnayan AI-edited highlight · Setnayan Save-the-Date film |
| Livestream · 1 | Setnayan Panood |
| **LOOK** | |
| Bride's Attire · 12 | Custom bridal gown · Gown rental · Terno · Maria Clara · Balintawak · Maranao · Tausug · Yakan · Qipao / cheongsam · Sari / lehenga · Modest Muslim bridal · Modest INC bridal |
| Groom's Attire · 9 | Custom barong · Barong rental · Custom suit · Suit rental · Sherwani · Maranao · Tausug · Yakan · Muslim groom attire |
| Jewelleries & Accessories · 10 | Engagement ring · Wedding ring · Bridal jewellery · Jewellery rental · Floral jewellery · Bridal headpiece · Wedding veil · Wedding garter · Flower-girl tiara · Sponsor corsage |
| Women's Attire · 6 | Bridesmaid dress · Junior bridesmaid · Flower-girl dress · Debutante gown · Mother-of-the-bride gown · **Ninang attire** |
| HMUA · 6 | Bridal HMUA · Bridal hair stylist · Touch-up MUA · Family MUA · Maternity-bride MUA · Mature-bride MUA |
| Men's Attire · 5 | Groomsman set · Junior groomsman · Ring-bearer suit · **Ninong attire** · 18-Roses attire |
| Wellness & Fitness · 5 | Bridal fitness · Bridal spa · Bridal derm · Bridal dental · Bridal nutritionist |
| Grooming · 1 | Groom grooming |
| **BOOTHS** | |
| Food Cart · 8 | **Sorbetes cart** · **Halo-halo station** · **Mini-lechon station** · Ice-cream cart · Cotton-candy cart · Crepe & pancake station · Charcuterie board · Food cart (general) |
| Photo Booth · 7 | Photo booth · 360 booth · GIF booth · Polaroid booth · Selfie magic mirror · Pabati · Setnayan Patiktok |
| Caricature / Calligraphy / Painting · 5 | Caricature artist · Live calligraphy · Silhouette artist · Wedding portrait painter · Poetry typewriter |
| Mocktail · 3 · Massage Chair · 3 · Henna · 3 | Mocktail bar · Mini mocktail booth · Mocktail-only caterer · Massage chair · Aromatherapy station · Hair touch-up station · Henna & tattoo booth · Mehndi artist · Muslim henna artist |
| Mobile Bar · 2 · Coffee · 2 · Dessert · 2 · Arcade · 2 · Tarot · 2 · Engraving · 2 | Mobile bar · Whiskey & cigar bar · Coffee booth · Tea bar · Dessert station · Donut wall · Retro arcade · VR / AR station · Tarot & astrology · Palmistry · Keychain engraving · Live embroidery |
| Food Truck · 1 · Perfume Bar · 1 · Mini Nail Bar · 1 | Food truck · Perfume bar · Mini nail bar |
| **PRINTS** | |
| Printing · 8 | Invitation (print) · Invitation (digital) · Save-the-date (digital) · Ceremony programme · Menu card · Place card · Stationery & signage · Wedding-cards designer |
| Souvenir / Giveaways · 5 | Souvenirs & giveaways · **Pasalubong box** · **Sponsor token** · **Godchild token** · **Angpao & betrothal supplier** |
| Trophies & Awards · 2 | Trophy supplier · Medals & plaques |
| **TRANSPORT** | |
| Transfers & Rentals · 5 | Airport transfer · Private car charter · Van rental · Boat / ferry charter · Motorcycle & scooter rental |
| Bridal Car · 4 | Bridal car · Vintage / classic vehicle · Horse-drawn carriage · Bridal boat / yacht |
| Guest Shuttle · 1 · Escort · 1 | Guest shuttle · Motorcycle escort |
| **EXPERIENCE · DINING · SAFETY · INSURANCE · SPECIALTY** | |
| 8 tiles, 1 kind each | Tours & activities · Tour guide · Restaurant reservation · Referees / officials · Event medic · Event insurance · Personal accident · Travel insurance · Reveal element |

### How much each event can draw on

Counting real kinds, not tiles.

| Event | Kinds | Tiles | Character |
|---|---|---|---|
| Wedding | **223** | 57 | the widest by far — every faith, every regional attire, every tradition |
| Debut | 179 | 49 | a wedding minus the bridal and ceremony specifics |
| Anniversary | 167 | 41 | wide, because a renewal is a wedding again |
| Graduation | 162 | 39 | |
| Gala Night | 159 | 45 | a full production event |
| Birthday | 154 | 41 | |
| Celebration | 153 | 40 | |
| Reunion | 151 | 38 | |
| Christening | 149 | 34 | |
| Corporate | 148 | 46 | staging, AV, speakers, awards |
| Gender Reveal | 103 | 27 | plus the only **Reveal Element** |
| Tournament | 56 | 15 | referees, medics, trophies, food trucks |
| Travel | 34 | 10 | tours, guides, transfers, stays, travel insurance |
| Date | 32 | 6 | restaurant, florist, cake, performers, photo & video, souvenirs |
| Hangout | 22 | 4 | restaurant, cake, photo & video, souvenirs |
| **Simple Event** | **0** | 0 | vendor-free by design — never show a marketplace here |

**Three things for design to solve here:**

1. **223 kinds cannot be a flat list.** A couple picks vendors from a tree three levels deep. The
   drill from shelf → tile → kind is unsolved and it is the busiest surface in the product.
2. **The bottom level is the selling point.** "Bride's Attire" says nothing; "Terno · Maria Clara ·
   Maranao · Tausug · Yakan · modest Muslim bridal" says we know this country. Surface it, don't
   bury it.
3. **Date and Hangout offer 22–32 kinds and ask no signature questions.** They should feel
   deliberately small and calm — not like a wedding with most of it missing.

---

## 5 · What it costs

Onboarding **sells nothing**. These prices appear later, in the dashboard. They are here so the copy
and any preview cards you design quote the right numbers.

### Setnayan AI — one-time, per event

Not a subscription. Bought once, runs until the event, then stops.

| Tier | Events | Price |
|---|---|---|
| A | Wedding | **₱1,499** |
| B | Debut · Corporate · Gala Night | ₱899 |
| C | Christening · Birthday · Celebration · Travel · Anniversary · Graduation · Reunion | ₱499 |
| D | Tournament · Gender Reveal · Date · Hangout | ₱99 |
| E | Simple Event | not offered |

⚠️ **Only the wedding price is switched on today.** The other three tiers exist but are inactive, so
on a non-wedding event the assistant is offered at no price or not at all. **This is an owner
decision, not a design one — flagging it because a design that assumes "₱499 for a birthday" would
be designing a door that does not open yet.**

### Papic — two ways to buy, both one-time

**Papic Pool** — one shared pool of shots the whole event spends from. No seat limit, no per-camera
maths.

| | |
|---|---|
| Free with every event | **50 shots** |
| ₱1,000 | +3,000 shots |
| ₱2,000 | +6,000 shots |
| ₱3,000 | +10,000 shots |

**Papic One** — a camera of its own for one trusted person, with its own QR and shots nobody else
can spend.

| | |
|---|---|
| First camera free | ~5 shots |
| ₱50 | 50 shots, that camera's own |
| ₱100 | 100 shots, that camera's own |

One 10-second clip counts as 8 shots. Every top-up stacks.

**Papic add-ons:** Kwento (words on a photo) ₱299 · Pabati ₱1,299 · Stories ₱2,000 · Thank You ₱2,499.

*(Neighbours, for context: Couple Website PRO ₱3,500 · Live Studio ₱2,999 · Pakanta ₱2,500 · Live
Photo Wall ₱2,500 · Patiktok ₱1,500/day · 3D Plan ₱1,500 · Animated Monogram ₱1,000 · Custom
Subdomain ₱999/yr.)*

---

## 6 · What we are asking for, ranked

1. **Bring the fifteen non-wedding flows up to the wedding flow's craft.** One system, not two. The
   frame, the kicker, the imagery slot, the option rows, the bottom bar.
2. **Design the persona reveal.** Six named outcomes, each with a line of copy, arriving after five
   questions. Today it is a heading. It should be the moment someone screenshots.
3. **Solve imagery for fifteen event types.** The wedding flow uses real photography. The others use
   one emoji. Whatever you propose has to be producible for sixteen events without a photo shoot per
   type — illustration, pattern, colour field, type-led. Your call.
4. **Redesign the "details that make it yours" screen.** Uncapped ninong/ninang lists, 18 Roses,
   the palabunutan, the balikbayan roster. This is where the product is most Filipino and least
   designed.
5. **Make progress feel like progress** across 26 wedding screens and ~18 elsewhere — chapters,
   named sections, something better than a hairline moving 4% at a time.
6. **Design the drill into the vendor tree** — 15 shelves, 69 tiles, 223 kinds for a wedding. Three
   levels, on a phone, without it feeling like a filing cabinet. See § 4.
7. **Give Date, Hangout and Simple Event their own light treatment.** A couple dozen vendor kinds, no
   signature questions. They should feel deliberately small, not unfinished.

**Mobile first.** Most of our couples are on a phone.

---

## Appendix · Walk it yourself

Public, no account needed. Substitute any type name from § 2.

- `https://www.setnayan.com/onboarding/wedding` — the good one, 26 screens
- `https://www.setnayan.com/onboarding/birthday` — the generic one, with the most questions
- `https://www.setnayan.com/onboarding/travel` — a narrow one, 10 vendor categories
- `https://www.setnayan.com/onboarding/hangout` — the thinnest, no signature questions
- `https://www.setnayan.com/onboarding/simple_event` — vendor-free
- `https://www.setnayan.com/pricing` — where the numbers in § 5 are shown to customers

*Verified 11 August 2026 against the live site, the live production database, and shipped code at
`origin/main`. Wedding's 26-screen count was measured on the live page. Non-wedding screen counts are
computed from the shipped flow; the live birthday page currently runs one step longer than the list
in § 3B, which is worth confirming as you walk it.*
