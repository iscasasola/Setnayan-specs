# Papic Access Scope — Which Event Types, and the PH Competitive Line — Council Verdict (2026-07-20)

> **Status:** 4-lens council (consent/DPO · PH market + money · SKU sprawl · red team) → chair synthesis after a **full repo verification pass against `origin/main` @ `5b72d625d`**. Several load-bearing claims in the lens briefs were WRONG; the corrections are in § 0 and they change the answer.
>
> **Owner brief:** *"do we open the access to all event? ideal strategy to match the competitors locally"*
>
> **Sibling verdict (this doc extends, does not replace):** [`Papic_Monetization_Council_Verdict_2026-07-20.md`](Papic_Monetization_Council_Verdict_2026-07-20.md) — which recommended reactivating `PAPIC_GUEST` as **Papic Buong Araw ₱1,499** and granted **override #3: "a flat event-level pass on the LIFE side."** This verdict answers the question that override deliberately left open: *how far past the life side?*
>
> **Canonical siblings:** [`0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md`](0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md) · [`NPC_Privacy_Compliance_Dossier_2026-07-12.md`](NPC_Privacy_Compliance_Dossier_2026-07-12.md) · [`Data_Retention_Schedule_2026-07-11.md`](Data_Retention_Schedule_2026-07-11.md).
>
> ## 🔴 **AMENDED 2026-07-20 by [`Papic_Compliance_Delta_2026-07-20.md`](Papic_Compliance_Delta_2026-07-20.md) — read it before actioning §5.**
>
> **(1) The hard data gate in §5 item 5 is PASSED, and it passed in the unblocking direction.** Live prod, queried 2026-07-20: **63 events (62 weddings) · 6 upcoming · 32 orders (27 paid) · `PAPIC_GUEST` ×1 all-time (2026-06-08) · `PAPIC_SEATS` ×2 · `PAPIC_ADDON_STORIES` ×1 · `PAPIC_ADDON_THANK_YOU` ×1 · `PAPIC_CAMERA_*` ×0 — none, ever.** Setnayan is **pre-revenue on Papic**: there is no attach rate to protect, so the ₱2,999→₱1,499 cut and the pax-curve removal cost nothing measurable. **This resolves the §6 secondary money-seat dissent** ("the price cut is being made blind") rather than sustaining it. It also means **no grandfathering clause is needed** for the roll→Mini rename or any capacity change — there are zero `PAPIC_CAMERA_*` buyers. **Do not write one.**
>
> **(2) Every revenue figure in this verdict and its sibling is a MODEL, not a measurement** (₱66/wedding · ₱1,099/wedding · ~16× · ₱1.10M/yr · 40% attach). Label them MODELLED wherever repeated.
>
> **(3) Items 0d / 0e / 0f are now written up in full** — the drafted ROPA row for guest-phone captured media (Delta §2.2, `[PENDING DPO]`), the "Papic Lite is built" correction (Delta §3, incl. a ⚠ name-collision warning: two *shipped* things also carry that name), the 90 d-vs-6 mo retention resolutions with consequences (Delta §1 — **which BLOCKS all retention marketing copy**), and the verbatim RSVP consent copy the DPO must rule on (Delta §4).

---

## 0. Verification pass — six corrections, and one of them inverts a §8 blocker

Everything below was read at `origin/main` @ `5b72d625d`. Cite these, not the briefs.

**0.1 — There is no event-type gate on Papic to open. The gate is a MISSING DOORWAY.**
`apps/web/app/papic/guest/page.tsx` reads `readGuestSession()` (line 35) + `eventPapicGuestActive()` (line 51) and **never reads `event_type`**. `platform_retail_catalog_v2` is keyed on `service_code` alone — no event-type column. `PAPIC_GUEST` is **absent from `apps/web/lib/add-ons-catalog.ts`** (grep: only `PAPIC_SEATS` at :572). Its only merchandising doorway in the entire app is `apps/web/app/onboarding/wedding/_components/onboarding-pricing.ts:60`. **So "open access to all events" is mechanically one catalog entry with `surface: 'rsvp'` — and the corollary is that the door is already unlocked: the day that entry lands, a corporate host can buy it.** Restricting requires *building* a gate that does not exist.

**0.2 — The live price is not ₱2,999. It is a rising pax curve, and that is the actual competitive defect.**
`apps/web/lib/v2-catalog.ts:123` marks `PAPIC_GUEST: 'live'` (not "inactive" as the monetization verdict asserted — that claim is about a DB `is_active` flag this repo cannot read, and the code contradicts it). `computePaxPriceCentavos` (`v2-catalog.ts:453-459`) is verified in its own docblock: **100→₱2,999 · 150→₱3,349 · 200→₱3,699 · 300→₱4,399 · 500→₱5,799.**

| pax | Setnayan today | photoshare.ph | EventPix.ph |
|---|---|---|---|
| 100 | ₱2,999 | ₱999 | ₱699 |
| 300 | ₱4,399 | ₱999 | ₱699 |
| 500 | ₱5,799 | ₱999 | ₱699 |

**We get more expensive exactly where they stay flat.** That is a *slope* problem, not a level problem, and it is worst at debut, corporate and big Pinoy weddings — the three segments we most want.

**0.3 — `event_class` is NOT a life/lifestyle predicate, and `isGatedLifeType()` is not either.**
`event_class` is `'personal' | 'community_eligible'` with the column comment *"personal = only a person may own events of this type; community_eligible = a community (Samahan) may also own them"* (`supabase/migrations/20270807254184_composable_event_foundation.sql:39-52`). It is an **ownership** axis. It seeds `anniversary` community-eligible (`:60-64`), so a couple's 25th sorts with a corporation's 10th. `isGatedLifeType()` (`apps/web/lib/life-event-gate.ts:64-72`) covers exactly `debut · christening · birthday · graduation · gender_reveal` and **deliberately excludes wedding**. **Neither is a correct Papic predicate. The memory note telling us to use `event_class` is wrong and is corrected by this verdict.**

**0.4 — 🔴 THE §8-ITEM-5 BLOCKER IS INVERTED. The projected wall is fail-CLOSED, not fail-open.**
`supabase/migrations/20261112000545_live_wall_p1_rpcs.sql:73-74` — `-- G1 — NSFW allowlist (un-disableable; 'unscreened' never projects.)` / `IF v_state IS DISTINCT FROM 'clean' THEN RETURN; END IF;`. The NSFW fail-open in `apps/web/lib/nsfw-screen.ts:24-28` leaves a row `'unscreened'`, which stays visible on the **couple's private gallery** and is **excluded from the wall**. So the failure mode is **not porn on a projector — it is the wall going dark**, silently, one photo at a time. And it does not heal: `reScreenStuckCaptures` is wired to exactly two surfaces (`app/dashboard/(account)/life-flash/page.tsx:106`, `app/dashboard/[eventId]/studio/papic/moderation/page.tsx:74`), bounded at `RESCREEN_LIMIT = 10` per table per pass with a 15-minute grace (`nsfw-screen.ts:307-308`), and `apps/web/vercel.json` is `"crons": []`. **At a 3,000-capture reception, healing 10 rows per manual page-open is a rounding error.** This is still a blocker — it is just a *different* blocker, with a different fix (wire the sweep to the Papic studio + guest surfaces and raise the bound), and it is cheaper than the one §8 named.

**0.5 — 🔴 No ROPA row covers guest-phone captured MEDIA. And the filing says Lite is built when it does not exist.**
All 20 ROPA rows read (`NPC_Privacy_Compliance_Dossier_2026-07-12.md:44-66`). Row 13 = RSVP *preferences*. Row 11 = biometric vectors. Row 20 = **Papic Lite** (gated). Row 3 = *"Event data — guest lists, vendor records, budget items, schedule, mood-board palettes"* — **which does not name photographs.** The monetization verdict's "no new ROPA class needed" is **not true even for weddings today**. Separately, §11 item 7 tells the regulator the Lite pool *"is **built** but flag-OFF"* — `git grep -iE "papic_lite|PAPIC_LITE_ENABLED"` across `apps/web` + `supabase` at `origin/main` returns **zero matches**. A submission must not describe a system that does not exist. Both are one-paragraph fixes; both are on the critical path of a mid-flight filing. **✅ 2026-07-20 — both are now WRITTEN: the drafted media ROPA row is at [`Papic_Compliance_Delta_2026-07-20.md`](Papic_Compliance_Delta_2026-07-20.md) §2.2 (`[PENDING DPO]`) and the §11-item-7 replacement wording at Delta §3.2. ⚠ Before anyone greps "Papic Lite" to delete it, read Delta §3.3 — the name also belongs to a **shipped** vendor on-the-day tier and a quality alias.**

**0.6 — Identity is self-declared, not host-verified, and it already is on weddings.**
`apps/web/app/join/[eventId]/actions.ts` — `selfJoinAction` accepts a typed name behind one shared event QR, inserts `guests` with `rsvp_status: 'pending'` / `entry_source: 'self_added_unlisted'` (:453-456), and signs the guest-session cookie with the comment *"now identical to a /[slug]/redeem guest"* (:466). Ceiling `SELF_JOIN_CEILING = 1000` (:17). `/papic/guest` never inspects `rsvp_status` or `entry_source`.
**Read this correctly, because both lenses over-read it in opposite directions.** At a wedding with printed per-guest QRs and a door, self-join is a reconciliation convenience and the roster is still host-written — the consent posture holds. At a corporate expo or a tournament with a poster QR that gets photographed and reposted, self-join becomes the *primary* entry path and the product is functionally anonymous ingest with a self-declared label. **The same code is safe on one type and not on another. That, and not `event_class`, is the real axis of this decision.**

**Also verified:** `GUEST_CAPTURE_CREDITS = 150` **per guest** (`lib/papic-guest.ts:51`) — a 10,000-point *event* pool is a **3× tightening** at 200 pax, not a loosening, and it is net-new code. `isPapicUncapped(eventType) => eventType !== 'wedding'` (`lib/papic-cameras.ts:188-190`) — every non-wedding type bills the ladder **uncapped** today. `CameraTier = 'free' | 'roll' | 'unlimited'` (:118) with `fetchCameraRates` reading only ROLL + UNLIMITED (:140-146) — **the ₱50 "Ltd" rung is advertised but unbuyable.** The couple checkout lands at `status='pending_approval'` and only `app/admin/payments/actions.ts:207` writes `'paid'` — **no payment gateway on the couple path** (PayMongo/Maya exist only on vendor tokens + subscriptions). The roster is **14 types**, not 12 (`simple_event` + `gala_night`; `20270726622326_enable_all_event_types.sql`).

---

## 1. The ruling in three sentences

**Yes — open it, to 11 of the 14 types, but in three phases separated by what each type does to the identity model, not by life-vs-lifestyle.** Phase 1 ships the flat **₱1,499 Papic Buong Araw** to the seven **closed-roster personal types** (wedding · debut · birthday · christening · gender_reveal · graduation · personally-owned anniversary), where the host writes the guest list, a natural person is the answerable controller, and consent-at-RSVP already reaches; Phase 2 adds the four **roster-backed group types** (reunion · celebration · gala_night · community-owned anniversary) once self-join is hardened; Phase 3 adds the two **open-crowd types** (corporate · tournament) only behind a CSAM known-hash matcher, a minors-in-crowd notice, and — for corporate — an NPC Circular 16-02 processor agreement we do not have and cannot fake. **Travel and simple_event never get the flat pass in V1** (travel is `layer_mode='roaming'` + `multi_day=true`, so "per event-day" is structurally the wrong unit; simple_event has no RSVP surface), and **Papic Lite is KILLED outright** — it is 100% document, its entire reason for existing was to serve the non-life half that Phases 2–3 now serve on the already-shipped rail, and deleting it removes 25% of the Papic v3 build plus the only net-new compliance control in it.

**The competitive answer is not the price. It is the slope.** Killing the pax curve is a 66% cut at 300 pax and a 74% cut at 500 pax — that alone closes the gap to a ₱999 competitor at the sizes where we currently lose 4-to-1, and we hold a ₱0 rung and a ₱30/camera rung that **neither photoshare.ph nor EventPix.ph has at any price.**

---

## 2. The per-event-type table

`event_class` and `isGatedLifeType()` are both listed to show they are **not** the predicate (§ 0.3). The predicate is the middle column: **who writes the roster.**

| # | Type | Roster shape | Open? | Price | Consent basis | Special handling |
|---|---|---|---|---|---|---|
| 1 | **wedding** | Host-written · printed per-guest QRs | **P1** | **₱1,499** | § 12(b) contract + § 12(a) RSVP consent | **Only type with peso day-caps** on the ladder (`isPapicUncapped`, ₱6,000/₱10,000/₱15,000). Flat pass has no per-camera subtotal → caps are orthogonal, leave the function alone |
| 2 | **debut** | Host-written · parents pay | **P1** | **₱1,499** | same | **#1 non-wedding target.** 100% smartphone-native guest cohort → highest capture-per-guest of any type. Size the pool for it |
| 3 | **birthday** | Host-written | **P1** | **₱1,499** | same | Price-sensitive (pass = 5–10% of a ₱15–30k party). **The answer is Free/Mini, not a cheaper pass** — see § 4 |
| 4 | **christening** | Host-written | **P1** | **₱1,499** | same + § 13(a) guardian consent (ROPA 4 — honoree is a minor) | Largest raw PH volume (~1.07M baptisms; ~30% get a party). Watch it; don't build for it |
| 5 | **gender_reveal** | Host-written · 20–40 pax | **P1** | **₱1,499** | same + ROPA 4 (due-date is sensitive PI) | Expect ~0 attach at ₱1,499. Free 3-camera tier is the honest product here |
| 6 | **graduation** | Host-written · house lunch | **P1** | **₱1,499** | same | Expect ~0 attach — **the school owns the ceremony photos.** No build |
| 7 | **anniversary** *(`community_id IS NULL`)* | Host-written · adult children pay | **P1** | **₱1,499** | same | The one type that genuinely splits by host. `events.community_id IS NULL` splits it exactly — and mirrors the shipped CHECK `events_community_class_consistency` |
| 8 | **reunion** | Poster QR · self-join is the primary path | **P2** | **₱1,499** | § 12(b) + § 12(a) self-join consent, **after hardening** | Diffuse payer (a committee that chips in). Dec + summer seasonal |
| 9 | **celebration** | Mixed — catch-all | **P2** | **₱1,499** | same | Relabeled birthday/reunion; inherits whichever posture the host actually runs |
| 10 | **gala_night** | Invite-list, but org-hosted | **P2** | **₱1,499** | same | Sits between #9 and corporate; treat as roster-backed until an org buyer appears |
| 11 | **anniversary** *(`community_id IS NOT NULL`)* | Samahan-owned | **P2** | **₱1,499** | same | Same row 7 type, different controller. The split is the point |
| 12 | **corporate** | Badge scanners · walk-ups · **employees** | **P3** | **₱1,499 flat at first; `PAPIC_GUEST_CORP` ~₱4,999 only on evidence** | ⛔ **Employment-context consent is not freely given.** Employer runs § 12(f) under its own notice ⇒ **Setnayan is a PROCESSOR** ⇒ NPC Circular 16-02 outsourcing agreement required | **Hardest no, most expensive no.** No DPA template, no surface to execute one, and the dossier's PIC model (§1) contemplates only a natural-person proprietor. Also needs a BIR Official Receipt (iteration 0026, not built on this path) |
| 13 | **tournament** | **Spectators are never RSVP'd** | **P3** | **₱1,499** | ⛔ Bystander basis + **minors-in-crowd notice** (dossier §11 item 7 already names this) | Youth tournaments are the bright line: subjects are other people's children, no guardian in the loop. `readGuestSession()` returns null for the people holding the phones |
| 14 | **travel** | No guest list, no event-day | ⛔ **NEVER (V1)** | — | — | `layer_mode='roaming'`, `multi_day=TRUE` (`20270807254184:37-44`). A **per-event-day** unit is simply wrong. Maximal bystander density. **Merchandising it ships a fake door** |
| — | **simple_event** | No RSVP surface | ⛔ **NEVER (V1)** | — | — | `SIMPLE_PROFILE.enabledSurfaces = ['seating','schedule','day_of','gallery']` (`lib/event-type-profile.ts:180`) — no `rsvp` ⇒ no guest identity ⇒ the whole "no CSAM matcher / no bystander gate" argument collapses. Auto-excluded for the right reason |

**The honest read:** wedding + debut carry the revenue. Everything from row 3 down is spillover at ~zero marginal cost **because the rail is already built and type-blind** — which is precisely why the bar for special-casing any of them is high, and only corporate clears it.

**Access predicate to implement — do NOT hand-maintain an allow-list:**
```
Phase 1: surfaceEnabled(profile,'rsvp') AND event_type IN
         ('wedding','debut','birthday','christening','gender_reveal','graduation')
      OR (event_type='anniversary' AND community_id IS NULL)
Phase 2: + reunion, celebration, gala_night, anniversary (community_id NOT NULL)
Phase 3: + corporate, tournament            [each behind its own gate]
Always denied: travel (explicit deny + code comment), simple_event (falls out of surfaceEnabled)
```

---

## 3. Papic Lite — **KILL.** Not merge, not defer, not "ship dark behind the flag."

**Build state, verified:** `git grep -iE "papic_lite|PAPIC_LITE_ENABLED"` over `apps/web` + `supabase` at `origin/main` → **zero matches.** Not partially built. Entirely a document. **Therefore zero buyers to migrate.**

**Why opening access kills it.** Lite's whole premise is *"non-life events have no guest list, so we need an anonymous-ingest architecture."* Phases 1–3 serve every one of those types on the shipped, NSFW-screened, live-wall-ingesting rail with a **named** guest — a *stronger* RA 10173 basis than anonymous bystander consent. Every other Lite differentiator is a **subtraction** (photos-only · 4 MP · no video · no face-sort · no reels · no Kwento/Pabati/Stories · no Drive). The only thing it *adds* is the anonymous consent model — and that model is what drags in the CSAM matcher and the entire DPO gate. **100% of Lite's cost sits in the 0% of its scope that Buong Araw cannot already cover.**

It is also **revenue-negative against its own replacement**: Lite tops out at ₱15,000 for 100,000 photos with a realistic corporate buy of ₱500–₱2,000, while Buong Araw sells the same event at ₱1,499 flat **with** video, face-sort, reels and 12 MP.

### What killing it saves — itemized

| Deleted | Detail |
|---|---|
| **3 of 12 PRs** | PRs 9/10/11 of `Papic_Build_Brief_2026-07-17.md` = **25% of the entire Papic v3 build** |
| **5 net-new tables + RLS at CREATE** | The brief forbids reusing `papic_photos` / `paparazzi_seats` — a deliberate second storage spine |
| **The highest-risk money code in the plan** | `papic_lite_reserve_capture`: atomic CAS on a single pool row, per-participant fair-use, **compensating decrement on subcap rejection**. The brief already records an operator-precedence bug in a draft that *"matched across pools"* |
| **4 net-new public routes + 2 UIs** | join / capture / claim / report + host dashboard + participant capture — a **second parallel capture surface** |
| **A net-new CSAM known-hash matcher** | Requires a PhotoDNA/NCMEC/IWF relationship a PH sole proprietorship does not have and cannot self-serve. Dossier §7:151 — *"Not yet engaged."* **The single largest unbounded item in the plan.** Mandatory-reporting counsel review attached |
| **A new ROPA class + 3 unanswered DPO questions** | Samahan controller identity · guardian-consent standard · guest-list reuse. Deleting Lite **deletes the questions** rather than answering them |
| **`NEXT_PUBLIC_PAPIC_LITE_ENABLED` + PR-8's Papic-vs-Lite fork** | And with it, the need for a life/non-life predicate that **does not correctly exist in code** (§ 0.3) |

**The CSAM matcher is not deleted — it is DEFERRED to Phase 3**, where it belongs, because corporate/tournament open-crowd ingest needs it regardless of which product name is on the button. That is the one honest cost this ruling carries forward.

**Reclaim the name.** "Papic Lite" currently means three unrelated things: (1) the **vendor on-the-day tier** — shipped, 20 pts, photos-only, in prod copy (`lib/vendor-papic-tier.ts:51`, `lib/vendor-dayof-modules.ts:274`); (2) the **`high_efficiency` fidelity tier** (`lib/papic-fidelity.ts:25`); (3) the dead non-life product. **Keep #1. Rename #2 to "High Efficiency." Delete #3.** One name, one meaning.

**Filing consequence — this is a benefit, not a cost.** Dossier ROPA row 20 must be struck or restated, and §11 item 7's *"is built but flag-OFF"* must be corrected (§ 0.5) **whether or not** Lite is killed, because it is false today. Killing Lite makes that correction a deletion instead of an argument.

**Say the trade out loud:** with Lite dead and Phase 3 gated, **Setnayan does not serve open-crowd events in V1.** That is a deliberate cession of the segment photoshare.ph lists first on its homepage. It is correct — that is where our face-sort moat evaporates, our consent model breaks, and the compliance bill is highest — but it is an owner decision made in daylight, not a consequence discovered when the matcher slips.

---

## 4. Pricing across types — ₱1,499 flat everywhere, with exactly one exception, and no cheap rung

**₱1,499 is right on 11 of 11 opened types at launch.** Reasons:

1. **The catalog physically cannot price by event type.** `platform_retail_catalog_v2` is `service_code`-keyed with no event-type column. Every per-type price is a **new `service_code`** (`PAPIC_GUEST_CORP`, `PAPIC_GUEST_LITE`…) and the ownership/entitlement/bundle matrix in `lib/entitlements.ts` becomes something nobody can reason about at three variants.
2. **One number is the competitive weapon.** photoshare.ph's strength is that a host can compare "₱999" to something. Our `/pricing` page currently answers with a **per-camera ₱30/₱50/₱100 ladder** — the host has to do arithmetic, and we lose before price is even considered.
3. **The cut is already aggressive.** Flat ₱1,499 is −50% at 100 pax, **−66% at 300**, **−74% at 500**.

**The one exception — corporate, and only on evidence.** Corporate is the only type where a *price* change moves more money than an *attach* change (₱180k → ₱600k per 1,000 events). But everything that would justify ₱4,999 is **not a Papic feature**: a BIR Official Receipt (iteration 0026, not built on this path), de-romanced/whitelabel chrome, a negotiated retention term + deletion certificate, and a B2B funnel we do not have. **Ship corporate flat at ₱1,499 in Phase 3; create `PAPIC_GUEST_CORP` only after ≥5 real inbound corporate orders, bundled with those four things.** Building a corporate tier before a corporate customer exists is inventing a market from a spreadsheet.

**Is there a case for a lower price on small/low-stakes types (gender_reveal, graduation, small christenings)? No — and we don't need one, because we already win there.**

| Guest-capture answer | Setnayan | photoshare.ph | EventPix.ph |
|---|---|---|---|
| Free tier | **₱0 — 3 cameras × 20 pts** (`PAPIC_FREE_CAMERA_COUNT`, shipped) | **none** | **none** |
| Cheapest paid | **₱30/camera/day** (Mini — 3 cams = ₱90) | ₱999 | ₱699 |
| Flat event pass | ₱1,499 | ₱999 | ₱699 / ₱1,299 |

**Our sub-₱999 answer already exists, is already shipped, and is an order of magnitude cheaper than either competitor's floor.** A ₱699 rung would (a) anchor the whole family down, (b) drop GM from 88.4% to the low 80s, and (c) fight a two-person outfit with no registered entity and no BIR exposure on the one axis where they structurally always win. **What I would NOT do: match ₱999, build a ₱699 rung, or build the dormant ₱50 "Ltd" rung** — deactivate Ltd instead (one config flip, removes it from every surface via `publicPapicLadder()`), giving an honest **₱0 → ₱30 → ₱100 → ₱1,499** ladder.

---

## 5. What must be true before each phase ships

### Phase 0 — repairs. Nothing reaches a public surface before these. *(These are wedding defects, not expansion work.)*

| # | Gate | Blocks | Why |
|---|---|---|---|
| **0a** | **Pricing-page truth PR** — 20 pts not 60 · 3 free not 5 · Mini not Ltd on the ₱30 row · caps ₱6,000/₱10,000/₱15,000 · deactivate the unbuyable `ltd` rung · owner DB action retitling `PAPIC_CAMERA_ROLL_DAY` | **ALL** | Live consumer-facing defect: the page advertises a rung whose buy path does not exist (`CameraTier` omits `'ltd'`, `papic-cameras.ts:118`; `fetchCameraRates` reads only ROLL+UNLIMITED, :140-146). Extend `lib/papic-copy-guardrails.test.ts` to fail CI on the deactivated rung |
| **0b** | **Kill the pax curve.** `is_pax_priced = FALSE`, `retail_price_php = 1499` on `PAPIC_GUEST`. One UPDATE | **ALL** | § 0.2. This is the competitive fix |
| **0c** | **Event-scoped points pool.** New counter + `papic_record_guest_capture` rewrite + ₱499/+5,000 top-up SKU, enforced fail-closed at **both** seams (`app/api/upload/route.ts:403`, `app/papic/actions.ts:347`). **One atomic PR, no flag — it is money logic** | **ALL** | The shipped quota is **150 credits per guest** (`papic-guest.ts:51`) = ~30,000 captures at 200 pax. A 10,000-pt event pool is a **3× tightening**, and at 150 pax it is **66 pt/guest** — *tighter than today* above 66 pax. **Re-derive the pool from guest count; 10,000 flat is regressive** and, against a competitor advertising "unlimited uploads," is the bound most likely to generate the refund |
| **0d** | **ROPA row for guest-phone captured media** (subjects: guests + incidental attendees; basis § 12(b) + § 12(a); retention per the 2026-07-17 media lifecycle) **+ correct §11 item 7's "built but flag-OFF" claim about Lite** | **ALL** | § 0.5. A filing must not omit the media and must not describe a system that does not exist |
| **0e** | **DPO confirms RSVP consent text names guest-phone capture AND face-sorted delivery** | **ALL** | The monetization verdict's own §8 item 4 — the real gate |
| **0f** | **Reconcile 90 d code vs 6 mo dossier** (`DEFAULT_FULL_RES_RETENTION_DAYS = 90` vs dossier:170) | All **retention copy** | Marketing a retention advantage on top of a filing that overstates it is the fastest route from a pricing win to a regulatory finding |
| **0g** | **De-wedding the guest-camera copy** (`app/papic/guest/page.tsx:57,106,131` — *"for this wedding"*, fallback `'the wedding'`) | Phases 1–3 | Guest-facing on every non-wedding sale |
| **0h** | **Build the event-type predicate + the `add-ons-catalog.ts` entry** (`surface: 'rsvp'`) with an **explicit deny + code comment for `travel`** | Phases 1–3 | § 0.1. `enabledSurfaces` is authored in `/admin/event-types` and **enforced by no runtime surface** — a teammate reading that admin UI will reasonably believe types are gated. They are not |

### Phase 1 — the 7 closed-roster personal types

| Gate | Status |
|---|---|
| All of Phase 0 | ⛔ blocking |
| **Live-wall healing.** Wire `reScreenStuckCaptures` to the Papic studio + guest-hub surfaces and raise `RESCREEN_LIMIT` — **or** accept documented silent drop | ⛔ blocking **if the wall is marketed** as a headline feature. § 0.4: the wall is fail-CLOSED, so the risk is a **dark wall**, not exposure. `vercel.json` `"crons": []` means there is no background pass and the cron-free primitive (`claim_periodic_job`) is the right vehicle |
| **Apply-then-pay latency, stated not fixed.** Couple orders land `pending_approval`; only `admin/payments/actions.ts:207` writes `'paid'`; no gateway on the couple path | ⚠ **not blocking — but it makes Buong Araw a PRE-EVENT purchase sold at RSVP-setup time.** No reception-moment upsell, and a mid-event pool top-up is a **hard stop**, not a soft one. Price and market it accordingly; do not model in-the-moment conversion |
| **Attach telemetry.** `SELECT count(*) FROM orders WHERE service_key='PAPIC_GUEST'` on prod | ⛔ blocking **0b only.** If wedding attach is already >10%, the price cut is expensive and must be re-litigated before the UPDATE lands |

### Phase 2 — reunion · celebration · gala_night · community anniversary

| Gate | Status |
|---|---|
| Phase 1 shipped + 20 measured events | ⛔ |
| **Self-join hardening.** Either (i) `/papic/guest` refuses a session whose guest row is `entry_source='self_added_unlisted'` and un-reconciled by the host, or (ii) DPO explicitly accepts self-declared identity as the basis — **plus a per-event self-join sub-ceiling well under 1,000** | ⛔ blocking. § 0.6: at these types the poster QR makes self-join the *primary* path |
| **A minor safeguard on plain photo capture** | ⛔ blocking. Existing safeguards are **face-only** (`face_recognition_excluded`; `selfie-capture.tsx:90` adults-only). There is no minor safeguard on plain capture on any rail |

### Phase 3 — corporate · tournament

| Gate | Status |
|---|---|
| **CSAM known-hash matcher live** (PhotoDNA/NCMEC/IWF; dossier §7:151 *"Not yet engaged"*) + mandatory-reporting counsel review | ⛔ blocking both |
| **Public takedown/complaint form** + posted-host-notice copy | ⛔ blocking both |
| **Minors-in-crowd notice** (dossier §11 item 7 already drafts it) | ⛔ blocking **tournament** |
| **NPC Circular 16-02 outsourcing / data-sharing agreement instrument + a corporate-controller model in the dossier**, and a product surface to execute it | ⛔ blocking **corporate.** No workaround. Any competent procurement asks for a DPA on day one |
| Face-sort **forced OFF** on these types until the above clear | ⛔ |

---

## 6. The local competitive line — per segment

**The frame, everywhere:** we do not match their coverage; we beat their **shape**. Their coverage (corporate, tournaments, conferences) is served with no named entity, no DPA, no CSAM posture, and a Privacy Policy §7 that contradicts their own 30-day headline. Meeting them there is competing where they have the least to lose and we have a live NPC filing.

| Segment | The sentence in front of the host |
|---|---|
| **Wedding** | *"₱1,499 for your whole wedding day. Every guest's phone is a camera — they scan a QR, no app. Each guest gets their own photos back, face-sorted. **Walang 30-day clock.**"* |
| **Debut** | *"Every one of her friends is already holding the camera. ₱1,499 turns all of them on for the whole night — and each of them gets their own reel."* |
| **Birthday / christening / small events** | *"Start at ₱0 — **libre ang unang tatlong camera**. Kung kulang, ₱30 per camera per day. Isang flat na ₱1,499 kung gusto n'yong lahat ng bisita ay camera."* **(This is the line that wins. Neither competitor has a free tier or a trial — verified.)** |
| **Reunion / celebration / gala** *(P2)* | *"One QR at the door. Everyone shoots, everyone gets their own set back — and it lives beside your guest list, not in a link that expires."* |
| **Corporate** *(P3 only, and only with the paperwork)* | *"₱1,499 per event day, unlimited attendees. Official Receipt issued. Written retention and deletion terms. We sign a data-sharing agreement."* — **do not say any of this before § 5 Phase 3 clears.** |
| **The compare row** | Photos kept **5 years** vs 30 days · **5-second video clips** vs none · **face-sorted delivery** vs scroll-the-album · **your own event site** vs a link · full-res download **included** on both · **no app** on both · **free tier: 3 cameras** vs none |

**Do not ship** *"habambuhay" / "forever" / "kayo lang ang makakabura"* — `Data_Retention_Schedule_2026-07-11.md:15` states indefinite retention is itself a violation. The approved claim is **"5 years,"** because that is what is filed. Ship ***"Walang 30-day clock."***

**Note for the record:** the local floor is **₱699** (EventPix.ph, budget tier), not ₱999 — photoshare.ph is already being undercut 30%. Anchoring strategy on ₱999 anchors on a price that is losing. **And the strategic threat is neither of them: it is Kuha.app**, which is PH-based, wedding-first, sells QR gallery **+ digital invitations + RSVP + guestbook + reception slideshow**, and runs a **white-label Studios & Partners program.** If Kuha signs the photographers and coordinators, we lose the *distribution layer*, which no price move recovers. *(Kuha peso figures were not publicly extractable — treat the tier names as verified and the prices as unknown.)*

---

## 7. Dissent — preserved, because it may be right

**Primary dissent (consent/DPO seat): Phase 2 is being granted on a premise the code does not honour, and Phase 1 is not as clean as this verdict says.** `selfJoinAction` already lets an unverified walk-up mint a `guests` row from a self-typed name behind one shared QR and receive a camera — **on weddings, today, up to 1,000 rows per event.** This verdict's answer is "the same code is safe at a wedding and not at a reunion," which is a judgment about *venues and QR distribution*, not about *code*. **The dissent's position is that the hardening in Phase 2 belongs in Phase 0**, because the door is equally open on a wedding and we are shipping a flat pass onto an unexamined path. If the DPO agrees, Phase 1's timeline moves right and this verdict is wrong about sequencing — though not about scope.

**Secondary dissent (money seat): the price cut is being made blind.** Flat ₱1,499 cuts a 300-pax event 66% and a 500-pax event 74%. **Break-even needs attach to rise ~2.9×–3.9× on the same event base**, and there is **no shipped order telemetry for `PAPIC_GUEST` in the repo** — the current attach rate is genuinely unknown. If it is already double-digit on weddings, the cut is expensive and the correct move is to keep the curve and just add the doorway. This dissent is why § 5 makes the prod query a hard gate on 0b.

**Third dissent (sprawl seat): killing Lite does not go far enough — the per-camera ladder should go too.** With a flat pass on 11 types, the ladder crosses ₱1,499 only at ~15 Unli / 50 Mini shooters, which no event has. Keeping Mini/Unli as peers is arguably sentiment about shipped code. **This verdict keeps them deliberately, because they are the ₱0–₱90 rung that answers a ₱699 competitor** — but if Buong Araw attach lands above 60%, the dissent is right: retire the ladder from the opened types and let the flat pass be the only guest-capture SKU.

**Fourth dissent (red team): we are opening 11 types on a solo-operated day-of product with no scheduler and 24-hour payment reconciliation.** Every Buong Araw failure mode — payment unverified, pool exhausted mid-reception, classifier stuck and the wall going dark — needs a human within minutes on a Saturday night, and there is no human. Opening 11 types multiplies **incident concurrency**, not just revenue. The counter is that Phases 2–3 are separated by months and the concurrency arrives gradually — but if support load is what breaks first, this dissent called it.

---

## 8. Kill criteria — what would prove this ruling wrong

1. **Attach.** Buong Araw attach **< 15%** across the 7 Phase-1 types over 50 measured events → couples buy *shooters*, not *events*. Revert to ladder-hero, keep the pass only inside `PAPIC_UNLOCK`, and do not ship Phase 2.
2. **The cut was expensive.** Prod shows pre-cut `PAPIC_GUEST` attach **> 10%** on weddings → the pax curve was working, the doorway was the only real gap, and 0b should be reverted to `is_pax_priced = TRUE` with a lower increment instead.
3. **Non-wedding types don't convert.** Phase-1 non-wedding attach **< 3%** after 100 events → the 13-types-at-zero-marginal-cost thesis (`project_setnayan_event_type_strategy`) is wrong for *capture specifically*, and Phases 2–3 should be cancelled rather than gated.
4. **Corporate demand is real and immediate.** **≥ 5 inbound corporate leads arriving with a procurement DPA request** before Phase 2 ships → the Circular 16-02 instrument is worth building now, and Phase 3's ordering is wrong.
5. **Lite had a customer.** A real buyer is refused a sale **specifically because their shooters are not on a guest list** (not because of price, not because of features) → the anonymous-ingest capability had attributable revenue and killing it was premature. Rebuild it as an `open_mode` flag on the Buong Araw rail — **never as 5 tables.**
6. **The fence is wrong.** **> 5%** of events breach the event pool → it is a fake door, re-size it. **< 0.5%** ever exceed half the pool → it is theatre and we left pricing power on the table.
7. **Face compute.** If face detection cannot be self-hosted at ~₱0.02/photo and lands on a hosted API at ~₱0.50/photo, face cost rises 25× and unlimited-guest capture is uneconomic at any flat price → **the per-camera meter is right and this verdict is wrong.**
8. **Compliance.** Counsel declines RSVP-consent as the basis for guest browser capture → the pass reduces to a designated-shooter flat pass (~₱999 for 10 cameras) and Phases 2–3 die entirely.
9. **Competitor.** photoshare.ph ships accounts + permanent storage at ₱999, or Kuha.app's white-label partner program signs the top PH wedding photographers → the retention wedge closes / the distribution layer is lost, and this becomes a build fight, not a pricing fight.
10. **Support.** Day-of incidents on non-wedding types exceed what one operator can absorb on a Saturday → freeze at Phase 1 regardless of revenue.

---

## 9. Owner decisions outstanding

1. **Approve the 3-phase scope** — 11 of 14 types, `travel` + `simple_event` permanently excluded in V1. *(This supersedes the memory note directing `event_class` as the Papic predicate — that column is an **ownership** axis, § 0.3.)*
2. **Approve KILLING Papic Lite** — delete PRs 9/10/11 from the build brief, strike ROPA row 20, correct dossier §11 item 7, rename the `high_efficiency` alias, keep "Papic Lite" as the vendor on-the-day tier only. **And accept the stated consequence: Setnayan does not serve open-crowd events in V1.**
3. **Approve flat ₱1,499 across all opened types**, with `PAPIC_GUEST_CORP` evidence-gated at ≥5 inbound corporate orders. **Confirm: no ₱699/₱999 rung is built** — Free (₱0 · 3 cameras) and Mini (₱30/camera/day) are the low-end answer.
4. **Deactivate the unbuyable ₱50 "Ltd" rung** (`papic_tier_config.ltd.is_active = FALSE`) rather than building it. Reverses build-order step 4 of the monetization verdict.
5. **Run the prod query** `SELECT count(*), sum(...) FROM orders WHERE service_key='PAPIC_GUEST'` before the reprice UPDATE lands. This is the only hard data gate in the plan.
6. **DPO:** the guest-media ROPA row (0d) · the RSVP consent-text confirmation (0e) · the 90 d/6 mo reconciliation (0f) · and the Phase-2 ruling on whether `self_added_unlisted` is an acceptable consent basis.
