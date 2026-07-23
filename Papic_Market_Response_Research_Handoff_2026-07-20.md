# Papic Market-Response Research — Consolidated Handoff (2026-07-20)

> **What this is.** The complete research output of one working session on 2026-07-20, written to be **self-contained**: a fresh session can act on this without reading anything else. It consolidates two council verdicts, a competitor recon that was never written down, an impact analysis of the owner's "Papic Quick" proposal, the five code changes that shipped/were opened the same day, and one **live production query that supersedes assumptions in both verdicts**.
>
> **Evidence discipline used throughout.** Every number carries a tag:
> - **[MEASURED]** — read from live production or from `origin/main` on 2026-07-20.
> - **[MODELLED]** — an assumption, a projection, or an arithmetic construction. **Never a measurement.** Every peso of projected revenue in this document is MODELLED.
> - **[VERIFIED-CODE]** — read directly out of `origin/main` at the commit cited.
> - **[UNVERIFIED]** — asserted by a source and not confirmed.
>
> **Repo state at time of writing:** `origin/main` @ `5b72d625d` (merge of PR #3421). The repo checkout at `~/Documents/Claude/Projects/setnayan-platform` is **read-only** for corpus sessions — inspect with `git show origin/main:<path>`.

---

## § 1 — Executive summary

**The commercial situation changed twice on 2026-07-20, and the second change is bigger than the first.**

**First change (the councils):** a PH competitor, **photoshare.ph**, sells a QR-based guest-photo product at **₱999 flat per event** [MEASURED — their live pricing page, owner screenshots]. Two councils concluded that Setnayan is **not losing a price fight — it is losing a SHAPE fight**, and that the winning shape is **already built and shipped** in our own repo: `/api/papic/guest-capture` already gives every RSVP'd guest a browser camera (no app, QR-entered, photos **and** ≤5s clips, NSFW-screened, live-wall-ingesting, Drive-copying) [VERIFIED-CODE]. It is merchandised behind `PAPIC_GUEST`, whose live price is not a flat number at all but a **rising pax curve**: 100 pax → ₱2,999 · 300 → ₱4,399 · 500 → ₱5,799 [VERIFIED-CODE `lib/v2-catalog.ts:453-459`]. **We get more expensive exactly where they stay flat.** That is a *slope* defect, not a *level* defect.

**Second change (the prod query) — and this is the one that matters commercially:**

| Live production, queried 2026-07-20 | Value |
|---|---|
| Total events | **63** (62 weddings) |
| Upcoming events | **6** |
| Total orders | **32** |
| Paid orders | **27** |
| `PAPIC_GUEST` orders, all time | **1** (2026-06-08) |
| `PAPIC_SEATS` orders, all time | **2** |
| `PAPIC_ADDON_STORIES` | **1** |
| `PAPIC_ADDON_THANK_YOU` | **1** |
| **`PAPIC_CAMERA_*` orders, all time** | **ZERO** |

All [MEASURED].

**What that fact does to the plan:**

1. **Setnayan is PRE-REVENUE on Papic.** There is no attach rate to protect. The proposed ₱2,999 → ₱1,499 reprice and the removal of the pax curve **cost nothing measurable**. The Access verdict's § 9 item 5 — *"run the prod query before the reprice UPDATE lands; this is the only hard data gate in the plan"* — **has now been run, and it PASSES.** The reprice is unblocked on commercial grounds. (It remains blocked on the § 7 copy/compliance gates, which are different gates.)
2. **There are ZERO camera-ladder buyers.** So the `roll` → `mini` rename, the ₱30-row retitle, any capacity change, and any rung deactivation need **NO grandfathering clause**. Do not write one. (The `roll` **tier code** must still never be deleted — it is the legacy identifier the schema CHECK and the seat rows use — but that is a schema-hygiene rule, not a customer-protection rule.)
3. **Every revenue projection in both verdicts is a MODEL.** "₱66/wedding today," "₱1,099/wedding after," "16× lift," "₱1.10M/yr at 1,000 weddings," every attach percentage, and the entire cost basis (₱/GB, ₱/face-vector, ₱/render) are **[MODELLED] on an event base that has produced five Papic orders in total.** They are decision aids, not measurements. Label them as such wherever they are repeated. The councils themselves flagged this — Monetization § 11 risk 1: *"there is literally zero Papic revenue history."* The query confirms it precisely.

**The three commercial moves that survived both councils** (unchanged by the prod finding, and now cheaper to make):

- **Kill the pax curve; sell one flat number.** `PAPIC_GUEST` becomes **Papic Buong Araw ₱1,499 per event-day**, on the already-shipped rail. −50% at 100 pax, **−66% at 300**, **−74% at 500** [MEASURED against the verified curve].
- **Keep the render menu PAID.** Refuse the 2026-07-17 spec-only recut that would have made Kwento/Pabati/Guest Stories free with the tiers. It was never migrated; the shipped catalog already prices all five as paid. **₱3,598 of live list price retained rather than given away** [VERIFIED-CODE].
- **Own the ₱0 rung.** Free = 3 cameras × 20 points, shipped [VERIFIED-CODE, PR #3407]. **Neither photoshare.ph nor EventPix.ph has a free tier or a trial** [MEASURED from their pricing pages]. Our cheapest paid rung is **₱30/camera/day** — an order of magnitude under either competitor's floor.

**The one thing no price move fixes:** **Kuha.app** — PH-based, wedding-first, selling our adjacency (QR gallery + digital invitations + RSVP + guestbook + reception slideshow) with a **white-label Studios & Partners program**. If Kuha signs the PH wedding photographers and coordinators, we lose the **distribution layer**, and pricing is irrelevant to that outcome. See § 2.4.

---

## § 2 — The competitive picture

### 2.1 photoshare.ph — verified facts

Source: their live pricing page, homepage, FAQ, Privacy Policy and Terms, read 2026-07-20.

| Attribute | Value | Tag |
|---|---|---|
| Price | **₱999 flat per event** | [MEASURED] |
| Guest uploads | Unlimited | [MEASURED] |
| Guest count | Unlimited | [MEASURED] |
| Storage window | **30 days cloud storage** (headline) | [MEASURED] |
| Upload window | **Event day only** | [MEASURED] |
| Host download | **Full-resolution** | [MEASURED] |
| Live photo wall | Yes — real-time, projectable | [MEASURED] |
| Access | QR code, browser, **no app download** | [MEASURED] |
| Access controls | Yes | [MEASURED] |
| **Free tier** | **NONE** | [MEASURED] |
| **Free trial** | **NONE** | [MEASURED] |
| Guest-side cost | **₱0** | [MEASURED] |
| Founded | **2024**, Metro Manila | [MEASURED — their own copy] |
| Registered entity | **None named anywhere on the site** | [MEASURED — absence] |
| Contact | **A mobile number and a Facebook page.** No corporate address, no registered business name | [MEASURED] |

**The retention clock detail that matters:** their 30-day window **starts at EVENT CREATION, not at the event date** [MEASURED — their own FAQ/terms]. A host who sets up two weeks early has burned half the window before a single photo exists. This is a real, demonstrable customer harm and it is the most defensible thing in our compare row.

### 2.2 Four self-contradictions inside their own primary sources

These are not our characterizations — each is a conflict between two of **their** published documents. All [MEASURED].

| # | Claim A | Claim B (contradicts A) |
|---|---|---|
| 1 | Homepage/pricing headline: **"30 days cloud storage"** | **Privacy Policy § 7**: photos are kept **until the host deletes them** |
| 2 | Marketing: **"never compress"** your photos | Terms/FAQ: **automatic compression** is applied |
| 3 | FAQ: **no pre-approval** of guest photos | Their **wedding page sells moderation** as a feature |
| 4 | Marketing: **"no subscriptions"** | **Terms § 7.2**: **auto-renew** |

**How to use this — and how NOT to use it.** Do **not** put "our competitor contradicts itself" in customer-facing copy; it reads as insecurity and invites the same audit of us. Use it two ways instead: (a) **internally**, as evidence that their 30-day figure is a **cost-control constraint dressed as a feature**, not a considered retention policy — which is exactly why we should not copy it (see § 5); (b) **structurally**, in the compare row, by stating only what *we* do in terms we can defend: **"5 years,"** because that is what is filed with the NPC. Their documents will do the rest of the work for any host who reads them.

### 2.3 EventPix.ph — the actual local floor

**₱699** budget tier [MEASURED]. Higher tier ~₱1,299 [MEASURED].

**Strategic read:** the local floor is **₱699, not ₱999** — photoshare.ph is *already being undercut by 30%*. **Anchoring our strategy on ₱999 anchors on a price that is losing.** Any instinct to "match ₱999" is matching the wrong number in a race we should not enter: the low end is where a two-person outfit with no registered entity and no BIR exposure structurally always wins, and where we have a live NPC filing to protect. Our answer to ₱699 is **₱0 (3 free cameras)** and **₱30/camera/day** — both shipped, both an order of magnitude cheaper, and neither competitor has any equivalent.

### 2.4 Kuha.app — the real threat

| Attribute | Value | Tag |
|---|---|---|
| Origin | Philippines | [MEASURED] |
| Positioning | **Wedding-first** — same primary segment as our V1 | [MEASURED] |
| Product surface | QR photo gallery **+ digital invitations + RSVP + guestbook + reception slideshow** | [MEASURED — tier names] |
| **Studios & Partners program** | **WHITE-LABEL** — photographers/studios resell it under their own brand | [MEASURED] |
| Peso prices | **Not publicly extractable** | [UNVERIFIED — treat tier names as verified, prices as unknown] |

**Why this is the threat and the other two are not.** photoshare.ph and EventPix sell a *feature* (a QR gallery) and compete on price — a fight we win on shape. **Kuha sells our adjacency**: gallery + invitations + RSVP + guestbook + slideshow is four of the surfaces Setnayan treats as its own integrated moat. And the white-label partner program attacks the one layer price cannot defend: **if the top PH wedding photographers and coordinators put Kuha's product in front of couples under their own brand, they become the distribution channel, and we never meet the couple at all.** No price move recovers a lost distribution layer.

**Consequence for planning:** Kuha belongs in the kill-criteria set (§ 10) and, arguably, in a *partner-strategy* workstream that neither council chartered. Nobody has written that plan.

### 2.5 The compare row that does the work

Approved framing from both verdicts (see § 9 for the copy that is **blocked** until the retention filing is reconciled):

| | photoshare.ph ₱999 | Papic Buong Araw ₱1,499 |
|---|---|---|
| Photos kept | 30 days | **5 years** |
| Uploads | Event day only | **Event day — plus your designated cameras, any day** |
| Video | — | **5-second clips** |
| Finding your photos | Scroll the whole album | **Face-sorted and delivered to each guest** |
| Your own reel | — | **Personal reel, template-rendered, free** |
| Where it lives | A link | **Your own Setnayan event site, beside your guest list, seating and vendors** |
| Full-res download | Included | **Included** |
| App download | None | **None** |
| **Free tier** | **None** | **3 cameras, ₱0** |

---

## § 3 — What we already have that answers it

**This is the central finding of the whole session: the product that beats a ₱999 QR-gallery competitor is already merged, already screened, and already wired. It is a merchandising problem, not a build problem.** All [VERIFIED-CODE] at `origin/main` `5b72d625d`.

| Capability | Where it lives | State |
|---|---|---|
| **Guest browser camera, no app** | `/api/papic/guest-capture` — guest-session identity, credit-pool RPC, **photos AND ≤5s clips**, `screenCapture`, `ingestToWall`, `enqueueDriveCopy` | **SHIPPED** |
| **Fail-closed capture-points ledger** | `papic_reserve_camera_points` / `papic_camera_points_remaining`; 409 `camera_points_exhausted` at **both** seams (`app/api/upload/route.ts:403`, `app/papic/actions.ts:347`) | **SHIPPED** — PR #3407 |
| **Free tier: 3 cameras × 20 pts** | `PAPIC_FREE_CAMERA_COUNT`; seats provisioned at fixed indexes 100–102 | **SHIPPED** — PR #3407 |
| **Per-event quality/fidelity tier** | `events.papic_quality_tier` (`full_res \| optimal \| high_efficiency`) + `lib/papic-ingest-fidelity.ts` on **both** capture chains | **SHIPPED** — PR #3416 |
| **Full-res drop sweep + Drive-aware defer** | `lib/papic-fullres-drop{,-core}.ts`; `DEFAULT_FULL_RES_RETENTION_DAYS = 90` | **SHIPPED** — PR #3420 |
| **`HIGH_RES_ARCHIVE` ₱999/yr** | ACTIVE in prod (migration `20270723385655`); the **sole** opt-out from the drop sweep (`papic-fullres-drop.ts:42`, `daily-email-jobs.ts:391`); buy surface at `studio/papic/page.tsx:446` | **SHIPPED + LIVE** |
| **Live Photo Wall, fail-CLOSED** | `20261112000545_live_wall_p1_rpcs.sql:73-74` — *"NSFW allowlist (un-disableable; 'unscreened' never projects)"* | **SHIPPED** |
| **Tier config as data** | `papic_tier_config` — free 20 · mini 20 · roll 20 · ltd 70 · unli ∞ | **SHIPPED** |
| Face enrollment + tagging · personal reels · the five render SKUs | across the Papic studio | **SHIPPED + LIVE** |

**The three gaps between "shipped" and "sellable":**

1. **There is no doorway.** `PAPIC_GUEST` is **absent from `lib/add-ons-catalog.ts`** (grep hits only `PAPIC_SEATS` at :572). Its **only** merchandising surface in the entire app is `app/onboarding/wedding/_components/onboarding-pricing.ts:60`. Opening it to more event types is *one catalog entry* with `surface: 'rsvp'` — and the corollary is that **the door is already unlocked**: the day that entry lands, a corporate host can buy it. Restricting requires *building* a gate that does not exist. [VERIFIED-CODE]
2. **The price is a pax curve, not a number.** `computePaxPriceCentavos` (`v2-catalog.ts:453-459`, verified in its own docblock). `PAPIC_GUEST` is marked `'live'` at `v2-catalog.ts:123` — **note this contradicts the Monetization verdict's claim that the SKU is "INACTIVE."** That claim was about a DB `is_active` flag the repo cannot read. **Do not build a grandfathering clause on the "inactive" claim** — and per § 1, the prod query means no grandfathering is needed anyway (one lifetime order).
3. **The guest-facing copy is wedding-literal.** `app/papic/guest/page.tsx:57,106,131` says *"for this wedding"* with fallback `'the wedding'` — guest-facing on every non-wedding sale.

---

## § 4 — The two council verdicts, compressed

### 4.1 Monetization verdict — `Papic_Monetization_Council_Verdict_2026-07-20.md`

**Brief:** *"use the council to strategize that this should be monetizing for us, as we keep other features as well."*
**Method:** 7-lens council → hostile cross-examination → chair synthesis. **All four headline proposals were REJECTED by cross-exam.** The verdict is what survived.

**The three moves:**

1. **Reactivate + reprice `PAPIC_GUEST` ₱2,999 → ₱1,499** as **Papic Buong Araw**, per event-day, on the shipped rail, bounded by an **event-scoped capture-points pool**. Same `service_key` (never-rename lock holds). **Zero new application code for the reprice** — one migration.
2. **Un-retire and RESCOPE `HIGH_RES_ARCHIVE` ₱999/yr from per-event to per-ACCOUNT** as **"Alaala Keep"** — the only compounding, recurring line in the couple catalog, and the direct answer to their "full-resolution downloads" headline. **Ships as a prepaid 12-month term, NOT auto-renew** — recurring billing is unbuilt. Say "12 months," never "subscription."
3. **Refuse the 2026-07-17 recut** that would have made Kwento/Pabati/Guest Stories free. The render menu stays **PAID** and fires in days 3–30 — exactly while photoshare.ph customers watch a deletion countdown.

**Why ₱1,499 and not ₱999 or ₱1,999** [MODELLED reasoning]: ₱999 matches their anchor and forfeits the premium on three things they structurally cannot ship — 5-second clips, face-sorted delivery + reels, and a gallery on the couple's own event site. ₱1,999 (2× anchor) snaps the comparison back to price. ₱1,499 is 1.5× the anchor, charm-priced, and ~0.4% of a ₱400k wedding budget.

**The economics — ALL MODELLED, on a five-order base:**

| Line | Value | Tag |
|---|---|---|
| Papic today, blended 30/50/20 across three event shapes | revenue ₱140 · cost ₱74 · **net +₱66/wedding (47% GM)** | **[MODELLED]** |
| Ladder crossover vs a ₱999 flat competitor | **13 Unli / 23 Ltd / 37 Mini shooters** | [MODELLED] — *"Nobody has 37 shooters"* |
| Buong Araw cost, typical (150 pax, 40% uploaders) | **≈ ₱299 → 80% GM** | **[MODELLED]** |
| Buong Araw cost, at the 10,000-pt fence | **≈ ₱730 → 51% GM** | **[MODELLED]** |
| Unbounded 300-pax free-for-all | **₱1,146 → 24% GM** — the tail the fence exists to stop | **[MODELLED]** |
| Blended after | revenue ₱1,263 · cost ₱164 · **≈ ₱1,099/wedding, 87% GM** | **[MODELLED]** |
| Claimed lift | **~16×**; ₱1.10M vs ₱66k at 1,000 weddings/yr | **[MODELLED]** |
| Robustness: halve Day-Pass attach to 20% | ₱879/wedding, still 13× | **[MODELLED]** |

**Cost basis** (₱58=$1 · R2-IA ₱6.96/GB-yr · **egress ₱0** · 12 MP photo ≈4 MB · 5s clip ≈10 MB · display AVIF ≈8% · face vector ≈₱0.02/photo · reel ≈₱1 · transcode+NSFW ≈₱0.11) is **stated by the verdict as entirely UNMEASURED and admin-dialable.**

**Cost-structure insight worth keeping:** **renders + face compute are 48–60% of marginal cost. Storage is not the problem and never was** [MODELLED]. A compressed gallery costs ~**₱8.35/event/year** — one ₱299 Kwento funds 36 event-years.

**Three overrides the owner must consciously grant** (see § 8).

**Explicitly NOT granted:** no anonymous browser ingest · no optimistic activation on reference-code submission · no 30-day retention class · no "forever" in copy · no free renders.

**Dissents — preserved** (see § 4.3).

### 4.2 Access-scope verdict — `Papic_Access_Scope_Council_Verdict_2026-07-20.md`

**Brief:** *"do we open the access to all event? ideal strategy to match the competitors locally"*
**Method:** 4-lens council (consent/DPO · PH market + money · SKU sprawl · red team) → chair synthesis **after a full repo verification pass**. **Several load-bearing claims in the lens briefs were WRONG**; the corrections changed the answer, and two of them correct the sibling verdict.

**The ruling: open it to 11 of 14 types, in three phases separated by ROSTER SHAPE — not by life-vs-lifestyle.**

| Phase | Types | Gate |
|---|---|---|
| **P1** — closed-roster personal (7) | wedding · debut · birthday · christening · gender_reveal · graduation · **anniversary where `community_id IS NULL`** | Host writes the guest list; a natural person is the answerable controller; consent-at-RSVP reaches |
| **P2** — roster-backed group (4) | reunion · celebration · gala_night · **anniversary where `community_id IS NOT NULL`** | Self-join hardening + a minor safeguard on plain capture |
| **P3** — open crowd (2) | corporate · tournament | CSAM known-hash matcher + takedown form + minors-in-crowd notice + (corporate) an **NPC Circular 16-02 processor agreement we do not have and cannot fake** |
| **⛔ NEVER in V1** | **travel** · **simple_event** | `travel` is `layer_mode='roaming'`, `multi_day=TRUE` → "per event-day" is structurally the wrong unit, and merchandising it ships a fake door. `simple_event` has **no `rsvp` surface** → no guest identity → the whole "no CSAM matcher needed" argument collapses |

**Access predicate to implement** (do NOT hand-maintain an allow-list):

```
P1: surfaceEnabled(profile,'rsvp') AND event_type IN
    ('wedding','debut','birthday','christening','gender_reveal','graduation')
 OR (event_type='anniversary' AND community_id IS NULL)
P2: + reunion, celebration, gala_night, anniversary (community_id NOT NULL)
P3: + corporate, tournament            [each behind its own gate]
Always denied: travel (explicit deny + code comment), simple_event (falls out of surfaceEnabled)
```

**KILL Papic Lite — outright.** `git grep -iE "papic_lite|PAPIC_LITE_ENABLED"` over `apps/web` + `supabase` at `origin/main` → **ZERO matches** [VERIFIED-CODE]. It is 100% document, **zero buyers to migrate**. Its entire premise — *"non-life events have no guest list, so we need anonymous ingest"* — is refuted, because Phases 1–3 serve every one of those types on the shipped rail with a **named** guest, which is a *stronger* RA 10173 basis than anonymous-bystander consent. Every other Lite differentiator is a **subtraction** (photos-only · 4 MP · no video · no face-sort · no reels · no renders · no Drive). It is also revenue-negative against its own replacement: Lite tops out at ₱15,000/100k photos with a realistic corporate buy of ₱500–₱2,000 [MODELLED], while Buong Araw sells the same event at ₱1,499 **with** video, face-sort, reels and 12 MP.

**What killing it deletes:** 3 of 12 PRs (**25% of the Papic v3 build**) · 5 net-new tables + RLS · the `papic_lite_reserve_capture` CAS RPC (the highest-risk money code in the plan — the brief already records an operator-precedence bug in a draft) · 4 net-new public routes + 2 UIs · **a net-new CSAM known-hash matcher** (PhotoDNA/NCMEC/IWF — a relationship a PH sole proprietorship does not have; dossier § 7:151 = *"Not yet engaged"*) · a new ROPA class + 3 unanswered DPO questions · the flag + the PR-8 fork · and the life/non-life predicate **that does not correctly exist in code**. **The CSAM matcher is not deleted — it is DEFERRED to Phase 3**, where open-crowd ingest needs it regardless of the product name.

**Reclaim the name:** "Papic Lite" currently means three unrelated things — (1) the **vendor on-the-day tier**, shipped and in prod copy (`lib/vendor-papic-tier.ts:51`); (2) the `high_efficiency` **fidelity tier** (`lib/papic-fidelity.ts:25`); (3) the dead non-life product. **Keep #1. Rename #2 to "High Efficiency." Delete #3.**

**Say the trade out loud:** with Lite dead and P3 gated, **Setnayan does not serve open-crowd events in V1.** That is a deliberate cession of the segment photoshare.ph lists first on its homepage. The verdict argues it is correct — that is where our face-sort moat evaporates, our consent model breaks, and the compliance bill is highest — **but it is an owner decision made in daylight, not a consequence discovered when the matcher slips.**

**Pricing across types: ₱1,499 flat on 11 of 11, one exception.** Reasons: the catalog **physically cannot price by event type** (`platform_retail_catalog_v2` is `service_code`-keyed with no event-type column, so every per-type price is a new `service_code` and the entitlement/bundle matrix in `lib/entitlements.ts` becomes unreasonable at three variants); one number is the competitive weapon; and the cut is already aggressive. **The exception is corporate** — the only type where a price change moves more money than an attach change — but everything that would justify ~₱4,999 is **not a Papic feature** (a BIR Official Receipt, whitelabel chrome, negotiated retention + deletion certificate, a B2B funnel). **Ship corporate flat at ₱1,499 in P3; create `PAPIC_GUEST_CORP` only after ≥5 real inbound corporate orders.**

**No cheap rung.** A ₱699 rung would anchor the family down, drop GM to the low 80s [MODELLED], and fight a two-person outfit on the one axis where they always win. **Our sub-₱999 answer already exists and is shipped:** ₱0 (3 cameras) → ₱30/camera/day. **Deactivate the unbuyable ₱50 "Ltd" rung rather than building it** — this **reverses** build-order step 4 of the Monetization verdict, and see § 5/§ 7 for how PR #3422 has since taken the opposite path.

**Six verification corrections from the repo pass — cite these, not the briefs:**

| # | Correction |
|---|---|
| **0.1** | **There is no event-type gate on Papic to open. The gate is a MISSING DOORWAY.** (§ 3 gap 1) |
| **0.2** | **The live price is a rising pax curve, and `PAPIC_GUEST` is marked `'live'`, not inactive** — contradicting the Monetization verdict |
| **0.3** | **`event_class` is NOT a life/lifestyle predicate, and neither is `isGatedLifeType()`.** `event_class` is `'personal' \| 'community_eligible'` — an **OWNERSHIP** axis (*"may a community own this type?"*, `20270807254184:39-52`); it seeds `anniversary` community-eligible, so a couple's 25th sorts with a corporation's 10th. `isGatedLifeType()` (`lib/life-event-gate.ts:64-72`) covers debut·christening·birthday·graduation·gender_reveal and **deliberately EXCLUDES wedding** — forking on it would send **every wedding** down the wrong path. **This corrects the standing memory note.** |
| **0.4** | **🔄 The "fail-open NSFW on a projected wall" blocker is INVERTED.** The wall is **fail-CLOSED** (`20261112000545:73-74` — *"'unscreened' never projects"*). The fail-open in `nsfw-screen.ts:24-28` leaves a row `'unscreened'`, visible only on the **couple's private gallery**, excluded from the wall. **The real failure mode is the wall going DARK, silently, one photo at a time** — and it does not heal: `reScreenStuckCaptures` is wired to exactly two surfaces, bounded at `RESCREEN_LIMIT = 10` per table per pass with a 15-minute grace, and `apps/web/vercel.json` is `"crons": []`. At a 3,000-capture reception, healing 10 rows per manual page-open is a rounding error. **Still a blocker — different blocker, cheaper fix** (wire the sweep to the Papic studio + guest surfaces via `claim_periodic_job`, raise the bound). |
| **0.5** | **🔴 No ROPA row covers guest-phone captured MEDIA** — row 13 = RSVP *preferences*, row 11 = biometric vectors, row 20 = Papic Lite, row 3 "Event data" **does not name photographs**. The Monetization verdict's "no new ROPA class needed" is **not true even for weddings today**. **And § 11 item 7 tells the regulator the Lite pool *"is built but flag-OFF"* — it does not exist.** A submission must not describe a system that does not exist. |
| **0.6** | **Identity is self-declared, not host-verified — and already is on weddings.** `selfJoinAction` (`join/[eventId]/actions.ts:453-466`) accepts a typed name behind one shared event QR, inserts `guests` with `entry_source='self_added_unlisted'`, signs the guest-session cookie *"now identical to a /[slug]/redeem guest"*, ceiling `SELF_JOIN_CEILING = 1000`. `/papic/guest` never inspects `rsvp_status` or `entry_source`. **At a wedding with printed per-guest QRs and a door, that's a reconciliation convenience. At a poster-QR reunion or tournament, it is functionally anonymous ingest with a self-declared label. The same code is safe on one type and not on another — and THAT, not `event_class`, is the real axis of this decision.** |

**Also verified in that pass:** `GUEST_CAPTURE_CREDITS = 150` **per guest** (`lib/papic-guest.ts:51`) — so a 10,000-point *event* pool is a **3× TIGHTENING** at 200 pax, not a loosening, and at 150 pax it is **66 pt/guest — tighter than today above 66 pax**. **Re-derive the pool from guest count; 10,000 flat is regressive**, and against a competitor advertising "unlimited uploads" it is the bound most likely to generate a refund. · `isPapicUncapped(eventType) => eventType !== 'wedding'` — every non-wedding type bills the ladder **uncapped** today. · The couple checkout lands at `status='pending_approval'` and **only** `app/admin/payments/actions.ts:207` writes `'paid'` — **there is no payment gateway on the couple path** (PayMongo/Maya exist only on vendor tokens + subscriptions). · The roster is **14 types**, not 12 (`simple_event` + `gala_night`).

### 4.3 The dissents — preserved, because they may be right

**From the Monetization council:**

1. **(Unit economics) "Keep both" is a hedge; the ladder should be a line item, not a peer.** Its negative-margin headline was refuted — a fail-closed meter is margin-positive by construction — **but its crossover arithmetic survived cross-examination completely**: per-camera revenue crosses ₱999 only at 13 Unli / 23 Ltd / 37 Mini shooters. The ladder is simultaneously **margin-positive and revenue-irrelevant**, and keeping it as a peer may be sentiment about shipped code. **If Day-Pass attach lands above 60%, this dissent was right.** *(The prod query — zero ladder orders ever — is at minimum consistent with this dissent.)*
2. **(Platform moat) The storage arithmetic that justifies giving things away is correct, and the verdict leans on it without following it to its conclusion.** A compressed gallery costs ₱8.35/event/yr. **If Day-Pass attach comes in under 15%, the correct next move is the give-it-away model, not a price cut** — at that point couples have said they will not buy capture at any price and the money is genuinely downstream.
3. **(Red team) Capture is a commodity and we just watched it get priced at ₱999 and falling; named delivery to a person you already know by name, table and email is not.** **If photoshare.ph responds by adding accounts and permanent storage at ₱999, the ₱1,499 premium evaporates overnight and the fight moves from pricing to build.**

**From the Access council:**

4. **(Consent/DPO) Phase 2 is granted on a premise the code does not honour, and Phase 1 is not as clean as the verdict says.** `selfJoinAction` already lets an unverified walk-up mint a guest row and receive a camera — **on weddings, today, up to 1,000 rows per event**. The verdict's answer ("the same code is safe at a wedding and not at a reunion") is a judgment about *venues and QR distribution*, not about *code*. **The dissent's position is that the P2 hardening belongs in Phase 0.** If the DPO agrees, P1's timeline moves right.
5. **(Money) The price cut is being made blind.** — **This dissent is now RESOLVED by the prod query.** It demanded attach telemetry before the reprice; the telemetry exists as of 2026-07-20 and shows **one lifetime `PAPIC_GUEST` order**. The cut is not expensive. *(Recorded as resolved rather than deleted, so the reasoning survives.)*
6. **(Sprawl) Killing Lite does not go far enough — the per-camera ladder should go too.** With a flat pass on 11 types, the ladder crosses ₱1,499 only at ~15 Unli / 50 Mini shooters. **The verdict keeps Mini/Unli deliberately, because they are the ₱0–₱90 rung that answers a ₱699 competitor.**
7. **(Red team) We are opening 11 types on a solo-operated day-of product with no scheduler and 24-hour payment reconciliation.** Every failure mode — payment unverified, pool exhausted mid-reception, classifier stuck and the wall dark — **needs a human within minutes on a Saturday night, and there is no human.** Opening 11 types multiplies **incident concurrency**, not just revenue.

---

## § 5 — "Papic Quick" — the ruling, and why

**The owner's proposal:** *"Papic Quick — unlimited shots/day, 30 days saving, no keeping of photos to account."*

**Ruling: ADOPT-MODIFIED on the retail shape only. All three defining clauses REJECTED.**

| Clause | Ruling | What ships instead |
|---|---|---|
| **"unlimited shots/day"** | **MODIFIED** | Unlimited *guests* and unlimited *cameras*; capture bounded by an event-scoped points pool (1 photo = 1 pt · 1×5s clip = 3 pts), soft-stop + one-tap top-up. Unbounded ingest is the only line item with a fat cost tail (a 300-pax free-for-all models at **₱1,146 = 24% GM** [MODELLED]). **The fence is what makes a flat price safe.** |
| **"30 days saving"** | **REJECTED** | Their 30-day window is **cost control dressed as a feature.** A compressed display copy costs **₱6.96/GB-year on R2-IA** ≈ **₱8–10 per event per year**, and **R2 egress is ₱0** [MODELLED cost basis]. **We do not have their problem.** Retention stays at the filed 5-year media schedule. |
| **"no keeping of photos to account"** | **REJECTED outright** | **The account attachment IS the product.** Every downstream peso — face-tagged personal delivery, personal reels, Kwento/Pabati/Stories/Thank You, Alaala, Life-Flash, the anniversary re-entry, the ~150 guest identities per wedding — is reachable **only** through it. This clause is a product engineered to stop our own moat from forming. |

**Also: drop the name.** "Quick" is the competitor's framing — fast, disposable, expiring. Ship **Papic Buong Araw** ("the whole day"), which is the framing we actually win on.

### The four hard blockers a 30-day purge hits

All [VERIFIED-CODE] at `origin/main` `5b72d625d`.

**1. No wholesale purge mechanism exists.** The only deletion path is `lib/papic-fullres-drop.ts` — a **photos-only, single-object, full-res-original drop**. It is not a purge: it deletes one R2 original per row, keeps the display copy, **excludes clips entirely** (a clip's `r2_object_key` *is* the playable video — there is no video web-copy fallback), refuses any row without a `display_r2_key`, refuses `sample/...` seed keys, and defers on Drive state. Deleting an *event's* media wholesale would require a mechanism that does not exist.
**And nothing cascades.** There are **zero foreign keys referencing `papic_photos`** across all 26 migrations that touch it. Downstream tables are **polymorphic by design** — e.g. `papic_live_wall` items carry `source_id UUID NOT NULL` with the comment `-- papic_photos.photo_id | papic_guest_captures.capture_id`, and `person_life_story_items` carries `source_id` over three possible parents. A purge would have to hand-walk every one of those tables or leave dangling references app-wide.

**2. A 30-day purge inverts the 5-year lock AND contradicts a mid-flight NPC filing.** The corpus lock is *"don't auto-delete photos within 5 years."* Meanwhile the filing itself is internally inconsistent with the code: `NPC_Privacy_Compliance_Dossier_2026-07-12.md:170` tells the regulator full-res is kept **6 months** and that a compressed web copy is retained **"indefinitely"**; the shipped constant is `DEFAULT_FULL_RES_RETENTION_DAYS = 90`; and `Data_Retention_Schedule_2026-07-11.md` sets media at **5 years** and states in terms that indefinite retention *"is itself a violation."* **Three documents, three different numbers, and the code agrees with none of them.** Adding a fourth retention class (30 days) *while the filing is mid-flight* is the worst possible sequencing.

**3. 🔁 Setnayan already built this exact product — and deliberately removed it.** Migration `20270103000000_papic_free_sampler.sql` shipped a free Papic sampler with **per-seat caps and 30-day retention**. Migration `20270307073708_remove_papic_sampler.sql` tore it out. Its own header records why:

> *"The sampler feature is fully torn out in app code (provisioning, per-seat caps, **30-day retention**, convert-to-permanent relocation, expiry emails, the `/admin/papic-sampler` surface, the R2 lifecycle script)…"*
> *"**DATA-PRESERVING (no couple loses a photo):** the handful of existing sampler captures are KEPT. Their 30-day expiry is cleared so they become permanent — consistent with the '**free = the kept memory for life**' decision (DECISION_LOG 2026-06-23)."*

The referenced DECISION_LOG row (2026-06-23, *"Papic / Alaala memory-economics — OWNER-LOCKED"*) states the principle in full: **"pay to create, free to keep, NO ADS"** — capture/creation is PAID because it has real delivery cost; the finished curated memory is **"KEPT FREE FOR LIFE (the emotional moat)."** The migration even leaves `papic_photos.expires_at` **vestigial and always-null** as a deliberate future-proofing. **Re-introducing a 30-day expiry would revive a column we intentionally neutered and reverse an owner lock made 27 days earlier.**

**4. The purge could not run on time even if we built it.** `apps/web/vercel.json` is `"crons": []` — Setnayan is **cron-free by design**, running periodic work via `claimPeriodicJob()` compare-and-swap fired from `after()` on **admin request traffic**. The full-res sweep claims **`WEEKLY_GAP_MS`** and processes a **default 500 rows per run (max 2,000)**. That is on the order of **~1,000 objects per week fleet-wide** [MODELLED from the shipped limits]. **ONE unlimited-capture event produces 15,000–100,000 objects** [MODELLED]. A 30-day guarantee on that machinery is a promise the infrastructure cannot keep — and a *missed* deletion deadline that we advertised is materially worse, legally, than never having promised it.

**Net:** Papic Quick's retail instinct (one flat price, unlimited guests, no app) is right and is preserved as Buong Araw. Its three mechanics are each independently blocked — by architecture, by a live regulatory filing, by a 27-day-old owner lock we already executed, and by our own scheduler.

---

## § 6 — The pre-revenue finding, and what it unblocks

**The query** (live prod, 2026-07-20) — repeated here so this section stands alone:

> **63 events (62 weddings) · 6 upcoming · 32 orders · 27 paid.**
> **Papic orders, all time: `PAPIC_GUEST` ×1 (2026-06-08) · `PAPIC_SEATS` ×2 · `PAPIC_ADDON_STORIES` ×1 · `PAPIC_ADDON_THANK_YOU` ×1. `PAPIC_CAMERA_*`: ZERO.**

All [MEASURED].

### 6.1 What it unblocks

| Unblocked | Because |
|---|---|
| **The reprice ₱2,999 → ₱1,499** | Access verdict § 9.5 made the prod query *"the only hard data gate in the plan"*, and kill-criterion #2 was *"pre-cut attach > 10% → the curve was working, revert."* **Measured attach is 1 order across 63 events ≈ 1.6% of events, on a SKU with one lifetime sale.** The gate **PASSES**. |
| **Killing the pax curve** | Same. Nothing measurable is being given up. |
| **The `roll` → `mini` retitle and any capacity change** | **Zero `PAPIC_CAMERA_*` buyers ever.** No cohort to protect. |
| **Deactivating or standing up the ₱50 Ltd rung** | Same — no buyer either way. This is now purely a product-clarity decision (§ 8 item 6). |
| **The 3-free-cameras change (5 → 3)** | Same — no paid camera cohort was displaced. |

### 6.2 What it does NOT unblock

- **The compliance gates are untouched.** § 9's items are about a mid-flight NPC filing and RA 10173 bases. Commercial evidence does not move them.
- **It does not validate the ₱1,499 thesis.** Zero sales is not evidence *for* a price — it is the absence of evidence in both directions. The verdicts' own dissent stands: **the flat-SKU thesis is unproven**, and the *only* honest claim is that testing it is now cheap.
- **It does not prove the product is unwanted.** With **one merchandising doorway app-wide** (`onboarding/wedding/_components/onboarding-pricing.ts:60`) and a price that rises with pax, near-zero sales is at least as consistent with "nobody could find it or afford it" as with "nobody wants it." **Fix the doorway before concluding anything about demand.**

### 6.3 The propagation rule — apply this everywhere

**Every peso figure in both council verdicts is a MODEL built on a base of five Papic orders.** Wherever "₱66/wedding," "₱1,099/wedding," "16×," "₱1.10M/yr," "80% GM," "51% at the fence," "₱299 typical cost," or any attach percentage appears — **in the verdicts, in memory, in DECISION_LOG rows, in future decks — it must be labelled [MODELLED].** Do not let a model harden into a remembered measurement. The corresponding measurement does not exist yet, and § 10 defines what to measure first to create it.

---

## § 7 — Build order: Phase 0 / 1 / 2 / 3, with blockers

### 7.0 What shipped or opened on 2026-07-20 — verified against `origin/main`

| PR | Title | State — **verified 2026-07-20** | What it does |
|---|---|---|---|
| **#3407** | `feat(papic): free-tier point enforcement + 3-seat provisioning (brief PR-3)` | **MERGED** — `45fcbae53` | The **fail-closed** capture-points ledger at both seams (presign 409 + record layer); `PAPIC_FREE_CAMERA_COUNT` 5→3; `provisionFreeCamerasAdmin` (3 `tier='free'` seats at fixed indexes 100–102); `roll`→Mini cap remap; weddings-only cap clamp. **Reverses the old fail-OPEN posture.** |
| **#3416** | `feat(papic): per-event quality/fidelity tier (brief-PR-4)` | **MERGED** — `5d73346e7` | `events.papic_quality_tier` (`full_res \| optimal \| high_efficiency`) + `lib/papic-ingest-fidelity.ts` wired on **both** capture chains. |
| **#3420** | `fix(papic): Drive-aware defer guard on the full-res drop sweep` | **MERGED** — `4144344ae` | The destructive sweep now defers a photo unless its high-res **Google Drive** copy is CONFIRMED. Queued/retrying/failed/missing → defer. **Drive state unreadable → defer** — a read failure must never authorize a deletion. |
| **#3421** | `fix(papic): derive every price/capacity claim from config, never hardcode` | **MERGED** — `5b72d625d` (**current `origin/main` HEAD**) | **The ₱30-row copy fix.** Four display surfaces (`/pricing`, `_components/home/pricing-data.ts`, the studio picker, `public/llms.txt`) advertised *"Ltd ₱30 · 30 photos + 10 videos · first 5 free · caps ₱9,000/₱15,000"* — **wrong rung name, wrong capacity (the gate enforces 20 points), wrong free count (3), wrong cap.** New `lib/papic-tier-copy.ts` is now the ONE place a Papic capacity/free-camera/cap number may live, reading admin-editable `papic_tier_config`. Capacity is stated as *"about N photos a day — fewer if you shoot clips,"* because photos and clips share one purse and an exact "N photos + M clips" promise is **unkeepable by construction**. `lib/papic-copy-guardrails.test.ts` **fails CI** if any enumerated surface re-grows a literal count. No migration, no catalog write. |
| **#3422** | `feat(papic): stand up the Mini + Ltd rungs — the camera ladder is real` | ⚠ **OPEN — NOT MERGED.** All 19 checks SUCCESS; auto-merge armed 07:42Z by the owner; not yet on `origin/main` | See below. |

**⚠ Correction to carry forward: PR #3422 is NOT shipped.** It is green and auto-merge-armed but had not landed as of `origin/main` `5b72d625d`. **Do not describe the Mini/Ltd/Unli buy path as live until it merges.** Its content:

- **The ladder as data.** `PAPIC_CAMERA_MINI_SKU` / `PAPIC_CAMERA_LTD_SKU`; a `PapicRung` vocabulary (`mini | ltd | unlimited`); `papicRungForTier()` as the **one** place that knows the `roll` ↔ `mini` alias (`roll` is the LEGACY tier code for the ₱30 rung — never deleted, always folded into Mini for quoting/display). `CameraTier` widened to `free | roll | mini | ltd | unlimited`. `fetchCameraRates` reads all **four** rate SKUs with Mini ↔ Roll falling back **both** directions. New `fetchPapicTierConfig()` so no surface hardcodes the ladder. `computeCameraQuote` clamps **per rung** (Mini ₱6,000 · Ltd ₱10,000 · Unli ₱15,000), **weddings only**.
- **🔒 A pre-existing money-safety hole, fixed.** Both enforcement seams gated the paid-check on an **allow-list**: `tier === 'roll' || tier === 'unlimited'`. **A `mini` or `ltd` seat would have skipped the paid gate and shot before payment.** Replaced with **`isPaidCameraTier()` — a deny-list ("not free")** — so a future rung can never slip through. `mini`/`ltd` also join `PER_CAMERA_SKUS` so the points gate meters them.
- **Note the tension:** this PR **builds** the ₱50 Ltd rung, while the Access verdict § 9.4 recommends **deactivating** it instead. Both cannot stand. That is § 8 item 6 — and per § 6, it is now a pure product-clarity call with no buyer cost either way.

### 7.1 Phase 0 — repairs. Nothing reaches a public surface first.

*(These are wedding defects, not expansion work.)*

| # | Gate | Blocks | Status |
|---|---|---|---|
| **0a** | **Pricing-page truth.** 20 pts not 60 · 3 free not 5 · Mini not Ltd on the ₱30 row · caps ₱6,000/₱10,000/₱15,000 | ALL | **✅ LARGELY DONE by #3421** (config-derived + a CI guardrail test). ⚠ **Still open: the OWNER DB action** re-titling the live `PAPIC_CAMERA_ROLL_DAY` row to *"Papic Mini"* — the live page currently shows **two SKUs both titled "Papic Ltd."** |
| **0b** | **Kill the pax curve.** `is_pax_priced = FALSE`, `retail_price_php = 1499` on `PAPIC_GUEST`. One UPDATE | ALL | **UNBLOCKED** — the hard data gate ran and passed (§ 6) |
| **0c** | **Event-scoped points pool** + a top-up SKU, enforced fail-closed at **both** seams. One atomic PR, no flag — **it is money logic** | ALL | ⛔ **NOT built.** ⚠ **Re-derive the pool from guest count.** The shipped quota is **150 credits PER GUEST**; a flat 10,000-pt event pool is a **3× tightening at 200 pax** and only **66 pt/guest at 150 pax** — *tighter than today above 66 pax*, and regressive against a competitor advertising "unlimited uploads" |
| **0d** | **ROPA row for guest-phone captured MEDIA** + **correct § 11 item 7's "Lite is built but flag-OFF"** claim | ALL | ⛔ DPO — see § 9 |
| **0e** | **DPO confirms the RSVP consent text names guest-phone capture AND face-sorted delivery** | ALL | ⛔ DPO — **the real gate** |
| **0f** | **Reconcile 90 d (code) vs 6 mo (dossier:170) vs 5 yr / "indefinitely"** | All **retention copy** | ⛔ DPO |
| **0g** | **De-wedding the guest-camera copy** (`app/papic/guest/page.tsx:57,106,131`) | P1–P3 | ⛔ NOT done |
| **0h** | **Build the event-type predicate + the `add-ons-catalog.ts` entry** (`surface:'rsvp'`) with an **explicit `travel` deny + code comment** | P1–P3 | ⛔ NOT built. Note `enabledSurfaces` is authored in `/admin/event-types` and **enforced by NO runtime surface** — a teammate reading that admin UI will reasonably believe types are gated. **They are not.** |
| **0i** | **Land or close PR #3422**, and settle build-vs-deactivate on the ₱50 Ltd rung | 0a's honesty | ⚠ open, green, armed |

### 7.2 Phase 1 — the 7 closed-roster personal types

| Gate | Status |
|---|---|
| All of Phase 0 | ⛔ blocking |
| **Live-wall healing.** Wire `reScreenStuckCaptures` to the Papic studio + guest-hub surfaces and raise `RESCREEN_LIMIT` — **or** accept a documented silent drop | ⛔ blocking **if the wall is marketed** as a headline feature. § 4.2 correction 0.4: the risk is a **dark wall**, not exposure. Use `claim_periodic_job`, not a cron |
| **Apply-then-pay latency — state it, don't fix it.** Couple orders land `pending_approval`; only `admin/payments/actions.ts:207` writes `'paid'`; **no gateway on the couple path** | ⚠ **not blocking — but it makes Buong Araw a PRE-EVENT purchase sold at RSVP-setup time.** No reception-moment upsell exists on this rail, and a mid-event pool top-up is a **HARD stop, not a soft one.** Price and market accordingly; do not model in-the-moment conversion |
| Attach telemetry before the reprice | ✅ **DONE 2026-07-20** (§ 6) |
| **Sequencing decision:** the reprice + doorway (0b + 0h) should ship **first and alone**, so the resulting attach number is attributable | recommended |

### 7.3 Phase 2 — reunion · celebration · gala_night · community anniversary

| Gate | Status |
|---|---|
| Phase 1 shipped + **20 measured events** | ⛔ |
| **Self-join hardening.** Either (i) `/papic/guest` refuses a session whose guest row is `entry_source='self_added_unlisted'` and un-reconciled by the host, or (ii) the DPO explicitly accepts self-declared identity as the basis — **plus a per-event self-join sub-ceiling well under 1,000** | ⛔ blocking. **Dissent #4 says this belongs in Phase 0** because the door is equally open on a wedding today |
| **A minor safeguard on plain photo capture.** Existing safeguards are **face-only** (`face_recognition_excluded`; `selfie-capture.tsx:90` adults-only) — there is **no minor safeguard on plain capture on any rail** | ⛔ blocking |

### 7.4 Phase 3 — corporate · tournament

| Gate | Status |
|---|---|
| **CSAM known-hash matcher live** (PhotoDNA/NCMEC/IWF; dossier § 7:151 *"Not yet engaged"*) + mandatory-reporting counsel review | ⛔ blocking both. **The single largest unbounded item in the whole plan** |
| **Public takedown/complaint form** + posted host-notice copy | ⛔ blocking both |
| **Minors-in-crowd notice** | ⛔ blocking **tournament** |
| **NPC Circular 16-02 outsourcing / data-sharing instrument + a corporate-controller model in the dossier + a product surface to execute it** | ⛔ blocking **corporate. No workaround** — any competent procurement asks for a DPA on day one, and the dossier's PIC model contemplates only a natural-person proprietor |
| Face-sort **forced OFF** on these types until the above clear | ⛔ |

### 7.5 The Buong Araw / Alaala Keep build items (Monetization § 9)

1. **Reactivate + reprice `PAPIC_GUEST` → ₱1,499, retitle "Papic Buong Araw."** One migration. **Zero new application code — the rail is built.**
2. **Event-scoped points pool** — see 0c, including the "re-derive from guest count" correction.
3. **Rescope `HIGH_RES_ARCHIVE` per-event → per-account ("Alaala Keep")** — surface on `/dashboard` Home, point the drop-sweep opt-out at the account grant, add a **T-30 prepaid-term nudge** on the existing `daily-email-jobs` rail (which already reads this SKU at `:391`). **Prepaid 12-month term, NOT auto-renew.** Gated on DPO item 2 in § 9.
4. **The compare page + the marketing line — LAST**, and only after § 9 item 1 is settled.

---

## § 8 — Owner decision queue (consolidated, de-duplicated)

| # | Decision | Source | Notes as of the prod finding |
|---|---|---|---|
| **1** | **Grant or refuse the three overrides:** (a) **un-retire Keep Full-Res** → rescope per-account as **Alaala Keep** (the 2026-07-17 GBB retirement was **never coded** — `HIGH_RES_ARCHIVE` is ACTIVE in prod and is the **sole** opt-out from the drop sweep, so retiring it means originals die at the window with **no paid way to keep them**); (b) **keep Kwento/Pabati/Guest Stories PAID** (cheap — spec-only, never migrated; **₱3,598 of live list price retained**); (c) **allow a flat event-level pass on the LIFE side** (Buong Araw is not Papic Lite — video ON, face-sort ON, reels ON, 12 MP, guest-list-backed) | Monetization § 7 | (b) is nearly free; (a) is the one with a DPO dependency |
| **2** | **Price the Day Pass: ₱999 (match) / ₱1,499 (recommended) / ₱1,999 (2× anchor).** Council genuinely split; chair recommends **₱1,499** | Monetization § 13.2 | Now a **cheap** experiment — no attach to protect |
| **3** | **Approve the 3-phase scope** — 11 of 14 types, `travel` + `simple_event` permanently excluded in V1 | Access § 9.1 | **This supersedes the memory note directing `event_class` as the Papic predicate** |
| **4** | **Approve KILLING Papic Lite** — delete PRs 9/10/11 from the build brief, strike ROPA row 20, correct dossier § 11 item 7, rename the `high_efficiency` alias, keep "Papic Lite" as the **vendor on-the-day tier only**. **And accept the stated consequence: Setnayan does not serve open-crowd events in V1** | Access § 9.2 | Zero buyers to migrate |
| **5** | **Approve flat ₱1,499 across all opened types**, with `PAPIC_GUEST_CORP` **evidence-gated at ≥5 inbound corporate orders**. Confirm **no ₱699/₱999 rung is built** — Free (₱0 × 3 cameras) and Mini (₱30/camera/day) are the low-end answer | Access § 9.3 | |
| **6** | **⚔ Settle the ₱50 "Ltd" rung — the two verdicts disagree and a PR is armed.** Monetization § 9.4 says **build** it; Access § 9.4 says **deactivate** it (`papic_tier_config.ltd.is_active = FALSE`, one config flip, removes it everywhere via `publicPapicLadder()`) for an honest **₱0 → ₱30 → ₱100 → ₱1,499** ladder; **PR #3422 builds it and is green + auto-merge-armed.** It cannot stay half-built while the pricing page names it | both § 9.4 + #3422 | **Zero buyers either way** — pure product clarity |
| **7** | **The pending DB action:** re-title the live ₱30 row (`PAPIC_CAMERA_ROLL_DAY`) to **"Papic Mini"**, and decide whether `PAPIC_CAMERA_MINI_DAY` becomes the sole ₱30 SKU. **Still blocking honest copy** — the live page shows two SKUs both titled "Papic Ltd" | both verdicts | **No grandfathering needed** (§ 1.2) |
| **8** | **Rename one of the two live "Papic Lite" products** — the crowd pool (dead) vs `lib/vendor-papic-tier.ts:51` (the shipped vendor on-the-day tier) — before either surfaces publicly | both | Folds into #4 |
| **9** | **Confirm the Day Pass is pre-event only** — i.e. accept that apply-then-pay forecloses the reception-moment upsell, rather than loosening payment verification to chase it | Monetization § 13.7 | The alternative (activating unlimited ingest on an unreconciled reference code with no chargeback function) is worse |
| **10** | **Approve running 0b + 0h alone first**, so the resulting attach rate is attributable to the reprice + doorway rather than to a bundle of changes | this handoff | |
| **11** | **NEW — charter a Kuha.app / distribution-layer response.** Neither council chartered one, and § 2.4 argues it is the only competitive threat pricing cannot answer | this handoff | |

---

## § 9 — DPO / counsel queue (consolidated, de-duplicated)

**Two of these are on the critical path of a mid-flight NPC filing.**

| # | Item | Severity |
|---|---|---|
| **1** | **🔴 A FILED DOCUMENT MISSTATES SHIPPED REALITY — and our headline claim is a retention claim.** `NPC_Privacy_Compliance_Dossier_2026-07-12.md:170` tells the regulator full-res is kept **6 months**; the shipped constant is **`DEFAULT_FULL_RES_RETENTION_DAYS = 90`**; the GBB spec also says 6 months. **Either change the constant or amend the filing — before one word of retention marketing ships.** | **BLOCKS THE COPY, not the SKU** |
| **2** | **🔴 The filing must carry the retention LADDER, not one line — and a paid extension must be capped at the filed maximum.** Four schedules now exist: full-res **90 d** · display copy **5 yr** · face vectors **~5 yr** · **Alaala Keep paid hold**. Under RA 10173 storage limitation a retention period is bound to a **declared purpose** — it is not a dial a paying customer buys upward without limit. **DPO must rule: is a paid full-res hold permissible, and what is its ceiling?** If no, Alaala Keep must reposition as a **Drive-sync / export convenience**, not a retention product | **BLOCKS Alaala Keep entirely.** The single most consequential ruling in the set |
| **3** | **Dossier:170 also says the compressed web copy is retained "indefinitely."** That contradicts `Data_Retention_Schedule_2026-07-11.md` row 2 (media = 5 years) **and** its § 15 (*"indefinite retention … is itself a violation"*). **Settle to 5 years across doc, filing and copy** | 🔴 |
| **4** | **🔴 No ROPA row covers guest-phone captured MEDIA.** Row 13 = RSVP *preferences* · row 11 = biometric vectors · row 20 = Papic Lite · row 3 "Event data" **does not name photographs**. **A new row is required: subjects = guests + incidental attendees; basis § 12(b) + § 12(a); retention per the media lifecycle.** *(This corrects the Monetization verdict's "no new ROPA class needed," which is not true even for weddings today)* | **BLOCKS all phases** |
| **5** | **🔴 Dossier § 11 item 7 tells the regulator the Papic Lite pool "is BUILT but flag-OFF." It does not exist** (`git grep` → zero matches). **A submission must not describe a system that does not exist.** Killing Lite makes this a deletion instead of an argument | **BLOCKS all phases** |
| **6** | **Confirm the RSVP consent text actually names guest-phone capture AND face-sorted delivery.** Guest browser capture rides `readGuestSession()` — a **named, RSVP-identified** guest, not an anonymous walk-up, which is why no net-new CSAM matcher / bystander gate / ROPA class is needed *for P1*. **That entire argument rests on this confirmation.** If the text doesn't name it, the copy edit is the real gate | **BLOCKS all phases — "the real gate"** |
| **7** | **Rule on `entry_source='self_added_unlisted'` as a consent basis.** `selfJoinAction` lets an unverified walk-up mint a guest row behind one shared QR (ceiling **1,000**) and receive a camera — **on weddings, today**. Either (i) `/papic/guest` refuses un-reconciled self-join sessions, or (ii) the DPO accepts self-declared identity — **plus a per-event sub-ceiling well under 1,000**. **Dissent #4 argues this belongs in Phase 0, not Phase 2** | ⛔ **P2** (arguably P0) |
| **8** | **A minor safeguard on plain photo capture.** Existing safeguards are **face-only**; there is none on plain capture on any rail | ⛔ **P2** |
| **9** | **CSAM known-hash matcher** (PhotoDNA / NCMEC / IWF) — dossier § 7:151 *"Not yet engaged."* Requires an institutional relationship a PH sole proprietorship cannot self-serve. **Mandatory-reporting counsel review attached** | ⛔ **P3, both types.** Largest unbounded item |
| **10** | **NPC Circular 16-02 outsourcing / data-sharing agreement instrument**, a **corporate-controller model** in the dossier (it currently contemplates only a natural-person proprietor), and a **product surface to execute it.** Employment-context consent is **not freely given** — the employer runs § 12(f) under its own notice, making **Setnayan a PROCESSOR** | ⛔ **P3 corporate. No workaround** |
| **11** | **Minors-in-crowd notice** (already drafted in dossier § 11 item 7) | ⛔ **P3 tournament** |
| **12** | **Public takedown / complaint form** + posted host-notice copy | ⛔ **P3 both** |
| **13** | **The Lite-specific open questions are DELETED, not answered, if Lite is killed** — Samahan controller identity · guardian-consent standard · guest-list reuse | resolves with owner #4 |

**Approved-copy rule (both verdicts, unanimous):** 🚫 **Do NOT ship** *"habambuhay" / "forever" / "kept indefinitely" / "kayo lang ang makakabura."* `Data_Retention_Schedule_2026-07-11.md:15` states indefinite retention **is itself a violation**, and a promise that deletion is impossible is **false** the first time an RA 10173 erasure request, an NPC order, a takedown, or an account hard-delete lands. **The approved claim is "5 years," because that is what is filed.** Ship ***"Walang 30-day clock."*** *(Voice rule: Filipino for product names and the two anchor words only. The spine stays English — full Taglish body copy reads downmarket to a segment paying ₱300k+ for the wedding.)*

---

## § 10 — Kill criteria, and what to measure first

### 10.1 Measure these FIRST — the prod query created the baseline, now create the signal

The whole plan rests on one unmeasured number. **Instrument it before shipping anything downstream of it.**

| Priority | Metric | Why | Baseline [MEASURED 2026-07-20] |
|---|---|---|---|
| **1** | **`PAPIC_GUEST` order count + attach % of events**, weekly, split wedding vs non-wedding | The single load-bearing number in both verdicts | **1 order / 63 events** |
| **2** | **Captures per Day-Pass event** (photos and clips separately) | Sets the pool size, and cost per event is the GM floor | none |
| **3** | **Measured MB per Optimal photo and per 5s clip** | The entire cost basis is assumed, never measured | none |
| **4** | **Measured face-compute cost per photo** | If it lands at ~₱0.50 instead of ~₱0.02, unlimited-guest capture is uneconomic at **any** flat price | none |
| **5** | **Points-pool breach rate** | >5% breaching = a fake door; <0.5% ever exceeding half = theatre, and we left pricing power on the table | none |
| **6** | **Camera-ladder orders after PR #3422 + the retitle land** | Zero to date; tests whether the ladder was unbought or merely unbuyable | **0** |
| **7** | **Wall dark-rate** — `unscreened` rows never healed per event | The inverted blocker (§ 4.2, 0.4) | none |
| **8** | **Alaala Keep attach at the 90-day cliff, and Drive-connect rate** | Kill-criterion for the recurring line | none |

### 10.2 Kill criteria — merged from both verdicts

| # | Trigger | Consequence |
|---|---|---|
| 1 | **Day-Pass attach < 15%** over 60 days / 50 weddings **while** ladder attach > 40% | Couples buy *shooters*, not *events*. Revert to ladder-hero; keep the pass only inside `PAPIC_UNLOCK`; **do not ship Phase 2** |
| 2 | ~~Pre-cut `PAPIC_GUEST` attach > 10%~~ | **✅ RESOLVED 2026-07-20 — measured attach is 1 order lifetime. The cut is not expensive.** Retained for the record |
| 3 | **Phase-1 non-wedding attach < 3%** after 100 events | The "13 types at zero marginal cost" thesis is wrong *for capture specifically*; **cancel** Phases 2–3 rather than gate them |
| 4 | **Measured Optimal photo > 7 MB**, or typical events > 8,000 captures | Cost passes ₱600, GM under 60% → ₱1,499 → ₱1,999, **or** shrink the pool 10,000 → 6,000. **Do NOT shrink the gallery** |
| 5 | **Face detection cannot be self-hosted at ~₱0.02/photo** and lands on a hosted API at ~₱0.50 | Face cost rises **25×** → unlimited-guest capture is uneconomic at any flat price. **In that world the per-camera meter is right and both verdicts are wrong** |
| 6 | **>5% of events breach the pool** / **<0.5% exceed half of it** | Fake door → re-size. / Theatre → we left pricing power on the table |
| 7 | **Alaala Keep attach < 3% AND Drive-connect < 20%** at the 90-day cliff | Couples don't value originals. Kill the SKU; fund storage from the Day Pass |
| 8 | **DPO rules a paid retention extension is impermissible** | Alaala Keep dies as a retention product → reposition as sync/export |
| 9 | **Counsel declines RSVP-consent** as the basis for guest browser capture | The pass reduces to a designated-shooter flat pass (~₱999 for 10 cameras) and **Phases 2–3 die entirely** |
| 10 | **≥5 inbound corporate leads arriving with a procurement DPA request** before P2 ships | The Circular 16-02 instrument is worth building now; **P3's ordering is wrong** |
| 11 | **A real buyer is refused a sale *specifically* because their shooters are not on a guest list** (not price, not features) | Anonymous ingest had attributable revenue; killing Lite was premature. **Rebuild it as an `open_mode` flag on the Buong Araw rail — NEVER as 5 tables** |
| 12 | **Cloudflare introduces R2 egress charges, or raises storage >2×** | Free downloads and the 5-year display copy collapse; a 30-day window becomes rational; **the owner's Papic Quick instinct was right after all.** Free egress is load-bearing for this entire plan — monitor it as a **strategic dependency**, not a line item |
| 13 | **photoshare.ph ships accounts + permanent storage at ₱999** | The retention wedge closes. Build fight, not a price fight. Re-run the model |
| 14 | **Kuha.app's white-label partner program signs the top PH wedding photographers** | **The distribution layer is lost, and no price move recovers it.** See § 2.4 — this is the one with no prepared response |
| 15 | **Day-of incidents on non-wedding types exceed what one operator can absorb on a Saturday** | Freeze at Phase 1 regardless of revenue (dissent #7) |
| 16 | **If Day-Pass attach lands above 60%** | Dissents #1 and #6 were right: retire Mini/Unli from the opened types and let the flat pass be the only guest-capture SKU |

---

## § 11 — Source index

**Corpus (`~/Documents/Claude/Projects/Setnayan/`) — writable:**

| File | What's in it |
|---|---|
| **`Papic_Monetization_Council_Verdict_2026-07-20.md`** | 7-lens council; the shape-fight thesis; Buong Araw ₱1,499; Alaala Keep; the render-menu refusal; the full cost model (§ 5); the cross-exam record of why all four headline proposals died (§ 3); 3 overrides (§ 7); the DPO items (§ 8); build order (§ 9); 3 dissents (§ 10); kill criteria (§ 12) |
| **`Papic_Access_Scope_Council_Verdict_2026-07-20.md`** | 4-lens council; the **six repo-verification corrections (§ 0)** — read these before trusting either verdict's code claims; the 14-type table (§ 2); the KILL-Lite argument with an itemized savings table (§ 3); per-type pricing (§ 4); **Phase 0/1/2/3 gate tables (§ 5)**; the per-segment competitive lines (§ 6); 4 dissents (§ 7); 10 kill criteria (§ 8) |
| `0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md` | § 0 = the 2026-07-20 structure lock (Lite = non-life · Mini/Ltd/Unli = life). **The Lite half is superseded by the Access verdict** |
| `0012_papic/Papic_Build_Brief_2026-07-17.md` | The 12-PR schema-first plan. **PRs 9/10/11 are deleted if Lite is killed** |
| `0012_papic/Papic_v3_Whats_Next_2026-07-18.md` | The running build handoff; resume pointer |
| `0012_papic/Papic_Open_Council_Verdict_2026-07-17.md` | The council that created Papic Lite (now proposed for deletion) |
| `NPC_Privacy_Compliance_Dossier_2026-07-12.md` | **Mid-flight filing.** Line 170 = the 6-month/indefinite retention text · § 7:151 = CSAM *"Not yet engaged"* · § 11 item 7 = the false "Lite is built" claim + the minors-in-crowd notice draft · ROPA rows 3/4/11/13/20 |
| `Data_Retention_Schedule_2026-07-11.md` | Row 2 = media 5 years; line 15 = *"indefinite retention is itself a violation"*; § 15 |
| `Pricing.md` § 00 / § 2.1 / § 2.1a | Canonical pricing; the storage/retention model |
| `DECISION_LOG.md` | Row **2026-06-23 "Papic / Alaala memory-economics — OWNER-LOCKED"** = *"pay to create, free to keep, NO ADS"* / *"KEPT FREE FOR LIFE (the emotional moat)"* — **the lock a 30-day purge would reverse.** Row **2026-06-24** amends it (paid raw storage retired). Plus the three 2026-07-20 rows and this handoff's row at the bottom |

**Repo (`~/Documents/Claude/Projects/setnayan-platform`) — READ-ONLY; use `git show origin/main:<path>`. Verified @ `5b72d625d`:**

| Path | What it proves |
|---|---|
| `apps/web/lib/v2-catalog.ts:123, :453-459` | `PAPIC_GUEST` is `'live'`; the pax curve 100→₱2,999 … 500→₱5,799 |
| `apps/web/lib/papic-guest.ts:51` | `GUEST_CAPTURE_CREDITS = 150` **per guest** — why a 10,000-pt event pool is a tightening |
| `apps/web/lib/papic-cameras.ts` | `CameraTier`; `fetchCameraRates`; `isPapicUncapped(t) => t !== 'wedding'` |
| `apps/web/lib/life-event-gate.ts:64-72` | `isGatedLifeType()` **excludes wedding** — never use it as a Papic predicate |
| `apps/web/lib/event-type-profile.ts:180` | `SIMPLE_PROFILE.enabledSurfaces` has **no `rsvp`** |
| `apps/web/lib/add-ons-catalog.ts` | **`PAPIC_GUEST` is absent** — the missing doorway |
| `apps/web/app/onboarding/wedding/_components/onboarding-pricing.ts:60` | Its **only** merchandising surface app-wide |
| `apps/web/app/papic/guest/page.tsx:35,51,57,106,131` | `readGuestSession()` + `eventPapicGuestActive()`; **never reads `event_type`**; wedding-literal copy |
| `apps/web/app/join/[eventId]/actions.ts:17,453-466` | `selfJoinAction`; `SELF_JOIN_CEILING = 1000`; `entry_source='self_added_unlisted'` |
| `apps/web/lib/nsfw-screen.ts:24-28, :307-308` | The fail-open; `RESCREEN_LIMIT = 10`; the 15-minute grace |
| `supabase/migrations/20261112000545_live_wall_p1_rpcs.sql:73-74` | **The wall is fail-CLOSED** — *"'unscreened' never projects"* |
| `apps/web/lib/papic-fullres-drop{,-core}.ts` | `DEFAULT_FULL_RES_RETENTION_DAYS = 90`; photos-only; the Drive-aware defer; per-run limit 500 (max 2,000); `claimPeriodicJob('papic-fullres-drop', WEEKLY_GAP_MS)` |
| `apps/web/lib/periodic-jobs.ts` | The cron-free primitive; `DAILY_GAP_MS` / `WEEKLY_GAP_MS` |
| `apps/web/vercel.json` | **`"crons": []`** |
| `supabase/migrations/20270103000000_papic_free_sampler.sql` | **We built a 30-day-retention free Papic once** |
| `supabase/migrations/20270307073708_remove_papic_sampler.sql` | **…and deliberately removed it**, citing DECISION_LOG 2026-06-23; leaves `expires_at` vestigial/always-null |
| `supabase/migrations/20270807254184_composable_event_foundation.sql:37-64` | `event_class` = an **ownership** axis; `travel` = `roaming` + `multi_day` |
| `supabase/migrations/20270726622326_enable_all_event_types.sql` | The roster is **14 types** |
| `supabase/migrations/20261104000959_papic_live_photo_wall_schema.sql:100` · `20270515309755_...life_story_items...:71` | **Polymorphic `source_id` with no FK** — nothing cascades on delete |
| `app/api/upload/route.ts:403` · `app/papic/actions.ts:347` | The two fail-closed enforcement seams |
| `app/admin/payments/actions.ts:207` | **The only writer of `'paid'`** — no gateway on the couple path |
| `apps/web/lib/vendor-papic-tier.ts:51` · `lib/papic-fidelity.ts:25` | The two *other* live meanings of "Papic Lite" |

**PRs:** #3407 (merged) · #3416 (merged) · #3420 (merged) · #3421 (merged, HEAD) · **#3422 (OPEN, green, auto-merge armed — NOT on `origin/main`)**.

**Memory:** `project_setnayan_papic_gbb_pricing.md` (updated 2026-07-20 with this handoff pointer) · `project_setnayan_pricing_strategy` · `project_setnayan_data_retention` · `project_setnayan_vendor_on_the_day` · `project_setnayan_cron_free` · `project_setnayan_event_type_strategy`.

**Competitor sources** (live pages read 2026-07-20; no artifacts archived — **re-read before quoting in public copy**): photoshare.ph (pricing · homepage · FAQ · Privacy Policy § 7 · Terms § 7.2) · eventpix.ph (pricing) · kuha.app (tiers + Studios & Partners program).

---

*Compiled 2026-07-20. Prod query [MEASURED] the same day. Repo claims verified at `origin/main` `5b72d625d`. Every peso projection herein is [MODELLED] on an event base that has produced five Papic orders in total.*
