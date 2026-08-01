# Per-clause `/privacy` honesty audit · 2026-08-02

> **What this closes.** `Interim_Payments_and_Privacy_Deferral_Policy_2026-07-24.md` §5 left one
> verification open: *"Per-clause `/privacy` honesty audit — confirm each active control's disclosure
> is **complete**, not just **present**."* The 2026-07-24 check was category-level (does the notice
> mention face data at all?). This one is clause-level: for each control, does the notice state
> **scope · opt-in/out · retention · withdrawal**?
>
> **Method.** Mechanical first pass over all 31 `<Section>` bodies for the four clause families, then
> a read of every section the scan flagged, discarding the false positives (a "Contact" section does
> not owe a retention clause). Verdicts below are from the read, not the scan.
>
> **Not legal advice.** External PH counsel remains the gate before the 2027-01-01 lodging.

---

## 1 · Verdict

**The notice was materially honest. Two genuine clause gaps were found and both are now fixed.**

Twenty-eight of the thirty-one sections needed no change. The two that did are recorded below with
the fix; both were **omissions**, not misstatements — nothing on the page was untrue, which is the
guardrail that matters (§3 of the interim policy).

---

## 2 · The two gaps

### GAP 1 — 🔴 no retention period for media, anywhere on the page

**Found:** `grep` for any retention figure across all 1,415 lines returned disclosures for exactly
three things — a TikTok grant, a Google Drive connection, and BIR records. **Photos and video — the
largest and most sensitive category Setnayan holds — had no stated retention period at all.** Nor did
chat, contracts, account data, tickets or logs.

**Why it matters:** RA 10173 requires the retention period to be disclosed. And this was not an
undecided question we were hiding — every number already existed in
`Data_Retention_Schedule_2026-07-11.md`. The notice simply never carried them across.

**Fixed:** new `/privacy` section **"How long we keep things"**, carrying the schedule verbatim —
media **5 years** post-event (hot 90 days → cold), face vectors **per-event, deleted on withdrawal or
with the media**, chat **5 years**, payments/receipts **10 years (BIR floor — cannot delete early)**,
contracts **10 years**, account **life + 30–90 day tail**, tickets **2 years**, logs **≤90 days, no
PII**, device hash **life of account, 24-month prune**. It closes by naming what a person can end
early and the two items they cannot.

⚠ **Keep these in lockstep.** The section is the retention schedule restated for a reader. Changing
one without the other re-opens this gap; a comment in the page says so at the insertion point.

### GAP 2 — 🟠 the one disclosure that never said whether you can opt out

**Found:** §"Vendor interest counts (what other couples can see)" describes the same-date demand
signal thoroughly — aggregate only, inquiry-only (not saves), min-3 floor, exact-date only, and an
explicit promise never to dress it as scarcity. Every *other* processing section on the page tells the
reader how to switch the thing off. This one did not, **because the answer is no** — a couple cannot
exclude their own inquiry from the counts other couples see.

**Why it matters:** a notice that goes quiet exactly where the answer is unflattering is not an honest
notice, and this is the marketplace's only cross-couple disclosure.

**Fixed:** an added paragraph stating plainly that it cannot be switched off, what the protection is
instead (an integer at or above three, with nothing attached that points back to you), and the only
way to not be counted — don't send the inquiry. RoPA **DPS-17** records the same absence as the open
question for the DPO.

---

## 3 · Checked and sound — no change needed

| Control | Section | Scope | Opt in/out | Retention | Withdrawal |
|---|---|---|---|---|---|
| `face_enrollment` | Biometric data (facial recognition) | ✅ per-event | ✅ opt-in, 18+, never pre-checked | ✅ *(now)* | ✅ withdraw in settings |
| `papic_geo_metadata` | Photos and videos — location data | ✅ stripped outbound | ✅ | ✅ *(now)* | ✅ |
| `papic_pool_gallery` | Photos and videos — the shared pool | ✅ same event only, web copies | ✅ host toggle, capture opt-in | ✅ *(now)* | ✅ retroactive close |
| `guest_columns` | Guest-written columns | ✅ open web, stated | ✅ consent at submit | ✅ dies with guest/event | ✅ self-serve takedown |
| `dependent_minor_profiles` | Minors, dependents, religious info | ✅ | ✅ | ✅ *(now)* | ✅ |
| `faith_religion_graph` | Minors, dependents, religious info | ✅ | ✅ | ✅ *(now)* | ✅ |
| `cross_event_vendor_recall` | Your connection tree | ✅ | ✅ | ✅ *(now)* | ✅ |
| `device_fingerprint` | Device identifier (fraud prevention) | ✅ pseudonymous | n/a — §12(f), no opt-out **and the section says so** | ✅ *(now)* | n/a |
| `antifraud_trust_signals` | Anti-fraud & trust integrity | ✅ | n/a — §12(f) | ✅ *(now)* | ✅ **right to object + human reversal stated** |
| `vendor_ai_autoreply` | Vendor AI assistant | ✅ | ✅ vendor opt-in | ✅ *(now)* | ✅ |
| `vendor_deep_search` | Vendor Deep Search | ✅ own business only | ✅ | ✅ short retention stated | ✅ |
| `coordinator_*` (5) | Coordinators you invite | ✅ scoped | ✅ couple grants each scope | ✅ *(now)* | ✅ revocable |
| `home_activity_signals` | Optional personalization | ✅ | ✅ | ✅ *(now)* | ✅ |
| `vendor_papic_capture` · `vendor_guest_delivery` | Photos and videos | ✅ | ✅ | ✅ *(now)* | ✅ |
| `same_date_demand` | Vendor interest counts | ✅ | ✅ *(now — see Gap 2)* | ✅ not stored | n/a *(now stated)* |

**Two findings worth keeping** from the sound column: the anti-fraud section already carries the
RA 10173 §16(c) **right to object**, states that automated action is reversible and human-reviewed,
and that permanent action is never automatic — that is the hardest clause on the page and it was
already right. The WebRTC section already states that IP addresses pass through **in transit only**
and are never written to a database or log — the scan flagged it as missing a retention clause and
the scan was wrong.

---

## 4 · What this audit does NOT cover

- **The filing artifacts.** `declaredIn` stays empty on purpose — the RoPA rows are drafted
  (DPS-15/16/17/18) but the bundled ROPA **PDF** is regenerated in January 2027 per the owner's
  instruction. That is a filing task, not an honesty gap: the public notice is complete today.

  ⚠ **Correction to the working assumption — it is SIX controls, not three.** Enumerating
  `CONTROL_COVERAGE` at audit time returns: `guest_columns`, `papic_pool_gallery`,
  `same_date_demand` **plus `coordinator_run_of_show`, `coordinator_day_of_broadcast` and
  `coordinator_requests_inbox`**. DPS-14 declares the coordinator *consent scopes* and
  *prep-then-release* — which is why `coordinator_consent_money` and `coordinator_prep_release` are
  declared — but it never names the run-of-show surface, the day-of broadcast, or the requests
  inbox. All three are **active in prod**. Their public disclosure is sound (§"Coordinators you
  invite (delegated access)" covers delegated scope, grant, and revocation), so this is the same
  filing-artifact class as the other three: **three more RoPA rows owed in January**, not an
  honesty gap. Added to the January list here so it is not rediscovered late.
- **Counsel's view.** The minors cluster, the vendor gov-ID/AMLC basis and the automated
  fraud-suspension still need the single external PH counsel pass before lodging.
- **Whether each control's gate is wired.** Verified separately on 2026-08-01: all 20 controls now
  have a live `isDataPrivacyControlActive` call site, closing the other §5 follow-up.

---

*Prepared 2026-08-02. Method and verdicts are reproducible from `apps/web/app/privacy/page.tsx` at
the commit this landed with.*
