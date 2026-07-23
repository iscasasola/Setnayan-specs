# Papic Compliance Delta — three filing defects, one DPO question (2026-07-20)

> **Status:** compliance correction pass over the two 2026-07-20 Papic council verdicts. Every claim below was re-verified this session against the corpus files and against the **read-only** repo at `origin/main` @ `5b72d625d`. No code, no schema, and no DB were touched.
>
> **What this document is:** the written record of (1) a decisive live-prod fact that supersedes the attach-rate assumptions in both verdicts, (2) three defects in the mid-flight NPC submission draft, and (3) the single DPO ruling that the entire Papic access expansion rests on.
>
> **Parents:** [`Papic_Access_Scope_Council_Verdict_2026-07-20.md`](Papic_Access_Scope_Council_Verdict_2026-07-20.md) (items 0d · 0e · 0f) · [`Papic_Monetization_Council_Verdict_2026-07-20.md`](Papic_Monetization_Council_Verdict_2026-07-20.md) (§ 8 open items 1 · 2 · 4).
> **Filing:** [`NPC_Privacy_Compliance_Dossier_2026-07-12.md`](NPC_Privacy_Compliance_Dossier_2026-07-12.md) · [`Data_Retention_Schedule_2026-07-11.md`](Data_Retention_Schedule_2026-07-11.md) · [`0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md`](0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md).

---

## 0. Read this first — the prod query is in, and it re-bases both verdicts

Queried against live production, 2026-07-20:

| Measure | Value |
|---|---|
| Total events | **63** (62 weddings) |
| Upcoming events | **6** |
| Total orders | **32** (27 paid) |
| `PAPIC_GUEST` orders, all time | **1** (2026-06-08) |
| `PAPIC_SEATS` orders, all time | **2** |
| `PAPIC_ADDON_STORIES` / `PAPIC_ADDON_THANK_YOU` | **1 each** |
| `PAPIC_CAMERA_*` orders, all time | **0 — none, ever** |

**Three consequences that propagate everywhere:**

**(a) Setnayan is pre-revenue on Papic. The hard data gate is PASSED, and it passed in the direction that unblocks.**
The access verdict § 5 made the prod `PAPIC_GUEST` query a **hard gate** on item 0b (the reprice), and its secondary money-seat dissent objected that *"the price cut is being made blind… if attach is already double-digit on weddings, the cut is expensive."* The query answers it: **five Papic orders in the platform's life, across 63 events.** There is no attach rate to protect. The ₱2,999 → ₱1,499 reprice and the removal of the `computePaxPriceCentavos` pax curve therefore **cost nothing measurable**, and the dissent — which was correct to demand the number — is resolved by it rather than sustained. *0b is unblocked on data; it remains gated on the copy defect in § 1 only insofar as it carries retention marketing.*

**(b) There are no `PAPIC_CAMERA_*` buyers, so nothing needs grandfathering. Do not write a grandfathering clause.**
The roll-vs-mini rename (₱30 rung → **Papic Mini**) and any per-tier capacity change touch **zero existing orders**. The monetization verdict § 4's *"any legacy order is grandfathered at the 150-credit/guest model, honoured, never downgraded"* is describing a cohort of **one order from 2026-06-08** for a different SKU (`PAPIC_GUEST`), not a camera-ladder cohort. Honour that single order; write no clause. A grandfathering clause with no beneficiaries is dead code in a spec — it becomes a constraint nobody can later delete because nobody remembers it was empty.

**(c) Every revenue number in both verdicts is a MODEL, not a measurement — label it as such at every repetition.**
"+₱66/wedding gross today", "≈ ₱1,099/wedding gross (87%)", "~16× lift", "₱1.10M vs ₱66k at 1,000 weddings/yr", the 30/50/20 tier blend, the 40% Day-Pass attach — **none of these is derived from observed orders.** They are derived from published prices multiplied by assumed adoption. The monetization verdict's own § 9 open risk 1 already concedes *"there is literally zero Papic revenue history"*; this query converts that concession into a fact. **Every one of those figures must carry the word MODELLED wherever it is repeated**, including in any owner-facing summary, board note, or pricing page rationale. Presenting a model as a measurement is how a pricing decision becomes a belief.

---

## 1. Defect 1 (item 0f) — the filing contradicts shipped code. **BLOCKS all retention marketing copy.**

### 1.1 The conflict, stated exactly

`NPC_Privacy_Compliance_Dossier_2026-07-12.md:170` (§ 8a, "Papic media lifecycle (2026-07-17)") tells the regulator, in one sentence, **two things that are each contradicted by a different artifact**:

| # | Artifact | What it says | Verified at |
|---|---|---|---|
| A | **The filing** — dossier `:170` | Full-res kept **6 months**; compressed web copy retained **"indefinitely"** | corpus, this session |
| B | **The shipped code** | `export const DEFAULT_FULL_RES_RETENTION_DAYS = 90;` | `apps/web/lib/papic-fullres-drop-core.ts:10` @ `5b72d625d` |
| C | **The owner lock** — GBB pricing spec | *"full-res free window **3 → 6 months**"* (owner sign-off 2026-07-17); *"After 6 months only the compressed gallery remains (**kept forever**)"* | `0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md:9, :124, :143` |
| D | **The filed retention schedule** | Media (Papic photos/video, gallery, reels) = **5 years** from `event_date`, "hot 90 d → cold → purge", mechanism *"R2 lifecycle expiry"* | `Data_Retention_Schedule_2026-07-11.md:27` (row 2) |
| E | **The storage-limitation principle we filed under** | *"Indefinite retention of personal data is itself a violation and a breach-surface liability. 'Keep everything forever' is **not** an option for personal data."* | `Data_Retention_Schedule_2026-07-11.md:15` |

⚠ **Attribution correction:** statement E is at **`Data_Retention_Schedule_2026-07-11.md:15`**, not at "dossier § 15". The dossier has **eleven sections** and no § 15. The principle is filed, and it is ours — but it is filed in the companion schedule, and any note citing it must cite the right document.

So the conflict is genuinely three-way on the full-res number (A=6 mo · B=90 d · C=6 mo) and three-way again on the compressed copy (A="indefinitely" · C="kept forever" · D=5 years, against principle E).

### 1.2 Two things the verification pass added that the verdicts did not have

**(i) The 90-day drop is LIVE BY DEFAULT — this divergence is operative, not theoretical.**
`apps/web/lib/papic-fullres-drop.ts:161` reads `return process.env.PAPIC_FULLRES_DROP_ENABLED !== 'false';` — i.e. **enabled unless explicitly disabled** (owner 2026-07-11 "enable the drop"). The module's own header comment at `:26` still says it *"ships DRY-RUN by default: it deletes NOTHING unless PAPIC_FULLRES_DROP_ENABLED='true'"* — **the comment is stale and inverts the actual predicate.** Nothing has been dropped yet only because prod holds sample photos and no real capture has aged past 90 days (the code says so at `:159-160`). The first real couple photo to cross 90 days will be deleted **three months before the date we gave the NPC**.

**(ii) There is a resolution that requires no code change at all.**
`papic-fullres-drop.ts:164-167` reads an env override: `PAPIC_FULLRES_RETENTION_DAYS`, falling back to the 90-day constant. **Setting `PAPIC_FULLRES_RETENTION_DAYS=180` on Vercel aligns the running system to the filing and to the owner's 2026-07-17 lock without a PR.** That converts Resolution A below from an engineering task into an owner action.

**(iii) The compressed copy is, today, genuinely indefinite — because no media purge exists.**
The only retention sweep shipped is `apps/web/lib/retention-sweep.ts` → `purge_expired_chat(p_years: 5)` — **chat threads only**. No sweep, job, or lifecycle rule deletes media. `Data_Retention_Schedule_2026-07-11.md:56` says it plainly: *"R2 lifecycle: **NOT configured** — hot→cold tiering + expiry exist only as prose."* So the dossier's word "indefinitely" is **accurate to the running system and inaccurate to the schedule we filed alongside it.** That is the more serious half of this defect, and it is the half the verdicts did not name.

### 1.3 The two clean resolutions — pick one, and only one

**Resolution A — align the system to the filing (180 days).**
- *Action:* set `PAPIC_FULLRES_RETENTION_DAYS=180` on Vercel (owner action, no PR), then follow with a PR changing `DEFAULT_FULL_RES_RETENTION_DAYS` to `180` so the constant and the env agree and the stale `:26` docblock is corrected.
- *Consequence:* **honours the owner's 2026-07-17 lock** (artifact C) and requires **no amendment to a mid-flight filing** — the cleanest regulatory posture. Full-res R2 storage cost on the hot tier roughly doubles per event (the monetization verdict costed full-res at ₱36–₱102/event over 90 days; at 180 days assume ~2× that line, which on a ₱1,499 SKU is immaterial). Shrinks the runway for the `HIGH_RES_ARCHIVE` / "Alaala Keep" paid-hold pitch — a paid extension is a weaker sell when the free window is already six months. The couple-facing "download before it drops" nudge copy must be re-dated.

**Resolution B — align the filing to the system (90 days).**
- *Action:* amend `NPC_Privacy_Compliance_Dossier_2026-07-12.md:170` **before lodging**; also amend `0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md:9, :124, :143` and any `Pricing.md § 2.1` retention prose.
- *Consequence:* **reverses an owner decision taken 2026-07-17** ("3 → 6 months") — so it is not a documentation fix, it is a product decision that needs the owner to re-decide. Cheapest storage; strongest Alaala Keep positioning. Costs the couple three months of free full-res, which is the thing the 2026-07-17 lock was granted to give them. Requires editing a submission draft in flight, which is ordinary and fine **provided it is done before lodging, not after**.

**Not optional either way — the "indefinitely" word.** Whichever resolution is chosen, dossier `:170` must stop telling the regulator the compressed copy is retained *indefinitely*, because that directly contradicts the 5-year media period in the schedule filed with it (D) and the storage-limitation principle stated in it (E). Restate it as **"retained for 5 years from the event date per the Data Retention Schedule row 2 *(counsel)*, then purged"** — **and configure the R2 lifecycle rule that actually does it.** Restating without configuring replaces a true-but-unlawful-sounding statement with a false one, which is worse: it would put a control in the filing that does not exist, exactly the defect § 3 below is about.

### 1.4 What this blocks, and what it does not

🔴 **BLOCKING:** all retention marketing copy. Specifically the **"Photos kept: 30 days vs 5 years"** comparison table at `Papic_Monetization_Council_Verdict_2026-07-20.md:139`, the "**5 years, not 30 days**" framing at `:218`, and every downstream use of it — pricing page, competitor-comparison copy, Day-Pass merchandising, onboarding. **Not one word of retention marketing ships until § 1.3 is resolved.** Marketing a retention advantage on top of a filing that misstates our own constant is the fastest route from a pricing win to a regulatory finding.

🟢 **NOT blocking:** the reprice itself (`PAPIC_GUEST` ₱2,999 → ₱1,499), the pax-curve removal, the SKU rename, the Phase-1 access expansion. Those carry no retention claim.

### 1.5 Precision: inaccurate ≠ unlawful

These are different and only the first is established.

- **Established:** a document intended for the NPC states a retention period (6 months) that the running system does not implement (90 days), and states a retention posture ("indefinitely") that the schedule filed beside it contradicts (5 years). That is an **accuracy defect in an unlodged draft.** It is fixable by editing a file, and it is being fixed here.
- **Not established:** any unlawful processing. On the full-res number the system deletes **earlier** than declared — deleting sooner than announced is not a storage-limitation breach, it is at worst a service-promise gap with the couple. On the compressed copy the direction is the adverse one (indefinite retention of personal data), but the 5-year period it would breach is itself marked *(counsel)* and unratified, the draft has not been lodged, and no data subject has been denied a right. **Nothing here supports a finding that Setnayan is doing something unlawful.** It supports exactly one finding: **do not lodge, and do not market, until these lines agree.**

---

## 2. Defect 2 (item 0d) — the ROPA has no row for guest-phone captured media

### 2.1 The gap, verified

All twenty ROPA rows at `NPC_Privacy_Compliance_Dossier_2026-07-12.md:47-66` were read in full:

- **Row 3** — *"Event data — guest lists, vendor records, budget items, schedule, mood-board palettes"*. **Does not name photographs, video, or media of any kind.**
- **Row 11** — biometric facial-geometry **vectors** (the matching *input*, not the photos).
- **Row 13** — guest RSVP details, including *"photo/face-recognition **preferences**"* (a preference flag, not the media).
- **Row 20** — **Papic Lite**, and only Lite (gated, and per § 3 below, non-existent and now cancelled).

**No row covers the photographs and ≤5-second clips that Papic captures today.** The consequence for the councils is direct: `Papic_Monetization_Council_Verdict_2026-07-20.md:176` asserts this verdict *"needs no… new ROPA class"*. **That is untrue as written — and untrue for weddings shipping today, not merely for the proposed expansion.**

**But state the correct version too, because it changes the remedy.** The Day Pass introduces **no new *processing*** — the `/api/papic/guest-capture` rail, the NSFW screen, the live wall, the Drive copy and the points ledger are all shipped and running against real weddings. What is missing is the **disclosure**. This is a **ROPA omission**, not an unlawful new processing activity. The fix is a paragraph, not a build.

### 2.2 Draft ROPA row — for insertion in the dossier's § 3 table

Insert as **row 21**, in the dossier's own seven-column format. Row 20 is struck per § 3.

> | 21 | **Papic captured media** — photographs and **≤5-second video clips** taken at the event on (i) host-designated shooter phones and (ii) RSVP'd guests' own phone browsers, plus the derived **compressed display/thumbnail copies**, the per-capture technical metadata (`captured_at`, coarse geolocation where a device fix is available, `device_model`, and paired camera brand/model where a camera is bridged), and the **photo↔guest tag records** (QR scan, manual pick, or — only where ROPA 11 consent exists — face match). **Captured images may incidentally include persons who are not on the guest roster** (other guests' companions, venue and vendor staff, passers-by in a shared venue). | Guests photographed at the event; the couple / host; incidentally-captured attendees, vendor crew and venue staff | Deliver the event photo-and-video gallery to the couple or host who purchased the capture service, and deliver each guest their own tagged photos; produce the couple- and guest-initiated renders (personal reels, Kwento, Pabati, Guest Stories, Thank You Video) from that media | § 12(b) **contract** — the couple/host is the paying party and capture-and-delivery is the service purchased; § 12(a) **consent** for a guest's own participation as a shooter, given by the named, session-authenticated guest at RSVP *(⚠ see § 4 — the adequacy of the current RSVP wording is the open DPO question)*; § 12(f) **legitimate interest** for incidental background capture at a private social gathering the subject is attending, balanced against a posted-host-notice and the takedown route in § 6 *(counsel)*. **Face-matched tagging never rides these bases** — it rides § 13(a) explicit opt-in only (ROPA 11) | **Full-resolution original:** the declared free window, after which our copy is dropped unless the couple synced it to their own Google Drive or holds `HIGH_RES_ARCHIVE` — **window value [PENDING — see § 1.3; 90 d in code vs 6 mo filed]**. **Compressed display copy:** 5 years from `event_date` per Data Retention Schedule row 2 *(counsel)* — **[PENDING the R2 lifecycle rule that enforces it, § 1.3]**. **Tags:** deleted with the guest record. NSFW screening is applied at ingest and cannot be disabled | **Active** — shipped and collecting on real events today (`app/papic/actions.ts`, `app/api/papic/guest-capture/route.ts` @ `origin/main` `5b72d625d`). ⚠ **This processing was live and unrepresented in the ROPA at dossier v2.0 (2026-07-13); this row closes that omission** |

**`[PENDING DPO]`** — the row is drafted, not adopted. The DPO must rule on: the § 12(f) basis for incidental capture; whether the § 12(a) leg survives § 4; and the two retention values left open by § 1.3.

### 2.3 Knock-on edits

- `Papic_Monetization_Council_Verdict_2026-07-20.md:176` — replace *"no new ROPA class"* with *"no new **processing** class; one **ROPA disclosure row** was missing for media already being captured and is drafted in `Papic_Compliance_Delta_2026-07-20.md` § 2.2."*
- `Papic_Access_Scope_Council_Verdict_2026-07-20.md:38` (§ 0.5) — already states the gap correctly; add the pointer to § 2.2 for the drafted text.

---

## 3. Defect 3 — the dossier states a falsehood to the regulator about Papic Lite

### 3.1 Verified

`NPC_Privacy_Compliance_Dossier_2026-07-12.md:209` (§ 11 item 7) tells the NPC:

> *"The open, public-QR photo pool (ROPA 20) **is built but flag-OFF**."*

**It is not built.** `git grep -iE "papic_lite|PAPIC_LITE_ENABLED"` over `apps/web` **and** `supabase` at `origin/main` `5b72d625d` returns **zero matches**. There is no flag, no table, no route, no migration. ROPA row 20 (`:66`) repeats the claim, naming a flag — `NEXT_PUBLIC_PAPIC_LITE_ENABLED` — **that does not exist in the codebase**.

**A submission must not describe a system that does not exist.** This is the cleanest of the three defects: no data was processed (which is precisely why the sentence is false), no subject was affected, and the fix is a deletion.

### 3.2 The correction is now "never built, and now cancelled"

`Papic_Access_Scope_Council_Verdict_2026-07-20.md` § 3 ruled **Papic Lite KILLED outright** — its entire purpose was to serve non-life events via anonymous ingest, and Phases 1–3 serve those types on the already-shipped, NSFW-screened, named-guest rail with a *stronger* RA 10173 basis. So the correction is not an argument about a dormant feature; it is a retirement.

**Apply to the dossier:**

1. **Strike ROPA row 20** (`:66`) entirely. Replace with a one-line note under the table: *"A previously-contemplated open/crowd anonymous capture pool ('Papic Lite') was **never built** and was **cancelled on 2026-07-20** before any processing occurred. It is withdrawn from this ROPA."*
2. **Rewrite § 11 item 7** (`:209`) to: *"**Withdrawn 2026-07-20.** The open, public-QR photo pool contemplated in ROPA row 20 was **never implemented** — no flag, table, route or migration exists — and the product was **cancelled** before any processing occurred. The bystander-consent, minors-in-crowd and CSAM-known-hash questions it raised are **not closed but deferred**: they attach to any future open-crowd event type (corporate, tournament) and are gated accordingly. Setnayan does not serve open-crowd capture in V1."*
3. **Amend the subprocessor line at `:151`** — the CSAM hash-matching row currently reads *"required before Papic Lite public launch."* Restate as *"required before any open-crowd capture (corporate / tournament) ships; **not** engaged, and no such capture is offered in V1."* Do **not** delete the row: the duty travels with open-crowd ingest, not with the cancelled product name.

### 3.3 ⚠ Name collision — do not let the retirement delete the wrong thing

"Papic Lite" names **three** unrelated things, two of which are shipped and must survive:

| Use | Where | Disposition |
|---|---|---|
| The cancelled open-crowd anonymous pool (ROPA 20) | corpus only — **no code** | **Retire** — this section |
| The **vendor on-the-day free tier** (20 points, photos-only, no video) | `apps/web/lib/vendor-papic-tier.ts:51`, `vendor-dayof-modules.ts:274`, `papic-capture-controller.tsx:58` | **SHIPPED — keep, untouched** |
| The `high_efficiency` **quality alias** ("the Papic Lite tier", ~2560px ≈ 4 MP) | `apps/web/lib/papic-fidelity.ts:25` | **Rename** — per access verdict item; it points at a product that no longer exists |

Anyone actioning § 3.2 without reading this table will grep "Papic Lite" and delete a live vendor tier.

---

## 4. The DPO question the entire access ruling rests on — **[PENDING DPO]**

### 4.1 Why this one question carries everything

Both verdicts lean on the same load-bearing sentence: guest browser capture rides `readGuestSession()` — a **named, RSVP-identified** guest, not an anonymous walk-up — **therefore** consent-at-RSVP already reaches, **therefore** no CSAM known-hash matcher, no bystander-consent gate, and no new ROPA class is needed (`Papic_Monetization_Council_Verdict_2026-07-20.md:176`; `Papic_Access_Scope_Council_Verdict_2026-07-20.md` § 1, Phase 1). § 2 above has already dented the third clause. **If the RSVP consent text does not actually name (a) guest-phone capture and (b) face-sorted delivery, the first two clauses fall as well, and Phase 1 cannot ship until the copy is fixed.**

So the DPO must rule on **the actual words**, not on a paraphrase. Here they are.

### 4.2 The current RSVP consent copy, verbatim

Rendered inside the public RSVP form at `apps/web/app/[slug]/page.tsx:3482-3545`, in the `SelfieCapture` block, which is revealed **only** when the guest selects "I'll be there". Source: `apps/web/app/[slug]/_components/selfie-capture.tsx` @ `origin/main` `5b72d625d`.

**The block's own heading and rationale (`:391-396`):**

> **Add your photo** · *optional*
> So the couple recognizes you on their guest list — and the **photographers** can find your candid shots after the wedding.

**Checkbox 1 — `name="biometric_consent"` (`:421-429`):**

> I consent to **facial-recognition photo matching for this event**. My selfie is used only to recognize me in this event's photos, only for this event, and I can withdraw anytime in my settings. *(Philippine Data Privacy Act, RA 10173.)*

**Checkbox 2 — `name="age_affirmation"` (`:444-449`), preceded by an "Adults only (18+)" label:**

> I confirm I am **18 or older** and consent to facial-recognition photo matching for this event. *(Face recognition is not offered to minors.)*

**That is the entirety of the photo-related consent copy on the RSVP surface.** The rest of the form is attendance radios, meal preference, plus-one and notes. There is **no privacy notice, no link to `/privacy`, and no photography notice** anywhere on the RSVP form.

### 4.3 What the copy does and does not say — read against the two questions

| The claim the verdicts make | What the copy actually does |
|---|---|
| RSVP consent names **guest-phone capture** | ❌ **It does not.** Nothing on the RSVP form tells the guest that **other guests' phones** will be cameras. The nearest sentence names *"the **photographers**"* (`:396`) — which a Filipino wedding guest reads as the hired professional team, not as the person seated next to them. The word "guest", "your phone", "other guests' phones" or "everyone's camera" appears nowhere. |
| RSVP consent names **face-sorted delivery** | 🟡 **Partially, and narrowly.** It names *"facial-recognition photo matching for this event"* and *"recognize me in this event's photos"* — that covers face **matching**. It does **not** say that the result is **delivered to the guest**, nor to whom else the matched set is visible. It is framed as a recognition mechanism, not as a delivery product. |
| Consent is **recorded** for photography generally | ❌ **`photo_consent` is defaulted `true` by the system, never asked.** On the public RSVP path `app/[slug]/actions.ts:188` writes `photo_consent: true`; the same default appears at `guests/import/actions.ts:150`, `join/[eventId]/actions.ts:138`, `onboarding/wedding/actions.ts:706` and `:728`, `sponsors/actions.ts:329`, `quick-add-actions.ts:105`, and `papic/face-enroll-actions.ts:157`. **The only surface where `photo_consent` is a checkbox is the couple's own dashboard** (`guests/[guestId]/page.tsx:816`) — i.e. a *host* setting, not a *subject* consent. So `photo_consent = true` on a guest row is a **system default, not a record of consent**, and should not be relied on as one in any filing or DPIA. |
| Biometric consent is properly gated | ✅ **This part is sound.** Two separate, unticked, freely-skippable checkboxes; an explicit 18+ attestation with minors scoped out; server-side backstop at `app/[slug]/actions.ts:167-178` that refuses enrolment without both flags and honours a host-set `face_recognition_excluded`. Withdrawal is offered. This is the strongest consent surface in the product and it should be the model for the fix. |

### 4.4 What the DPO is being asked to rule

1. **Does the RSVP surface adequately notify a guest that other attendees' phones will photograph and film them, and that the media lands in a shared gallery?** Current answer on the words above appears to be **no**. If so → a copy edit on the RSVP form and/or the invitation page is a **precondition to Phase 1**, not a follow-up.
2. **Does *"facial-recognition photo matching for this event"* adequately describe face-sorted **delivery** of a guest's photos to that guest?** If not → extend checkbox 1's wording to name the delivery, not just the matching.
3. **Is a system-defaulted `photo_consent = true` acceptable as a record of anything?** Recommended position: **no** — it should be renamed to reflect what it is (a host-set publication flag), or converted into an asked question. Either way it must not be cited as consent evidence in the dossier or in any DPIA.
4. **Is § 12(f) legitimate interest the right basis for incidental capture of non-roster persons** at a private social gathering, with a posted-host notice and the takedown route in § 6 as the safeguards? (This is the § 2.2 row's third leg.)

**If 1 or 2 is answered "no": Phase 1 ships only after the copy lands.** That is a small, well-understood edit — one paragraph on a form whose biometric block already demonstrates how to do it properly. It is not a build, and it is not a reason to delay the reprice, which carries no consent claim. But it **is** a gate, and the two verdicts should stop describing the consent question as already answered.

---

## 5. Edits this document requires elsewhere

| File | Edit |
|---|---|
| `NPC_Privacy_Compliance_Dossier_2026-07-12.md` | § 8a `:170` retention sentence (§ 1.3) · § 3 strike row 20, add row 21 (§ 2.2, § 3.2) · § 11 item 7 `:209` rewrite (§ 3.2) · § 7 `:151` CSAM row restate (§ 3.2) · § 10 appendix — add this file |
| `Papic_Access_Scope_Council_Verdict_2026-07-20.md` | § 0.5 → point at § 2.2 / § 3 · § 5 items 0d/0e/0f → point here · § 6 dissent → resolved by § 0(a) · add this file to the sibling list |
| `Papic_Monetization_Council_Verdict_2026-07-20.md` | `:176` "no new ROPA class" → § 2.3 wording · `:139` + `:218` retention comparison → BLOCKED per § 1.4 · § 8 items 1–2 → point at § 1.3 · label all revenue figures MODELLED per § 0(c) · add this file to the sibling list |
| `0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md` | Only if **Resolution B** is chosen: `:9`, `:124`, `:143` 6-month values → 90 days |
| `Data_Retention_Schedule_2026-07-11.md` | Row 2 media — note that the R2 lifecycle rule enforcing it is **still not configured** (`:56`), which is what makes the dossier's "indefinitely" currently true |
| `DECISION_LOG.md` | One dated row (appended this session) |

---

## 6. Owner / DPO action list

**Owner — decide (2 items):**
1. **§ 1.3 — Resolution A or B.** A = set `PAPIC_FULLRES_RETENTION_DAYS=180` on Vercel today (no PR), honours your 2026-07-17 lock, no filing amendment. B = amend the filing to 90 days, which **reverses that lock** and needs you to re-decide it. **Nothing retention-related markets until this is picked.**
2. **§ 3.2 — confirm the Papic Lite retirement** flows into the filing as a withdrawal (and read § 3.3 before anyone greps for the name).

**Owner — do (2 items):**
3. Configure the **R2 lifecycle rule** that actually enforces the 5-year media period (§ 1.3(iii)) — without it, "5 years" in the filing is a control that does not exist.
4. **Write no grandfathering clause** for the camera-tier rename (§ 0(b)) — there are no buyers.

**DPO — rule (4 items):** the four questions at § 4.4, plus adoption of the § 2.2 ROPA row and its § 12(f) leg, plus the two retention values § 2.2 leaves `[PENDING]`.

**Standing:** do not lodge the NPC submission until §§ 1–3 are applied. All three are document edits; none is a build.

---

_Prepared 2026-07-20. Repo verified read-only at `origin/main` `5b72d625d`. Prod counts queried 2026-07-20. This document is not legal advice._
