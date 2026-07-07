# BaZi Birth-Data — DPO Sign-off Checklist (before enabling)

**Status:** Required gate before `NEXT_PUBLIC_BAZI_BIRTHDATA_ENABLED` is set to `true` in production.
**Owner action:** Work through this with the DPO; record sign-off in the table at the bottom.
**Drafted:** 2026-06-28 · Setnayan team
**Cross-ref:** `Chinese_Wedding_Traditions_Reference_2026-06-28.md` §2.4 · PR #2322 (shipped, dark) · RA 10173 (PH Data Privacy Act).

> **What this gates.** The feature is **built, deployed, and live in production but switched OFF** behind the env flag `NEXT_PUBLIC_BAZI_BIRTHDATA_ENABLED` (default `false`). While OFF, **nothing renders and nothing is written** — the couple funnel is byte-identical to before. Flipping the flag to `true` turns ON the *capture* (an opt-in, consent-gated section on the event Details page that collects each partner's **birth date and time of birth** for a Chinese-tradition BaZi date reading). The export + erasure machinery is already always-on. **Do not flip the flag until every box below is checked and the sign-off table is complete.**

---

## 0. The data in question

| Field (on `public.events`) | Type | Sensitivity |
|---|---|---|
| `partner_a_birth_date`, `partner_b_birth_date` | date | Personal data |
| `partner_a_birth_time`, `partner_b_birth_time` | time | **Sensitive** (hour of birth — the BaZi "hour pillar"; no other product use) |
| `bazi_birthdata_consent_at` | timestamptz | Consent receipt |

**Purpose, and the only purpose:** to let the couple hand these details to a date/feng-shui specialist for a Four Pillars (BaZi) reading, and to derive a non-sensitive zodiac/element label. **The app never computes a compatibility/clash verdict** (locked posture). No marketing, profiling, or secondary use.

---

## 1. Lawful basis & consent (RA 10173 §12–13)

- [ ] **Consent is the basis.** Capture is opt-in: the Details section only appears for Chinese-tradition events, and the four inputs are inert until the couple ticks an explicit consent checkbox. *(Verify: with the flag ON, no value is written unless `bazi_birthdata_consent` is ticked; `bazi_birthdata_consent_at` is server-stamped at that moment.)*
- [ ] **Consent is informed.** The on-screen purpose notice states *what* is collected, *why* (specialist date reading only), that it is *optional*, and that it can be *withdrawn*. — **DPO must review the exact copy.**
- [ ] **Consent is withdrawable.** Un-ticking consent purges all five columns immediately (verified in the write path). The privacy notice says so.
- [ ] **Time-of-birth is justified.** Confirm the DPO accepts that the *hour* of birth (the sensitive part) is necessary for the stated purpose (it is the BaZi hour pillar) and is not collected for any other reason.

## 2. Data minimization & purpose limitation (§11)

- [ ] Only the 5 fields above are collected — no parents' details, no extended chart inputs.
- [ ] The data is **never** used to compute or display a verdict/score in-app (confirm in `lib/auspicious-date.ts` — it does not read these columns).
- [ ] No third-party transmission by the platform. The couple hands the data to a specialist *themselves*; Setnayan does not send it anywhere.

## 3. Transparency (§16)

- [ ] The **public privacy policy** is updated to disclose this collection, its purpose, retention, and the data-subject rights below. (Today's policy predates the feature.)
- [ ] The in-product purpose notice (on the Details section) matches the privacy policy.

## 4. Security (§20)

- [ ] **RLS confirmed.** The columns inherit the existing `events` row-level security (couple/admin only); they are excluded from every public/guest/OG/API select (verified — no `events.select('*')` on a public surface). DPO acknowledges.
- [ ] **⚠ Encryption-at-rest decision (OPEN — owner/DPO must choose).** There is no in-repo column-encryption pattern (no pgsodium/Vault). Two options:
  - **(a)** Rely on Supabase platform disk encryption (AES-256 at rest) as sufficient for this field set — **document the decision and rationale.**
  - **(b)** Require app-level column encryption (pgsodium/Vault) before go-live — **this is net-new infrastructure; scope it as a blocker.**
  Pick one and record it. *(Recommendation: (a) is defensible for opt-in, low-volume, purpose-limited data, but it is the DPO's call.)*
- [ ] Birth time confirmed **never rendered** on any public/guest surface (column comments enforce the intent; review confirmed no leak path).

## 5. Data-subject rights (§16, §18) — already wired; verify

- [ ] **Right to access / portability.** `/api/profile/export` includes the owner's birth fields + consent (owner-scoped, RLS-enforced). Spot-check an export.
- [ ] **Right to erasure.** Admin account hard-delete + blacklist purge the 5 columns on owned events **before** the irreversible auth delete; a failure writes a durable `admin_audit_log` `erasure_purge_failed` row for a manual sweep. Confirm the audit path with a dry run if desired.
- [ ] **Right to object / withdraw.** Covered by consent withdrawal (§1).

## 6. Retention (§11(e))

- [ ] **Set a retention rule.** Define how long birth data is kept (recommendation: until the wedding completes + a short grace window, or on consent withdrawal / account deletion, whichever first). Today there is no automated purge beyond erasure/withdrawal — decide whether a scheduled retention purge is required for launch or acceptable as a V1.x follow-up.

## 7. Go-live mechanics (only after 1–6 are signed off)

- [ ] Set `NEXT_PUBLIC_BAZI_BIRTHDATA_ENABLED=true` in the Vercel **production** environment for `setnayan-platform-web` (Project → Settings → Environment Variables), then redeploy (env change requires a rebuild since it's a `NEXT_PUBLIC_*` build-time flag).
- [ ] Verify on a Chinese-tradition test event that the opt-in section appears, consent gating works, and a non-Chinese event shows nothing.
- [ ] Confirm the Tsinoy cultural copy was verified against a named source (per the reference doc §7) before it goes couple-facing.

---

## Sign-off

| Item | Owner | DPO | Date |
|---|---|---|---|
| Lawful basis & consent (§1) | ☐ | ☐ | |
| Minimization & purpose (§2) | ☐ | ☐ | |
| Transparency / policy update (§3) | ☐ | ☐ | |
| Security + **encryption-at-rest decision** (§4) | ☐ | ☐ | |
| Data-subject rights verified (§5) | ☐ | ☐ | |
| Retention rule set (§6) | ☐ | ☐ | |
| **Approved to flip the flag** | ☐ | ☐ | |

Until the final row is signed, `NEXT_PUBLIC_BAZI_BIRTHDATA_ENABLED` stays `false`.
