# 0000 ADDENDUM — Invite & Join model v2 (name-as-answer-key · optimistic admit)

**Date:** 2026-06-25 · **Owner-locked this session.**
**Supersedes:** Step 3.5 of `0000_app_shell_and_navigation.md` (the role-picker QR join) **and** the shipped privacy-first claim flow (`lib/guest-claim-flow.ts` / `lib/guest-claim.ts` — OTP-or-couple-approval, "never auto-admit on a name alone"). Those remain in the corpus/code as lineage until the deltas below ship.

---

## 1. The premise

The host builds the guest list by typing only **first + last name** per guest (the existing fast "quick-add" path). That name list is the **answer key**. When a guest opens the one shared invite link and types their name, Setnayan checks it against the list to recognise them. The name **is** the verification — no email/OTP required to be recognised.

## 2. Matching outcomes (what the name-check returns)

| Check result | Behaviour |
|---|---|
| **Clean match** — typed name matches exactly one host entry | Linked to that entry → guest **self-completes their details** → **auto-finalised**, no couple approval. Entry shows a **"self-completed"** badge (provenance marker). |
| **No match** — name not on the list (forgotten guest, plus-one, typo, or stranger) | **Still added immediately**, flagged **"not on your list."** The guest sees a gentle note (*"You weren't on the original list, so you've been added and the host will confirm you"*). The couple is **notified** and can reconcile (see §4). |
| **Ambiguous** — two host entries with the same/similar name | Treated like **no-match**: added as a flagged entry. The couple uses **Link** to attach it to the right person. *(We never show the guest a "which one are you?" list — that would leak the guest list.)* |

**Nobody is ever blocked.** This is an **optimistic-admit** model: everyone who joins is added right away; the couple reconciles the few flagged entries afterward. The old blocking **Confirm** gate collapses into a lightweight **"reconcile the flagged entries"** step (Build → Invite → **Confirm/Reconcile** → Seat).

## 3. Field ownership

The host seeds ~5 seconds of work (names); each guest does their own data entry.

- **Host owns:** side · group · **role** · table · which events they're invited to.
- **Guest self-completes (their "listing"):** email · mobile · RSVP (attending/pending/maybe/declined) · meal preference + dietary/allergies · plus-one name (only if the host allowed one) · photo consent + profile photo · optional address + note to the couple.

Because **role is host-controlled**, the join flow's **role-picker is removed** — a matched guest inherits the role the host assigned (defaults to `guest`). A guest can no longer self-assign a privileged role (e.g. Principal Sponsor).

## 4. Couple reconciliation actions (on a flagged "not listed" entry)

- **Link** — "this is actually someone already on my list under a different spelling" → merge it into that existing entry.
- **Add (keep)** — "legit guest I forgot" → clear the flag, keep them.
- **Delete** — "shouldn't be here" → remove the entry + revoke membership.

These three actions are also the **safety net** that replaces the old anti-impersonation gate (see §6).

## 5. Email linking → automatic Setnayan account

Linking an email is the moment a **name on a list becomes a real Setnayan account.** Email = identity.

- When an email is attached to a guest entry, Setnayan **provisions an account** for that person and **auto-attaches this event to it as a guest membership** — so they land in their own event picker, receive their personal QR by email, and can log in from any device later.
- **Both** parties can trigger it:
  - **Guest** enters their own email during self-complete → upgrades their (possibly anonymous) entry into a full account.
  - **Host** types an email onto a guest entry → that person gets a **magic-link invite**; clicking it drops them straight into the event as their matched guest (no name-typing). This is the second, host-initiated invite path alongside the shared QR/link.
- **Consent (RA 10173):** the account is **provisioned but activated on first magic-link click** — we never silently stand up a fully-live account for someone whose email was typed by another person. Same end state, consent-clean.
- The linked email is also the **notification channel** for the "you weren't on the list" / confirmation notices.

A guest can self-complete **anonymously** (no account needed to fill in details); linking an email is the optional upgrade — consistent with the rest of Setnayan's onboarding (browse/fill freely; account only when you need cross-device or email delivery).

## 6. ⚠ Security note — deliberate reversal (owner-signed-off)

The current shipped flow **never** auto-admits on a name alone; it requires an email one-time-code **or** explicit couple approval, precisely because **a name is not a secret** (anyone who knows "Maria Santos" could type it). This addendum **knowingly reverses that invariant** in favour of UX: a clean name-match is admitted with no second factor.

**Accepted because** this is a wedding guest list (low-stakes; names aren't confidential) and the cost of friction (couple hand-approving every guest) outweighs the impersonation risk. **Mitigations that remain:**
1. **"self-completed" / "not listed" provenance badges** let the couple see who self-served vs whom they entered.
2. **Role is host-controlled** → no role escalation by impersonation.
3. The couple can **Delete** any entry → after-the-fact removal is the backstop.

## 7. Code deltas (planned — no PR yet)

1. **`app/join/[eventId]/actions.ts`** — replace branches 3–5: drop the OTP handshake + "pending_review only" path. On a confident name match → insert the `event_members` + link guest immediately (auto-finalise) + set provenance. On no-match/ambiguous → still insert a guest + membership, set `not_listed` flag, notify couple. Remove the `role` requirement from the form (role comes from the matched entry / defaults to `guest`).
2. **Schema** — add provenance to the guest/membership: e.g. `guests.entry_source` enum (`host_seeded` | `self_completed` | `self_added_unlisted`) + `guests.not_listed_flag` (or reuse a status). Migration FIRST, RLS at create time.
3. **`lib/guest-claim*.ts`** — retire/neutralise the OTP machinery on this path (keep matcher `classifyClaimMatch`; the ≥0.86 confident threshold + 0.08 margin still gate "clean match" vs "ambiguous→flagged").
4. **Guest detail / self-complete UI** — guest-editable field set per §3; remove the join role-picker.
5. **Reconciliation surface** (`dashboard/[eventId]/guests/claims` → repurpose to "Unlisted / to reconcile") — Link / Add / Delete on flagged entries.
6. **Email-link → account provisioning** — magic-link invite + provisioned-account-activated-on-click; auto-create `event_members` (guest) on activation.
7. **Notifications** — guest note (not-listed) + couple ping; both via the linked email + in-app `emitNotification`.

## 8. Provisional / for the holistic pass

- Exact email-match fast path (current branch 2 in `actions.ts`) still valid and stays — if a host *did* enter an email, an exact match links with no friction.
- Throttle/anti-DoS caps on the matcher (`CLAIM_*`, `MAX_NAME_LENGTH`) stay as input hygiene even though the OTP path is gone.
- All copy strings PROVISIONAL (holistic pricing/copy pass).
