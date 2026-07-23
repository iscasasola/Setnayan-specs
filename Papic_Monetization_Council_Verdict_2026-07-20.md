# Papic Monetization vs photoshare.ph — Council Verdict (2026-07-20)

> **Status:** 7-lens council → hostile cross-examination of every position → chair synthesis. **All four headline proposals were REJECTED by cross-exam.** This verdict is built from what survived, plus a repo verification pass against `origin/main` @ `4144344ae`.
>
> **Owner brief:** *"use the council to strategize that this should be **monetizing for us**, as we **keep other features as well**."*
>
> **Owner's proposal on the table:** *"Papic Quick — unlimited shots/day, 30 days saving, no keeping of photos to account."*
>
> **Competitor (verified from their live pricing page, owner screenshots 2026-07-20):** photoshare.ph — **₱999 flat per event**, unlimited guest browser uploads via QR (no app), unlimited guests, **30 days cloud storage**, event-day uploads only, full-resolution downloads, real-time projectable photo wall, access controls.
>
> **Canonical siblings:** [`0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md`](0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md) (§ 0 = 2026-07-20 structure lock) · [`Data_Retention_Schedule_2026-07-11.md`](Data_Retention_Schedule_2026-07-11.md) · [`NPC_Privacy_Compliance_Dossier_2026-07-12.md`](NPC_Privacy_Compliance_Dossier_2026-07-12.md).
>
> ## 🔴 **AMENDED 2026-07-20 by [`Papic_Compliance_Delta_2026-07-20.md`](Papic_Compliance_Delta_2026-07-20.md) — three corrections that change how this verdict must be read.**
>
> **(1) §9 open risk 1 is now a fact: there is NO Papic revenue history.** Live prod 2026-07-20: **63 events (62 weddings) · 32 orders (27 paid) · `PAPIC_GUEST` ×1 all-time · `PAPIC_SEATS` ×2 · `PAPIC_ADDON_STORIES` ×1 · `PAPIC_ADDON_THANK_YOU` ×1 · `PAPIC_CAMERA_*` ×0.** Consequently **every number in §1, §5, §6 and §7 — "+₱66/wedding", "≈₱1,099/wedding (87%)", "~16× lift", "₱1.10M vs ₱66k", the 30/50/20 blend, 40% attach — is MODELLED, not measured.** Say MODELLED wherever they are repeated. The upside: the reprice is now free of downside risk (no cohort to lose), and §4's grandfathering sentence describes a cohort of **one order** — honour it, but write no clause.
>
> **(2) §8 item 4's "no new ROPA class" is not true as written.** The dossier has **no ROPA row for Papic-captured photographs and clips at all** — not for the Day Pass, and not for weddings shipping today (row 3 "Event data" does not name media). The correct statement is "**no new *processing* class; one missing ROPA *disclosure* row**", drafted at Delta §2.2 `[PENDING DPO]`.
>
> **(3) §8 items 1–2 and §9 risk 2 are written up with resolutions at Delta §1 — and the block is confirmed.** The "Photos kept: 30 days vs **5 years**" comparison (§7) and the "5 years, not 30 days" framing are **BLOCKED** until the 90 d-code / 6 mo-filing / 5 yr-schedule / "indefinitely" conflict is settled. Note the newly-found facts: the drop sweep is **ON by default** (not dry-run as its own comment claims), and `PAPIC_FULLRES_RETENTION_DAYS=180` resolves it **without a code change**.

---

## 1. The verdict in three sentences

**Setnayan is not losing a price fight — it is losing a SHAPE fight, and the shape is already built in our own repo.** `/api/papic/guest-capture` already ships every guest a browser camera (no app, QR-entered, photos **and** ≤5s clips, NSFW-screened, live-wall-ingesting, Drive-copying) with a per-guest credit pool — it is gated behind `PAPIC_GUEST`, a **₱2,999 SKU that is currently INACTIVE in the catalog**; meanwhile the fail-closed per-camera ladder shipped one day ago (#3407) is margin-positive but revenue-trivial (~₱140/wedding, and it only crosses ₱999 at 13 Unli / 23 Ltd / 37 Mini shooters, which no wedding has). **The money answer is therefore three moves, none of which breaks a lock: (1) reactivate and reprice that rail as one flat per-event-day SKU — Papic Buong Araw ₱1,499 — bounded by the SHIPPED capture-points ledger scoped to the event; (2) un-retire and RESCOPE `HIGH_RES_ARCHIVE` ₱999/yr from per-event to per-ACCOUNT as "Alaala Keep", the only compounding, recurring line in the couple catalog and the direct answer to their "Full-Resolution Downloads" headline; (3) refuse the 2026-07-17 spec-only recut that would have made Kwento/Pabati/Stories free — the render menu stays PAID and fires in days 3–30, exactly while photoshare.ph customers watch a deletion countdown.** Blended, that moves Papic from **+₱66/wedding gross** to **≈ ₱1,099/wedding gross (87%)** — a ~16× lift from a reprice, a rescope and a refusal, with **zero anonymous-ingest build and zero retention-lock override**.

---

## 2. Papic Quick — **ADOPT-MODIFIED (retail shape only). All three defining clauses are REJECTED.**

| Clause of "Papic Quick" | Ruling | What ships instead |
|---|---|---|
| **"unlimited shots/day"** | **MODIFIED** | Unlimited *guests* and unlimited *cameras*; capture bounded by a **10,000-point event pool** (shipped currency: 1 photo = 1 pt · 1×5s clip = 3 pts), soft-stop + one-tap top-up. Unbounded ingest is the only line item with a fat cost tail (a 300-pax free-for-all models at **₱1,146** against a ₱1,499 price = 24% GM). The fence is what makes the flat price safe. |
| **"30 days saving"** | **REJECTED** | Their 30-day window is **cost control dressed as a feature** — a compressed display copy costs us **₱6.96/GB-year on R2-IA**, i.e. ~**₱8–10 per event per year**, and R2 egress is **₱0**. We do not have their problem. Retention stays at the **filed 5-year media schedule** (`Data_Retention_Schedule` row 2). Adopting a 30-day purge would be an override of the 5-year lock, taken **while the NPC filing is mid-flight**, in exchange for a constraint we don't share. |
| **"no keeping of photos to account"** | **REJECTED outright** | The account attachment IS the product. Every downstream peso — face-tagged personal delivery, personal reels, Kwento/Pabati/Stories/Thank You, Alaala, Life-Flash, the anniversary re-entry, the ~150 guest identities per wedding — is reachable **only** through it. This clause is a product engineered to stop our own moat from forming. |

**Also drop the name.** "Quick" is the competitor's framing (fast, disposable, expiring). Ship **Papic Buong Araw** — "the whole day" — which is the framing we actually win on.

---

## 3. Why every headline proposal was rejected (the cross-exam record)

| Position | Proposal | Why it died |
|---|---|---|
| Unit economics | Papic Buo ₱1,999 + Buo Pro ₱4,999; demote ladder | Central arithmetic **sign-inverted** — it paired FREE-tier revenue with PAID-tier capture volume, ignoring the fail-closed gate shipped in #3407 (Shape A assumed 620 pts on a 40-pt budget = 15.5× the enforced ceiling). Recomputed at enforced ceilings the ladder is **+₱66/wedding**, not −₱67. Its conversion mechanic (a paywall that drops **at the reception** and lifts in the moment) is unbuildable on a manually-reconciled 24-hr rail. Vendor leg returns **100.0% of Enterprise subscription revenue** as comped SKU. |
| Filipino couple | Libre ₱0 / Araw ₱999 / Kasal ₱1,999 / Kasal Buo ₱2,999 | The +29% ARPE rests on one invented conversion mix; an honestly-conservative mix gives **−33%**. *"Ang Pangako: kayo lang ang makakabura"* is an unbounded retention promise over ~150 guests who are not the couple's data subjects, shipped mid-filing, against a schedule that states in terms that indefinite retention *"is itself a violation."* Kasal ₱1,999 also underprices its own retained ladder 2.8× (7 days × 8 Unli cams = ₱5,600). |
| Platform moat | Papic Open **₱0**; monetize renders + Alaala Keep | Answers *"this should be monetizing for us"* with **₱0**, and concedes per-event revenue **falls** (₱875 vs their ₱989). Attach rates are applied to the cohort it just selected for price-sensitivity. Self-contradictory: §1 **excludes** face-delivery from Open, §6 runs the entire ₱4,400 fan-out case **through** face-delivery. And ₱100 of Unli buys ₱3,598 of bundled renders with no minimum. |
| Red team | Give away their whole ₱999 product; sell named delivery | Breaks the retention lock in the *opposite* direction (*"kept indefinitely… no 30-day cliff, ever, at any price"* as public marketing). ₱60/wedding omits ingest transcode, face compute (~₱175/wedding at hosted rates — **3× its own claimed total**), and permanent moderation labour on a solo operator. Puts **identity after the shutter** at a wedding with children, mid-filing. And the fence between its free tier and its ₱3,499 money SKU reduces to *an email blast*. |

**What survived, unanimously across all four cross-exams:** reject Papic Quick · fix the live pricing page before anything ships · never charge for viewing, sharing, or per-photo full-res download (egress is ₱0) · do not build anonymous crowd ingest · the ladder stays fail-closed.

---

## 4. The SKU table after the change

| SKU | PHP | Unit | Included | Retention | Build state |
|---|---|---|---|---|---|
| **Papic Free** | **₱0** | 3 cameras × 20 pts | Designated shooters · photos + 5s clips · face-sort · personal reels · gallery on the couple's own event site · per-photo full-res download in window | display **5 yr** · full-res **90 d** | ✅ SHIPPED (#3407, seats at idx 100–102) |
| **Papic Mini** | **₱30** | per camera · day | 20 pts | same | ✅ SHIPPED — ⚠ live ₱30 row is mis-titled *"Papic Ltd"*, owner DB action pending |
| **Papic Ltd** | **₱50** | per camera · day | 70 pts | same | ⚠ **SEEDED but DORMANT** — `papic_tier_config` has `ltd`/70pts, but `lib/papic-cameras.ts` still declares `CameraTier = 'free' \| 'roll' \| 'unlimited'` and reads only ROLL + UNLIMITED SKUs. **The GBB ladder is 2/3 built.** |
| **Papic Unli** | **₱100** | per camera · day | ∞ pts | same | ✅ SHIPPED |
| **★ Papic Buong Araw** | **₱1,499** | **per event-day** | **Every RSVP'd guest's phone is a camera — browser QR, no app download · 10,000 event capture points · Optimal 12 MP · 5-second clips · face-sorted personal delivery to every guest · personal reels · Live Photo Wall (projectable) · per-photo full-res download · gallery on the couple's own Setnayan event site** | display **5 yr** · full-res **90 d** | ⚙ **REPRICE + REACTIVATE `PAPIC_GUEST` (₱2,999 → ₱1,499, currently INACTIVE) on the SHIPPED `/api/papic/guest-capture` rail** + event-scoped points pool |
| Buong Araw top-up | ₱499 | +5,000 pts | Soft-stop, one tap | — | ⚙ same RPC, event scope |
| **Alaala Keep** *(was Keep Full-Res)* | **₱999 / 12 months** | **per ACCOUNT · 50 GB** | Holds full-res originals past the 90-day drop **across every event the account owns** — wedding + anniversary + christening + birthday under one term | full-res held for the paid term, **capped at the filed maximum** | ⚙ **`HIGH_RES_ARCHIVE` is ACTIVE in prod** (migration `20270723385655`, ₱999, cost ₱350, `per_year`) and is the **sole** opt-out from the drop sweep (`papic-fullres-drop.ts:42`, `daily-email-jobs.ts:391`). Rescope per-event → per-account. |
| Kwento | ₱299 | per event | — | — | ✅ live · **stays PAID** |
| Pabati | ₱1,299 | per event | — | — | ✅ live · **stays PAID** |
| Guest Stories | ₱2,000 | per event | — | — | ✅ live · **stays PAID** |
| Thank You | ₱2,499 | per event | — | — | ✅ live · **stays PAID** |
| Patiktok | ₱1,499 | per day | — | — | ✅ live · unchanged |
| Live Photo Wall | ₱2,500 | per event | Standalone for ladder events; **INCLUDED** in Buong Araw | — | ✅ live |
| Papic Lite | ₱100 – ₱15,000 | non-life events | Shared photos-only pool, 4 MP | 5 yr | 🚫 NOT BUILT — **unchanged by this verdict** |

### Retired / merged, and what happens to existing buyers

- **`PAPIC_GUEST` "Papic Guest (Disposable Camera)" ₱2,999 → renamed + repriced to Papic Buong Araw ₱1,499.** Same `service_key` (never-rename lock holds), same rail. The SKU is currently **INACTIVE**, so there is no live buyer cohort; any legacy order is **grandfathered at the 150-credit/guest model, honoured, never downgraded**.
- **`PAPIC_UNLOCK` ₱15,000 and `PAPIC_UNLOCK_LTD` ₱9,000 keep working** and continue to grant the Day Pass — they already grant `PAPIC_GUEST` (verified in `bundle_components`). No existing bundle buyer loses anything; they gain.
- **Nothing is retired from the ladder.** Mini/Ltd/Unli buyers are unaffected. The ladder becomes the *designated-shooter* line and the sub-₱1,499 on-ramp.
- **The 2026-07-17 "Kwento/Pabati/Stories free with tiers" recut is NOT applied.** It was spec-only, never migrated; the shipped catalog already prices all five as paid. **₱3,598 of live list price is retained, not given away** — this is the "keep other features sellable" half of the brief, answered literally.

---

## 5. The money mechanic — with the arithmetic

**Cost basis (stated, all admin-dialable, all currently UNMEASURED):** ₱58 = $1 · R2 Standard $0.015/GB-mo = ₱0.87 · R2-IA $0.010/GB-mo = **₱6.96/GB-yr** · **egress ₱0** · Optimal 12 MP photo ≈ 4 MB · 5s 1080p clip ≈ 10 MB · display AVIF ≈ 8% of original · face vector ≈ ₱0.02/photo · reel render ≈ ₱1 · clip transcode + NSFW screen ≈ ₱0.10 / ₱0.01. Full-res window = the **shipped 90 days** (`DEFAULT_FULL_RES_RETENTION_DAYS = 90`), display copy costed at the **filed 5 years**.

### 5.1 What Papic earns today (corrected — at the ENFORCED points ceilings, not wished-for volume)

| Shape | Paid cams | Revenue | Cost | Net |
|---|---|---|---|---|
| A · intimate, 2 shooters (3 free seats cover it) | 0 | ₱0 | ₱32 | −₱32 |
| B · standard, 5 shooters (2 paid) | 2 | ₱100 | ₱69 | +₱31 |
| C · big, 12 shooters (9 paid) | 9 | ₱450 | ₱150 | +₱300 |

Blended 30/50/20: **revenue ₱140 · cost ₱74 · net +₱66/wedding (47% GM).** A fail-closed meter is margin-positive by construction — but it is **revenue-trivial**, and it only beats a ₱999 flat competitor at **13 Unli / 23 Ltd / 37 Mini shooters**. Nobody has 37 shooters. **That crossover is the real indictment of the ladder, and it survived cross-examination intact.**

### 5.2 What Papic Buong Araw costs us

| | Typical: 150 pax, 40% uploaders (2,700 photos + 300 clips) | At the 10,000-pt fence (8,500 photos + 500 clips) |
|---|---|---|
| Full-res, 90 d, R2 Std | ₱36 | ₱102 |
| Display copy, 5 yr, R2-IA | ₱59 | ₱143 |
| Face vectors | ₱54 | ₱170 |
| Reel renders (~180 × ₱1) | ₱90 | ₱180 |
| Transcode + NSFW screen | ₱60 | ₱135 |
| **Total** | **≈ ₱299 → 80% GM** | **≈ ₱730 → 51% GM** |

**51% at the absolute fence is the acceptable worst case — and the fence exists so that there IS one.** Without the pool bound, a 300-pax free-for-all models at **₱1,146 = 24% GM**; that is precisely the tail that killed the "unlimited" proposals. **Note the cost driver: renders + face compute are 48–60% of marginal cost. Storage is not the problem, and never was.**

### 5.3 Blended revenue per wedding, after

| Line | Price | Attach | Contribution |
|---|---|---|---|
| Papic Buong Araw | ₱1,499 | 40% | ₱600 |
| Ladder residual (non-pass events add shooters) | ~₱180 avg | 60% | ₱108 |
| Kwento | ₱299 | 20% | ₱60 |
| Thank You | ₱2,499 | 10% | ₱250 |
| Guest Stories | ₱2,000 | 5% | ₱100 |
| Pabati | ₱1,299 | 5% | ₱65 |
| Alaala Keep | ₱999/12mo | 8% | ₱80 |
| **Revenue** | | | **₱1,263** |
| Cost (0.40 × ₱299 + 0.60 × ₱74) | | | **₱164** |
| **Gross** | | | **≈ ₱1,099/wedding · 87% GM** |

**vs. +₱66 today = a ~16× lift per wedding.** At 1,000 weddings/yr that is **₱1.10M gross vs ₱66k.**

**Robustness — the model does not depend on the flat SKU landing.** Halve Day-Pass attach to 20%: revenue ₱999, cost ₱120 → **₱879/wedding, still 13×**. That is because **the render menu carries ~₱475 of it at ~99% margin**, and the render menu is exactly the thing the 2026-07-17 recut would have given away. **Refusing that recut is worth more than the new SKU.**

### 5.4 Why ₱1,499 and not ₱999 or ₱1,999

₱999 is their anchor; matching it says "same product, same price" and forfeits the premium on three things they structurally cannot ship — **5-second video clips**, **face-sorted personal delivery + reels**, and **a gallery that lives on the couple's own event site next to their guest list, seating and vendors, for 5 years**. ₱1,999 (2× anchor) risks snapping the comparison back to price. **₱1,499 is 1.5× the anchor, charm-priced, still one number a couple writes in a spreadsheet, and ~0.4% of a ₱400k wedding budget.** It is also the price at which the 51%-at-fence floor holds without a second capacity rung.

---

## 6. Customer-facing framing

**Hero:** *"One price. Every guest's phone is a camera. Your photos stay five years — not thirty days."*
**Sub:** *"₱1,499 for your whole event day. No app to download — your guests scan a QR and shoot."*
**Free hook:** *"**Libre ang unang tatlong camera.**"* (We own the ₱0 slot. They have none.)
**The guarantee — DPO-safe wording:** *"**Walang 30-day clock.**"* → "We don't put a timer on your gallery."

> 🚫 **Do NOT ship** "habambuhay" / "forever" / "kept indefinitely" / "kayo lang ang makakabura" as advertised copy. `Data_Retention_Schedule_2026-07-11.md:15` states in terms that *indefinite retention of personal data is itself a violation* and that "keep everything forever" is not an option. The approved claim is **"5 years"**, because that is what is **filed**. A promise that deletion is impossible is also simply false the first time an RA 10173 erasure request, an NPC order, a takedown, or an account hard-delete lands.

**The compare row that does the work:**

| | photoshare.ph ₱999 | Papic Buong Araw ₱1,499 |
|---|---|---|
| Photos kept | 30 days | **5 years** 🔴 *(BLOCKED as marketing copy — [`Papic_Compliance_Delta_2026-07-20.md`](Papic_Compliance_Delta_2026-07-20.md) §1.4; the filing and the code disagree on our own retention, and no media purge is configured)* |
| Uploads | Event day only | **Event day — plus your designated cameras, any day** |
| Video | — | **5-second clips** |
| Finding your photos | Scroll the whole album | **Face-sorted and delivered to each guest** |
| Your own reel | — | **Personal reel, template-rendered, free** |
| Where it lives | A link | **Your own Setnayan event site, beside your guest list, seating and vendors** |
| Full-res download | Included | **Included** |
| App download | None | **None** |

**Voice rule (kept from the council):** Filipino for product names and the two anchor words only. Spine stays English — full Taglish body copy reads downmarket to the segment paying ₱300k+ for the wedding.

---

## 7. Locked constraints — what's defended, and the three overrides the owner must consciously grant

**DEFENDED, NOT BROKEN:**

- **"Don't auto-delete photos within 5 years"** + `Data_Retention_Schedule` 5-yr media default + the mid-flight NPC filing's stated posture. This verdict exists to keep it; rejecting Papic Quick is the reason.
- **0% commission · no customer-side convenience fee · apply-then-pay, PHP-direct.** No optimistic activation, no rake, no per-shot fee. **Consequence, stated plainly: the Day Pass is a PRE-EVENT purchase sold at RSVP-setup time, not a reception-moment upsell.** Both the "reception paywall" and the "morning-after peak-emotion" mechanics are dead on this rail, and the alternative — activating unlimited ingest on an unreconciled reference code, with no chargeback function — is worse.
- **5-second clip cap** (enforced at `MAX_CLIP_MS = 5000` in the guest route *and* clamped `LEAST(ms,5000)` in the RPC) · max 10 tags/photo · untagged-still-delivered · per-event-scoped face vectors · Setnayan AI deterministic + free (Rule 1).
- **"Pay for access, not transactions / monetize the doorway, never the deal."** A flat per-event-day pass IS access. Note the corollary: the per-camera-per-day meter is the **least** philosophy-aligned SKU in the couple catalog, because metering each shot monetizes the transaction.

**OVERRIDE #1 — un-retire Keep Full-Res.** GBB § 3 (owner, 2026-07-17): *"Keep Full-Res is RETIRED entirely. There is no paid full-res hosting."* This verdict un-retires it and rescopes it per-account as **Alaala Keep**. Grounds: it was **never coded** — `HIGH_RES_ARCHIVE` is ACTIVE in `origin/main` and in prod, it is the **sole** opt-out from the shipped drop sweep, and it is the **only recurring line** in the couple catalog. Retiring it means every event's originals die at the window with **no paid way to keep them** — worse for the customer *and* it deletes the answer to their loudest headline. **Owner must formally withdraw the retirement.**

**OVERRIDE #2 — keep Kwento / Pabati / Guest Stories PAID.** GBB § 9 / *"add-ons now FREE with tiers."* Cheap override: spec-only, never migrated, and the shipped catalog already prices them paid. **₱3,598 of live list price retained.**

**OVERRIDE #3 — a flat event-level pass on the LIFE side.** The 2026-07-20 structure lock says *"Papic Lite = NON-LIFE · Mini/Ltd/Unli = LIFE."* Buong Araw is a flat, event-level product on the **life** side. It is **not** Papic Lite (video ON, face-sort ON, reels ON, Optimal 12 MP, guest-list-backed), so the "Lite = non-life" half is untouched — but the "life events are served by the per-camera ladder" half needs a signed delta: **life events may also buy one flat event pass.**

**NOT GRANTED, explicitly:** no anonymous browser ingest (identity stays RSVP-backed) · no optimistic activation on reference-code submission · no 30-day retention class · no "forever" in copy · no free renders.

---

## 8. DPO / counsel items — two of these are on the critical path

1. **🔴 BLOCKING THE COPY, NOT THE SKU — a filed document misstates shipped reality.** `NPC_Privacy_Compliance_Dossier_2026-07-12.md:170` tells the regulator full-res is kept **6 months**; the shipped constant is **`DEFAULT_FULL_RES_RETENTION_DAYS = 90`** (`lib/papic-fullres-drop-core.ts:10`); the GBB spec also says 6 months. **Either change the constant or amend the filing — before one word of retention marketing ships.** Marketing a retention advantage on top of a filing that overstates it is the worst possible sequencing.
2. **🔴 The filing must carry the retention LADDER, not one line, and a paid extension must be capped at the filed maximum.** Four schedules now exist: full-res **90 d** · display copy **5 yr** (filed default) · face vectors **~5 yr** expiry · **Alaala Keep paid hold**. Under RA 10173 storage limitation, a retention period is bound to a **declared purpose** — it is not a dial a paying customer buys upward without limit. **DPO must rule: is a paid full-res hold permissible, and what is its ceiling?** If the answer is no, Alaala Keep must be repositioned as a Drive-sync/export convenience rather than a retention product. *(This is the single most consequential ruling in this doc — Leg 2 of the money mechanic depends on it.)*
3. **Also in dossier line 170: "a compressed web copy … retained indefinitely."** That contradicts `Data_Retention_Schedule` row 2 (media = 5 years) **and** § 15 ("indefinite retention … is itself a violation"). Settle to **5 years** across doc, filing and copy.
4. **Confirm the Day Pass consent basis.** Guest browser capture rides `readGuestSession()` — a **named, RSVP-identified guest**, not an anonymous walk-up. Consent-at-RSVP therefore covers it, which is why this verdict needs **no** net-new CSAM known-hash matcher, no bystander-consent gate, and no new ROPA class. **DPO must confirm the RSVP consent text actually names guest-phone capture and face-sorted delivery** — if it doesn't, that copy edit is the real gate. 🔴 **2026-07-20 — it appears NOT to.** The verbatim copy was pulled from `origin/main` `5b72d625d` and is quoted in full at [`Papic_Compliance_Delta_2026-07-20.md`](Papic_Compliance_Delta_2026-07-20.md) §4.2: the RSVP form's only photo-consent text is the optional biometric block, which names *"facial-recognition photo matching for this event"* and *"the **photographers** can find your candid shots"* — **it never says other guests' phones are the cameras**, and `photo_consent` is **defaulted `true` by the system, never asked**. **And "no new ROPA class" is wrong as written** — see the header amendment (2) and Delta §2.2.
5. **🟠 Live Photo Wall + fail-open NSFW.** `lib/nsfw-screen.ts` fails **OPEN** — on any error the row stays unscreened and remains visible on guest/public surfaces. That posture was tolerable when uploaders were a handful of named seat-holders; the Day Pass makes a **projected** wall a headline feature at the exact moment every guest phone is shooting. **The wall must render screened rows only (or gain a host-approval queue) before the Day Pass goes public.** This is a build gate no pricing decision fixes.
6. Papic Lite's open items (Samahan controller question, guardian-consent standard, CSAM matcher) are **untouched and still block `NEXT_PUBLIC_PAPIC_LITE_ENABLED`** — but they no longer block Papic monetization, because this verdict does not route life events through Lite.

---

## 9. Build order — shipped vs net-new

**Already in `origin/main` (reuse, don't rebuild):**

- `events.papic_quality_tier` (`full_res | optimal | high_efficiency`, default `full_res`) + `lib/papic-ingest-fidelity.ts` on **both** capture chains — PR #3416.
- Full-res drop sweep + Drive-aware defer guard — `lib/papic-fullres-drop{,-core}.ts`, PR #3420.
- **Fail-closed capture-points ledger** — `papic_reserve_camera_points` / `papic_camera_points_remaining`, 409 `camera_points_exhausted` at both seams (`app/api/upload/route.ts:403`, `app/papic/actions.ts:347`) — PR #3407.
- **`HIGH_RES_ARCHIVE` ₱999/yr ACTIVE** + drop-sweep opt-out + buy surface (`studio/papic/page.tsx:446`).
- **`/api/papic/guest-capture`** — guest-session identity, credit pool RPC, photos **and** ≤5s clips, `screenCapture`, `ingestToWall`, `enqueueDriveCopy`.
- `papic_tier_config` (free 20 · mini 20 · roll 20 · ltd 70 · unli ∞) · face enrollment/tagging · personal reels · live wall · the five render SKUs.

**Net-new, in order — nothing reaches a public surface before step 1:**

1. **Pricing-page truth PR (BLOCKING).** `app/pricing/page.tsx`, `_components/home/pricing-data.ts`, `studio/papic/guest-camera-tier-picker.tsx`, `public/llms.txt`, `lib/v2-catalog.ts` comment: **20 pts not 60** · **3 free not 5** · **Mini not Ltd** on the ₱30 row · caps **₱6,000 / ₱10,000 / ₱15,000** not ₱9,000. **+ the pending OWNER DB action** re-titling `PAPIC_CAMERA_ROLL_DAY` → "Papic Mini". Launching a retention guarantee on a page that overstates capacity 3× is how you earn a chargeback and, mid-filing, a complaint.
2. **Reactivate + reprice `PAPIC_GUEST` ₱2,999 → ₱1,499, retitle "Papic Buong Araw."** One migration. **Zero new application code** — the rail is built.
3. **Event-scoped points pool.** Extend the shipped points RPCs to consult an event-level budget row (10,000 pts) alongside the per-seat one, so **both** fail-closed seams enforce it; replaces the per-guest 150-credit pool on Day-Pass events. Reuses `papic_tier_config`'s shape. ~1 migration + 2 seam edits + tests. **One atomic PR, no flag — it is money logic one week after #3407 shipped specifically to refuse this.**
4. **Ship the dormant Ltd ₱50 rung.** `CameraTier` is still `'free' | 'roll' | 'unlimited'` and `PAPIC_LTD_CAP_FALLBACK_PHP` is commented *"dormant until the Ltd selection ships."* The owner-locked ladder is only 2/3 built, and step 1's copy cannot be fully honest until it is.
5. **Wall safety** — `ingestToWall` renders screened rows only (or host-approve). Gates the public Day Pass.
6. **Rescope `HIGH_RES_ARCHIVE` per-event → per-account ("Alaala Keep"),** surface on `/dashboard` Home per `Pricing.md § 00.G #5`, point the drop-sweep opt-out at the account grant, add a **T-30 prepaid-term nudge** on the existing `daily-email-jobs` rail (which already reads this SKU at `:391`). **Ships as a prepaid 12-month term, NOT auto-renew** — recurring billing is unbuilt and PayMongo is owner-locked but not live. Say "12 months," never "subscription."
7. **The compare page + the marketing line** — last, and only after item 1 of § 8 is settled.

---

## 10. Dissent — preserved, because it may be right

**Primary dissent (unit economics): "keep both" is a hedge; the ladder should be demoted to a line item, not kept as a peer.** Its negative-margin headline was refuted — a fail-closed meter is margin-positive by construction (+₱66/wedding, not −₱67) — **but its crossover arithmetic survived cross-examination completely**, because it depends only on published prices and the free-camera count: per-camera revenue crosses ₱999 only at **13 Unli / 23 Ltd / 37 Mini shooters**. That means the ladder is simultaneously **margin-positive and revenue-irrelevant**, and this verdict's decision to keep it as a peer product on weddings may just be sentiment about shipped code. **If Day-Pass attach lands above 60%, the dissent was right:** retire Mini and Unli from weddings, keep them for life non-wedding types, and let the flat pass be the only wedding capture SKU. Revisit at 50 measured weddings.

**Secondary dissent (platform moat): the storage arithmetic that justifies giving things away is correct, and this verdict leans on it without following it to its conclusion.** A compressed gallery costs **₱8.35/event/yr** — one ₱299 Kwento funds 36 event-years. The moat seat's conclusion (make the competitor's *entire* product ₱0 and monetize only downstream) was rejected because it answers "monetize" with ₱0 and because it needed anonymous ingest — **but if Day-Pass attach comes in under 15%, the correct next move is that model, not a price cut**, because at that point couples have told us they will not buy capture at any price and the money is genuinely downstream.

**Third dissent (red team), worth keeping on the record:** *capture is a commodity and we just watched it get priced at ₱999 and falling; named delivery to a person you already know by name, table and email is not.* This verdict prices the commodity at ₱1,499 — a premium justified by video + delivery + retention + the event site. **If photoshare.ph responds by adding accounts and permanent storage at ₱999, that premium evaporates and the fight moves from pricing to build (face-delivery, reels, the event site) overnight.**

---

## 11. Top 3 risks

1. **Day-Pass attach is the single load-bearing unmeasured number.** 40% is assumed, and there is **literally zero Papic revenue history** — points enforcement shipped one day before this council. The model survives at 20% (₱879/wedding) but the flat-SKU thesis itself is unproven, and every proposal in this council rested on an invented attach rate.
2. **A filed document misstates shipped reality (90 d code vs 6 mo dossier), and this verdict's headline claim is a retention claim.** Marketing "5 years, not 30 days" on top of a filing that is wrong about our own constant is the fastest route from a pricing win to a regulatory finding. **This blocks the copy, not the SKU.**
3. **Projected Live Photo Wall × fail-open NSFW × unlimited guest phones.** The failure mode is not a bad photo in a gallery — it is unscreened content on a projector in front of 150 people including the couple's parents, at an event a solo operator is not staffing. Making the wall a headline feature multiplies the exposure the same week the Day Pass launches.

*(Honourable mention, deliberately not top-3 because it is bounded: the couple catalog now carries six Papic states — Free / Mini / Ltd / Unli / Buong Araw / Lite — on a surface that already ships two products named "Papic Lite" and a ₱30 row mis-titled "Papic Ltd". Step 1 of the build order exists to clear that before step 2 adds to it.)*

## 12. Kill criteria for the recommended model

1. **Attach.** Day-Pass attach **< 15%** over 60 days / 50 weddings **while** ladder attach **> 40%** → PH couples buy *shooters*, not *events*. Revert to ladder-hero and keep the pass only inside `PAPIC_UNLOCK`.
2. **Cost.** Measured Optimal photo **> 7 MB**, **or** typical Day-Pass events **> 8,000 captures** → per-event cost passes ₱600 and GM falls under 60%. Then ₱1,499 → ₱1,999, **or** the pool drops 10,000 → 6,000 points. Do **not** shrink the gallery.
3. **Face compute.** If face detection cannot be self-hosted at ~₱0.02/photo and lands on a hosted vision API at ~₱0.50/photo, face cost rises **25×** (₱54 → ₱1,350 on a typical event) and unlimited-guest capture is uneconomic at **any** flat price. **In that world the per-camera meter is right and this verdict is wrong.**
4. **The fence.** **> 5%** of Day-Pass events breaching 10,000 points → the fence is a fake door; re-price or re-size. **< 0.5%** ever exceeding 5,000 points → the fence is theatre and we are leaving pricing power on the table.
5. **Permanence isn't a product.** At the 90-day cliff, Alaala Keep attach **< 3%** AND Drive-connect **< 20%** → couples don't value originals. Kill the SKU and fund storage from the Day Pass.
6. **Compliance.** DPO rules a **paid retention extension is impermissible** under the declared purpose → Leg 2 dies as a retention product and must reposition as sync/export. **Or** counsel declines RSVP-consent as the basis for guest browser capture → the Day Pass reduces to a designated-shooter flat pass (~₱999 for 10 cameras, unlimited points).
7. **Infrastructure.** Cloudflare introduces R2 egress charges **or** raises storage **> 2×** → free downloads and the 5-year display copy collapse, a 30-day window becomes rational, and **the owner's Papic Quick instinct was right after all.** Free egress is load-bearing for this entire verdict; monitor it as a strategic dependency, not a line item.
8. **Competitor.** photoshare.ph ships accounts + permanent storage at ₱999 → the retention wedge closes and this is a build fight, not a pricing fight. Re-run the model.

---

## 13. Owner decisions outstanding

1. **Grant or refuse the three overrides** (§ 7): un-retire Keep Full-Res → Alaala Keep · keep Kwento/Pabati/Stories PAID · allow a flat event pass on the LIFE side.
2. **Price the Day Pass: ₱999 (match) / ₱1,499 (recommended) / ₱1,999 (2× anchor).** Council genuinely split; chair recommends **₱1,499**.
3. **Settle the retention number — 90 days or 6 months for full-res** — and amend either the constant or the NPC dossier accordingly. **Blocks all retention copy.**
4. **Ship the dormant Ltd ₱50 rung, or formally collapse the ladder to Free / Mini / Unli.** It cannot stay half-built while the pricing page claims it exists.
5. **The pending DB action** re-titling the live ₱30 row to "Papic Mini" (and whether `PAPIC_CAMERA_MINI_DAY` becomes the sole ₱30 SKU) — unchanged from 2026-07-20, still blocking honest copy.
6. **Rename one of the two live "Papic Lite" products** (crowd pool vs `lib/vendor-papic-tier.ts:51` vendor on-the-day tier) before either surfaces publicly.
7. **Confirm the Day Pass is pre-event only** — i.e. accept that apply-then-pay forecloses the reception-moment upsell, rather than loosening payment verification to chase it.
