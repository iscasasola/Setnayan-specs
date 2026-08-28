<!-- The feature-strategy doc (owner-supplied 2026-08-29) was compiled WITHOUT repo access and says
so. This file answers its open questions and corrects its build list against origin/main. Read it
beside `papic-feature-strategy.md`, not instead of it — the market analysis is sound and is not
re-argued here. -->

# The strategy doc, checked against the code (2026-08-29)

**Method:** read out of `origin/main` (the commit production serves) and the live database.
**Verdict: the strategy is right and four of the things it tells us to build are already built.**
Its Phase 2 "Filipino moat" is largely shipped; what is missing is the *wiring*, not the model.

---

## § 1 · Its six open questions, answered

| # | Its question | The answer from the code |
|---|---|---|
| **1** | Does Controlled Shots enforce server-side? | **Today: NOTHING enforces per guest at all.** A cap of 150 is drawn in the browser and applied nowhere — see `WHATS_NEXT_Shots_Per_Guest_2026-08-28.md` § 1. The build in progress enforces it inside `papic_record_guest_capture`, the one object an anonymous caller still reaches. |
| **2** | Does face-blocking delete the embedding? | **Two different switches, and both exist.** *Face Block* (`guests.faceblock_enabled`) SUPPRESSES — it bakes a server-side blurred copy for the wall and fails closed. *Deletion on withdrawal* is its own control (`withdrawFaceConsent` / "Delete my face data") and really deletes: the enrolment row, the vector and the source selfie in R2. There is also an automatic clock — **three months after the event ends** — and account erasure reaches it. ⇒ **The NPC finding it names is met.** ⚠ But they are two switches, so do not say "face-blocking deletes"; say deletion is offered and enforced. |
| **3** | Real inference cost on our own face stack | **Not answered here.** Genuinely open. Note the matcher is ours — the phone computes the descriptor and OUR server compares vectors; no per-image cloud face API is billed. So the $0.001/image figure the doc calibrates against is **not our cost shape**, and § 3's arithmetic should be re-derived before it is quoted. |
| **4** | Can the vendor subscription absorb Papic? | Pricing decision, owner's. Not an engineering question. |
| **5** | Messenger Platform policy | Not answered. Verify before building. |
| **6** | Who moderates the wall in practice? | Product decision. Note a moderation surface already ships (`studio/papic/moderation`). |

---

## § 2 · 🔑 FOUR THINGS IT SAYS TO BUILD THAT ALREADY EXIST

**RULE 0 — this project's first rule — applied to the strategy doc.**

### 2a · Filipino wedding roles — its § 4.2, listed *"Genuinely first · Nobody found"* and placed in Phase 2

**BUILT.** `lib/event-sponsors.ts` models the full set as first-class roles: **principal sponsors**
(one enum value, with `side` distinguishing **ninong** from **ninang**, and `pair_index` coupling
each pair), plus **cord · veil · coin · candle** sponsors, each its own role. Its own copy already
reads *"Your ninong and ninang — the witnesses who'll stand with you and guide your marriage."*

⇒ The doc is right that no rival models this. It is wrong that we do not. **What is missing is the
CONNECTION, not the model** — nothing yet weights a shot budget by role.

### 2b · Ritual-aware chapters — its § 4.3, same Phase 2 slot

**BUILT.** `lib/kwento-moments.ts` carries the sequence in order: bridal march · exchange of vows ·
**veil & cord** · first kiss · leaving the church · cocktail hour · newlywed entrance · first dance ·
cake cutting · **money dance**. That is the exact spine the doc says to preload challenges against.

⇒ Again the delta is wiring: challenges are not yet keyed to these markers.

### 2c · Offline-first capture — its § 6, *"decide this before launch"*

**BUILT.** Shots taken with no signal are held on the phone and drain when the connection returns
(`enqueuePapicGuestCapture` + `lib/offline/service-handlers/papic-drain.ts`).

🚨 **AND THE DOC'S WARNING IS REAL, JUST NOT WHERE IT THINKS.** Server-side enforcement does not
break offline capture — but the drain path **throws away, or silently retries fifty times, any
refusal it does not recognise**, and its own docblock records the cost: *"They finish the night
believing they captured dozens of photos that do not exist."* The new ceiling creates exactly such
a refusal. **The rule is already written into the build spec § 7d: a shot already taken is
honoured, even above the ceiling.**

### 2d · Per-surface consent — its § 2.1, *"the actual innovation"*, Phase 1 item 1, *"a schema migration, not a sprint"*

**PARTLY BUILT — and the retrofit is much cheaper than it assumes.** The four surfaces it names are
**already separate in the read paths**, each with its own gate:

- **the live wall** — `faceblock_enabled`, with a baked blurred derivative, fail-closed;
- **the shared gallery** — a DPO-gated control that AND-gates a flag, and whose read *"bakes the
  FaceBlock blur rule, the photo_consent veto, and web-copy-only keys"*;
- **the couple's archive** — always delivered; that is the untagged-still-delivered guarantee;
- **personal delivery** — the guest's own tagged set.

Two independent guest flags already exist (`faceblock_enabled`, `photo_consent`) and the wall
filter reads **both**.

⇒ **We are not retrofitting per-surface consent into a single face collection.** The surfaces are
already distinct; what is missing is letting the GUEST choose per surface instead of one flag
covering several. That is a UI and a small schema addition, not the rebuild the doc warns about.
**This is the single biggest correction in this file** — it moves their hardest Phase 1 item from
"expensive foundation" to "finish what is there".

---

## § 3 · Where it changes what we say, not what we build

- **Lead with the lifetime archive, never with six months.** The global norm is 6–12 month upload
  windows and 12–14 month storage; our 6-month live tier is *below* it. Already recorded as the
  worst framing available to us — the redesigned page had turned our SHOOTING window into an
  expiry date.
- **"Twelve shots each" is not ours alone.** Lense already does per-guest limits. The defensible
  claim is narrower: **shot limits paired with a live wall — nobody pairs those.**
- **Challenges are table stakes**, not a headline. Kuha ships a scavenger hunt; Guestpix ships
  I-Spy.
- **Our entry price is a weapon we are not using.** The local floor is ₱499 (Kuha) / ₱699
  (EventPix) / ₱999 (PhotoShare). **Papic starts free — 50 shots on every celebration — then ₱50.**
  The promotion page never says so.
- **The live wall is free on every event**, which is stronger than any of those numbers and is also
  unsaid.

---

## § 4 · What is genuinely unbuilt from its list

1. **Role-weighted shot budgets** — but this is *exactly* the per-guest allotment the owner already
   ruled on 2026-08-28. Building it delivers the doc's § 3.2 mechanic as a side effect. The only
   addition is defaulting an allotment by sponsor role.
2. **Challenges keyed to the ritual markers** — the markers exist, the challenge library exists,
   nothing joins them.
3. **Guest-chosen per-surface consent** — the surfaces exist; the choice does not.
4. **Messenger / Viber delivery** — nothing. Its highest-ROI item, and unverified against Meta
   policy.
5. **Tagalog / Bisaya UI** — unverified here.
6. **Civil Ceremony Express** — nothing.
7. **Pre-display moderation** — a moderation surface ships; whether it approves BEFORE display is
   unverified and is the doc's best competitive wedge, so it is worth measuring precisely.

---

## § 5 · Honest limits of this check

Read from source and from the live database, not from a running signed-in browser. § 2d describes
what the read paths gate on; it does **not** prove a guest can reach each control today. The
inference-cost question (§ 1.3) is untouched. And the doc's own caveat stands: its novelty claims
reflect an absence of evidence in the sources reviewed, which is not proof of absence — re-check
the biometric opt-out claim quarterly, because it is the one most likely to be copied.

---

## § 6 · The two "firsts" the owner pulled out, measured (2026-08-29)

### 6a · Multi-chapter journey — **genuinely first, genuinely unbuilt, and half-decided**

- **Nothing links two celebrations in code.** No parent, no cluster, no relation — measured.
- **The shot pot is strictly per-celebration by construction** (`papic_event_pool_config` ·
  `papic_reserve_event_points(event_id)`). One pot across a year changes the primitive people pay
  for, not a display.
- ✅ **How the year divides was already settled 2026-07-15** — a separate *occasion* is its own
  celebration, shown as a **linked cluster**; a multi-day celebration stays ONE celebration with
  days. So the product question is answered; only the building is open.
- 🔑 **The moat is structural, not featural.** It needs a planning platform underneath — a guest
  list and dates months ahead. Kuha would have to build one from zero. **This is the only play on
  the board that cannot be copied in a quarter.**

### 6b · Messenger / Viber delivery — **absent, and we already own an unused channel**

- **No Messenger, Viber or WhatsApp integration exists.** Every hit in the tree is marketing copy
  or — notably — `lib/chat-contact-filter.ts`, which **BLOCKS** guests and vendors naming Viber /
  Messenger / WhatsApp in chat, so the relationship does not walk off Setnayan. ⚠ **The product
  therefore already holds a deliberate, defensive stance toward these apps.** Making one the
  primary delivery channel is compatible (different context — delivering a guest's own photos, not
  swapping contacts) but it must be a **decision taken knowingly**, not an accident.
- 🔑 **WEB PUSH IS BUILT, MOUNTED AND WIRED TO 108 EMIT SITES — AND HAS ZERO SUBSCRIBERS IN
  PRODUCTION.** `lib/web-push.ts` · `lib/push-actions.ts` · `lib/notification-emit.ts` ·
  `push-unblock-steps` · VAPID keys in the secrets rotation registry.
- ⇒ **RECOMMENDATION: ask for push at the moment a guest scans the QR at the venue, BEFORE
  building anything with Meta.** That is the single best permission moment this product will ever
  get — the guest is holding their phone, standing at the celebration, with the page already open —
  and **we never ask.** Zero policy risk, zero new integration, already built. It answers the
  strategy doc's real complaint (email delivery is where guest photo sets quietly die) at a
  fraction of the cost, and it is the honest test of whether the delivery problem is the CHANNEL
  or the ASKING.
- ⏭ Messenger stays worth doing after that, and its § 10 item 5 stands: **verify Meta's
  business-initiated messaging rules and the 24-hour window before committing engineering.**
