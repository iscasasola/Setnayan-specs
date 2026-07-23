# Gap audit — re-verification against live `main`

**2026-07-21 · owner session**

> The 2026-07-20 adversarial audit found **53 gaps (1 critical · 7 high · 26 medium · 19 low)**. The
> critical one shipped as PR #3419. The **7 HIGH gaps** were left open when 12 fix agents were killed
> by a session limit.
>
> **This document re-verifies all 7 against `origin/main` as of 2026-07-21**, after 30+ PRs merged in
> the intervening day. Every verdict below was read from the code, not carried forward from the audit.
>
> `[VERIFIED-CODE]` = read at the cited path. `[MEASURED]` = produced by running something.

---

## § 0 — Headline

**All 7 are still present.** None was fixed by the intervening merges. One (④) was *partially* fixed
in a neighbouring module, which makes it more dangerous rather than less — the fix landed where it is
visible and not where it bites.

| # | Gap | Verdict | Live or latent |
|---|---|---|---|
| ① | Coordinator private-notes wall void | **STILL PRESENT** | latent — flag OFF |
| ② | Money scopes mintable by a coordinator | **STILL PRESENT** | latent — flag OFF |
| ③ | 7-day offline-PI TTL does not exist | **STILL PRESENT** | **live** |
| ④ | 14 vendor categories unmapped | **STILL PRESENT** | **live** |
| ⑤ | Bot reply eats the couple's follow-up | **STILL PRESENT** | **live** |
| ⑥ | 5 event types render as weddings | **STILL PRESENT** | **live** |
| ⑦ | RA 10173 export incomplete, no guardrail | **STILL PRESENT** | **live** |

---

## § 1 — The five live gaps

### ⑦ Data export is incomplete — and nothing stops it recurring

`apps/web/app/api/profile/export/route.ts` reads **13** tables `[MEASURED]`:

```
chat_messages · community_members · coordinator_access_consents · dependents ·
editorial_vendor_media · event_members · godparents · guest_face_enrollments ·
marketing_share_consents · orders · payments · users · vendor_profiles
```

`event_vendor_working_notes` and `coordinator_broadcasts` are **both absent** (grep count 0), and
there is **no guardrail test** anywhere that scans migrations for new user-data tables.

**That absence is the actual defect.** The two missing tables are a symptom — this class of omission
recurred **three times in a single day** because every new user-data table defaults to un-exported and
nothing fails when it does. Adding two table names fixes today and guarantees a fourth recurrence.

⚠ **The fix is not purely additive.** A `coordinator_private` working note is authored by a
coordinator *about a vendor*; `coordinator_broadcasts` is written by one person and received by many.
Exporting them under the wrong data subject would **leak a third party's data through the privacy
endpoint** — the opposite of the intent. Subject scoping has to be reasoned per table, not inherited
from the event.

This is the one with a live NPC filing behind it, so it ranks first.

### ⑤ The vendor bot eats the couple's one pre-accept follow-up

`apps/web/lib/chat-send.ts:177` `[VERIFIED-CODE]`:

```ts
const { count } = await admin
  .from('chat_messages')
  .select('*', { count: 'exact', head: true })
  .eq('thread_id', thread.thread_id);
```

No `sender_role` filter. The comment directly above states the invariant:

> *"While the thread is pending only the couple can post (the vendor is accept-gated below), so this
> count == the number of couple messages so far."*

**That invariant is false.** `apps/web/lib/vendor-autoreply/inbox-hook.ts:221` `[VERIFIED-CODE]`
inserts into `chat_messages` with `sender_role: 'vendor'`, `is_bot: true`, `sender_user_id: null` —
into a thread that is still `pending`.

Consequences: the bot's reply consumes one of the couple's two allowed messages, and **a bot that
asks a clarifying question can strand its own conversation** — the couple hits `followup_used` and
cannot answer the question the bot just asked.

The false comment is part of the bug. It is the reason a reader checking this code concludes it is
correct.

### ④ 14 vendor categories vanish from the couple's planning surfaces

`apps/web/lib/shortlist-taxonomy.ts:54` builds `CATEGORY_TO_TILE` from `PLAN_GROUPS` + an 8-entry
supplement, and its docstring claims the union is *"exhaustive over the enum."*

**Measured: 45 enum values, 14 unmapped** `[MEASURED]` —

```
referee_official · event_medic · tour_activity · tour_guide · travel_insurance ·
av_production · speaker_talent · performers · kids_entertainer · choreographer ·
reveal_element · event_insurance · personal_accident_insurance · restaurant_reservation
```

`tileForCategory()` returns `null` for each, so a considered vendor in those categories disappears
from Shortlist / Build / Budget.

**⚠ Partially fixed in the wrong place.** `lib/taxonomy-gap-leaves.test.ts` now asserts these same 14
leaves are correctly placed in the **admin** tile tree (`TAXONOMY_MAP`). So the Studio renders them
and looks healthy, while the couple-side bridge still drops them. A green test on the adjacent module
is exactly the condition under which this stays unnoticed.

**The mapping is a judgment call, not a mechanical fill.** `WeddingTile` is a *wedding* vocabulary;
several of the 14 are non-wedding leaves (`tour_guide`, `travel_insurance`, `referee_official`,
`restaurant_reservation`). Forcing a tour guide onto a wedding tile may be worse than `null`. The
lying docstring must be corrected either way.

### ⑥ Graduations, anniversaries and reunions render as weddings

`apps/web/lib/checklist.ts:774` — `CHECKLIST_EVENT_LABELS` has **9** entries: wedding · debut ·
birthday · christening · corporate · tournament · gender_reveal · travel · celebration.

`checklistChrome()` at `:793` `[VERIFIED-CODE]`:

```ts
if (eventType == null || eventType === 'wedding' || !CHECKLIST_EVENT_LABELS[eventType]) {
  return { eventNoun: 'wedding', ... }   // the EXACT original wedding copy
```

`event_type_vocab` carries at least `anniversary`, `graduation` and `reunion` beyond the nine
`[MEASURED]` — none has a label, so each falls into the wedding branch and a graduate is told about
their wedding.

The fallback itself is defensible (wedding is the V1 surface); **the silence is not.** A missing
label produces confidently wrong copy rather than a neutral default or a failure.

### ③ The 7-day offline-PI TTL does not exist

Two different IndexedDB databases `[VERIFIED-CODE]`:

| | |
|---|---|
| `apps/web/lib/indexedDB.ts:22` | `DB_NAME = 'setnayan_offline_vault'` ← what the sweep targets |
| `apps/web/lib/offline/db.ts:29` | `DB_NAME = 'setnayan_offline'` ← where the queues actually live |

Guest personal information sits on devices indefinitely while four modules cite a sweep that never
touches it. The retention *claim* exists in prose; the mechanism does not.

---

## § 2 — The two latent gaps (both flag-gated OFF)

### ① The coordinator private-notes wall is void by construction

`public.current_moderator_event_ids()` (`supabase/migrations/20261129003000_coordinator_delegate_rls.sql:36`)
`[VERIFIED-CODE]`:

```sql
SELECT event_id FROM public.event_moderators
WHERE user_id = auth.uid() AND accepted_at IS NOT NULL AND removed_at IS NULL;
```

**No role filter.** And onboarding seeds the couple themselves such a row —
`apps/web/app/onboarding/wedding/actions.ts:571` inserts `event_moderators` with
`role_subtype` ∈ {bride, groom, partner1, family_helper} and `accepted_at: now`.

So `evwn_moderator_select` (`20270825279091:78`) hands **the couple every note**, including
`coordinator_private`. The app mirrors the hole: `canReadWorkingNote` checks `viewer.isCoordinator`
**first** and returns `true` (`lib/vendor-working-notes.ts:68`).

The privacy split *is* the P4 feature. It dies the moment
`NEXT_PUBLIC_COORDINATOR_VENDOR_NOTES_ENABLED` flips.

⚠ Do **not** fix this by changing `current_moderator_event_ids()` — it is shared by many policies.
The notes policy needs its own delegate-only predicate.

### ② Money scopes are mintable by a coordinator

`requireHostMembership` (`app/dashboard/[eventId]/hosts/actions.ts:44-56`) admits **any accepted
`event_moderators` row** — which includes a coordinator. That caller then writes
`coordinator_access_consents.scopes` from **their own form** (`:179-192`), recording
`consented_by_user_id: userId` — the *inviter's* id, never checked against `member_type = 'couple'`.

`coordinatorMoneyScopeAllowed` (`lib/coordinator-money-scope.ts:69-79`) reads `scopes` and **ignores
`consented_by_user_id` entirely.**

So an accepted coordinator can invite a second host and grant them `vendor_lock` + `checkout` — money
authority the couple never consented to.

The contrast is instructive: `updateHostAccess` in the same file (`:233-239`) **does** require
`member_type = 'couple'`. Invite is the weak door; the correct shape already exists 60 lines below.

**One mitigating fact worth keeping:** the consent row is only written when
`isCoordinatorConsentGateEnabled()` is true, and the flag is OFF. **No poisoned rows are
accumulating** — the flip would be into a clean table, not a compromised one. That is a meaningfully
better position than it first appears, and it is the reason this is latent rather than live.

---

## § 3 — Also outstanding

The **7 WIP worktrees** from the killed 2026-07-20 fix wave are still on disk with unverified
commits — none typechecked or tested. `export-completeness` contains ~16 lines with the guardrail
test (the important half) **missing**. They are not a trustworthy starting point; treat them as
notes, not as work.

---

*Compiled 2026-07-21 by re-reading `origin/main`, not by carrying the prior audit forward. Four fixes
(③ ⑤ ⑥ ⑦ — the live ones minus the taxonomy judgment call) were dispatched the same session; ① and ②
need an owner decision on the delegate predicate before either flag can flip.*
