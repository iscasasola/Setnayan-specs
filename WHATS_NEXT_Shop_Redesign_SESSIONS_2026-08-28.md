# THE SHOP REDESIGN — THE SESSIONS

> Drawing (agreed shape, owner-corrected 4×):
> [`prototypes/shop_rooms_made_easy_2026-08-28.html`](prototypes/shop_rooms_made_easy_2026-08-28.html)
> Planned with a Fable adversarial pass, 2026-08-28. **Every claim below was re-verified by hand
> against `origin/main` before it was written down.**
>
> ⚠ **The shared checkout is STALE. Branch every session from fresh `origin/main`** —
> `vendor-sidebar.tsx` exists on disk and is DELETED on main.

---

## THE SESSIONS

| | Session | Model | Effort | Runs with | Waits for |
|---|---|---|---|---|---|
| ~~**S1**~~ | ✅ **DONE 2026-08-28 · PR [#4953](https://github.com/iscasasola/setnayan-platform/pull/4953)** — a dispute is not an eraser | **Opus 5** | **medium** | S2 · S3 | — |
| **S2** | ✅ **DONE** — the shop tells the truth | **Opus 5** | **medium** | S1 · S3 | — |
| **S3** | ✅ **DONE** — a card that can be found | **Opus 5** | **high** | S1 · S2 | — |
| ~~**S4**~~ | ✅ **DONE 2026-08-28 · PR [#4957](https://github.com/iscasasola/setnayan-platform/pull/4957)** — the customer page answers | **Opus 5** | **high** | S3 · S5 | ~~S1~~ — |
| **S5** | ⚠ **A FLAG FLIP, NOT A BUILD** — price decides reach | **Opus 5** | **medium** | S4 | ~~S3~~ — |

**S1, S2 and S3 touch disjoint files and may all run at once.** ⛔ **Never two sessions in
`nav-registry-defaults.ts`** — S2 owns it alone. *(S2 is done, so that lock is released.)*

### WHERE THE STREAM STANDS — 2026-08-28

| | state |
|---|---|
| ~~**S1**~~ | ✅ **MERGED AND SERVED — PR [#4953](https://github.com/iscasasola/setnayan-platform/pull/4953)** (merge `f2001515`, prod `/api/health` self-reports it; migration verified applied **BY THE OBJECT**).** Its premise was dead (the erasure was fixed the day before the plan was written, PR #4927) and the ONE thing genuinely left — **nowhere for Setnayan to settle by hand** — is what shipped. ⚠ Verify with `gh pr view 4953 --json state,mergedAt`. |
| **S2** | ✅ **MERGED AND SERVED** · PR [#4950](https://github.com/iscasasola/setnayan-platform/pull/4950), merged 06:36Z, merge `320c42b` — **production's own `/api/health` reports `320c42b`**, so it is live, not merely merged. All 16 checks green. |
| **S3** | ✅ **MERGED** 2026-08-28T06:39Z · PR [#4951](https://github.com/iscasasola/setnayan-platform/pull/4951), merge `1ddb503`. ⏳ *Serving* not yet confirmed — prod was still on `320c42b` two minutes later. **A merge is not a ship**; re-check `/api/health` before claiming it live. |
| ~~**S4**~~ | ✅ **MERGED 2026-08-28T09:15Z — PR [#4957](https://github.com/iscasasola/setnayan-platform/pull/4957), merge `bd8127c`, verified an ancestor of `origin/main`.** ⏳ *Serving* not yet confirmed — prod's `/api/health` still reported `8f6ba14` at the merge. **A merge is not a ship.** ✅ **THE MIGRATION IS VERIFIED APPLIED IN PROD BY THE OBJECT** (not by `schema_migrations`, not by the migration file): `vendor_payment_asks` exists with **4 policies · ZERO grants to `anon`** — the revoke ran, which is the load-bearing one, since a new table in `public` is born with seven — and `authenticated` holds exactly **INSERT, SELECT** and nothing else. The live `withdraw_vendor_payment_ask` is `SECURITY DEFINER`, its body carries the `current_vendor_profile_ids` ownership gate, the `FOR UPDATE` lock AND the `status = 'open'` precondition repeated in the UPDATE's WHERE, and EXECUTE is held by `authenticated` · `service_role` · `postgres` — **not `anon`, not PUBLIC**. The `vendor_payment_asked` notification label exists in the enum, so the couple's notice cannot be silently refused. ⚠ Verify with `gh pr view 4957 --json state,mergedAt`. **AND THE FLAG CONSTRAINT ABOVE WAS OVERSTATED — corrected below: all four lanes work with the flag off; only the booking-ask KIND is unreachable.** |
| **S5** | ✅ **MERGED AND SERVED 2026-08-28 · PR [#4954](https://github.com/iscasasola/setnayan-platform/pull/4954)** (merge `70988bc`; production's own `/api/health` reports `70988bc`, so it is live, not merely merged) · **+ PR [#4956](https://github.com/iscasasola/setnayan-platform/pull/4956)**, the same-day follow-on that tells a couple when we ranked them on a guess — gap 1 below is closed: the couple's budget FEEL now becomes a number and the search uses it, and a shop is told the reach its price is earning. ⚠ Verify with `gh pr view 4954 --json state,mergedAt`. Gap 2 (should a couple browsing publicly see what a shop charges?) is **still the owner's** and is untouched. |

⚠ **Every state above is a claim with an expiry date.** Verify with
`gh pr view <n> --json state,mergedAt` before acting on it; this corpus has been wrong about a PR's
state five times. Neither PR was merged when this was written — *armed is not merged*.
At the last check both stood at **15 checks passed · 1 pending · 2 skipped**, `mergeStateStatus`
BLOCKED (which is what a pending required check looks like, not a refusal).

🔎 **HOW THIS BLOCK WAS MEASURED**, so the next session knows what to redo rather than trust:
`gh pr list --state all` for every PR state · `pg_get_functiondef` on the live
`reject_vendor_deposit` · `pg_constraint` for the lock-request CHECKs · row counts read straight out
of production. **No claim here came from a migration file, a docblock or an earlier handoff** — the
one claim in the original plan that did (S1's) is the one that turned out to be false.

🔑 **AND S5's PREMISE IS NOW TRUE IN A WAY IT WAS NOT THIS MORNING.** Its brief says both halves
exist and nothing joins them. Half of that was optimistic: `starting_price_php` existed as a
COLUMN, and **every card in production carried NULL**. S3 does not fill the old ones — it stops new
ones being born empty. **S5 must still handle a priceless legacy card**, and the honest answer is
the one already shipped in `category-search.ts`: **fail OPEN to a neutral fit, never hide the
card.** A segmentation that silently deletes a shop from the results is a worse defect than the one
it fixes.

---

### ✅ S1 — A dispute is not an eraser · **DONE 2026-08-28** · PR [#4953](https://github.com/iscasasola/setnayan-platform/pull/4953)

🛑 **READ THIS BEFORE THE BRIEF. THE HEADLINE FINDING IS ALREADY FIXED, AND IT WAS FIXED THE DAY
BEFORE THIS PLAN WAS WRITTEN** — PR
[#4927](https://github.com/iscasasola/setnayan-platform/pull/4927), merged and served 2026-08-27,
migration `20271175634994`, from the owner's own ruling *"yes they keep their record."*

✅ **MEASURED BY THE OBJECT, not by a migration file and not by a comment** — `pg_get_functiondef`
on the LIVE production `reject_vendor_deposit` (2026-08-28):
· it sets **`deposit_declined_at` · `deposit_decline_reason` · `deposit_declined_by_user_id`** and
  nothing else;
· it does **NOT** null `deposit_recorded_at`, `deposit_proof_url`, `deposit_method_id` or
  `deposit_method_label`;
· there is **no `DELETE FROM public.event_vendor_payments`** anywhere in the body;
· and its own comment names the change: *"WHAT IS NO LONGER TOUCHED, AND IT IS THE WHOLE POINT OF
  THIS MIGRATION."*
So **the refusal is already a MARK, not a deletion.** The couple already keeps their amount,
receipt, method and ledger row.

🔑 **HOW THE BRIEF GOT IT WRONG, and the lesson is bigger than the item:** it cited
`20270722461308_reject_vendor_deposit.sql` and said *"verified in the migration itself"*.
**Applied migrations are never edited**, so that file still describes the erasure perfectly — a
LATER migration replaced the function. *A migration file is not evidence of what the database
does; read the object.* This corpus already carries that rule twice over, and the plan was written
straight past it.

⚠ **AND MY OWN FIRST PROBE OF IT RETURNED A FALSE NEGATIVE.** Searching the body for
`deposit_rejected_at` found nothing — because the column is `deposit_declined_at`. *A search that
cannot match is not a negative result.* Read the clause; never substring-test it.

🔢 **NOTHING IS AT RISK TODAY EITHER WAY.** Production holds **45 bookings · 0 with a deposit
recorded · 0 refusals ever · 3 ledger rows.** No couple has ever lost a receipt to this.

#### ⏭ WHAT IS ACTUALLY LEFT — the second half of the owner's ruling
⚖ **Owner 2026-08-28: _"no. do not. we will confirm it manually."_** The *keep the record* half is
done. The **_settle it by hand_** half is not:
· **`deposit_declined_at` has NO admin reader.** Grepped across the tree — its five readers are the
  couple's own vendor screens, the vendor's customer card, the delete gate and the overview feed.
  **Nothing in `/admin` can see that a supplier said "it never reached me"**, so there is nowhere
  for Setnayan to settle it. That is the build.
· Anything it emits must have its notice kinds **inserted in the database**, not only emitted —
  guard: `lib/every-notice-type-exists-in-the-database.test.ts`. (Three notification types have
  shipped with live emit sites and no database row; that guard exists because of it.)

#### ✅ AND THAT IS WHAT SHIPPED — PR [#4953](https://github.com/iscasasola/setnayan-platform/pull/4953)
**Setnayan is the referee now.** `settle_vendor_deposit_dispute` (admin-only, `SECURITY DEFINER`)
answers a refusal two ways — **the payment stands** (the booking proceeds) or **it did not arrive**
(the refusal stands and the couple is asked to send it again) — and **neither deletes the couple's
amount, receipt, method or ledger row.** It is a **section on `/admin/disputes`, not a new route**
(a second address would need the nav entry S2 owns), the `disputes` badge counts **both** kinds
through the sanctioned `digest` hatch so it cannot undercount its own page, and **both parties are
told**. The couple sees the finding on their own workspace card.

⛔ **REUSING `vendor_disputes` WAS MEASURED AND REJECTED — do not "simplify" it back later.** Its
own `CHECK (payout_id IS NOT NULL OR order_id IS NOT NULL)` **cannot be satisfied** by off-platform
couple→supplier money, and it feeds the **3-in-30 demotion cron** — putting a supplier who *raised*
a dispute one boolean away from being demoted by it.

🪤 **THE NOTICE-KIND WARNING ABOVE WAS MOOT, AND BETTER THAN MOOT: no new kind was needed.**
`dispute_resolved` already existed, was already on the email allowlist, and had **ZERO emit
sites** — a type with no handle, which now has one. **No enum migration, so nothing could drift.**

🔒 **A FORGERY CLOSED ON THE WAY (the row is yours, the field is not — 9th instance):**
`event_vendors_couple_write` is a PERMISSIVE `FOR ALL` policy and `authenticated` holds UPDATE on
all 76 columns, so without a trigger guard a couple could PATCH *"Setnayan ruled the payment
stands"* onto their own booking — **forging a referee's decision in the referee's name.**

🪤 **THE SILENT MISS, GUARDED:** settle → couple re-sends → supplier refuses AGAIN. Without
clearing the settlement the second dispute inherits *"already settled"* and **never reaches the
queue** — no error, no log, a queue quietly wrong about how much work is waiting. Every writer of
the refusal now also writes the settlement.

🚨 **THE REPO'S OWN GUARD CAUGHT A DEAD FEATURE.** The settle RPC was first called on the
**service-role** client, which carries no user ⇒ `auth.uid()` is NULL ⇒ `is_admin()` false ⇒
**every settle refused in production**, while the feature looked finished.
`lib/admin-gated-rpc-needs-a-session.test.ts` derives its list from the migrations, which is why it
caught a function written the same hour. *Service_role bypasses RLS policies and fails every check
that asks WHO IS THIS.*
📋 **NAMED, NOT FIXED:** the admin map scans `refusedWhenEmpty` only from the
`String(formData.get(…))` idiom, so the **8 admin action files using the `nullIfBlank` helper are
likely understating what they refuse.** Teaching the scanner belongs with the admin-map work.

✅ **VERIFIED APPLIED IN PROD BY THE OBJECT** (2026-08-28, not by `schema_migrations` and not by a
migration comment): 4 settlement columns exist · `settle_vendor_deposit_dispute` is
`SECURITY DEFINER` and its body gates on `is_admin()` · EXECUTE is held by
`postgres` · `service_role` · `authenticated` and **not `anon`, not PUBLIC** · the forgery guard is
live in `guard_event_vendor_deposit_ack` · a fresh refusal reopens the dispute · and **PR #4927's
non-erasure SURVIVED the `CREATE OR REPLACE`** (no proof wipe, no ledger DELETE) — the one thing
most at risk, since this repo has silently reverted a guard that way before. **0 disputes open
today.**

🧪 **How it was proved, since a money path deserves saying:** the **EXACT migration file** was
dry-run against **PROD** inside `BEGIN…ROLLBACK` (applies cleanly · 0 columns survive the rollback ·
`CREATE OR REPLACE` provably kept #4927's non-erasure) — a retyped copy would have proved something
other than what ships. 8 db tests, and **6 mutations each proven to LAND by occurrence count (1→0)
before being believed**. ⚠ **The first mutation run had a `shift` bug: all six reported a clean
pass and NONE had applied** (0→0). And one that did land stayed GREEN — a **measurement error in
the sabotage**, not a decorative guard: it disabled one of four disjuncts while the test sets two
columns. *An occurrence count proves a sabotage landed, not that it landed where you aimed.*
⚠ `tsc` first **aborted at exit 134 while printing zero errors** — the documented trap; it needed a
bigger heap, after which it was genuinely 0/0 with unit **10846/10846**.

⛔ **DO NOT rewrite `reject_vendor_deposit`.** A 334-line duplicate migration was already written
and deleted once on discovering the refusal existed (PR
[#4923](https://github.com/iscasasola/setnayan-platform/pull/4923)), and a guard now fails if a
second way to say no appears.

<details><summary>The original brief, kept — every red claim in it is now false</summary>

**What a person gets:** a couple who paid keeps their receipt. A supplier saying *"it never
reached me"* raises a dispute Setnayan settles by hand, instead of deleting the evidence.
🔴 **LIVE DATA DESTRUCTION, verified in the migration itself** (`20270722461308_reject_vendor_deposit.sql`):
the refusal sets `deposit_recorded_at`, `deposit_proof_url`, `deposit_method_id` and
`deposit_method_label` to NULL and deletes the couple's `event_vendor_payments` row. The couple is
not told, and the only party who benefits is the one making the claim.
⚖ **Owner 2026-08-28: _"no. do not. we will confirm it manually."_** Keep the record, mark it
disputed, settle in the admin.
🪤 Its new notice kinds must be **inserted in the database**, not only emitted — guard:
`lib/every-notice-type-exists-in-the-database.test.ts`.

</details>

### S2 — The shop tells the truth · **Opus 5 · medium** · ✅ **BUILT 2026-08-28 — do NOT rebuild it**
PR [#4950](https://github.com/iscasasola/setnayan-platform/pull/4950) — **MERGED AND SERVED**, merge `320c42b`, confirmed by production's own `/api/health`. ⚠ Verify with
`gh pr view 4950 --json state,mergedAt` before trusting this line — this corpus has been wrong
about a PR's state five times. Full row: `DECISION_LOG.md` 2026-08-28 🏛.

**Four corrections this session made to the brief below, every one measured:**
· **The rename is SIX copies, not five.** The sixth is `vendor-rail-context.tsx`'s `CAPTION` map —
  the 72px icon strip, keyed by the stable key — which would have gone on saying *"On the day"*
  beside five renamed rows. And one of the five the brief DID name, `more/page.tsx`, is a
  **redirect stub** carrying the word only in a comment. ✅ `nav_slot_override` holds **0 rows in
  production**, so nothing out-ranks the code.
· **"Both your shops are hidden today" is STALE.** Read out of prod: `SetnaProd` is
  `verified`/`verified` and LIVE; the fixture shop is verified-but-hidden. The real gap is that the
  first-steps rail reads ONE column (`verification_state`) while findability needs TWO — and
  **nothing notifies a shop when its visibility changes at all**: `transitionVendorVisibility`
  writes an audit row and calls no notifier, so the new banner is the only telling there is.
· **The multi-day bug had a SECOND half** the brief did not name: `?event=<id>` names a celebration,
  not a day, so the setup view's is-it-today branch was decided by array order.
· **Performance ships NO invented statistic.** The drawing's *"booked twice as often"* is a number
  we do not have — production holds zero marketplace bookings.

**The original brief, kept:**

**What a person gets:** the room is called what it is, a hidden shop learns why, a supplier
working two days of one wedding sees both, and Performance says what its numbers mean.
🔒 **THE RENAME IS LABELS ONLY. Never touch the `on-the-day` key or route** —
`vendor-nav-destinations.ts` warns the key is load-bearing in four places.
🪤 **A rename that misses a copy is a diff, not a rename.** Five places: `vendor-nav-destinations.ts:129` ·
`nav-registry-defaults.ts:1639` **and the more-slot ~1747** · `vendor-bottom-nav.tsx:169` ·
`more/page.tsx` · page metadata. **Then check the `nav_slot_override` table for a stale admin override**,
which out-ranks all of them.
🐛 **The multi-day fix:** `on-the-day/page.tsx:198-201` dedupes with a `Map` keyed on eventId, so a
supplier booked on two days of one celebration loses the earlier one. Key on eventId + bookedDate —
the per-day rows already come back from `fetchVendorPoolBookings`.

### S3 — A card that can be found · **Opus 5 · high** · ✅ **BUILT 2026-08-28 — do NOT rebuild it**
PR [#4951](https://github.com/iscasasola/setnayan-platform/pull/4951). ⚠ Verify with
`gh pr view 4951 --json state,mergedAt` before trusting this line. Full row: `DECISION_LOG.md`
2026-08-28 💰.
**What a person gets:** a shop can no longer publish a service card with no price. The maker asks
for it alongside the cover photo and the Setnayan Exclusive, the card's own meter counts it as
missing until it is there, and Publish stays shut. Saving a draft is never refused.
🔑 **RULE 0 PAID ENORMOUSLY — THE COMPLETENESS METER ALREADY SHIPS.** `lib/card-health.ts` (blockers
· warnings · hints · a one-line coach that deep-links to the sheet that fixes it), owner-locked
2026-07-27, with `hasPrice` **already a field on its snapshot**. The whole delta was **one lane
change** — `no_price` from HINT to BLOCKER — plus the gate. `canvas-maker.tsx` warns in terms that a
second meter is a REGRESSION; the prototype's "2 of 5 done" is the same idea in different clothes
and was deliberately NOT redrawn.
⚠ **BUT THE METER IS BEHIND `NEXT_PUBLIC_CANVAS_MAKER_ENABLED`, WHICH DEFAULTS OFF**, and its
production value is **not readable from a session** (read in a server component, so it never inlines
into a client bundle). Flag off ⇒ a shop gets the 6-step wizard, which has no meter — so the
wizard's own Publish button and recap were taught the same rule rather than left to the server to
bounce. **OWNER: check that flag in Vercel.**
🔒 **THE FENCE IS A DATABASE TRIGGER, NOT THE APP** (migration `20271176775619`): `vendor_services`
carries a PERMISSIVE `FOR ALL` policy on *"this row is yours"* and `authenticated` holds UPDATE on
**all 40 columns**, so a shop can PATCH `is_active` through PostgREST and meet no TypeScript —
**past the new price gate AND past the Setnayan Exclusive gate that has shipped since day one.**
🪤 **THE OBVIOUS TRIGGER WOULD HAVE BEEN A CLIFF:** a blanket "every live row must be complete" rule
makes `merge_canonical_service()` — an admin folding one trade into another, which rewrites
`category` on every live card — fail on somebody else's legacy priceless row. It judges the ACT of
publishing, plus any statement emptying one of the two fields on a live card, and nothing else.
🪤 **ZERO WAS A PRICE:** the save accepts a typed `0`, so the card rendered *"₱0 flat"* and reported
itself priced while the gate refused it — screen and gate disagreeing by exactly one value.
⚖ **IT REVERSES A DOCUMENTED RULE, on the record:** `card-health.ts` argued a missing price was a
hint because *"quote on request is a real answer"*. An engineering rationale, never an owner lock.
🔢 **SAFE BY ARITHMETIC:** the 2 prod cards are both on a **hidden FIXTURE shop** (seeded, no title,
no perk); **the one real published shop has ZERO cards.** Nobody is refused anything today.
⚠ **AND THE ROW ABOVE OVERSTATED THE HARM — corrected:** an unpriced card is **not** hidden from
search today; `category-search.ts` fails OPEN to a neutral price-fit, so it merely never wins on
price and shows no figure. It becomes literally unfindable when **S5** joins `budget_band` to
`starting_price_php`.
⛔ **The meter measures COMPLETENESS, never the size of the price** — `PublishFacts` carries booleans
only, and a test fails if a number is ever added to it.
📦 **PR [#4951](https://github.com/iscasasola/setnayan-platform/pull/4951), auto-merge armed.**
⚠ Verify with `gh pr view 4951 --json state,mergedAt` — this register has been wrong about a PR's
state before.
🚨 **AND THE FIXTURES WERE ALREADY DESCRIBING IMPOSSIBLE ROWS.** The trigger made **91 db tests
across 10 files** fail — the cliff, measured rather than pushed. **61 of the 91 refusals were for
the SETNAYAN EXCLUSIVE**, the gate that has shipped since day one: `is_active` DEFAULTS TO TRUE, so
15 fixture inserts were minting published cards the app itself could never have created. The price
accounts for 28. All 15 now carry both; **124/124 pass.**
🛡 Typecheck **0 errors / exit 0** · **9103** unit pass · **124** db pass · **15 mutations, all
measured before → after, all RED**. Migration dry-run against prod inside a self-rolling-back
transaction (8 cases), prod verified afterwards unchanged.
🪤 **TWO TRAPS PAID FOR, BOTH ALREADY WRITTEN DOWN:** one of my own guards was **decoration** —
reverting the wizard's `canPublish` left the import in the file, so a FILE-LEVEL census stayed GREEN
while the button published priceless cards again (*a file-level count cannot say which EXPRESSION
still asks*) — and **I piped a mutation run into `head`**, which killed it by SIGPIPE mid-run and
left a sabotage applied, so the next baseline read two failures that were mine. Also: **an empty
`tsc` log is not a clean one** — a run OOM'd at 4 GB against another session's concurrent typecheck
and printed nothing at all. ⏭ **NOT built, deliberately:** the per-card
reach bar on the Services list (the prototype's *"1 of 2 — one card is reaching nobody"*) — with the
gate in place no NEW card can lack a price, so that row can only ever describe legacy rows.

### ✅ S4 — The customer page answers · **DONE 2026-08-28** · PR [#4957](https://github.com/iscasasola/setnayan-platform/pull/4957)

🛑 **READ THIS BEFORE THE BRIEF — TWO CLAIMS IN IT ARE FALSE, BOTH MEASURED.**

1. ⚠ **"A Customers page built on four states would render TWO of them" IS WRONG.** Only the
   **booking-ask KIND** is unreachable while `NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED` is dark. The
   *enquiry* half of **Waiting on you**, plus **Talking**, **Booked** and **Finished**, all read
   columns the flag never touches — `chat_threads.inquiry_status` and `event_vendors.status`. **All
   four lanes work in production today**, and a test runs the whole set through
   `handshakeEnabled = false` to prove it rather than argue it. The page still ASKS the flag (it is
   registered as a gate in `flag-chokepoint-scan.test.ts`), so the dark arm is the couple's own
   answer, not a second guess.
2. ⚠ **"Booked and Waitlist filters already exist in `customers/page.tsx`" IS FALSE.** The PILL
   existed; the FILTER never did. `STATUS_PILL` mapped five statuses and the assembly loop could
   produce exactly **two** — `booked` and `in_conversation`. `locked`, `whitelist` and `waitlist`
   were unreachable by construction. It is deleted.

✅ **WHAT SHIPPED.** The roster is the page's **first** block, above the month calendar, carrying
four lanes — **Waiting on you** (an unanswered enquiry OR an unanswered booking ask, one list,
oldest first) · **Talking** · **Booked** · **Finished** — with chips that narrow the same list.
**Nothing was deleted to make room:** calendar, summary tiles, QR panel all still render below, and
*Book of business* was deliberately carried across (`lint-port-no-lost-controls` is what makes that
checkable). And a shop can **ask a booked customer for a payment** from the Quote & Payments tab,
beside the balance; the couple is told and reads it above their own deposit card.

🔴 **AND IT FOUND TWO SHIPPED FEATURES THAT COULD NEVER HAVE WORKED — repaired in the same PR.**
`vendorPostHandover` (a supplier delivering a gallery link, proof or sign-off) and
`vendorRaiseChangeOrder` (a supplier proposing an add-on) each resolved their booking on **the
vendor's own session**, under a comment asserting *"RLS already scopes vendor reads to their own
bookings."* **Measured against production as the shop's own authenticated role, in a rolled-back
transaction: `event_vendors` carries four policies — couple read, couple write, moderator read,
moderator write — and NOT ONE admits a vendor.** The shop genuinely booked on the one marketplace
booking in prod reads **ZERO rows** of it. Both bounced to their own error flag on every attempt,
for every shop, always. *An RLS denial and an empty read are the same value.*

⏭ **OPEN OWNER DECISIONS, deliberately NOT built:**
· **48 hours or 7 days?** The 2026-06-02 lock says 48h; the shipped fuse is the materialized
  `lock_request_expires_at` (~7 days). Surfaced, unchanged, exactly as this register asked.
· **A fifth lane, "Holding"** — you said yes, they have not booked. The shared core maps
  `agreed`-but-unconfirmed to `cancelled` with its reasons written down there; re-deciding it on one
  screen is how two screens start disagreeing about who is booked.
· **Whether the Waitlist should be a lane at all** — it is deliberately absent, because picking
  somebody off the waitlist does nothing today and still reports success.

**The original brief is kept below.**

---

#### The brief, as written

🔓 **THE DEPENDENCY IS DISCHARGED.** S4 waited on S1 because the Payments tab shows a deposit whose
meaning S1 was going to change. **S1's data-model half already shipped** (PR
[#4927](https://github.com/iscasasola/setnayan-platform/pull/4927), 2026-08-27, verified by reading
the live function out of prod — see S1 above): a refusal is a mark, the receipt survives, and
`deposit_declined_at` / `deposit_decline_reason` exist and already render on the shop's customer
card. **What is left of S1 is an ADMIN surface**, which a vendor screen does not depend on.
⇒ **S4 may start now. It is still the riskiest piece in the plan.**

🔴 **AND A CONSTRAINT ITS BRIEF NEVER NAMED: THE FOUR STATES ARE BEHIND AN UNFLIPPED FLAG.**
`lockRequestStateOf(row, enabled)` — the ONE shared translator — returns **only `'locked'` or
`'none'`** when `enabled` is false, and `enabled` is `NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED`, which
has been **waiting on the owner's press since 2026-08-16** and is *not readable from a session*
(it inlines at build time). A Customers page built on four states would render **two** of them,
look half-finished, and nobody would be able to tell that from a bug. **Design both arms, and say
in the PR which one production is actually serving.**

✅ **AND THE VOCABULARY MAPPING IS ALREADY WRITTEN — do NOT invent one.** `lib/lock-request-state.ts`
translates the database's words to the couple-facing ones (`pending → requested`), handles the
`agreed`-but-not-confirmed hole deliberately, and lets a real booking outrank any stale marker it
carries. Its own docblock explains each choice. **Reuse it; a second mapping is how two screens
start disagreeing about who is booked.**

✅ **The as-built machine is confirmed BY THE OBJECT, not from the brief** (prod, 2026-08-28):
`event_vendors.lock_request_state` is **TEXT** — not an enum — with
`event_vendors_lock_request_state_chk` admitting exactly
`pending · agreed · declined · cancelled · expired`, plus a coherence CHECK pairing each state with
its own timestamp and a marketplace CHECK requiring `marketplace_vendor_id` on `pending`. The
spec's *requested → accepted → lock_requested → confirmed* exists nowhere in the database. **The
brief's warning was right and is now measured.**

🔢 **Prod, for scoping:** 45 bookings · **0 with a deposit recorded** · 0 refusals ever ·
**0 enquiry threads ever** · 3 ledger rows. Every state this page draws will be empty on day one,
so **the empty states are the deliverable**, not an afterthought.

**What a person gets:** Customers opens on who is waiting, in four states, and a shop can ask a
customer for money from the page where it sees the balance.
🚨 **THE RISKIEST THING IN THE WHOLE PLAN.** The 2026-06-02 lock's vocabulary
(*requested → accepted → lock_requested → confirmed*, **48h**) is SPEC LANGUAGE. The **as-built**
machine is `lock_request_state` (pending/agreed/declined/cancelled/expired) on a **~7-day** lazy
window, and `event_vendors.status` is owner-locked never-repurposed. **Map the UI onto the shipped
columns and SURFACE the 48h-vs-7-day question — implement neither silently.** Building from the
spec would pass every test, demo perfectly, and be wrong about which couples are "Booked".
✅ **The conversation is ALREADY SHIPPED — do not move it.** `clients/[eventId]/page.tsx` is a
chat-first shell (Chat · Quote · Payments · Files) with a live thread embed. **The only delta is
the "Ask for a payment" button.** Recreating that screen is the defect this project is named for.
🆕 **Genuinely new:** nothing called a payment request exists anywhere. Migration + RLS pattern +
a notification kind row.
✅ Booked and Waitlist filters already exist in `customers/page.tsx`.

### S5 — Price decides reach · **Opus 5 · high** · ✅ **BUILT 2026-08-28 — do NOT rebuild it**
PR [#4954](https://github.com/iscasasola/setnayan-platform/pull/4954). ⚠ Verify with
`gh pr view 4954 --json state,mergedAt` before trusting this line — this corpus has been wrong
about a PR's state five times. Full row: `DECISION_LOG.md` 2026-08-28 💸.

🛑 **AND IT CORRECTED THE MEASUREMENT BELOW, WHICH WAS RIGHT ABOUT THE GAPS AND WRONG ABOUT THE
FLAG.** *"All of it behind `NEXT_PUBLIC_SMART_SORT_ENABLED`, off by default ⇒ S5 IS A FLAG FLIP"* is
**false**, and it is the load-bearing half. Read out of `category-search.ts` + `compat-score.ts`:
**budget-fit became part of the FREE compat score on 2026-07-12 and runs on EVERY search, flag or
no flag** — `budgetFitRatio` is computed unconditionally and carries **weight 0.20, the
second-largest dimension of the whole match %**. What the flag actually gates is three smaller
things: the SOFT tail re-rank, the strict-mode hard filter, and the *"raise your budget?"* pressure
flag. ⇒ **There was nothing to flip, and the fix takes effect for every couple immediately.**

**WHAT SHIPPED — gap 1, closed.** A couple who picked a budget feel and a guest count and never
typed a peso figure was, to the search, identical to a couple who answered nothing. Their band
becomes a number now (`lib/budget-band-money.ts`) and the two ranking surfaces opt into it
explicitly. 🔑 **The read needed no migration** — `budget_band` is already in the `events_host`
projection and SELECT-granted to `authenticated` (verified by the column ACL in prod, not by a
migration comment), so it rides along on a query the resolver already makes.

🚨 **AND THE ARITHMETIC HAD TWO IMPLEMENTATIONS THAT NEVER MET.** The wedding onboarding stores the
band's **TOP**; `create-event` stores its **MIDDLE**. Same band, same guest count, **two budgets ~20%
apart depending on which door the couple came through** — and that number decides which shops they
see. Both writers call one module now; **neither stored value was changed**, because moving a
couple's saved budget is the owner's call, not a refactor's. ⚠ **It is an open question, named, not
fixed.**

⛔ **THE DRAWING'S OWN COPY WAS OVERSTATED AND IS NOT SHIPPED.** The prototype's Performance line
says *"one card is reaching nobody — it has no price, so it never appears in a search"*. **That is
not what happens**: a priceless card scores the neutral fit and stays in the results; what it loses
is the ability to WIN on budget and the figure a couple would read. The shipped word is **limited**,
and a test fails if the copy ever says *nobody*. The per-card line is on the Services list, where a
shop already looks, not in a report.

🔴 **AND IT OPENED A HOLE THAT THE SAME DAY CLOSED — PR
[#4956](https://github.com/iscasasola/setnayan-platform/pull/4956).** `budgetSource` shipped in
#4954 with **zero readers**: the band-derived budget moves `budgetFit`, **weight 0.20, the
second-largest dimension of the match %**, so a couple was being ranked against ~₱900,000 they never
chose with nothing on screen saying so. A line above the results now names the band they picked, the
figure we worked out and the way to set their own — shown **only where the estimate really decided
something**, **not** behind the smart-sort flag (the estimate isn't either), and it stands the
raise-your-budget nudge down. *A field with no reader is the shape this project keeps paying for,
and this one was mine.*

⏭ **DELIBERATELY NOT BUILT:** Performance's *"most couples looking at you are planning
₱60k–₱120k"* — production holds 6 events, so that band would be an invented statistic printed to a
shop as fact.

**The measurement this session started from, kept because both gaps were right:**
**What a person gets:** the price a shop declares actually decides which couples see the card.
⛔ **Segmentation, never paid placement.**

🛑 **READ THIS BEFORE STARTING — THE BRIEF'S PREMISE IS FALSE, MEASURED 2026-08-28.**
It said *"both halves exist and nothing joins them."* **The join already ships, whole**, and it is
switched off:
· `lib/smart-sort.ts` — a pax-adaptive "starts at" (per-head × the couple's **live** headcount, not
  the static estimate) plus `priceFitScore`, a soft [0,1] fit against the couple's remaining budget
  for that category.
· `_actions/category-search.ts` — wired in: soft re-rank · a strict-mode hard filter the couple has
  to ask for · a *"raise your budget?"* pressure flag.
· `category-search-overlay.tsx` — the screen for it. Plus `compat-score.ts`, `ranking-lenses.ts`
  and `bench-sort.ts`, which all already reason about it.
· **All of it behind `NEXT_PUBLIC_SMART_SORT_ENABLED`, off by default.** *(Whether it is on in
  production has NOT been read — check Vercel. It is `NEXT_PUBLIC_` and used in a client component,
  so unlike the canvas-maker flag this one IS readable from a signed-in bundle.)*
⇒ **S5 IS A FLAG FLIP AND A VERIFICATION, NOT A BUILD.** Writing a second matcher is the
paid-twice defect this project is named for.

✅ **AND THE DANGER THIS REGISTER WARNED ABOUT IS ALREADY HANDLED:** `isBudgetFiltered` returns
FALSE when the starts-at is unknown, so **a priceless card is never hidden — not even in strict
mode.** Fail-open, by construction, in the shipped code.

🚨 **TWO REAL GAPS REMAIN, AND NEITHER IS THE ONE THE BRIEF NAMED.**
1. ✅ **CLOSED BY THIS PR.** **`budget_band` FEEDS NO SEARCH AT ALL.** Measured: it is read by the Event Brief a supplier
   sees, by event recurrence and by the create-event capture — **and by nothing in ranking**. The
   shipped matcher uses a different number entirely: the Budget Planner's **recommended ₱ for that
   category**. *There are two notions of "the couple's budget" in this product and the brief named
   the one nothing ranks on.*
2. ◐ **HALF CLOSED 2026-08-28 — the OWNER DECISION half was answered, and the question was
   wrong.** It read: *should a couple browsing publicly see what a shop charges?* ⚖ **Owner:
   _"their service cards has the prices."* They already could, and had since 2026-07-16** — the
   **2026-05-16 hide-prices lock this row cited was SUPERSEDED** by `hide_prices_publicly`, an
   opt-in-to-HIDE defaulting to SHOW, which `/v/[slug]` has honoured ever since. There was no
   decision to make, only one screen that never got the memo.
   ✅ **The price half is BUILT — PR [#4958](https://github.com/iscasasola/setnayan-platform/pull/4958)**,
   merged 09:24Z (`0f9ad6ae`). ⚠ Verify with `gh pr view 4958 --json state,mergedAt`.
   🔑 **RULE 0 paid almost the whole change:** the grid ALREADY computed every visible shop's
   cheapest active `starting_price_php` and the card could ALWAYS render it — one ternary
   (`v.is_demo === true && …`) threw it away. 🔒 The real risk was the opposite direction — printing
   a price a shop OPTED OUT of — so the hide rule now has **one home and two callers**, is read once
   per page, and fails OPEN.
   ⏭ **STILL OPEN, and still not an owner decision: EXPLORE DOES NO BUDGET MATCHING.** Its sort
   keys are reviews / rating / newest / name; the word *budget* appears **zero** times in its 4,588
   lines. Deliberately NOT bundled into the price PR — ordering a public marketplace by what a
   visitor can afford is its own change, and a signed-out visitor has no budget at all.

🔢 **AND IT CANNOT BE VERIFIED LIVE YET.** Production holds 2 cards, both on a hidden fixture shop,
both with no price; the one real published shop has none. Flipping the flag today changes what
nobody sees. S3 stops NEW cards being born priceless — it does not fill the old ones.

---

## NOT SESSIONS

- ✅ **Shop registration from a signed-in home page is SHIPPED** — the `canOpenShop` gate in
  `dashboard/(launcher)/page.tsx`, pinned by `open-shop/has-a-doorway.test.ts`. A one-line check,
  and **it must not gate anything.**
- ✅ **The five rooms already exist as designed.** Only the rename and the room CONTENTS are deltas.
- 🔴 **Recruiting shops is the owner's, and it is the binding constraint.** 1 published shop,
  1 card, 0 priced, 0 enquiries ever. Every session above is scaffolding until suppliers arrive.
