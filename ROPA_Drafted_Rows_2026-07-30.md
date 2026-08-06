# ROPA — three drafted rows + one refresh · 2026-07-30

> **Status: `[PENDING DPO]` drafts.** Prepared by Claude Code from the shipped code at
> `origin/main`, in the dossier's own seven-column § 3 format so each row can be pasted
> into [`NPC_Privacy_Compliance_Dossier_2026-07-12.md`](NPC_Privacy_Compliance_Dossier_2026-07-12.md)
> § 3 unchanged. **Drafting is not adopting** — the DPO (the owner) must rule on each
> lawful-basis leg and each `[PENDING]` retention value before any of this is filed.
>
> **Why this file exists.** The live Data Privacy board (`/admin` → Data Privacy) derives a
> *coverage drift* list: privacy-sensitive controls with `declaredIn: []` in
> `apps/web/lib/privacy-coverage.ts`. Three controls sit in that list, and **two of them are
> ACTIVE in prod as of 2026-07-27** — i.e. switched on, gating real processing, undeclared.
> These drafts close the declaration side. **Do NOT silence the drift by editing
> `declaredIn`** — the tab must keep showing the gap until the *filing itself* carries the row.

---

## 0. What the drift actually is (verified, not assumed)

Parsed from `privacy-coverage.ts` @ `origin/main`: **20 controls, 17 privacy-sensitive.**
Undeclared **and** privacy-sensitive:

| Control | Prod state (queried 2026-07-30) | This file's answer |
|---|---|---|
| `papic_pool_gallery` | 🔴 **ACTIVE since 2026-07-27** | Row 21 refresh, § 1 — the pool-sharing leg is added to the media row |
| `guest_columns` | 🔴 **ACTIVE since 2026-07-27** | Row 22, § 2 — new row |
| `same_date_demand` | inactive (fail-closed) | **not drafted** — owner/DPO must first rule on the missing per-couple opt-out; see the control's own note |

The three `coordinator_*` controls also carry `declaredIn: []` but are marked
`privacySensitive: false` — plain activation switches over data the reader already holds.
That classification is a judgment already recorded in the map; it is not drift.

⚠ **Both ACTIVE rows mean the fail-closed posture described in the coverage notes is stale.**
The notes say each is "held fail-closed (control inactive AND env flag off)". The *control* half
is no longer inactive. Whether the env-flag half still holds is a separate check the owner
should make before treating these as dormant.

---

## 1. Row 21 — REFRESH of the existing draft (do not file the old text)

A row 21 was already drafted on 2026-07-20 at
[`Papic_Compliance_Delta_2026-07-20.md`](Papic_Compliance_Delta_2026-07-20.md) § 2.2. **It is
stale on a material fact and must not be filed as written.** Three deltas since it was drafted:

1. 🔴 **It says "≤5-second video clips". The cap is 10 seconds** (owner-reversed 2026-07-22;
   clip currency 10 s = 8 pts). Filing the old text would misstate a data category to the
   regulator.
2. It predates the **two-type model** (locked 2026-07-29): Papic **Pool** (one shared shot pool
   for the celebration) and Papic **One** (a dedicated reloadable camera). *There is no product
   called "Papic Guest".*
3. It predates **guest-purchased shots** (`papic_guest_orders`, shipped 2026-07-29) — a
   **non-account-holder guest** can now buy shots, which collects `payer_name`, a ≥24-char
   bearer `access_token`, and (through the shared `orders` flow) **a payment-proof screenshot**.

**Amend the drafted row 21 as follows, then file:**

- Data categories: replace *"≤5-second video clips"* → **"video clips up to 10 seconds"**.
- Data categories: append — *"plus, where the host has enabled the shared pool, the
  **event-wide visibility** of each guest's clean-screened web copies to every other
  session-authenticated guest of the same event, and the guest's own **self-link** tag."*
- Recipients / disclosure: append — *"other session-authenticated guests of the same event
  (shared-pool only; gated by the `papic_pool_gallery` control **and** the host's per-event
  toggle)."*
- Build-state: replace the commit anchor with **`origin/main` @ 2026-07-30** and add — *"the
  shared-pool control is **ACTIVE in prod since 2026-07-27**."*
- Add the payment sub-note below.

**Row 21a — sub-note on guest-purchased shots** *(fold into row 21 rather than a separate row —
it is the same processing purpose, with a payment record attached):*

> A guest who is not an account holder may purchase additional shots for the event. This
> collects the **payer's self-entered name**, a **bearer access token** scoped to their seat or
> guest record, and the **payment-proof image** they upload — which is a free-form screenshot
> and may incidentally contain bank or wallet identifiers. Lawful basis § 12(b) contract (the
> guest is the paying party for their own purchase). Retention follows the payment record, not
> the media. Activation is **admin-approval-gated** — no purchase self-activates.
> ⚠ This is the same processing the coverage map already flags as an *unlisted candidate flow*
> (**"Payment proof uploads … may contain PII … Not on the board"**) — the guest-buy path makes
> that flow reach **non-account-holders**, which raises its priority.

---

## 2. Row 22 — NEW · guest-authored columns published to the open web

Declares the `guest_columns` control (🔴 **ACTIVE in prod since 2026-07-27**).

> | 22 | **Guest-authored public columns** — a short written message a guest submits for the event's public page: `title` (≤60 chars), `body_text` (≤280 chars), the **author byline** derived from the guest's roster name, the guest's consent timestamp (`consent_captured_at`), an `author_publicly_hidden` flag, submission/edit timestamps and edit count (≤5), plus the moderation verdict (`moderation_state`, `moderation_labels`) and the couple's optional `decline_note`. | The guest who authors the column; the couple/host who approves it; **the general public**, once approved | Let guests contribute a written greeting to the event's public page, and let the couple review each one before anything is published | § 12(a) **consent** — the guest writes and submits their own words, and consent is captured at submit time in a `NOT NULL` column, so a row cannot exist without it; § 12(b) contract for the couple's own review-and-publish workflow. **Publication is not automatic**: `status` starts `pending` and only a couple approval moves it to `approved`, and the `gcol_approved_needs_screen` constraint makes approval impossible while the text is unscreened or blocked | Purged with the guest record — `guest_id … ON DELETE CASCADE` — and with the event (`event_id … ON DELETE CASCADE`). A guest may withdraw their own column at any time (`status = 'user_deleted'`), which unpublishes it. Otherwise retained with the event page per Data Retention Schedule *(counsel)* | **Active** — control ON in prod since 2026-07-27. ⚠ **Two disclosures are owed before this is relied on**: a public `/privacy` section covering *guest-authored publication to the open web*, and this row in the filing. The coverage note in `privacy-coverage.ts` states both as owed |

**The DPO must rule on two things here:**

1. **Is § 12(a) consent-at-submit enough for open-web publication of a named person's words?**
   The byline is the guest's roster name — entered by the *couple*, not by the guest. The
   `author_publicly_hidden` flag exists, but the DPO should say whether hidden-byline is the
   **default** or the opt-in.
2. **Minors.** Nothing in `guest_columns` blocks a child guest from authoring a public column.
   A minor's name + words on the open web is a materially different risk from an adult's, and
   the dossier's own § 5 minors treatment should extend here or expressly exclude it.

---

## 3. Row 23 — NEW · in-app voice and video calls

No control gates this and none is proposed — it is base-contract communication between two
parties who already hold each other's thread. It is drafted because it introduces a **recipient**
the filing does not currently name.

> | 23 | **In-app voice / video calls** — call **metadata only**: `kind` (voice\|video), `status` (ringing\|active\|ended\|missed\|declined), who started it, and start/end timestamps (`thread_calls`). Plus best-effort **relay-vs-direct connection telemetry**. **No call content is recorded, stored, or transcribed** — there is no media column, no recording object, and no storage write on the call path | Couples, vendors, and coordinators who are already parties to the chat thread | Let a couple and a vendor talk inside the thread instead of exchanging personal phone numbers | § 12(b) **contract** — in-thread communication is part of the service both parties are using | **Metadata:** deleted with the thread (`thread_id … ON DELETE CASCADE`) and with the event. **Content:** never retained — nothing to delete | **Active** (env-gated). 🔑 **Recipient disclosure owed:** audio/video is peer-to-peer where the network allows, but when a direct path fails — routinely, on Philippine mobile data — the media **transits a Cloudflare TURN relay** using short-lived minted credentials. Cloudflare is therefore a **transient processor of call content** even though Setnayan stores none of it. Cloudflare must appear in the subprocessor list for this activity |

**The DPO must rule on one thing:** whether "calls are never recorded" can be stated publicly
**as-is**, given the TURN relay. The honest phrasing is *"Setnayan does not record or store your
calls; when a direct connection isn't possible, the audio and video pass through our relay
provider in transit and are not retained."* Saying only "never recorded" is true of Setnayan's
storage but silent about the transit hop.

---

## 4. What the owner actually has to do

| # | Action | Whose call |
|---|---|---|
| 1 | ~~Rule on the five open lawful-basis / retention questions~~ **✅ ALL FIVE RULED 2026-08-06 — approved as recommended.** §1 pool = **consent** (host's per-event switch) · §1 guest-buy = **contract**, screenshot on the payment clock · §2 byline = **hidden by DEFAULT**, naming is the opt-in · §2 minors = **refuse a known child**, via the existing stewardship signal, NOT by collecting birthdays · §3 calls = **"never recorded" may not stand alone**; the relay-hop phrasing is required and already live on `/privacy`. ⚠ These were mis-filed as *"blocked on the lawyer"* for weeks — they never were. Shipped in PR #4180. | **DPO = owner** ✅ |
| 2 | Paste rows 21-refreshed, 22, 23 into the dossier § 3 and strike the 2026-07-20 row-21 text | DPO, after #1 |
| 3 | Add the two owed **public `/privacy` sections** — guest-authored publication; shared-pool visibility | build task, once #1 lands |
| 4 | Name **Cloudflare (TURN)** in the subprocessor list | DPO |
| 5 | Decide `same_date_demand` — the per-couple opt-out gap — before it is ever activated | owner |
| 6 | Re-check the **env-flag half** of the fail-closed posture on the two ACTIVE controls | owner |

**Not drafted here, deliberately:** `same_date_demand` (needs a product decision first, § 0) and
any edit to `privacy-coverage.ts` (§ 0 — the drift tab must keep alarming).

---

## 5. Provenance

Every factual claim above was read from shipped code or queried from prod on 2026-07-30, not
from the specs:

- `apps/web/lib/privacy-coverage.ts` — the coverage map + drift derivation
- `supabase/migrations/20270917200000_guest_columns.sql` — row 22's categories, constraints, cascade
- `thread_calls` migration + `apps/web/lib/call-webrtc.ts` — row 23's metadata-only claim and the TURN transit
- `papic_guest_orders` migration — row 21a's `payer_name` / `access_token`
- prod `data_privacy_controls` — the two 2026-07-27 activations
- `DECISION_LOG.md` 2026-07-22 (10-second cap) and 2026-07-29 (two-type model)
