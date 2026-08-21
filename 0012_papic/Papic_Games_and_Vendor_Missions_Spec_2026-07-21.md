# Papic Games — and Vendor Booth Missions as a vendor-side product

**Spec · 2026-07-21 · owner session**

> **Status: SPEC. Nothing is built.** Owner decisions taken in-session: *"we want to offer different
> games instead of just 1"* · *"we also want to make them try the cocktail booths"* · **"we sell that
> to vendors."**
>
> **Evidence discipline.** `[VERIFIED-CODE]` = read at a cited path on `origin/main` · `[MEASURED]` =
> live prod · `[MODELLED]` = assumption.

---

## § 1 — What exists today: nothing, and one fake door

`git grep` over `apps/web` + `supabase/migrations` for game / mission / challenge / scavenger
machinery returns **zero tables and zero components** `[VERIFIED-CODE]`.

> 🔴 **But "Photo Challenges" is already advertised in production.**
> `app/[slug]/page.tsx:3152` — *"In-app features like Shutter and Photo Challenges…"*
> `app/[slug]/page.tsx:4178` — *"Shutter · Selfie Camera · **Photo Challenges** · Saved Forever ·
> Reel builder"*
>
> This is a **fake door on a live guest-facing surface** — the same defect class the 2026-07-20
> website audit found across the site. **Either build it or delete the copy.** It does not get to sit
> there.

**Note this breaks the session's pattern.** Face-sort, the purchase doorway, photo themes and the
Maya gateway were each found **built and switched off**. This one genuinely does not exist — so
unlike those, it is real work, not an env var.

---

## § 2 — The game family

Kuha ships **one** game: a generic photo scavenger hunt with a prompt list, a leaderboard and a
winner screen `[MEASURED — their feature page]`. It is generic **because it has to be** — they have
no roster, no face graph and no vendor marketplace, so a prompt list is the only mechanic available
to them.

We have three assets they do not. Ranked by how hard each is to copy:

| # | Game type | Needs | Kuha can copy? |
|---|---|---|---|
| 1 | **Generic prompts** — *"a selfie with someone in blue"* | nothing | ✅ **they already have it** |
| 2 | **Roster missions** — table bingo · collect the entourage · *"meet 3 people you don't know"* | the guest list + seating chart (**shipped**) | ❌ no roster |
| 3 | **🎥 Video greeting** — *"record a message for the couple"* | **PABATI — ALREADY SHIPPED** (§ 2.1) | ⚠ they cap a guestbook at 50–100 |
| 4 | **🥂 Toast or dance** — a binary dare | nothing; **vendor-adjacent** (§ 2.2) | ✅ copyable |
| 5 | **Face-verified** — *"get a photo with BOTH of them"*, auto-confirmed | face-sort **live** (⚠ currently dormant) | ❌ no face graph |
| 6 | **🏆 Vendor booth missions** — *"try the cocktail bar"* | `event_vendors` (**shipped**) | ❌ **needs a two-sided marketplace** |

### 2.1 🔥 Video greeting is ALREADY BUILT — it is Pabati

`apps/web/app/api/pabati/clip/route.ts` `[VERIFIED-CODE]`: *"The clip-recording endpoint for PABATI
(the guest video-greeting collector). **Mirrors /api/papic/guest-capture, swapping photo → video.**"*
Ships with `pabati-prompt.tsx`, `lib/pabati.ts` (`fetchPabatiQuota`, `screenPabatiClipPoster`),
guest-session identity (the zero-account model) and Drive copy.

**⇒ A video-greeting mission does NOT build video capture. It prompts a rail that already works.**
This is the **FIFTH** capability found built-and-unmerchandised this session — after face-sort, the
purchase doorway, photo themes and the Maya gateway.

⚠ **Verify before pricing on it:** `fetchPabatiQuota` implies Pabati carries its **OWN quota**,
separate from the Papic points pool. If so, video greetings may not consume Papic points at all —
which breaks the "the game is the capture pump" logic for this mission type specifically.

### 2.2 🥂 "Drink or dance" → ship it as **"Toast or dance"**

The mechanic is strong: a binary dare beats a task, and *"drink"* points straight at the bar
vendor's booth, so it doubles as a vendor mission.

**But do not instruct guests to drink.** The prompt reaches EVERY guest, PH weddings have minors
present, and the corpus already records that there is **no minor safeguard on plain capture on any
rail** (an open P2 blocker). A drinking instruction is a materially worse version of that exposure
and is the kind of thing that ends up in a screenshot.

***"Toast or dance"*** keeps the entire mechanic — same energy, same pull toward the bar, same binary
— and works for a twelve-year-old with calamansi juice. The explicit version would need an age gate,
and we do not have one.

**Type 5 (face-verified) is the mechanical differentiator.** Kuha's game needs a *human to judge*
whether a task was completed. Ours can verify *"you got a photo with the bride"* automatically,
because the face graph already knows who is in the frame. That is a different product, not a longer
list. ⚠ It is blocked on the same env var as everything else — `NEXT_PUBLIC_FACE_MODEL_URL` is unset,
so face enrolment has run for **zero guests, ever** `[MEASURED]`. **Ship it LAST.**

**Type 6 (vendor booth) is the commercial one**, and the rest of this spec is about it.

**Build order: 3 (free — already built) → 1, 2, 4 → 6 (the money) → 5 (needs the env var).**

---

## § 3 — Vendor booth missions

### 3.1 The mechanic

`public.event_vendors` ships from iteration 0006 (migration `20260513100000`) `[VERIFIED-CODE]`, so
**the couple's booked vendors are already in the database.** Missions therefore **auto-generate** —
no content authoring, no setup:

> *"Get a photo at **Salt & Lime**'s cocktail bar."*

The 3D plan already carries booth positions, so a later iteration can point a guest at *where* it is.

### 3.2 Why it is worth money to a vendor

| Party | Gets |
|---|---|
| Guest | a reason to leave the table and explore |
| Couple | guests actually **use** the ₱40k bar they booked |
| **Vendor** | **foot traffic · engagement proof · real photos of people enjoying their service** |

A vendor today has **no way** to prove their booth was busy and **no way** to obtain usable photos of
guests at it. Both arrive here as a by-product of a guest having fun.

### 3.3 🔒 The line that does not move: BOOKED VENDORS ONLY

**Missions may only name a vendor the couple actually hired.** No third-party placement, no
pay-to-appear, ever.

- **Booked** → we are helping the couple get value from their own spend. Legitimate.
- **Not booked** → advertising at someone's wedding. That is precisely the brand cost that **retired
  AdSense on 2026-05-19**, in a far worse venue.

Selling to vendors is fine. Selling *placement at events they have no relationship with* is not.
**The product is a tool for a vendor's own client's event.**

### 3.4 The commercial model — owner-decided 2026-07-21

**TWO TIERS. The free one serves the COUPLE; the paid one serves the VENDOR.**

| | What it is | Price | Vendor receives |
|---|---|---|---|
| **Auto mission** | *"Get a photo at Salt & Lime's bar"* — generated from `event_vendors`, zero authoring | **FREE, every booked vendor, every tier** | **foot traffic only** |
| **Custom challenge** | the vendor authors it: *"Order our signature calamansi mojito and show us the pour"* | **2 tokens = ₱400** per event · **UNLIMITED on Pro+** | foot traffic **+ the photos** + completion metrics |

**Why the custom one is worth real money.** It is specific — it names the thing they want tried, and
it produces photos of *that service* rather than a generic booth shot. A caterer wants guests
photographing the lechon, not the table it sits on.

**Why 2 tokens and not 1.** A token anchors to **1 lead = ₱200**, and a lead is a *lottery ticket* —
one couple, uncertain. A challenge is a *delivered result*: ~40 of 150 guests complete it, and the
vendor gets photos they would otherwise pay a photographer for. **Certain beats uncertain, so the
challenge prices above the lead** — and the ₱200 lead anchor stays legible.

**Why unlimited on Pro+ is SAFE.** A vendor can only create a challenge at an event **they are booked
for**, so "unlimited" is bounded by their real bookings — three weddings, three challenges. There is
no spam path and no cost tail (a challenge is a row in a table). The booked-only rule you wanted for
brand reasons doubles as the fair-use clause.

**The crossover does the selling:**

| | |
|---|---|
| Solo → Pro | **+₱1,500 / 28 days** |
| Challenge at 2 tokens | ₱400 |
| **Break-even** | **~4 events a month** |

A vendor doing four or more weddings a month upgrades to Pro **on challenges alone**, before Market
Intel or team seats enter the conversation. A photographer can check that against their own calendar
in five seconds.

Below four events, tokens are honestly cheaper — which keeps the solo vendor on the platform instead
of pricing out the people who populate the marketplace early.

**Standing rule to protect the anchor: TOKENS BUY ACCESS TO PEOPLE — leads, guests, planning
surfaces. TOKENS NEVER BUY FEATURES.** The moment a token unlocks a dashboard capability, vendors
cannot price them and the subscription tiers lose their job.

### 3.5 ⚠ 3D Plan is deliberately NOT priced here

Its vendor model is an **open working document with 12 sign-offs outstanding and nothing locked**
(`project_setnayan_3d_plan_vendor_revenue`) — it has already cycled through ₱999 couple activation,
₱100/inquiry tiers, a ₱500 lock fee, a retired inquiry gate and deferred boosts, and 3D Booth Ads is
still backlog. **Bundling it here would make the challenge inherit twelve open questions it does not
have.** Settle challenges first; 3D closes on its own calendar.

### 3.6 The couple approves custom copy

Auto missions fire automatically — they only name a vendor the couple hired. **Custom copy is a
vendor writing on the couple's surface**, so it needs one tap of approval. Cheap to build, and
without it you will eventually have a vendor write something off-tone at a christening.

---

## § 4 — Consent: the per-photo tap (owner-decided 2026-07-21)

**The photos are what justifies ₱400 — and photo delivery to a vendor is exactly what is blocked.**
Guests consented at RSVP to photos in the *couple's gallery*, not to a business using their face in
marketing. As originally specced, the thing being charged for was the thing that could not ship.

### 4.1 🔑 The unlock: ask the guest, at the moment of completion

Do **not** infer consent from mission completion. Make it an explicit tap:

> ✅ *Challenge complete!*
> **Share this photo with Salt & Lime?** They'd love to feature it.
> **[ Share ]  [ Keep it private ]**

**Explicit · specific · informed · freely given** — the RA 10173 standard, rather than an inference
from behaviour. It also lands at the exact moment the guest is engaged and feeling warm toward that
vendor, which is when a yes is both most likely and most genuine.

| | |
|---|---|
| Vendor gets | **fewer** photos, with **clean** consent |
| Guest gets | real control, at the right moment |
| Setnayan gets | a defensible position instead of an argument |

**Fewer photos we can defend beats more photos we cannot.** *"Completing a game implies consent"* is
the version a regulator refuses; a per-photo opt-in is the version they expect.

### 4.2 It also unblocks something else that is stuck

The **vendor past-events gallery** shipped facts-only (PR #3400 — venue, month, type; no names, no
photos); **the photo-rich layer is DEFERRED on per-event consent**
(`project_setnayan_vendor_past_events_gallery`). A per-photo share tap is a **better consent
instrument than anything proposed for that feature** — take both to the DPO as one package, since
they are the same problem and this is the stronger fact pattern.

### 4.3 🔒 Sequencing — do not invert this

**Build the consent tap FIRST. Then sell the challenge at ₱400.**

Selling it without photos would be overpriced, and dropping to ₱200 to compensate means repricing
*upward* later — which is far harder than launching at the right number. The tap is small, and it is
what makes the vendor product legitimate rather than merely profitable.

---

## § 5 — What has to be built

| # | Item | Notes |
|---|---|---|
| 1 | `papic_missions` + `papic_mission_completions` | mission = (event, type, prompt, optional vendor_id, optional target guest/role) |
| 2 | Auto-generation from `event_vendors` | the whole point — zero authoring |
| 3 | Guest UI on the capture surface | list · tap-to-shoot · completed state |
| 4 | Leaderboard + winner screen | Kuha parity |
| 5 | Per-event-type mission packs | wedding entourage · **18 Moments** (debut) · **ninong/ninang** (binyag) — ⚠ **cultural review by a Filipino reviewer before launch**, per the 90-day plan |
| 6 | Vendor surface | their missions, completion counts, (gated) photos |
| 7 | Face-verified missions | **LAST** — needs the face env var flipped first |
| 8 | **Delete or build the `Photo Challenges` copy** | § 1 — it is live now |

**Sequencing:** 1–4 are the product · 5 makes it Filipino · 6 makes it earn · 7 makes it uncopyable.

**Points interaction:** mission photos are ordinary captures and **draw from the same pool** (1 photo
= 1 pt). A game that drives capture volume is a game that **consumes points** — which is
margin-positive at 85% and drives top-ups. Worth stating plainly rather than discovering: **the game
is the capture pump.**

---

## § 6 — Open questions

1. **Does the game consume points, or get a free allowance?** Consuming is simpler and pumps top-ups;
   a free allowance is friendlier. **Recommend consuming** — the pool is generous and a game that
   silently drains it is only a problem if the remaining count is invisible.
2. **Which vendor tier?** Recommend Pro-and-up, matching Market Intel. Owner call.
3. **Do free-tier vendors get completion counts?** Recommend no — counts are the Market-Intel-shaped
   value.
4. **⚠ DPO:** mission photos → vendor marketing use (§ 4). **Blocks photo delivery only**, not the game.
5. **Does the couple curate missions?** ✅ **RESOLVED 2026-07-23 → see § 9.** The couple hand-picks up
   to 10 from a 40-challenge library (+ create-your-own); Setnayan auto-fills 10 more with a
   guaranteed Top-5 backfill (20-slot board). Vendor opt-in is a simple "allow vendors" toggle; never
   a required setup step — auto-generation stays the default.
6. **Prize/winner mechanics** — who decides, is there a real prize? Kuha ships a winner screen. Out
   of scope here; the couple's business.

---

## § 7 — Why this is the strongest thing in the Papic roadmap

Couple-side Papic is priced to acquire, not to earn — ~₱200/wedding at 20% attach `[MODELLED]`
against ~₱3.25M/yr from 100 Pro vendor subscriptions. **Booth missions are the only Papic feature
that sells into the line that actually earns.**

They also need something no competitor can assemble: a **two-sided marketplace with the couple's
booked vendors already in the database.** Kuha can copy a prompt list in a sprint. They cannot copy
`event_vendors`.

---

## § 8 — The completion reward: a free Story (owner-decided 2026-07-23)

Kuha's payoff is a **leaderboard + winner screen** — one winner, everyone else loses, and the owner
already cut that ("*for what? — no job at a wedding*"). Our payoff is the opposite: **everyone who
plays wins something they keep.**

**Completing a challenge earns a free Personal Reel / Story.** It is not a bolt-on prize — it is the
**recap of the exact shots the challenge just made them take.** Complete *"get a photo at Salt &
Lime's bar"* → you now have the material → the reward is a story stitched from it → you download it.
The game drives capture (booths, engagement, the vendor's foot traffic); the reward is the by-product.
**The game is the capture pump; the story is the pump's receipt.**

### 8.1 The mechanic

| | |
|---|---|
| **Picks** | up to ~10 items, **any mix of the guest's own photos + clips, free choice** (this **relaxes** the 2026-05-09 locked "max 5 guest + 5 couple" split) |
| **Output** | 30s · 9:16 · 1080×1920 · template-driven (no per-render AI) |
| **Music** | their own upload (BYO, client-side per `14_Music_Catalogue_Cowork_Playbook.md § 16.7`) **or** an owned-catalogue track |
| **Render** | **entirely in the guest's browser** (WebCodecs; ffmpeg.wasm fallback) |
| **Storage** | **none — the output downloads to their phone; Setnayan stores nothing** (no `/reels/render`, no Queue, no R2 write, no DB row, no shared feed) |

This **reverses** the server-side pipeline in `10_Papic_Feature_Specification.md § 4.3` (both it and
CLAUDE.md's critical flows are banner-corrected).

### 8.2 Why this is the right shape

- **Cost = ₱0, storage = 0.** The guest's device renders; R2 free egress pulls the source; the
  finished ~15–25 MB file never lands on us. No accumulation on our space, ever — the "large deposit"
  worry is void.
- **Not-distributor posture.** We never host or hand out the finished artifact — same protection the
  BYO-music decision bought (§ 16.7).
- **No cost cap needed.** Client-side + free egress + we store nothing ⇒ nothing to farm. A guest
  re-rendering 50 stories costs us ₱0. Any limit is **motivation design, not economics** — recommend
  **one story per completed challenge**, each a themed recap of that moment.

### 8.3 Where it slots

Right after the § 4 per-vendor consent tap on the completion screen:

> ✅ *Challenge complete!*
> **Share this photo with Salt & Lime?**  **[ Share ]  [ Keep it private ]**
> 🎁 **You earned a Story — make yours →**

### 8.4 The one real dependency (technical, not commercial)

A 10-**clip** montage is the heaviest client-side job there is (decode + trim + concat + re-encode of
ten videos in the browser). It is practical only when it compiles from the **compressed,
geo-stripped `clip_web_r2_key` web-copies** — the corpus notes clips *"don't compress yet,"* so
compiling full-res would pull ~150–300 MB to the guest's phone (fine on our bill via free egress,
rough on weak venue signal). **This reward effectively depends on the clip web-copy pipeline landing
first**, and on a WebCodecs render path (ffmpeg.wasm is too slow on the budget Androids common at PH
weddings). Photo-only reels are light and ship without that dependency.

---

## § 9 — The 40-challenge library + the 20-slot selection mechanic (owner-decided 2026-07-23)

Owner session 2026-07-23 turned the open "does the couple curate?" question (§ 6.5) into a concrete
model: a **Setnayan-supplied library of 40 generic wedding challenges**, a **couple-curation flow**,
and a **guaranteed-must-capture backfill** so the couple can't accidentally skip the shots that make
the wedding video.

### 9.1 The two layers — generic library vs. named vendor

The library challenges are **generic and category-level — they never name a specific vendor.** They
point guests at the *paid elements* of the event ("the bar," "the dessert table," "the band," "the
backdrop"), so they work at **any** wedding regardless of who is booked. A challenge may *show* a
vendor incidentally (a guest doing "Toast at the Bar" ends up at whoever's bar is booked) but never
names them.

The **named-vendor** challenges are the separate Layer 2 already in this spec: **auto-booth missions**
(auto-generated from `event_vendors`, free, § 3.1) and **paid vendor challenges** (vendor-authored,
₱400/event add-on, § 3). Both drive guests to the *same physical station* the generic library
already activates — so **the library IS the spend-maximizer, and a vendor simply claims/sponsors a
category the library already lights up.** The owner's stated goal: *"make the guests maximize the
expenses the couple spent for the event."*

### 9.2 The library (44 · Setnayan-supplied · generic) — 📷 photo · 🎥 clip

> **⚠ UPDATED 2026-08-10 — the library is 44, not 40.** Four **STORY** challenges were added
> (ids 41–44, category `stories`, all 🎥 clip), owner-worded. Every one of the original 40 is an
> ERRAND — *go photograph this* — and none asked a guest to say anything about the couple.
> See **§ 9.2b** below. Shipped in migration `20271125220401`.

Every challenge lands a guest at a paid line item. `PB` = the Pabati rail (own quota, see § 9.5).

**💍 The Couple & Family** — 1 Steal a Dance 🎥 · 2 Kiss Cam 📷 · 3 Twin the Couple 📷 · 4 Blessing
Cam 🎥 · 5 Pabati 🎥`PB` · 6 Parents' Hug 📷 · 7 Entourage Selfie 📷
**🍽️ Food, Drinks & Carts** — 8 Toast at the Bar 📷 · 9 Signature Drink 📷 · 10 Sweet Tooth 📷 ·
11 Cake Watch 📷 · 12 Catch the Cart 🎥 · 13 Grazing Table 📷 · 14 Food Trip 📷
**🎶 Band & Dance Floor** — 15 Tunnel Run 🎥 · 16 Bust a Move 🎥 · 17 Dance-Off 🎥 · 18 Group Boogie
📷 · 19 Request a Song 🎥 · 20 Serenade 🎥 · 21 Conga Line 🎥
**✨ Booth, Decor, Florals & Lights** — 22 Photo Booth Run 📷 · 23 Backdrop Star 📷 · 24 Bloom Check
📷 · 25 Under the Lights 🎥 · 26 Table Art 📷 · 27 Aisle Moment 📷
**🤝 Meet the Room** — 28 New Friend 📷 · 29 Table Squad 📷 · 30 Both Sides 📷 · 31 Generation Gap 📷
**👗 Fashion & Candids** — 32 Runway Moment 🎥 · 33 Best Dressed 📷 · 34 Accessory Game 📷 · 35 The
Big Laugh 📷 · 36 Photobomb 📷
**🎆 Big-Production Moments** — 37 Bouquet/Garter Catch 🎥 · 38 Confetti Moment 🎥 · 39 Guestbook
Signing 📷 · 40 Grand Finale 🎥

Balance: ~25 photo / 15 clip. **No per-challenge point cost** — the *capture* the guest makes costs
the pool (photo = 1 pt, clip = 7 pts, per the currency lock); selecting a challenge is free. Only the
**no-face-graph types** are in the launch 40 (generic prompts + roster + toast/dance + station
visits); face-verified auto-confirm challenges ("get a photo with BOTH of them") stay gated on the
dormant `NEXT_PUBLIC_FACE_MODEL_URL` and are a later add. **"Drink" is deliberately "Toast — any drink
counts"** (§ 2.2 minor-safety rule; no age gate exists).

### 9.3 The 20-slot board — 10 (couple) + 5 (vendor) + 5 (Setnayan), Setnayan backfills the rest

Each event runs a board of up to **20 active challenges** in **three lanes** (owner 2026-07-23:
*"5 will be opened for the vendors. if no vendor availed, then our goal is to fill it up to 20"*):

1. **Couple — up to 10.** Hand-picked from the 40 + **create-your-own** (couple-authored count here;
   keep the § 2.2 no-drinking / no-unsafe-dare guardrail on custom text).
2. **Vendor — 5 reserved.** Layer 2: auto-booth missions from booked vendors (free) + paid vendor
   custom challenges (₱400/ev, couple-approved). Up to 5 of the 20 slots are held for vendors.
3. **Setnayan — 5 guaranteed.** The **Top-5 Must-Capture** (§ 9.4), always present so the couple can't
   skip the hero shots.

**Backfill (owner "fill it up to 20"):** any of the 5 **vendor** slots **not** taken by a booked/paid
vendor revert to **Setnayan**, filled from the Top-10 ranking (6→10, then library order). Likewise if
the couple picks **< 10**, Setnayan backfills toward 20. Setnayan therefore always holds **≥ 5** slots
(20 − 10 − 5), so the guaranteed Top-5 always fit.

**Guarantee + dedup:** if the couple already picked a Top-5 item it is *taken* — do **not** duplicate;
**backfill down the ranking (6→10)** so the guaranteed slots always deliver *distinct* captures.

**Fill algorithm (ordered lanes, dedup by walking the ranking):**
1. Fix the couple's picks (≤ 10).
2. Attach up to 5 vendor missions (auto-booth + approved paid).
3. Setnayan: place the Top-5 (skipping any already on the board), then **backfill empty vendor slots
   + any couple shortfall** by walking Top-10 → library order, **skipping anything already on the
   board**, until the board = 20 or sources are exhausted.

*Resolves the earlier "vendors on-top vs compete-for-20" flag → **vendors get 5 OF the 20**; unfilled
vendor slots revert to Setnayan.* **Edge:** couple picks 0 + no vendor → board = Setnayan's Top-10 +
next 10 by library order. Board size ranges 10–20 depending on how many couple + vendor slots fill.

### 9.2b The STORY challenges (41–44 · added 2026-08-10 · owner-worded) — 🎥 clip

Owner 2026-08-10, on seeing the "confession booth" idea (couples DIY-ing prompt cards on top of a
shared-album app): *"we just want to add those new challenges"* + *"We want a 10 second story."*

> **⚠ EXPANDED 2026-08-10 — the set is 20, in TWO kinds.** Owner: *"make more. something to
> uplift the groom, bride, and as a couple. questions that are fun to share but still memorable
> and safe enough to share."* Migration `20271125890940`.

**📖 Stories — `{who}` side-token (uplift the one they came for)** — 41 Most Memorable 🎥 ·
42 The First Time 🎥 · 43 When It Mattered 🎥 · 44 Always Remember 🎥 · 45 Brag For Them 🎥 ·
46 Three Words 🎥 · 47 The Best At 🎥 · 48 The Kindest Thing 🎥 · 49 Set It Straight 🎥 ·
50 First Impression 🎥 · 51 Made You Laugh 🎥 · 52 Proud Of Them 🎥

**💞 Stories — couple (uplift them as a pair, no token)** — 53 When You Knew 🎥`R15` ·
54 Better Together 🎥`R16` · 55 Advice For The Years 🎥 · 56 Different Together 🎥 ·
57 Ten Years From Now 🎥 · 58 The Best Day 🎥 · 59 Their Song 🎥 · 60 One Day, Their Kids 🎥

🔑 **The two kinds are how all three of the owner's asks are met.** The side-token set *is*
"uplift the groom" and "uplift the bride" — each guest is asked about the half they actually
know. A fixed *"praise the bride"* handed to the groom's college roommate produces a polite
non-answer, the opposite of memorable. **Targeting by side beats targeting by name.** And
"as a couple" can only come from the untokenised set: a both-side guest resolving `{who}` to
"the couple" happens by accident of their side, not by design.

🔒 **"SAFE ENOUGH TO SHARE" IS A CONSTRAINT ON THE WORDING, NOT A DISCLAIMER.** The § 2.2
blocklist stops **dares**; it does not stop tactlessness, and a question whose honest answer
embarrasses someone in front of both families is unsafe even though every word passes the
filter. Rules these 20 keep, and any new one must:
- Point at something **good** — proud of · kindest · best at · made you laugh · what people get
  wrong. **Never** the wildest, the most embarrassing, the secret, or the story they have never
  told. Those read as fun on a planning screen and land as a problem on a projector, in front of
  both families, permanently.
- Anything that could tip carries its steer **IN the prompt where the guest reads it**
  ("keep it kind" · "Be nice") — not in a policy nobody sees.
- Never ask a guest to compare the two of them, rank anyone, or speak about an ex, money, or
  family friction.

📌 **Only SIX are on every board** (ranks 11–16: 41–44 + 53 + 54) → 10 heroes + 6 stories +
4 errands. Ranking all 20 would leave **zero errands**, and the errands are what walk a guest to
the paid line items (§ 9: *the library IS the spend-maximizer*). **The other 14 are reached by
the couple's picker** — see § 9.3b.

| id | prompt (stored) |
|---|---|
| 41 | Share a story about your most memorable experience with `{who}`. Ten seconds. |
| 42 | Share a story about the first time you met `{who}`. Ten seconds. |
| 43 | Share a story of an experience where `{who}` played a crucial part in your life. Ten seconds. |
| 44 | Share a story of how you will always remember `{who}`. Ten seconds. |

**`{who}` — the side token.** Owner: *"Or dedicate it to whether they are team groom/bride/both. so
it adjusts."* `guests.side` is a NOT NULL enum already, so nothing needs authoring or backfilling.
`papic_guest_missions` (v5) substitutes **per guest**: bride → *the bride*, groom → *the groom*,
anything else → *the couple*. 🔑 **Substitution belongs in the per-guest reader and nowhere else** —
the board is materialized per EVENT, one row serving every guest, so baking it at materialization
would show one side's wording to the entire wedding. Every non-guest screen (couple manager, vendor
approval, vendor panel, vendor photo delivery) reads `papic_missions.prompt` **straight from the
table** and renders the neutral wording via `displayChallengePrompt()` — a raw `{who}` must never
reach a human.

**⚠ TEN SECONDS IS THE ANSWER, AND THE PROMPT SAYS SO.** A challenge is completed by the guest's
next capture, and a Papic clip is hard-capped at 10 s (owner lock 2026-07-22 · § 0). There is **no
text-answer completion path** and none was invented. A story prompt that does not name the ten
seconds gets the guest cut off mid-sentence *and told they succeeded* — do not add one.

**🚨 A STORY WITHOUT A RANK IS UNREACHABLE.** See § 9.4: the board is 20 slots and the Setnayan lane
backfills by `priority_rank NULLS LAST, library_id` over 44 rows, so an unranked row at 41+ sorts
dead last and is never placed — and **nothing else surfaces the library** (no app code reads
`papic_challenge_library`; the couple's manager has **no library picker**, only free-text authoring
and hide/show). The rows would exist and no guest would ever be asked one.

### 9.3b The couple's STORY PICKER (built 2026-08-10)

**The first thing anywhere that lets a couple choose a LIBRARY challenge.** Before this the couple
manager could only (a) author free text and (b) hide/show what was already on their board — so an
unranked library row was **unreachable by any human**, which is why 14 of the 20 stories would
otherwise have been dead rows.

The picker lists the two story groups with copy naming which is which (*"Share a story about the
couple"* and *"…about the bride"* look like the same question on that screen and are not), hides
what the event already carries, and warns at 10 picks that the couple lane caps there.

⚠ **A pick MUST carry its `library_id`.** The board resolver dedupes the Setnayan auto-fill against
*couple picks WHERE library_id = …*, so a prompt copied as free text is invisible to that check and
**the same question lands on the board twice** — once as theirs, once as ours. Identical on screen,
wrong underneath. The prompt is also read from the library row, **never from the posted form** —
otherwise any string could be stamped with a library id and inherit its dedup identity.

⚠ **Hidden counts as TAKEN.** The taken-set is read without an `is_active` filter on purpose: a
question the couple hid is still theirs, and re-offering it would say "add this" while their own
list below says "Hidden from guests". Un-hiding is the Show button, not a second Add.

### 9.3c The couple's LIST of the board (rebuilt 2026-08-10)

> 🚨 **AND THE BOARD ITSELF HAD NEVER BEEN BUILT.** Found while checking this list.
> The guest route calls `ensure_papic_board` via the **service-role** client (a Papic guest is
> zero-account — no `auth.uid()`), and the board's first act was `PERFORM
> ensure_papic_auto_missions`, hardened **2026-08-01** with *"a missing session is now a REFUSAL,
> not a bypass."* Every call raised; the route's `.catch(() => 0)` swallowed it; the reader
> **fail-softed** to *"no board → show everything by created_at"* — a list that looks fine. So the
> whole library, the § 3 booth-mission core, the § 9.4 ranking and the 20-slot cap were **all
> inert**, and a guest saw only what the couple typed by hand. Reproduced against the replayed
> prod schema, not inferred. Prod was pre-launch (0 missions), so nothing was harmed.
> 🔑 **The defect was WHERE THE CHECK LIVED.** A function that is both a public RPC and an
> internal step re-litigates its caller's already-passed gate under rules written for a different
> caller. **An entry point authorizes; a step does the work.** Split accordingly; the 2026-08-01
> hardening was **not** reversed.
> 🪤 **A comment asserting how a callee's callee behaves cannot notice when that callee is
> hardened** — the route's comment named neither the changed function nor its migration.

The couple's list was **one flat list in creation order** — the order vendors happened to get
booked, which matches no other screen — and since the board caps at 20, a couple could read a list
of 24 with **no hint that four of them reach nobody**.

It now:
- **resolves the board on load** (the resolver's guard names the couple/coordinator, so this is the
  caller it was written for; idempotent, advisory-locked, materialize-once) — otherwise every slot
  is NULL for the whole planning period, exactly when the couple is curating;
- lists **in the guest's order, with the position shown**, so this screen and their phone agree;
- splits **"What your guests see"** from **"Not showing"**, the latter saying whether each is
  *waiting for a free spot* or *hidden by you*;
- labels what the guest is asked to DO — **Photo · On camera · Video greeting** — because
  *"Brag about the bride for ten seconds"* and *"Catch the cake"* otherwise read as the same item;
- **suppresses itself on a failed read** rather than rendering *"No challenges yet"*, a confident
  lie about an event that may have twenty.

### 9.4 ⚠ PROVISIONAL Top-10 Must-Capture ranking — OWNER SIGN-OFF PENDING

> **⚠ UPDATED 2026-08-10 — the ladder is 1..20, not 1..10.** `priority_rank` widened (still UNIQUE —
> a rank is a board POSITION, and two rows claiming one turns a guarantee into a coin flip).
> **11–14 = the four § 9.2b story challenges**, ranked directly below the Top-10 heroes.
> **What it costs:** the 20-slot board was already full, so on an event with no couple picks and no
> booked vendors the four stories DISPLACE the four lowest-ordered unranked errands — the board
> becomes **10 heroes + 4 stories + 6 errands**. Nothing is deleted; displaced rows return the moment
> a couple pick or vendor mission takes a slot. Reordering is an UPDATE of four ranks.

Setnayan's fill order. The **Top 5 are guaranteed** every event; **6–10** are the backfill. This
ranking is a curatorial call the owner has **not yet locked** — proposed here so the build has a seed,
**reorder freely:**

**Top 5 (guaranteed — the wedding-video hero moments):** 1 Steal a Dance · 2 Grand Finale (send-off) ·
3 Pabati · 4 Kiss Cam · 5 Tunnel Run.
**#6–10 (backfill):** 6 Confetti Moment · 7 Blessing Cam · 8 Group Boogie · 9 Parents' Hug · 10 Photo
Booth Run.

### 9.5 Pabati (#5) — wiring + quota flags

Pabati (video greeting) is **already built** (§ 2.1: `/api/pabati/clip` mirrors guest-capture,
photo→video). Embedding it as a challenge is a doorway, not a new capture build. Build decisions:
- **Wire to the Pabati route** (`/api/pabati/clip`), NOT the Papic capture path.
- **Own meter:** `fetchPabatiQuota` implies Pabati carries its **own quota, separate from the Papic
  point pool** → Pabati is the one library challenge that is **not** a points capture-pump (it's a
  gift to the couple). Decide whether it draws Papic points or stays on its own meter — recommend own
  meter.
- **Reward:** the Story reward (§ 8) is stitched from the guest's own Papic photos/clips; a Pabati
  greeting is a standalone video on a different rail → recommend **Pabati is its own reward** (the
  couple gets the message), no Story attached.

### 9.6 Build state

The booth-mission machinery + challenge panel are **built** (phases 1→5, flag `NEXT_PUBLIC_PAPIC_GAMES_V1`
LIVE — see `project_setnayan_papic_games_build`). The **40-library + curation flow + 20-slot backfill
selector** in this section is a **NEW design decision, not yet built** — it is the setup-side curation
UI plus a fill resolver over the existing mission tables. Store the library as seed data (challenge =
`type` generic, `prompt`, `capture_kind` photo|clip|pabati, `priority_rank` nullable) and the board as
per-event selected + auto-filled mission rows.

---

*Compiled 2026-07-21 · § 8 reward added 2026-07-23 · § 9 library + 20-slot selection added 2026-07-23.
Booth-mission machinery built (phases 1→5, see `project_setnayan_papic_games_build`); the § 8
challenge-completion reward (client-side reel) and the § 9 library/curation flow are NEW design
decisions, not yet built. `event_vendors` verified present; the `Photo Challenges` fake door was
verified live at two guest-facing surfaces and has since been gated behind the flag.*

---

## § 10 — 631 CHALLENGES, AND EVENT-TYPE SCOPE (owner-decided 2026-08-21)

> **This section supersedes every count in § 9.** The library was 40, then 44, then 60. It is
> **631**. Where § 9 says "the 40-challenge library", read this.

### 10.1 What the owner asked for

Verbatim, in one sitting:

> *"we want to create a 500 papic challenges. activities that they can talk make people do during
> the event. or something they can share to the host. like a greeting, a story. try to search the
> internet of similar challenges and compile our challenge pool. so we want to have over 500
> challenges photos or videos combined."*
>
> *"here they can filter it so they can pick which challenge they like. also search. but we will
> show the top 20 most picked challenges."*
>
> *"we can have the idea of a confession box where we want them to share their stories. or like a
> on the spot anywhere challenge. or a challenge that includes the host. or a challenge that
> includes other people. a selfie. a flex of what they wore. or brought. a special message for the
> couple."*

### 10.2 🔑 FIVE OF THE SEVEN SHAPES ALREADY HAD A HOME

Read this before designing anything here. The seven shapes the owner named map onto the shipped
taxonomy almost exactly — **only three categories are new**, and the rest were GROWN:

| The owner's words | Where it lives | New? |
|---|---|---|
| a confession box … share their stories | `stories` · `stories_couple` | no — shipped 2026-08-10 |
| a special message for the couple | `greeting` (was `couple_family`'s video greeting) | **new category** |
| an on the spot anywhere challenge | `anywhere` | **new category** |
| a selfie | `selfie` | **new category** |
| a challenge that includes the host | `couple_family` | no |
| a challenge that includes other people | `meet_room` | no |
| a flex of what they wore. or brought | `fashion_candids` | no |

### 10.3 The pool — 631 rows, 12 categories

**346 photo · 285 video** (284 `clip` + 1 `pabati`). Id blocks, so appending to a block never
renumbers another: shipped 1–60 · selfie 100 · anywhere 200 · greeting 300 · stories 400 (side)
and 450 (any event) · stories_couple 500 · couple_family 600 · meet_room 700 · fashion_candids 800
· food_drinks 900 · decor_booth 1000 · band_dance 1100 · big_moments 1200.

🔒 **The canonical list is `apps/web/lib/papic-challenge-pool.ts` in the code repo, and the
migration is GENERATED from it.** Do not hand-write challenge rows into a migration again — six
hundred rows cannot be kept in step with a hand-typed seed, and a CI guard now re-generates and
compares.

### 10.4 🚨 EVENT-TYPE SCOPE — a live defect, not a precaution

Every one of the 60 shipped challenges was written for a **wedding**, and the library had no column
that could say so. Measured in production on 2026-08-21: the event `movie-night`, of type `date`,
was carrying a full 20-slot board asking two people to *"dance with the bride or groom"*, to
*"catch the newlyweds mid-kiss"*, and to get *"a photo with one of the couple's parents."*

`papic_challenge_library.event_types text[]` — **NULL = fits any celebration**, a list = only those
types. **Both lanes** of `ensure_papic_board` filter on it: the INSERT that materializes rows AND
the CTE that assigns slots. Scoping only the INSERT leaves an already-broken board exactly as it is.

**475 of the 631 fit any event**, so no board goes short.

### 10.5 The tokens — four now, resolved at READ time

| token | becomes | scope |
|---|---|---|
| `{who}` | the bride / the groom / the couple, **per guest** from `guests.side` | **wedding only** |
| `{host}` | the couple / the celebrant / the graduate / the host | any |
| `{hosts}` | the same, possessive | any |
| `{event}` | wedding / birthday / graduation / event | any |

`{host}` · `{hosts}` · `{event}` come from `event_type_profiles.terminology` — the same block the
guest tree's own vocabulary reads, so a birthday's Papic board and a birthday's seating page use
the same word for the same person.

🔑 **`{host}` IS ONLY EVER AN OBJECT.** *"The couple"* takes a plural verb and *"the celebrant"* a
singular one, so *"{host} is dancing"* is wrong for half the event types no matter how it is
written. *"A photo with {host}"* is right for all of them.

🔑 **`{hosts}` IS REPLACED BEFORE `{host}`,** in SQL and in TypeScript. The other order turns
`{hosts}` into `the couple}s` — invisible in review, obvious to a guest.

### 10.6 The picker — filter, search, top 20

Runs as a **URL query**: the chips are links, the search box is a GET form. No client bundle, and
it works with JavaScript off. Default view is the owner's **top 20 most picked**, from
`papic_challenge_pick_counts()` — an aggregate-only RPC (a count per library row; no event, guest
or vendor identity crosses it), because a couple can only read their OWN event's missions.

⚠ **With zero picks the shelf SAYS SO** and shows recommendations under a different heading.
Presenting our own list as *"what other couples chose"* is a claim about other people that is not
true, and it is the launch-day empty rail wearing a compliment.

### 10.7 🔒 What must not change

- **A wedding's board does not move.** All 571 new rows are unranked and numbered above
  `library_id` 99, and the Setnayan lane backfills `ORDER BY priority_rank NULLS LAST, library_id`
  — so the shipped sixty still win every slot they won before. **Ranking a new row silently gives
  every couple already planning a different board.**
- **Exactly six stories hold a guaranteed slot.** Ranking more leaves a 20-slot board with zero
  errands, and § 9 is explicit that the errands are what walk a guest to the paid line items.
- **The wording lock of 2026-08-10 binds every one of the 631.** Point at something GOOD; never
  wildest / most embarrassing / secret / never-told; carry the steer IN the prompt; never ask a
  guest to rank anyone, compare the two of them, or speak about an ex, money or family friction.
- **Every clip that asks a guest to SPEAK names the ten seconds.** A clip is cut at 10 000 ms and
  the guest is told they succeeded.
