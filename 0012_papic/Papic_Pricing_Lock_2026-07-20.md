# Papic — Pricing Lock (2026-07-20, owner session)

> **What this is.** The settled Papic pricing architecture from a working session with the owner on
> 2026-07-20. It **supersedes the pricing halves** of `Papic_Good_Better_Best_Pricing_2026-07-17.md`,
> `Papic_Monetization_Council_Verdict_2026-07-20.md`, `Papic_Access_Scope_Council_Verdict_2026-07-20.md`
> and `Papic_Pricing_Plan_of_Action_2026-07-20.md` wherever they disagree with it.
>
> **Status: OWNER-DECIDED on the ladder. NOT YET BUILT. Three items still open (§ 8).**
>
> **Evidence discipline.** `[MEASURED]` = read from live prod or `origin/main` on 2026-07-20 ·
> `[VERIFIED-CODE]` = read at a cited `path:line` · `[MODELLED]` = assumption or projection, never a
> measurement · `[ESTIMATED]` = derived from a vendor price list, not from our own bill.

---

## § 0 — The two rulings this session produced

**Ruling 1 — `Papic_Pricing_Plan_of_Action_2026-07-20.md` § 0 is STANDING.** Where it conflicts with
the two council verdicts of the same date, it wins. Specifically:

| | Council verdicts said | **Owner ruling** |
|---|---|---|
| Live Photo Wall | ₱2,500/day | **FREE** |
| Thank You Video | ₱2,499, "stays PAID" | **FREE** |
| Kwento · Pabati · Guest Stories | keep PAID (₱3,598 retained) | **FREE** |
| Photo game / scavenger hunt | not chartered | **BUILD** |
| Kuha's caps | — | **OUT-SPEC them** |

**Consequence — the thesis:** every event-day feature is free, so **stop selling event-day features.**
Papic charges for **SCALE** (capture volume), **RETENTION + IDENTITY** (preservation, face graph) and
**COMPUTE** (rendered films). Bytes are Kuha's home field. Compute is ours alone. Nothing a guest
touches is ever priced.

**Ruling 2 — retention default is SIX MONTHS.** This supersedes both the 5-year default *and* the
1-month proposal explored earlier in the same session. Reasoning in § 4.

---

## § 1 — The currency

| | Points |
|---|---|
| 1 photo | **1 point** |
| 1 video clip (any length, **up to 10 seconds**) | **7 points** |

**Flat per clip, not per second** — simpler to explain and to enforce, and it makes longer clips
better value, which nudges toward the content that actually feeds Kwento and the personal reels.

**Why 7 and not 5 or 3.** The cost-fair clip value is a function of the retention window, because
clips **never compress** — a clip's `r2_object_key` *is* the playable file and there is no video
web-copy fallback, so it carries full size for the whole window while photos flatten to a 0.32 MB
AVIF at day 90 `[VERIFIED-CODE]`.

| Retention | Cost-fair clip value | Note |
|---|---|---|
| 1 month | 5 pts | |
| **6 months** | **7 pts** | ← **the lock** |
| 12 months | ~11 pts | |
| 5 years | ~30 pts | |

At 7 points and a 6-month window, a clip costs **₱0.0236/point** against a photo's **₱0.0230/point**
— within 3%. **Cost becomes mix-independent**: it no longer matters whether guests shoot photos or
video, which is what lets a flat price be quoted safely without forecasting behaviour.

> ⚠ **The 10-second cap REVERSES a locked constraint.** `CLAUDE.md` carries *"5-second hard cap on
> video clips. Capped client-side. Not configurable. UI must enforce."* Extending to 10s needs
> explicit sign-off, and it likely touches the reel templates — some manifests carry minimum/maximum
> slot durations built around ≤5s clips. **Check the template manifests before shipping.**
>
> 🔴 **CORRECTION — the clip point value is NOT a config flip.** An earlier line here claimed "moving
> to 7 is a config value." It is not. `papic_tier_config` holds `points_per_day` (the tier BUDGETS)
> but **not the per-capture cost**; `1 clip = 3 pts` is a **hardcoded constant** in
> `apps/web/lib/papic-cameras.ts:674,:691` `[VERIFIED-CODE]`. Changing it is a **code change on the
> fail-closed capture path**, so the standing rule applies: **it ships ALONE, in its own window, with
> a full re-verify.** A bug on that path stops capture at a live wedding and there is no re-shoot.

---

## § 2 — The ladder

### 2.1 Papic Free

| | |
|---|---|
| Points | **50, SHARED** |
| Cameras | up to **3** |
| Price | **₱0** |
| Cost to us | ~₱1 |

> ⚠ **A shared pool creates a race.** The first shooter can burn all 50 and leave cameras 2 and 3
> with an immediate `409 camera_points_exhausted`. **Build a per-seat floor** — e.g. 10 points
> reserved per camera, 20 first-come — or at minimum surface a live shared counter on every camera.
> Without one, one guest silently ends the free trial for the other two.

> 🔴 **Free seats have NEVER been provisioned in production — zero rows, ever** `[MEASURED]`. Whatever
> the number, **verify that three cameras actually appear on a real event** before any "free" claim
> goes on a public surface. Until then it is a fake door at any capacity.

**Positioning consequence.** At 50 shared points, free is a **demo, not a trial** (~17 photos per
shooter, vs Kuha's 200-photo free trial). It cannot carry acquisition on its own — the funnel has to
be pulled by the free *platform* (event website, RSVP, guest list, seating) with Papic as the upsell
inside it. That is a different marketing motion than "try Papic free," and it should be deliberate.

### 2.2 Per-camera — DEPTH ("a few people shoot everything")

| | Points /camera·day | Price | Margin |
|---|---|---|---|
| **Papic Mini** | 200 | **₱100** | ~88% |
| **Papic Max** | 500 | **₱200** | ~90% |
| **Papic Pro** *(proposed, § 8)* | 3,000 | ₱999 | ~92% |

**Round numbers, not charm.** This follows the owner's 2026-07-17 per-service sheet, which is
systematically round across the catalog (Pakanta ₱2,500 · 3D Plan Unlock ₱3,000 · Website Upgrade
₱3,500 · and decisively **Monogram Pro ₱999 → ₱1,000**, an explicit move OFF a charm price). The
2026-05-12 charm convention is older and superseded — see DECISION_LOG 2026-07-20, the Live Studio
correction row. Every figure in the ladder is now round.

**"Papic Unli" is RETIRED as a name.** A tier capped at 500 points is not unlimited, and shipping
that word would be the same class of defect the website audit found everywhere else. **Papic Max.**

**Per-camera stays deliberately expensive per point** — **₱400/1,000 points at Max vs ₱167/1,000 at
Papic One, i.e. 2.4×.** You are buying a *dedicated shooter*, not volume. If Max were priced near
Papic One's rate, a handful of Max cameras would beat the event pass and the ladder would collapse.

**⚠ CROSSOVER IS ~2–3 CAMERAS, NOT 10.** *(An earlier draft of this document said "~10 Max cameras ≈
Papic One's 3,000-point tier." That was wrong by 4× — 10 Max cameras is 5,000 points for **₱2,000**,
against Papic One's 3,000 points for **₱500**.)*

| Cameras | Points | Cost | vs Papic One 3,000 @ ₱500 |
|---|---|---|---|
| 1 Max | 500 | ₱200 | cheaper in absolute terms, 6× fewer points |
| 2 Max | 1,000 | ₱400 | cheaper, 3× fewer points |
| **3 Max** | 1,500 | **₱600** | **Papic One wins outright** |

**So Mini/Max are NOT a parallel ladder — they are a small top-up for 1–2 extra shooters.** Above two
cameras, Papic One wins on price *and* volume. Merchandise them that way ("add a shooter"), never as
an alternative to the event pass.

### 2.3 Papic One — WIDTH ("every guest shoots")

| Pax | Points | **Price** | Cost | Margin |
|---|---|---|---|---|
| ~60 | **3,000** | **₱500** | ₱77 | **85%** |
| ~120 | **6,000** | **₱1,000** | ₱146 | **85%** |
| ~200 | **10,000** | **₱1,500** | ₱238 | **84%** |
| **top-up** | **+10,000** | **₱1,500** | ₱238 | **84%** |

**Three rungs, and the top-up is UNCAPPED — repeatable as many times as the couple wants.**
*(A 15,000 / ₱1,999 / ~300-pax rung was drafted and REMOVED by the owner 2026-07-20; the uncapped
top-up covers everything above 200 pax instead.)*

**Why uncapped is safe.** The top-up is priced at **the same ₱150/1,000 points as the top rung**, and
our cost is **perfectly linear** at ₱0.023/point. So margin is **flat at ~84% at any volume** — a
couple buying 100,000 points for ₱15,000 costs us ~₱2,300 and earns the same percentage as one buying
10,000. **There is no volume at which unlimited top-ups erode the margin**, which is precisely what
makes removing the cap defensible. Reconciliation is ₱7.50 per order — 0.5% at this price, immaterial.

**Competitive property worth keeping:** the entire ladder now tops out at **₱1,500 — below Kuha
LUXXE's ₱1,999** — while the top rung gives **2× their volume**. There is no price point at which a
couple comparing us to Kuha sees a bigger number on our side.

> ⚠ **Granularity: the +10,000 increment is coarse.** A couple needing 2,000 more points pays ₱1,500
> for 10,000. **Cleanest fix — make the TIERS THEMSELVES STACKABLE** rather than shipping a separate
> top-up SKU: buying Papic One again adds its points, so a couple can add +3,000 (₱500), +6,000
> (₱1,000) or +10,000 (₱1,500) — whichever fits. Zero new SKUs, better granularity, and "no cap" falls
> out for free. **Recommended over a dedicated top-up SKU.**

> ⚠ **Top-ups are PRE-EVENT ONLY and that does not change.** Couple orders land `pending_approval`
> and only `app/admin/payments/actions.ts:207` writes `'paid'` — **no gateway on the couple path**
> `[VERIFIED-CODE]`. "No cap" buys unlimited *headroom*, not a mid-reception rescue: a pool exhausted
> at 9pm on a Saturday is still a **hard stop**. Top-ups must therefore be purchasable **in the same
> order as the tier**, or a large wedding needs two orders and two manual reconciliations. The card
> should read *"about 200 guests — more than that? add points."*

**SIZING GUIDE (owner-set): aim for ~60 POINTS PER GUEST for a comfortable event.**

**🚫 THIS IS GUIDANCE, NOT A GATE. Papic One gives UNLIMITED GUESTS — the pool bounds CAPTURES, not
PEOPLE.** A 200-guest couple may absolutely buy the ₱500 tier; each guest simply gets fewer shots.
Nothing in the system enforces a guest ceiling, and **copy must say "good for about 50 guests," never
"up to 50 guests"** — promising a limit we do not enforce is the same class of defect the website
audit found across the live site.

**Points per guest, by tier and headcount:**

| | 50 pax | 100 pax | 200 pax | 300 pax |
|---|---|---|---|---|
| **3,000** ₱500 | **60** | 30 | 15 | 10 |
| **6,000** ₱1,000 | 120 | **60** | 30 | 20 |
| **10,000** ₱1,500 | 200 | 100 | **50** | 33 |

*(60 pts ≈ 60 photos or 8 videos · 15 pts ≈ 15 photos or 2 videos)*

**So the buying question is not "how many guests?" but "how many shots should each guest get?"** —
which is the question a couple actually has an opinion about.

> ⚠ **BUILD: show the arithmetic at checkout.** A 200-pax couple buying ₱500 gets 15 shots each; the
> pool empties in the first hour and the wall goes quiet mid-reception — and the top-up **cannot
> rescue it** (no gateway on the couple path). Surface it at the point of purchase:
> *"You have 200 guests. This tier gives each about **15 photos**. The ₱1,500 tier gives each about
> **50**."* Honest, prevents the bad-experience case, and upsells without a hard gate.

**It is an ALLOCATION rule, not a consumption forecast.** Only ~30–45% of guests actually shoot, so
the pool is spread across far fewer people than it is sized for: at 100 pax a 5,000-point pool serves
~40 active shooters at **~125 points each in practice**, not 50. Modelled typical consumption at 100
pax is ~1,200 captures against 5,000 points — **~4× headroom** `[MODELLED]`. That headroom is
deliberate and nearly free at ₱0.023/point, because **the top-up cannot rescue a live event.**

⚠ **Copy note:** at 7 points a clip, 50 points is *50 photos or 7 videos*. A video-heavy guest burns
their share fast — say so plainly rather than letting them discover it.

**The top-up is a RESIZE, not a RESCUE.** Couple orders land `pending_approval` and only
`app/admin/payments/actions.ts:207` writes `'paid'` — **there is no payment gateway on the couple
path** `[VERIFIED-CODE]`. A mid-reception top-up is a **hard stop**, not a soft one. State the cutoff
on the page: *"Order at least 3 days before your event. We confirm within 24 hours."*

Because the top-up cannot save a live event, **base pools carry 4–5× headroom over modelled typical
consumption** (§ 6). That headroom is the safety margin, and it is nearly free at ₱0.023/point.

> ⚠ **Tiers must be CHOSEN, never auto-applied.** That is the entire line between an honest ladder
> and the pax curve that was killed (`computePaxPriceCentavos`, `v2-catalog.ts:453-459` — 100 pax
> ₱2,999 · 300 ₱4,399 · 500 ₱5,799 `[VERIFIED-CODE]`). Kuha sells tiers and nobody reads it as a
> penalty. The defect was never "big events pay more" — it was **making the buyer discover the
> multiplier at checkout.**

---

## § 3 — The two modes (the structural idea of this session)

**Papic One ships in two modes, and the split follows the legal boundary rather than a feature list.**

| | **Mode A — Guest-enabled** | **Mode B — Free guests** |
|---|---|---|
| QR | **one per guest**, printed | **one** for the event |
| Roster | **host-written** | self-declared at scan |
| Identity basis | host-verified | typed name |
| **Face tagging** | **✓** | **✗** |
| Delivery | photos find each guest | each keeps their own uploads |
| Album | personal + shared | shared |
| Video · reels · wall · retention | ✓ | ✓ |

**The rule:**

> **A host-written roster unlocks face tagging. Self-declared identity is enough to capture, and not
> enough for biometrics.**

**Why this is the right axis.** It is the one the access council identified and nobody built on
(`Papic_Access_Scope_Council_Verdict_2026-07-20.md` § 0 correction 0.6): *"At a wedding with printed
per-guest QRs and a door, that's a reconciliation convenience. At a poster-QR reunion, it is
functionally anonymous ingest with a self-declared label. The same code is safe on one type and not
on another — and THAT is the real axis of this decision."*

**It also resolves an open DPO item.** Item #7 — *is `entry_source='self_added_unlisted'` a valid
consent basis?* — has been blocking Phase 2. The answer becomes: **yes for capture, no for face.**
The stronger identity basis unlocks the stronger feature.

**Mode B is NOT anonymous ingest.** It rides `selfJoinAction` (`join/[eventId]/actions.ts:453-466`),
which already ships: one shared QR, the guest types a name, a guest row is minted, session signed.
There is still a named person. That distinction is what kept Papic Lite dead — anonymous ingest needs
a CSAM matcher, a bystander-consent gate and a net-new ROPA class we do not have.

> ⚠ **Collision to settle.** `Custom QR per Guest` is a **live ₱1,499 SKU** (1 QR/guest, up to 250
> pax). Mode A structurally requires exactly that. **Recommendation: bundle it into Mode A** — per-guest
> QR is meaningless outside this use case, and bundling makes ₱1,999 look like ₱3,498 of value. The
> alternative (Mode A *requires* the separate purchase) puts the real price of face-sorted delivery at
> ₱3,498, which is a different product.

---

## § 4 — Retention: SIX MONTHS

> 🔴 **SUPERSEDED IN PART — 2026-08-07. READ THIS BEFORE THE TABLE BELOW.**
> The **90-day full-res drop** documented in § 4.1 is **no longer the model** and
> has not been since 2026-08-02. The enforced rule is now:
>
> | | value | constant |
> |---|---|---|
> | cameras may start shooting | **6 months** before the event | `PAPIC_CAPTURE_MONTHS_BEFORE = 6` |
> | full-res kept | **6 months from the event's FIRST capture** | `DEFAULT_FULL_RES_RETENTION_DAYS = 183` |
> | …but never less than | **3 months after the event date** | `FULL_RES_POST_EVENT_GRACE_DAYS = 92` |
> | compressed gallery | **indefinitely** | no expiry rule |
>
> Eligibility is `GREATEST(first_capture + 183d, event_date + 92d)` — migration
> `20271102113000`. **The Drive-handover reasoning in § 4.1 still holds** (hand
> over BEFORE the originals go, not after); only the day numbers moved.
>
> 🔑 **The 3-month floor is the promise, not the 6-month clock.** Because shooting
> opens six months out, the earliest permitted photo's own clock expires **on the
> wedding day**. Everything the couple keeps afterwards comes from the floor.
> Owner, verbatim: *"still preserve 3 months all their photos in high res before we
> compress it."*
>
> The drift-audit table in § 4 further down is a **historical record of a
> disagreement**, not current values — do not read numbers out of it.


### 4.1 The layers

| Day | What happens |
|---|---|
| 0–90 | we hold **full-res originals** + the compressed gallery |
| **~80** | **full-res pushed to the couple's own Google Drive** — free, permanent, their custody |
| **90** | **full-res dropped from our storage** (`DEFAULT_FULL_RES_RETENTION_DAYS = 90`) |
| 90–180 | compressed gallery only |
| **~150** | we ask: *which photos should we keep?* (§ 5) |
| **180** | gallery expires unless preserved |

> 🔴 **CORRECTION (2026-07-20, same day).** An earlier draft of this document put the Drive handover
> at **month 6**. That is impossible — the originals are **already dropped at day 90**, so there would
> be nothing left to hand over but the compressed copy. **The Drive push must happen BEFORE day 90**
> (~day 80). Any session building against the month-6 version would ship a handover of files that no
> longer exist.

**⇒ Drive must therefore be connected within the first ~80 days, ideally at event setup.** This is
not only a customer-experience point: PR #3420 made the drop sweep **DEFER whenever Drive state is
unreadable**, so an unconnected Drive means originals are held **indefinitely** — unbounded storage
and out of step with our own filing. **The Drive prompt is what allows the 90-day drop to fire at
all.** Ask at event setup (not checkout — an OAuth screen mid-purchase is the highest-friction thing
in the flow), then remind at day 60 and day 80; if still unconnected at day 90, **hold and warn,
never delete.**

### 4.2 Why 6 months and not 1 month or 5 years

**Retention is cheap up to about a year, then it gets expensive fast** — and the whole cliff is video:

| Window | Cost (3,000 pts) | Margin @ ₱500 | Step |
|---|---|---|---|
| 1 month | ₱49 | 90% | — |
| **6 months** | **₱77** | **85%** | +₱28 |
| 12 months | ₱110 | 78% | +₱33 |
| 5 years | ₱307 | **39%** | **+₱197** |

Going 1 → 12 months costs ₱61. Going 12 months → 5 years costs ₱197 — three times as much for the
next step, entirely because clips never compress.

**Against 1 month:** a 30-day default would **tie Kuha's free trial and lose to all three of their
paid tiers** (3 / 6 / 12 months). Retention would stop being a differentiator and become a weakness
against the one competitor that matters. It also adopts the exact mechanic we position against
(photoshare.ph's 30-day countdown, which starts at *event creation*).

**Against 5 years:** ₱197/event for a window the couple mostly cannot feel, and it drags in the
hardest compliance exposure — *"indefinite retention is itself a violation"*
(`Data_Retention_Schedule_2026-07-11.md` § 15).

**Six months matches Kuha ELITE's window starting at ₱500 — half their price, 3× their volume — and
beats photoshare.ph by 6× and EventPix by 12×.**

### 4.3 🔴 The blocker that applies to ANY bounded window

**No wholesale purge mechanism exists** `[VERIFIED-CODE]`:

- The only deletion path is `lib/papic-fullres-drop.ts` — **photos-only, single-object, full-res
  originals only**. It excludes clips entirely, refuses rows without a `display_r2_key`, refuses
  `sample/...` seed keys, and defers on Drive state.
- **Nothing cascades.** Zero foreign keys reference `papic_photos` across all 26 migrations that
  touch it. Downstream tables are polymorphic by design (`papic_live_wall.source_id`,
  `person_life_story_items.source_id`). A purge would leave dangling references app-wide.
- **The scheduler cannot deliver it.** `apps/web/vercel.json` is `"crons": []`; the sweep claims
  `WEEKLY_GAP_MS` at 500 rows/run (max 2,000) — on the order of **~1,000 objects/week fleet-wide**,
  against **15,000–100,000 objects from a single event** `[MODELLED from the shipped limits]`.

A 6-month deadline is **far more forgiving than a 30-day one** — twelve times the runway to work a
backlog, and raising the sweep to daily × 2,000 rows makes it viable at current scale (63 events).
But **the machinery still has to be built**, and a deletion deadline we advertise and miss is
materially worse legally than never having promised one.

### 4.4 The retention numbers still disagree across four documents

| Source | Says |
|---|---|
| `lib/papic-fullres-drop-core.ts` | full-res **90 days** |
| `NPC_Privacy_Compliance_Dossier_2026-07-12.md:170` | full-res **6 months**, compressed **"indefinitely"** |
| `Data_Retention_Schedule_2026-07-11.md` row 2 | media **5 years** |
| **This lock** | gallery **6 months**, full-res **90 days** |

**Settle to this lock and amend the filing to match, before one word of retention copy ships.**
Amending *downward* is the easy direction — storage limitation under RA 10173 favours shorter.

---

## § 5 — Preservation beyond 6 months

**Priced POST-EVENT, on what was actually collected.** Neither side guesses: the couple sees what
they have, we quote against real bytes rather than a modelled 4 MB.

**Default at month 6 is HANDOVER, not deletion.** Originals are pushed free and permanently to the
couple's own Google Drive. Nobody loses a photo; custody moves. That removes the hostage framing
(*"pay or your wedding photos are deleted"* — photoshare.ph's mechanic, aimed at a couple's wedding)
and it is also the DPO's stated fallback if paid retention is refused.

**Publish the rate upfront in bands** so the total is predictable before the count is known:

| Photos collected | Keep the gallery, 5 yr | Cost | Margin |
|---|---|---|---|
| up to 3,000 | ₱499 | ₱54 | 89% |
| up to 10,000 | ₱999 | ₱180 | 82% |
| up to 20,000 | ₱1,499 | ₱360 | 76% |

> ⚠ **Do NOT sell full-res hosting this way.** Full-res is 12× the bytes of the display copy, so
> margin collapses exactly where volume grows — 43% at 10,000 photos, 34% at 20,000. **Sell gallery
> hosting; give away originals via Drive.**

> ⚠ **Depends on a Drive handover that actually fires.** The drop sweep currently *defers* when Drive
> state is unreadable (PR #3420 — correct safety behaviour, but it means handover is not guaranteed).
> That path must be reliable before *"we'll push it to your Drive"* becomes a promise on a page.

---

## § 6 — The corrected cost basis

**🔴 The corpus cost model was wrong by ~3.5×, and two of its three largest terms are actually zero
or near-zero.** Read this before quoting any margin from the earlier verdicts.

| Component | Corpus modelled | **Actual** | Source |
|---|---|---|---|
| **Face vector** | ₱0.02/photo | **₱0** | **On-device.** `lib/face-embed.ts`: *"Browser-only ON-DEVICE face EMBEDDER… runs them on the guest's / friend's own phone — **no cloud face API, ₱0**. The face IMAGE never leaves the device; only the tiny 128-d descriptor moves on."* Models served from R2; **R2 egress is ₱0** `[VERIFIED-CODE]` |
| **Transcode + NSFW** | ₱0.11/capture | **~₱0.01** | **Self-hosted, not an API.** `lib/nsfw-screen.ts` runs nsfwjs (quantized MobileNetV2) on tfjs pure-JS CPU, model files committed to the repo and traced into the serverless bundle. Cost is Vercel function duration `[VERIFIED-CODE]` + `[ESTIMATED]` from GB-hour pricing |
| **Egress** | ₱0 | **₱0** | R2 `[MEASURED]` |
| **Storage** | ₱6.05/GB-yr blend | **₱11.49/GB-yr** | **Tiering is NOT built** — R2 standard, no IA/B2 tier |
| **Reconciliation** | ₱7.50/order | ₱7.50 | manual rail; **per ORDER, not per camera** |

**Resulting per-unit cost at a 6-month window:**

| | Cost |
|---|---|
| Photo (1 pt) | **₱0.023** |
| 10s clip (7 pts) | **₱0.165** → ₱0.0236/pt |
| **Blended** | **₱0.023/point — mix-independent** |

**Two consequences.** Margins across the whole ladder are **82–85%**, not the 54–58% the councils
designed around — so there is far more pricing room than assumed. And **the binding constraint was
never storage**; it was a modelled transcode figure that turned out to be self-hosted.

> 🔴 **The single biggest unlock in this plan is an environment variable, not a price.** Face-sorted
> delivery — the one capability no PH competitor has at any price — is **DORMANT**.
> `scripts/host-face-models.mjs`: *"the feature ships **DORMANT**… ⚠ Needs the weights + face-api.js
> hosted on R2 and `NEXT_PUBLIC_FACE_MODEL_URL` set (OWNER_ACTIONS)."* That is why prod shows **zero
> guest face enrolments, ever** `[MEASURED]`. Activation is one command:
> `pnpm host:face-models -- --activate`.

**Consumption assumptions behind the pools (all `[MODELLED]`, never measured):** ~30 captures per
active shooter; participation ~45% at 50 pax declining to ~30% at 300 pax; pools set at 4–5× modelled
typical so that <5% of events breach. **Captures per event is metric #2 in the corpus and has no
baseline.** The first 20 real events should be used to re-derive these.

**Professional shooters are NOT served by the per-camera tiers** `[ESTIMATED from photography
practice]`: a pro with a phone and a powerbank shoots **2,000–4,000 frames/day**, and battery is not
the constraint. Papic Max's 500 points is ~1.5 hours. The vendor on-the-day allocation (70 points) is
~10 minutes. See § 8 item 4.

---

## § 7 — Competitive position at these prices

All competitor figures `[MEASURED 2026-07-20]` from live pricing pages — **re-read before quoting in
public copy; no artifacts were archived.**

| | Price | Captures | Album life | Video | Face | Renders |
|---|---|---|---|---|---|---|
| EventPix.ph | ₱699 | unlimited | **15 days** | ✗ | ✗ | ✗ |
| photoshare.ph | ₱999 | unlimited | **30 days** ⚠ | ✗ | ✗ | ✗ |
| Kuha BASIC | ₱499 | 1,000 | 3 months | capped | ✗ | ✗ |
| Kuha ELITE | ₱999 | 3,000 | 6 months | capped | ✗ | ✗ |
| Kuha LUXXE | ₱1,999 | 5,000 | 12 months | capped | ✗ | ✗ |
| **Papic One** | **₱500** | **3,000** | **6 months** | **✓** | **✓** | **✓ free** |
| **Papic One** | **₱1,000** | **6,000** | **6 months** | **✓** | **✓** | **✓ free** |
| **Papic One** | **₱1,500** | **10,000** | **6 months** | **✓** | **✓** | **✓ free** |

⚠ photoshare.ph's 30-day clock **starts at EVENT CREATION, not the event date** — a host who sets up
two weeks early has burned half the window before a single photo exists.

**We out-spec Kuha at every matching price point**, which satisfies the § 0 ruling:
₱499 → 3× their volume · ₱999 → 2× · ₱1,500 → 2× LUXXE's volume for ₱500 less.

**Three category-level facts** `[MEASURED]`: **nobody in the Philippines does face recognition** at
any price · **nobody renders anything** — the deliverable is a ZIP · **everything expires.**

**Do NOT compete on cost-per-guest against the direct rivals — we lose that row.** At 150 guests:
photoshare ₱6.66/guest · Kuha ₱6.66 · EventPix ₱4.66 · **Papic ₱1,000 tier = ₱6.66** (parity at best).
The per-guest frame works against **adjacent spend**, where it is devastating: photo booth ₱37–90/guest
that most guests never queue for · photographer ₱330–1,000/guest who delivers to nobody but the couple
· catering ₱2,000–3,000/head.

**🚨 The threat pricing cannot answer** remains **Kuha.app's white-label Studios & Partners program**.
If they sign the top PH wedding photographers and coordinators, they become the distribution layer and
we never meet the couple. No price move recovers that. Still unchartered — owner decision #11 in
`Papic_Market_Response_Research_Handoff_2026-07-20.md`.

---

## § 8 — Still open

| # | Item | Owner |
|---|---|---|
| **1** | **The 10-second clip cap reverses a locked constraint** (`CLAUDE.md`: *"5-second hard cap… not configurable"*). Needs explicit sign-off **and** a reel-template check — some manifests assume ≤5s slots | owner + eng |
| **2** | **🔴 Paid preservation beyond 6 months is DPO-GATED and the ruling has not been requested.** Under RA 10173 storage limitation a retention period is bound to a *declared purpose* — it is not a dial a customer buys upward. **Ask before building.** If refused, § 5 repositions as Drive sync/export | **DPO** |
| **3** | **Purge machinery for the 6-month window** — doesn't exist, nothing cascades, scheduler can't run it at volume (§ 4.3) | eng |
| **4** | **Papic Pro rung** — 3,000 pts/camera·day at ₱999 for professional shooters. Also fixes the vendor on-the-day tier, where 70 points is a fake door for a pro | owner |
| **5** | **Per-seat floor on the free tier** so one shooter can't burn all 50 shared points (§ 2.1) | eng |
| **6** | **Bundle `Custom QR per Guest` ₱1,499 into Mode A**, or make it a prerequisite purchase (§ 3) | owner |
| **7** | **Charm vs round — RESOLVED toward ROUND (owner 2026-07-20).** Mini/Max set to **₱100/₱200**, matching the owner's 2026-07-17 round re-basing across the catalog (which explicitly moved Monogram Pro ₱999 → ₱1,000). The older 2026-05-12 charm convention does not govern here. **RESOLVED** — the whole ladder is round (₱500/₱1,000/₱1,500, Mini ₱100/Max ₱200). No odd figures remain. | — |
| **8** | **Clip compression.** Specced 2026-07-17, never built. It is the highest-leverage build item: it makes any longer retention affordable and restores a 5-point clip rate | eng |
| **9** | **PR #3422 is OPEN and builds the ₱50 Ltd rung** — which this lock does not carry. Close it, but **extract its money-safety fix first** (both enforcement seams gated the paid check on an allow-list, so a `mini`/`ltd` seat could have shot before payment; it replaces that with `isPaidCameraTier()`, a deny-list) | eng |
| **10** | **Owner DB action still pending:** the live pricing page shows **two SKUs both titled "Papic Ltd"** at ₱30 and ₱50 (`PAPIC_CAMERA_ROLL_DAY` was never retitled) | owner |

---

## § 9 — What must be true before any of this reaches a public surface

1. **`PAPIC_GUEST` is `is_active=false` in prod** `[MEASURED]` — the flat pass cannot currently be
   bought at any price. One DB write unblocks it (plus killing the pax curve).
2. **The doorway card ships `status:'coming_soon'`** (`add-ons-catalog.ts:620`, PR #3423) and renders
   as a dead div. Flip to `'live'` **only in the same PR that wires `papicGuestPassAccess()`** — the
   predicate currently has **zero production callers**.
3. **Face-sort is dormant.** Set `NEXT_PUBLIC_FACE_MODEL_URL`. No campaign may lead with face-sorted
   delivery until at least one end-to-end match is observed on a real event.
4. **Free-camera provisioning has never fired.** No "three cameras free" claim until it does.
5. **Banned permanence copy is live on public surfaces** — `app/page.tsx:40,41,58`,
   `HomeReskin.tsx:602`, `[slug]/page.tsx:4178,4226` ship *"kept forever" / "Saved Forever — photos
   kept permanently" / "keep it for life"* `[VERIFIED-CODE]`. **These must come down regardless of
   pricing** — they contradict the filed schedule and the 6-month lock.
6. **`lib/papic-copy-guardrails.test.ts` fails CI** if any public surface states a literal capacity
   count. Capacity must be phrased as a **rate**, never a bundle:

   > **₱500 — 3,000 shots.** A photo is 1. A 10-second video is 7.
   > *About 3,000 photos, or 428 videos, or any mix.*

   *"3,000 photos + 100 videos"* is **unkeepable by construction** (one shared purse) and will not
   deploy.

---

*Compiled 2026-07-20 from an owner working session. Ladder owner-decided; § 8 items open. Cost basis
corrected against `origin/main` @ `412913de2` and live prod the same day. Every peso projection rests
on an event base that has produced **five Papic orders in total** — 63 events, `PAPIC_GUEST` ×1,
`PAPIC_SEATS` ×2, `PAPIC_CAMERA_*` **zero** `[MEASURED]`.*

---

## § 10 — Purchase flow, upgrades and payment rails (added 2026-07-20, later in session)

### 10.1 The order template

Six steps. Only 2–4 are the purchase; 1 and 5 are configuration collected at the same time.

| # | Step | Notes |
|---|---|---|
| **1** | **Your look** — the five photo themes | **ALREADY SHIPPED** (§ 10.4). Opens the flow deliberately: a free creative choice with no money attached gets a couple invested before the price appears |
| **2** | **How guests join** — Mode A (a QR each + face) / Mode B (one shared QR) | the § 3 decision |
| **3** | **Guests** | sizes the pool; **never a limit** |
| **4** | **How many shots** — the 3 tiers + the gated top-up | |
| **5** | **Where your originals go** — connect Google Drive | **skippable** with a day-60 reminder; blocking checkout on an OAuth grant would cost more sales than it saves photos |
| — | **Summary** | must show the per-guest arithmetic — see below |

**🔴 BUILD: show the arithmetic at the point of purchase.** *"You have 200 guests. This tier gives
each about 15 photos. The ₱1,500 tier gives each about 50."* It prevents the bad-experience case
(pool empty in the first hour, wall dark mid-reception, **and no way to top up in time**) without
gating anyone from deliberately under-buying.

### 10.2 The top-up gate

**+10,000 / ₱1,500 unlocks at ≥10,000 POINTS HELD** — not "purchased the ₱1,500 SKU."

Owner rule was *"only after they purchase ₱1,500, not ₱1,000 and ₱500."* Stated as a **points-held**
threshold rather than a SKU check because tiers stack: a couple could hold 9,000 points
(₱500 + ₱1,000) having never bought the top SKU. Points-held is mechanical and has no edge cases.

### 10.3 Upgrades

**Additive purchases, NOT delta-billing.** ₱500 → ₱1,000 means buying again and stacking points, not
paying a ₱500 difference. On an apply-then-pay rail where an admin manually marks each order paid,
additive keeps every order clean and independent — delta-billing would need credit tracking against
prior orders.

**The cost of laddering up is exactly the volume discount forfeited:**

| Path | Paid | Points |
|---|---|---|
| ₱500 → then ₱1,000 | ₱1,500 | **9,000** |
| ₱1,500 direct | ₱1,500 | **10,000** |

A consistent 1,000-point gap. Say it plainly: *buy the size you need and get the better rate.*

**Free → paid:** any time; the 50 free points fold into the purchased pool (one purse).

**📅 THE SERVICE WINDOW — owner-locked 2026-07-21: `event − 120 days` → `event + 60 days` (180 days).**

| | |
|---|---|
| Opens | **120 days before** the event — covers virtually every PH pre-nup (typically 2–6 months out), the bridal shower and the despedida |
| Closes | **60 days after** the event — full-res originals held to here |
| Total | **180 days**, fixed, **regardless of when they buy** |
| Requirement | **an exact event date is mandatory to purchase** — everything anchors to it |

**Why bounded at all.** Full-res is held to `event + 60d`, so an unbounded front made storage a
function of engagement length: a 2-year plan modelled at **₱248** against a 3-month plan's ₱55
`[MODELLED]`, on a ₱500 sale. A fixed window makes the worst case **₱54 and predictable** — you can
price against a known number instead of a distribution. **That predictability is worth more than the
₱194.**

**Why 120/60 and not 90/90 or 180/30.** Cost across the whole range is only ~₱19 apart, so the split
is a customer decision, not an economic one:
- **The front is the CAPTURE window** — 120 days covers the pre-nup, which is the single most likely
  early shoot anyone buys this for. 90 days cuts it in half.
- **The back is the SAFETY window** — time to secure originals. **30 days was rejected**: weeks 1–2
  are the honeymoon and 3–4 are the exhausted return, so a day-30 drop lands in the least reachable
  month of a couple's life. It also reads uncomfortably like the 30-day clock we attack
  photoshare.ph for. 60 days clears it.

**Buying earlier than 120 days out is allowed** — the service simply activates on schedule. The card
must state both real dates, computed from their event: *"Your cameras open on 12 March and stay open
until 10 September."* Two dates, nothing to configure.

**⏱ WHEN THE SERVICE STARTS — the rule and the copy (owner-locked 2026-07-21).**

> **Starts at `max(payment confirmed, event − 120 days)` · Ends at `event + 60 days`.**

Two gates, and **the later one wins**. Both dates are **DERIVED — nothing is stored.**

**The message forks on how far out the event is:**

| Days until event | Copy |
|---|---|
| **≤ 120** | *"Your cameras open **as soon as we confirm your payment — usually within 24 hours** — and close on **10 September 2026**."* |
| **> 120** | *"Your cameras open on **12 March 2026** and close on **10 September 2026**."* |

⚠ **Never write "available upon purchase."** Payment takes **up to 24 hours** on the manual rail
(`admin/payments/actions.ts:207` is the only writer of `'paid'`), so "upon purchase" implies an
instant that does not exist — and the couple who buys at 11pm expecting to shoot at breakfast was
misled by us. **Always name the 24-hour confirmation in the ≤120 case.**

⚠ **Always show REAL DATES, never relative ones.** *"Opens in 45 days"* ages badly on a page a couple
revisits weekly. And **always state the close date** — it is the one nobody thinks to ask about until
it matters.

**THREE STATES the UI must carry:**

| State | Guest sees | Couple sees |
|---|---|---|
| **Before** | *"Cameras open 12 March"* — **a message, never an error** | the date + a countdown |
| **Open** | the camera | shots remaining |
| **Closed** | *"Cameras have closed — here's the gallery"* | link to the gallery |

**The BEFORE state matters more than it looks.** In Mode A the per-guest QRs are **printed and
distributed with the invitations** — months ahead. Guests **will** scan early, and they must get a
friendly "not yet," never a 404 or a dead screen.

✅ **Half of this already ships.** The SEAT rail enforces exactly this window with the right error
codes — **`capture_not_started`** and **`capture_window_closed`** (`app/papic/actions.ts:288`), driven
by `valid_from`/`valid_until` and **failing OPEN when bounds are absent** so legacy seats never break.
**The GUEST rail has no window at all** — so this is not new machinery, it is giving `/papic/guest`
the window the seats already have, plus the two friendly states.

⚠ **Edge to decide deliberately:** payment confirmed **AFTER** the event (someone pays the day before,
the admin confirms the morning after). Under `max(confirmed, event−120d)` the service opens
post-event and still runs to `event + 60d`. That is probably correct — guests can still upload what
they already shot — but it should be a decision, not a discovery.

**⚠ This narrows the window differentiator but does NOT lose it.** Upload windows `[MEASURED]`:
photoshare.ph **event day only** · EventPix **5 days** · Kuha **3/30/60/100 days** by tier · **Papic
180 days** — still ~2× Kuha's best tier and 36× photoshare, at half their price. The marketing line
moves from *"the whole engagement"* to ***"months before, months after"*** — narrower, but it
survives contact with the storage math, which the open-ended version did not.

**⏳ THE PASS RUNS UNTIL THE POINTS ARE DEPLETED — NOT until a date passes (owner-locked 2026-07-21).**

A `service_date` column and a date-aware gate were **built and removed before merge** (PR #3430).
Keep this reasoning, because the absence will read as an omission later:

- **Points are already the bound.** The fail-closed pool RPC refuses at zero, so a date gate is a
  second fence around something already fenced. The exposure that motivated dates — *"the pass never
  closes"* — is **bounded by construction anyway**: N unused points is at most N more captures,
  whenever they happen. Time was never what contained it.
- **It is the only model that survives a MULTI-DAY event.** `travel` is `multi_day = TRUE` by
  definition, and a ten-day trip must not need ten purchases. Per-day scoping breaks there; points
  do not.
- **It matches the rest of this lock** — purchased buckets, N shots for N shots. Days were the one
  place that model did not hold.

**Multi-date events need nothing further.** Several purchases stack into one pool, and every capture
from every date already lands in **ONE ALBUM** — photos key to `event_id`, never to a purchase. That
half required no work at all.

⚠ If the pass ever *does* need to close, tie it to the **retention window** (it shuts when the gallery
does), **never** a per-day picker.

🔴 **A bug this exposed, now fixed (PR #3430):** `eventPapicGuestActive()` checked only `PAPIC_GUEST`,
so a couple buying the **6,000- or 10,000-shot rung would have been granted points and gotten NO
CAMERAS**. The gate now covers all four rungs via `PAPIC_PASS_SERVICE_KEYS`.

**🔒 NO DOWNGRADE — owner-locked 2026-07-21.** Upgrades yes; downgrades never. This is **enforced by
construction, not by a rule**: tiers are additive grants in an **append-only ledger**
(`papic_event_point_grants`), so a couple can only ever *add* points — there is no operation that
swaps a bucket for a smaller one, and spent points cannot be un-spent.

**The one reversal that must work is a refunded / un-approved order**, and it was a genuine hole:
`deactivateOrderSku` early-returned for every SKU except `SETNAYAN_AI`, so a reversed Papic One
order would have **kept its points** — buy → granted → refund → keep the pool. Closed by
`reversePapicPassPoints` (PR #3426), which deletes grants by `order_id` and ledgers
`order_refunded` with `points_revoked`.

⚠ If the couple already spent more than the remaining grants cover, the pool's remaining goes
**non-positive and the fail-closed gate stops capture.** That is the correct outcome for a reversed
order — do not "fix" it by clamping.

**⚠ Mode B → Mode A has a PHYSICAL deadline, not just a payment one.** It needs a guest list,
generated per-guest codes, and printing/distribution — so it must happen **before invitations go
out**, not merely before the event. Surface it separately: *"Switching to a QR each? Do it before
your invitations go out."*

**⛔ NO upgrade is instant.** Every one is a new order landing `pending_approval`, and
`app/admin/payments/actions.ts:207` is still **the only writer of `'paid'` anywhere in the app**
`[VERIFIED-CODE]`. Upgrade during planning ✅ · a week out ✅ · **at the reception ❌**.

### 10.4 The photo theme is ALREADY BUILT — do not re-implement

`[VERIFIED-CODE]` — this is the **third** capability this session found shipped-but-unmerchandised.

| | |
|---|---|
| `lib/papic-photo-styles.ts` | five looks — **ORIG · RETRO · MONO · CINE · LOMO** — real per-pixel pipelines (tone curves, channel WB, split-toning, grain, bloom, chromatic aberration, vignette). Runs **on device**; nothing renders server-side ⇒ **₱0** |
| `events.papic_style` | migration `20270307004141` — *"event-wide capture look"*, CHECK on the five codes |
| `studio/papic/style-picker.tsx` | the couple's picker |
| Wired into | guest capture · seat capture · the public event page · Kwento decorator · the demo flow |
| Analytics | style is already a rolled-up dimension in Demand Radar |

**The only gap is placement** — it lives in the Papic studio (post-purchase) rather than in the setup
flow where a couple would discover it.

**🔒 TWO CONSTRAINTS THAT MUST NOT BREAK when moving it earlier:**

1. **Faces embed from the CLEAN frame, BEFORE styling.** The module is explicit: MONO crushes colour,
   LOMO shifts channels, CINE re-tones — all of which wreck face-api's 128-d descriptors and would
   **silently** tank the ≥0.85 auto-tag. Order is `draw clean → embed → applyPapicStyle → encode`.
2. **CINE letterboxes, never crops** — it paints 2.39:1 bars so frame size and every face box are
   unchanged, preserving the untagged-still-delivered and mixed-aspect gallery guarantees.

**⚠ KNOWN LIMITATION, and it grows with 10-second clips:** *"V1 has no video render pipeline, so clip
BODIES stay un-styled; the clip POSTER frame is styled so the gallery thumbnail matches."* A themed
event therefore produces **styled photos and unstyled video** — thumbnail matches, playback doesn't.
Tolerable at 5 incidental seconds; a couple who picked MONO **will** notice their 10-second clips are
in colour. Log it before "set your theme" is merchandised.

### 10.5 Payment rails

**🔴 CORRECTION: the automated gateway is BUILT and DORMANT — not absent.** Earlier drafts of this
document (and both council verdicts) state *"there is no payment gateway on the couple path."* That
is wrong as stated. `app/api/v1/billing/initialize-maya/route.ts` `[VERIFIED-CODE]`:

| Branch | When | Behaviour |
|---|---|---|
| **A** — `MANUAL_QR_OVERLAY` | default | 100% retail total → `manual_payment_logs` row + reference number → **admin reconciles** |
| **B** — `AUTOMATED_MAYA_API` | `NEXT_PUBLIC_MAYA_STATUS === 'APPROVED'` | forwards line items to the Maya checkout API, returns a redirect |

Auth is *"cookie session (event member of `event_id`)"* — **this is the couple path.** This is the
**fourth** capability found built-and-switched-off this session.

**⚠ BUT THERE IS A MISSING LINK.** `admin/payments/actions.ts:207` remains the **only** writer of
`status: 'paid'` anywhere. Nothing flips an order on payment confirmation. So Branch B would *start*
a Maya checkout and still leave the order `pending_approval`. **Activating Maya is necessary but NOT
sufficient.**

**Mid-event top-up therefore needs two things:**

| | Effort |
|---|---|
| Maya merchant KYC + `NEXT_PUBLIC_MAYA_STATUS=APPROVED` + redeploy | **a form and a wait — zero engineering** |
| A webhook writing `'paid'` on confirmed Maya payment | **small build** — `api/webhooks/token-purchase/route.ts` is a working template |

**Instant activation is GATEWAY-ONLY by construction.** Manual GCash/BDO transfers have no callback —
a human must match a deposit to a reference code. **So the mid-event top-up button must not render
when the only available rail is manual.** You cannot offer "top up now" that sometimes takes 24 hours.

**Design note:** let the **coordinator** top up, not the couple. The role already exists with host
access; a couple fumbling a checkout on their phone mid-reception is the worst possible moment.

**⚠ THE FEE INVERSION — the gateway is NOT uniformly cheaper.** `setnayan_pay_methods` carries
**1.5% / 2.0% / 2.5%** per rail against a flat **₱7.50** manual reconciliation:

| Order | Manual | Gateway @2.5% | Cheaper |
|---|---|---|---|
| ₱100 (Mini) | ₱7.50 | **₱2.50** | gateway |
| ₱200 (Max) | ₱7.50 | **₱5.00** | gateway |
| **~₱300** | ₱7.50 | ₱7.50 | crossover |
| ₱500 | **₱7.50** | ₱12.50 | manual |
| ₱1,500 | **₱7.50** | ₱37.50 | manual |

**Crossover ~₱300–500.** So automating does **not** save money on the main ladder — it costs ~2 margin
points at the top tier. Its genuine wins are **instant activation**, **no 24-hour anxiety**, and
**making sub-₱150 SKUs viable again** (reviving the case the ₱150 floor argument killed).

**⇒ Rail selection, not one rail:** gateway for **small** orders and **time-critical** ones; manual
for **large pre-event** ones.

**💰 ABSORB THE FEE — one price everywhere.** ₱1,500 on the pricing page means ₱1,500 at checkout,
whatever rail they pick. Reasons: it is only **2–3 margin points** at 82–85% margins; a surcharge
would **reverse the owner lock of 2026-06-07** (*"No Setnayan Pay convenience fee… there is no
customer-side convenience fee"* — 3% drafted, repriced to 5%, **both RETIRED to 0%**) and the route
itself hard-locks the opposite direction (*"hard-locked 100% retail · `discount_applied: false`
always emitted · all cash discounts are completely deprecated"*); **PH card-surcharging rules would
need counsel sign-off**; and a price that moves at the last step reads as bait-and-switch.

> ⚠ **If the owner does want the processing cost recovered**, the distinction to record explicitly is
> that the retired fee governed **vendor bookings** (a cut of someone else's transaction), whereas
> this would be **processing pass-through on our own SKU**. Those are arguably different things — but
> it must be stated, not assumed, and counsel must clear the surcharge first.

**Revisit trigger:** instrument **rail split by ticket size** once both rails are live. If couples
overwhelmingly choose the gateway for ₱1,500 orders, we are absorbing ₱37.50 on most sales and the
decision is worth re-opening on a measured number rather than a guess.

**⚠ `₱7.50` is `[MODELLED]`** — from the Plan of Action's cost basis; nobody has timed an actual
reconciliation. It is the number that decides whether cheap SKUs can exist at all, so measure it once
there is volume.

---

## § 11 — How the tiers meter (resolved against SHIPPED code, 2026-07-20 late)

**Owner-confirmed model: the tiers are FIXED POINT BUCKETS. You buy N points; you get N points,
however many guests turn up.**

### 11.1 The apparent conflict, and why it dissolves

PR **#3424** (`b46e67218`) shipped an **event-scoped capture fence** four hours before this session's
ladder was designed, and its numbers look incompatible with ours:

| | Shipped `papic_event_pool_config` `[MEASURED prod]` | This lock |
|---|---|---|
| Points per guest | **150** | ~60 (guidance) |
| Floor | **5,000** | entry tier is 3,000 |
| Ceiling | 30,000 | 10,000 + uncapped top-ups |
| Model | pool **auto-derived** from guest count | **purchased** buckets |

**They are not competing — they govern different products.** The live config's
`pass_service_codes` is **`["PAPIC_UNLOCK", "PAPIC_UNLOCK_LTD"]`** `[MEASURED]` — the ₱15,000 and
₱9,000 **unlimited bundles**. The fence exists to bound products that *promise unlimited*. It does
**not** reference `PAPIC_GUEST` and must not be pointed at the tiers.

**Papic One tiers are self-bounding by construction** — 3,000 points is 3,000 points — so they need
no fence at all.

> ⚠ **Do NOT add the tier SKUs to `pass_service_codes`.** Doing so would layer the
> `clamp(guests × 150, 5000, 30000)` formula on top of a purchased bucket and silently grant a
> ₱500 buyer up to 30,000 points. The config is a **single global `default` row** — there is no
> per-SKU formula — so this is not tunable around.

### 11.2 The mechanism that already exists

`papic_event_point_grants` (per event, `points INTEGER`) ships in the same migration, and the pool
resolves as:

> `total = clamp(guests × per_guest, floor, ceiling) + granted top-ups`

**⇒ A purchased tier lands as a GRANT.** ₱500 paid → a 3,000-point grant on that event. Top-ups are
additional grants, which is why "uncapped and repeatable" needs no new machinery.

**Open implementation question (small):** for a tier-purchased event, `base_points` must resolve to
**zero**, not to the formula and not to "unlimited" (today non-pass events read back unlimited). The
grant must be the *whole* pool, not a bonus on top of one.

### 11.3 🔴 The correction this forced — my margin math was wrong

Earlier sections of this document computed cost **as if the pool were fully consumed**. It is not —
**the pool is a fence for the tail, not a forecast.** Modelled typical consumption at 100 pax is
~1,200 captures, not 6,000:

| | Cost | Margin @ ₱1,000 |
|---|---|---|
| Earlier figure (full pool) | ₱146 | 85% |
| **Typical consumption** | **~₱28** | **~97%** |

**Consequence: a generous pool costs almost nothing, because almost nobody reaches it.** The margin
tables in §2.3 are therefore a **floor**, not an estimate — real margins run far higher. This also
means capacity was never the lever it appeared to be, and the shipped 150/guest model is both more
generous *and* roughly as profitable as ours. **Do not tighten capacity to protect margin; there is
nothing to protect.**

### 11.4 The edge case the checkout MUST catch

Pax is guidance, never a gate — a 500-guest couple may buy the ₱500 tier. What that means:

| 500 pax on 3,000 points | |
|---|---|
| Per guest | **6 points** |
| Photos each | **6** |
| Videos each | **ZERO** — one clip costs 7 pts, more than a guest's entire share |

**At 500 pax on the entry tier no guest can take a single video.** They tap record, get refused, and
**cannot top up in time** (pre-event only). Allowed — but the arithmetic must be loud:

> *500 guests on this tier is about **6 photos each**, and not enough for anyone to take a video.
> The ₱1,500 tier gives about 20 photos each.*

### 11.5 PR-1 scope, as authorised

**In:** three tier SKUs in `platform_retail_catalog_v2`; retire the pax curve on `PAPIC_GUEST`
(`is_pax_priced=false`, clear the four `pax_*` columns); grant-on-payment wiring so a paid tier
writes its points to `papic_event_point_grants`; `base_points = 0` for tier-purchased events.

**OUT — each blocked or deliberately deferred:** retention (no purge machinery · mid-flight NPC
filing) · clip 3→7 pts and the 10s cap (**code constant on the FAIL-CLOSED capture path — ships
ALONE** · reverses a `CLAUDE.md` lock · needs the reel-template check) · the free tier's per-seat
floor (capture path) · Mini/Max/Pro (per §2.2, **retained** — owner confirmed "the plan as designed")
· the doorway flip from `coming_soon` (PR-2, together with wiring `papicGuestPassAccess()`, which
still has **zero production callers**).

**Prod facts verified before writing** `[MEASURED 2026-07-20]`: prices are plain PHP `numeric` (NOT
centavos) · `PAPIC_GUEST` is `is_active=false`, pax-priced floor 100 @ ₱2,999 +₱350/50 pax ·
`PAPIC_SEATS` also `is_active=false` · **PR #3422 has since MERGED** (`389186a0a`), so the Mini/Ltd
rungs are real in code · the duplicate title is confirmed live — `PAPIC_CAMERA_ROLL_DAY` (₱30) and
`PAPIC_CAMERA_LTD_DAY` (₱50) **both read "Papic Ltd"**.
