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
| **S1** | A dispute is not an eraser | **Opus 5** | **high** | S2 · S3 | — |
| **S2** | ✅ **DONE** — the shop tells the truth | **Opus 5** | **medium** | S1 · S3 | — |
| **S3** | ✅ **DONE** — a card that can be found | **Opus 5** | **high** | S1 · S2 | — |
| **S4** | The customer page answers | **Opus 5** | **high** | S3 | **S1** |
| **S5** | Price decides reach | **Opus 5** | **high** | — | **S3** |

**S1, S2 and S3 touch disjoint files and may all run at once.** ⛔ **Never two sessions in
`nav-registry-defaults.ts`** — S2 owns it alone.

### WHERE THE STREAM STANDS — 2026-08-28

| | state |
|---|---|
| **S1** | **NOT STARTED.** No branch, no PR. It is the only thing blocking S4. |
| **S2** | ✅ built · PR [#4950](https://github.com/iscasasola/setnayan-platform/pull/4950) OPEN, auto-merge armed |
| **S3** | ✅ built · PR [#4951](https://github.com/iscasasola/setnayan-platform/pull/4951) OPEN, auto-merge armed |
| **S4** | **BLOCKED on S1**, and unchanged: it is still the riskiest piece in the plan. |
| **S5** | **UNBLOCKED** — S3 is built, so a declared price now exists to segment on. |

⚠ **Every state above is a claim with an expiry date.** Verify with
`gh pr view <n> --json state,mergedAt` before acting on it; this corpus has been wrong about a PR's
state five times. Neither PR was merged when this was written — *armed is not merged*.

🔑 **AND S5's PREMISE IS NOW TRUE IN A WAY IT WAS NOT THIS MORNING.** Its brief says both halves
exist and nothing joins them. Half of that was optimistic: `starting_price_php` existed as a
COLUMN, and **every card in production carried NULL**. S3 does not fill the old ones — it stops new
ones being born empty. **S5 must still handle a priceless legacy card**, and the honest answer is
the one already shipped in `category-search.ts`: **fail OPEN to a neutral fit, never hide the
card.** A segmentation that silently deletes a shop from the results is a worse defect than the one
it fixes.

---

### S1 — A dispute is not an eraser · **Opus 5 · high** · no dependencies
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

### S2 — The shop tells the truth · **Opus 5 · medium** · ✅ **BUILT 2026-08-28 — do NOT rebuild it**
PR [#4950](https://github.com/iscasasola/setnayan-platform/pull/4950). ⚠ Verify with
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

### S4 — The customer page answers · **Opus 5 · high** · after S1
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

### S5 — Price decides reach · **Opus 5 · high** · after S3
**What a person gets:** the price a shop declares actually decides which couples see the card.
Both halves exist and nothing joins them: couples' `budget_band`, cards' `starting_price_php`.
⛔ **Segmentation, never paid placement.**

---

## NOT SESSIONS

- ✅ **Shop registration from a signed-in home page is SHIPPED** — the `canOpenShop` gate in
  `dashboard/(launcher)/page.tsx`, pinned by `open-shop/has-a-doorway.test.ts`. A one-line check,
  and **it must not gate anything.**
- ✅ **The five rooms already exist as designed.** Only the rename and the room CONTENTS are deltas.
- 🔴 **Recruiting shops is the owner's, and it is the binding constraint.** 1 published shop,
  1 card, 0 priced, 0 enquiries ever. Every session above is scaffolding until suppliers arrive.
