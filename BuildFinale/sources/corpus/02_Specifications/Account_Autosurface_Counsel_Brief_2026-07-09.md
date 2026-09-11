# Account Auto-Surface (#7b) — Counsel Review Brief · 2026-07-09

> **Purpose.** A turnkey packet for PH data-privacy counsel to review the "account
> auto-surface" feature under RA 10173 (Data Privacy Act) before it is enabled.
> The feature is **built but OFF** (`FEATURE_ACCOUNT_AUTOSURFACE` unset; verified
> 0 auto-surfaced rows in prod on 2026-07-09). Nothing processes until counsel
> signs off **and** the flag is flipped. This brief is prepared by engineering; it
> is **not legal advice** and does not substitute for counsel's determination.

## 1. What the feature does (plain language)

When a couple adds a guest to their event, and that guest's email resolves to a
person who **already has a Setnayan account**, the event is **automatically shown
in that guest's own account** — *without waiting for the guest to accept*
(owner intent: "the event is sent whether they accept or not; only if they say NO
is it not included"). The guest opts out by saying **no**: either declining the
RSVP or tapping **Leave**.

## 2. Who + what data

- **Data subjects:** existing Setnayan account-holders who are added as guests.
- **Personal data involved:** the guest's email (used to match the account, supplied
  by the *couple*, not the guest), the identity link (`guests.person_id →
  people.claimed_by_user_id`), and a membership row (`event_members`, `member_type=
  'guest'`, `auto_surfaced=true`).
- **What the guest sees before engaging:** only the event **card** (couple names +
  date) + a one-tap Leave. No other guest data is exposed until they act.

## 3. Data flow

1. Couple adds guest (email provided by couple) → person-spine resolves/claims a
   `people` node, stamps `guests.person_id`.
2. If that person is a **claimed account** (`claimed_by_user_id` set) →
   `maybeAutoSurfaceEventForGuest` inserts an `event_members` row (auto_surfaced) +
   fires the in-app notice.
3. The event appears in the guest's picker (`fetchUserEvents`), filtered by
   `hidden_at IS NULL`.
4. **Opt-out ("no"):** (a) RSVP decline → DB trigger `hide_autosurfaced_on_decline`
   sets `hidden_at`; (b) tap **Leave** → `leaveAutoSurfacedEvent` sets `hidden_at`.
   Either hides the event from their account.

## 4. RA 10173 questions for counsel

1. **Lawful basis.** Is inclusion-by-default (surfacing before acceptance)
   supportable under a lawful basis (consent vs. legitimate interest vs. another),
   given the email was supplied by the couple, not the data subject?
2. **Transparency / notice.** Is the proposed notice (§5) sufficient as the RA 10173
   notification? Should it name the couple, state the basis, and link to the privacy
   policy? Timing — at surfacing, or before?
3. **Consent model.** Is **opt-out** (included until they say no) acceptable here, or
   is **opt-in** required? This is the load-bearing question.
4. **Data-subject rights.** Are Leave + decline sufficient objection/erasure
   mechanisms? Do we need an explicit "don't contact me again" beyond hiding?
5. **Minimization + retention.** Is surfacing only the event card (couple names +
   date) minimal enough? How long may an `auto_surfaced` + `hidden_at` row be
   retained after opt-out?
6. **Minors / special cases.** Any additional safeguard if a matched account belongs
   to a minor? (Note: face-recognition already has a minor-exclusion flag; this
   feature does not process biometric data.)

## 5. Proposed notice copy — **for counsel to approve or redline**

Current placeholder in code (`AUTOSURFACE_NOTICE`, `lib/account-autosurface.ts`):

- **Title:** `You were added to {eventName}`
- **Body:** `A couple added you to their event on Setnayan. You can leave any time from your events.`

Counsel: please approve as-is or provide the exact approved wording (incl. any
required lawful-basis statement + privacy-policy link).

## 6. Opt-out coverage (already built)

| "No" path | Mechanism | Status |
|---|---|---|
| Decline RSVP | DB trigger `hide_autosurfaced_on_decline` (covers every decline route) | built, verified in prod |
| Leave from account | `leaveAutoSurfacedEvent` server action → `hidden_at` | built |
| Picker never shows opted-out events | `fetchUserEvents … hidden_at IS NULL` | built |

## 7. Enablement — the exact steps once cleared

1. Counsel approves the notice copy (§5); update `AUTOSURFACE_NOTICE` if redlined.
2. Set env `FEATURE_ACCOUNT_AUTOSURFACE=1` (Vercel project env) — this is the only
   switch; no code change otherwise.
3. Smoke-test on a test account: add a guest whose email is a claimed account →
   event appears + notice fires; decline/leave → event hides.

## 8. What is NOT in scope

No biometric data (that's a separate consented flow). No email is sent by this
feature (in-app notice only, unless counsel wants an email — the `emitNotification`
path can gate one). No data leaves Setnayan.

---

_Prepared by engineering 2026-07-09. Feature verified OFF in prod (0 auto_surfaced
rows). Do not enable until counsel's written sign-off on §4–§5._
