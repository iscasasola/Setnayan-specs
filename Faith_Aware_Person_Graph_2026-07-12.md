# Faith-Aware Person Graph — Design

**Authored:** 2026-07-12 — owner design conversation (extends the date-anchor model into a faith-aware person/relationship graph).
**Status:** DESIGN. NOT built. The heart of it is COUNSEL-GATED (minors' data + religion as sensitive PI + third-party notifications + money). Companion to [`Event_Anchor_Minimalist_Setup_Design_2026-07-12.md`](Event_Anchor_Minimalist_Setup_Design_2026-07-12.md) and the People layer (§ 2 there).
**Positioning:** this is the evolution that redefines Setnayan as **the operating system for a Filipino family's celebratory life** — a people graph where every milestone across a lifetime and across generations is anticipated, planned, captured, shared. Wedding-first stays the wedge; the graph is the retention/LTV engine, not a new front door.

---

## 1. The profile layer (owner 2026-07-12)

The user profile gains, all **optional / opt-in**:
- **birthdate** — self-consented (NOT counsel-gated; only *dependents'* birthdates are). Drives the user's own birthday/milestone moments.
- **religion** — ⚠ **sensitive personal information under RA 10173 §3(l)**, therefore MUST be optional and consent-gated, never required. **REFERENCE-ONLY (owner reaffirmed 2026-07-12): used solely to tailor suggestions — never to verify, gate, share, or require.** Adding it (a) pre-selects the wedding ceremony path (faith-registry already supports Catholic/Muslim/INC/interfaith) and (b) **unlocks that faith's milestone events as suggestions**. Blank = those simply don't auto-suggest; the user can still create any event manually. **Religion earns its keep by unlocking value, never by gating access** (owner rule).
- **civil status** (owner-added 2026-07-12) — single · in a relationship · engaged · married · widowed · separated/annulled (no civil divorce in PH except the Muslim code). ⚠ **also SENSITIVE PI — RA 10173 §3(l) lists *marital status* explicitly** → same opt-in/unlock-not-gate treatment as religion. **REFERENCE-ONLY (owner reaffirmed 2026-07-12): never required** — used only to tailor Wedding relevance + the union-anchor stage.
- **persons-in-connection** — the person graph edges (union, dependents, godparents). The reserved "People" nav surface (owner-locked 2026-07-04) is its home.

**Trust principle (owner 2026-07-12): "we store your events, NOT your documents."** State this plainly at the point of collecting the sensitive fields above. The family/personal profile holds people + dates + events — **not a document vault** (no gov IDs, PSA certificates, passports). RA 10173 **data-minimization** made visible. Scope caveat: some documents DO exist elsewhere on the platform (vendor verification, 0032 contracts, payment proofs); the promise is scoped to the personal/family profile and is true there.

## 2. Faith-aware events — "adding religion adds the religious events"

Religion → the app surfaces that faith's rite milestones. The Catholic ladder (owner added **Confirmation** 2026-07-12):

| Rite | Typical age (PH) | date_model | Notes |
|---|---|---|---|
| **Binyag** (Baptism) | infant | output (parish) | = existing Christening type · ninong/ninang assigned here |
| **First Communion** | ~7 | output (parish) | **OWNER-CONFIRMED 2026-07-12: added** (alongside Confirmation) |
| **Confirmation** (Kumpil) | ~12–16 | output (diocese) | **owner-added 2026-07-12** · has its own *sponsor* |
| Matrimony | — | output (venue) | = Wedding |

**Shared shape (why they model consistently):** religion-gated visibility · **age-WINDOWED** from the child's birthdate but **parish/diocese-DATED** (date_model=output, like binyag — suggest the window, the parish sets the day; NOT a fixed birthdate-derived date like the debut) · **sponsor-linked** (a Confirmation sponsor is a relationship edge → reuses the ninong/ninang graph; godparents aren't just for baptism).

**Cross-faith consistency** (same "religion unlocks its rites" pattern):
- **Muslim** → **Aqiqah** (7th-day naming/offering)
- **INC (Iglesia ni Cristo)** → baptism at *accountable age* (no infant rite)
- **Protestant / Evangelical** → **child dedication** (infant), believer's baptism later

**Modeling recommendation (owner sign-off open):** a single **"Religious Rite"** event type with a *faith-driven rite picker* (Catholic → Baptism/Communion/Confirmation; Muslim → Aqiqah; Protestant → Dedication) — keeps the 14-card picker clean and makes the faith→rites map authored reference data. Alternative: each rite as its own top-level type (crowds the picker).

## 3. Dependents — birthday + religion + gender (owner 2026-07-12)

"When a person gives birth they add dependent(s)" with **birthday · religion · gender**. This IS the dependent People layer (PR-D), and these three fields make it the **most sensitive record the platform holds**:
- birthdate of a minor (stored up to 18 yr) — the core gated item,
- religion — sensitive PI, now on a child,
- gender — needed for the debut 18/21 derivation, sensitive for a minor.

Useful (religion → the right rite; gender → the right debut year) but **COUNSEL-GATED**: design now, store no dependent record until counsel clears. Respects the <18/>50 age fence + age-out-at-18 hand-over from the People layer § 2.

## 4. Godparents (ninong/ninang) → birthday reminders

The godparent ↔ godchild edge. Culturally native (PH godparents remember + give on birthdays). Safe design:
- the **guardian** creates the link + consents to sharing the child's birthday with that specific person — **never automatic** (council's locked "celebrant→account linking is never automatic, always consent-gated" + Smart Seat-Plan inclusion gate),
- the **godparent** opts into reminders on their side,
- then the godparent gets the anchor reminder ("Amara turns 7 in June") pointed at a *relationship edge*.

A birthday reminder to a godparent = **sending a third party information about a minor** → two-sided consent, not a broadcast. Counsel-gated.

## 5. E-gifts for godchildren — QR-DISPLAY ONLY (owner-clarified 2026-07-12)

**Setnayan only DISPLAYS a receiving QR the recipient placed there** (their own GCash / Maya / bank QR). The giver scans it with their own e-wallet and pays the recipient **directly, peer-to-peer** — the money **never touches Setnayan at all** (not held, not routed, not processed). We are a bulletin board showing an image the user uploaded, nothing more. For a godchild, the surface displays the **guardian's** receiving QR.

**Regulatory consequence (⚠ CORRECTED after the verified competitive/legal research — do not overclaim):** the QR-display model is definitively **not an EMI** (Setnayan never holds or issues e-money) and is the *strongest possible facts* for staying out of money-service territory. BUT it is **NOT an automatic licensing shield.** Under **BSP Circular 1049 (RA 11127, National Payment Systems Act)**, an "Operator of a Payment System (OPS)" includes any person that "maintains the platform that **enables** payments or fund transfers, regardless of whether the source and destination accounts are maintained with the same or different institutions" — so a P2P-facilitating platform *can* fall under OPS registration even when money moves between two outside accounts and Setnayan never touches it. Whether *pure static-QR display* (arguably just content display, with GCash's rail doing the transfer) escapes OPS is a **counsel question, not settled fact.** [This corrects an earlier note that said "no BSP license needed" — that was too confident.] Still materially cleaner than a hold-and-route model (which would almost certainly trigger OPS and possibly EMI); the QR-display facts give counsel the best case to argue outside OPS. **Route to counsel before launch.**

**Trade-off:** because Setnayan never touches the money, it doesn't *know* a gift was sent — no automatic ledger. Any "who gave what" record must be a MANUAL, social note the recipient/giver taps in (for thank-yous); Setnayan never reads a transaction. Pure display is the safe default. Aligns the existing Pabuya lock ("never holds money") to its cleanest form: **never touches money.** Light remaining consideration only: displaying a guardian's QR is the guardian's own choice (not a payments review).

## 6. The build/gate split

| Piece | Posture |
|---|---|
| Religion + **civil status** on the **user's own** profile | **SELF OPT-IN carve-out (owner-decided 2026-07-12)** — buildable Phase 1, no external counsel (self-consent is valid). MUST ship: per-field opt-in for religion AND civil status + a plain purpose line + an easy withdrawal path. Self-accounts are **adults-only** (minors → guardian consent) so the self-consent is valid. |
| Dependent records (child birthdate + religion + gender) | **Counsel-gated** — design now, build flag-off |
| Faith rites for a child (Confirmation, Communion, Aqiqah…) — age-windowed, sponsor-linked | **Counsel-gated** (minor + sensitive religion + sponsor edge) |
| Godparent link + third-party birthday reminders | **Counsel-gated** (third-party notify about a minor) |
| E-gifts to godchildren (QR-DISPLAY only — Setnayan never touches money) | Light — NOT a payments/EMI concern (pure QR display, §5); minor: guardian displays own QR |

DPO = owner ([[dpo-designation-owner]]). Recommend all counsel-gated items go through one batched review before any store a child's record, notify a godparent, or move a gift.

## 7. Open owner sign-offs
1. First Communion — add alongside Confirmation, or Confirmation only for now?
2. "Religious Rite" single type + faith rite-picker, vs each rite as its own event type?
3. Batched counsel review for the dependent/godparent/e-gift cluster — authorize routing?
