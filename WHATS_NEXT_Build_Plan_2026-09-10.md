# WHAT'S NEXT — the build plan for the live two-sided test (2026-09-10)

> ⚠ **CORRECTION BY THE ORCHESTRATOR, 2026-09-10 — READ BEFORE ACTING ON ANY "STOCK PHOTO" LINE BELOW.**
> This plan cites DECISION_LOG row 3838 as the owner ruling "never a stock photo" and says it supersedes his
> 2026-06-04 order. **That is wrong about whose words they are.** Row 3838's owner quote is only *"we want a different
> look for free and solo. We want minimum website function for free. so they would want to go solo."* — "never shows a
> stock photo, a zero or an empty chart" is the orchestrator's own APPLICATION of it, written into the same row. The
> owner's only explicit ruling on the stock photo is 2026-06-04 (commit 4dfa9d8a5c): *"it can apply to real vendors as
> well"* — i.e. he ORDERED it. ⇒ **The stock photo is an OPEN OWNER QUESTION, not settled.** No session removes it
> until he rules. "No zero" and "no empty chart" are likewise the orchestrator's reading and ride with the same question.

> **Register. The one open stream for the supplier ↔ couple path.** Prompts to launch each session:
> [`WHATS_NEXT_Build_Plan_PROMPTS_2026-09-10.md`](WHATS_NEXT_Build_Plan_PROMPTS_2026-09-10.md).
>
> **Measured, not read:** code at `origin/main` **`a692363771`**, which production serves
> (`GET https://www.setnayan.com/api/health` → `"version":"a692363"`, 10:13Z). PR states from
> `gh pr view` at 10:13–10:20Z. Production data from read-only SELECTs. Corpus at `7cddcaa`.
> Two critics attacked the first draft; every must-fix they proved is applied (§ 8 lists them).
>
> ⚠ **A DOC IS NOT EVIDENCE, THIS ONE INCLUDED.** PR states in this file WILL go stale within hours
> — four PRs moved while it was being written. Before acting on any line, re-run
> `gh pr view <n> --json state,isDraft,mergeable,mergedAt,headRefOid` and check production's
> `/api/health` version by **ancestry** (`git merge-base --is-ancestor <merge-sha> <served-sha>`).

---

## 1 · For the owner — one screen

**The path you want to test** — a supplier makes a card, a couple finds it, they talk, agree, book,
it locks, and the price can still change afterwards with both numbers shown — **is mostly built.
Four things break it today and one step is missing:**

1. **A supplier still has to type a Setnayan gift to publish a card.** You ruled it optional; the
   fix is finished and waiting to go in. It goes in first.
2. **"Lock this deal" can lie.** If you agree a deal in chat before the supplier has sent a formal
   quote, pressing Lock tells both of you it is locked — but nobody is booked and no price is saved.
   It is the most natural thing to try in your test. Nobody is fixing it yet; it is now session A2.
3. **After you accept a quote, the page just says "Accepted" and stops.** Nothing tells you that
   booking means pressing Lock on your suppliers page. That is a dead end on day one — session A4.
4. **After a lock, changing the price replaces the old number instead of showing both**, and a price
   cut can turn into a negative bill. The fix follows your "both, shown separately" ruling and is
   built, but it needs rework and **your look before it goes in**, because it is money.
5. **The missing step:** adding a shop to one of your events on purpose. Today it happens only as a
   side effect of messaging, onto your first event. Your "want to add them to your event?" section
   is **already drawn** — the drawing is finished. It needs a few corrections (it shows the wrong
   Enterprise price and promises two checks we cannot do yet) and then **your look**.

Already on its way in by itself: the fix that takes a shop's email and phone off its public page and
off your own screens (five places, not two).

**Steps 8 to 11 — negotiate, book, lock, change the price — have never run in production, not
once.** Your test will be the first time.

**What gets built, in order**
- **Now:** the gift becomes optional for real · "Lock this deal" stops locking without a price ·
  accepting a quote shows you the next step · a locked shop sits at the top of its group on your
  list · deploys get some headroom and a critical Next.js security update lands. Alongside, with no
  code: today's rulings go into the decision log, the shop-page drawing is corrected, and your
  one-page test script is written.
- **Next:** no card can go live without a name · both numbers after a lock (you look first) · the
  verification desk.
- **Then your first test round**, with a session watching production and telling you in plain words
  what each tap actually did.
- **Then:** the gift actually reaching couples · photos and proper names on marketplace cards · an
  honest shop page (songs only for music acts, no "0 yrs", a lapsed plan loses its paid look).
- **After you have seen the drawing:** the add-to-your-event section · the old verify page points to
  the new one · a share preview that never breaks · then the new shop page and the six-door My Shop.

**What I need from you**
- **Before the test (blocking):** rename the band shop — its public name ends in "(FIXTURE)" — give
  its two cards real titles and cover photos, add a GCash QR, and leave the gift at "no". Play the
  couple on a **test account, not yours** (yours unlocks everything, so it proves nothing about
  payment), and give that test couple's event a date.
- **Look at three things when they are ready:** the corrected shop-page drawing · the "both numbers
  after a lock" change before it merges · the corrected six-door My Shop drawing.
- **Questions that can wait** are in § 5, each with my recommended answer.

---

## 2 · The critical path — 11 steps

| # | Step | Verdict today | What fixes it |
|---|---|---|---|
| 1 | Supplier creates a card | **Works.** A new card is named in the browser only; copied/older cards stay nameless, and both live cards are nameless (they show their category). | **B1** (#5387, the database names a blank card) + owner types real titles |
| 2 | Supplier publishes | **Broken against the owner's ruling.** App gate, publish trigger and save function all still require the gift; the save function also erases a card's gift text when the key is absent. #5375 merged into #5373's *branch*, not main. | **A1** (land #5373 whole). Its "yes" promises Papic credits nothing grants until **C1**, so test shops stay at "no". |
| 3 | Shop is verified | **Works, checks nothing.** Approve grants the badge with no papers or profile check — both production shops were verified that way. The standing ruling is: Approve **warns**, it does not refuse. | **C3** (#5394, per-check results + open the paper + vouch mounted); **D3** points the old 12-document page at the new flow |
| 4 | Couple sees it in the marketplace | **Works** (signed-out `/explore` 200). But the only visible shop is named "(FIXTURE)", cards are nameless, the default grid shows no photo even for the card with a cover, and a label reads "Host Mc". | **C2** (grid falls back to the cover; proper names from the label map already in code) + owner prep |
| 5 | Couple opens the shop page | **Works.** Email/phone exits are being closed by **#5404** (auto-merging). Share preview expires after 24 h; a shop without a logo has none. Not yet the "proud to share" page. | **#5404** (watch) · **E1** (stable share card) · **F1/F2** (port the drawing) |
| 6 | Couple adds the shop to an event | **Missing as a step.** Happens only as a side effect of Inquire, silently, onto the first event. A signed-in couple with no event can be sent to wedding setup (rare fallback). | **D1** — fold 5, reusing the shipped add-to-event picker and the shipped save-to-picks action. Round 1 of the test uses Inquire with a **one-event** couple. |
| 7 | Couple messages the shop in the app | **Works.** Contact filter is ON in production. Accept-to-continue rule holds. | Nothing beyond #5404 |
| 8 | They negotiate | **Broken.** A Deal struck before a formal quote still shows "Lock this deal"; pressing it books nobody, freezes a NULL price, tells the supplier "Deal locked", and the card says "Price agreed and frozen at this amount". | **A2** (new). #5402 (answer requests from Decisions) auto-merges and helps. |
| 9 | The booking is made | **Built, never run.** Accepting a formal quote only shortlists at a price; the accepted page says "Accepted on <date>" and a Back link — no next step. A verified shop's first 5 sourced bookings pay no booking fee, and the fee is switched on but not enforced, so **no fee order will appear in round 1.** | **A4** (the accepted page and chat say what to do next) |
| 10 | It locks (the handshake) | **Works by code and by the production objects; flag ON; never exercised.** After a lock, the couple's list still sorts the locked shop like a candidate (the fix is stranded on a branch). | **A5** (land the stranded commit `e67420406e`) |
| 11 | Price adjusted after the lock, both numbers | **Broken.** A post-lock Deal REPLACES the agreed total; the change-order function would turn −₱15,000 on ₱100,000 into a −₱15,000 bill. | **B2** (rework #5390, cover the Deal-reprice branch too; owner looks before merge) |

---

## 3 · The order

**Rules for every wave:** at most **three code sessions at once**; never two sessions on the same
file; every session builds in a worktree **beside the repo** (never `/tmp`) and commits early;
money, security-grant and owner-gated PRs open as **DRAFT** (a workflow arms auto-merge on every
non-draft PR ~12 s after it opens). "Done" = production's `/api/health` version contains the merge
commit **by ancestry**.

**Moving by itself — no session, only a check once it lands:**
- **#5402** (answer each side's request from Decisions) — auto-merge armed, CI green but one.
- **#5404** (no door out of the app — five exits closed) — auto-merge armed. This **is** session A3.
- **#5377** (a host can take back a coordinator's guest-list access) — MERGEABLE, auto-merge armed.
- **#5403** (the invite link is an arrival) — another stream; shares no file with this plan.

**WAVE 1 — start now (three code slots):**
- Slot 1: **A1** (watch/land #5373) → then **A4** (after-accept next step).
- Slot 2: **A5** (bench cherry-pick, ~30 min) → then **A2** once #5402 has merged.
- Slot 3: **B3** (deploy headroom + Next.js security). If any production deploy fails on the
  function-size limit before B3 lands, B3 becomes the top priority of the whole plan.
- No code, in parallel: **L1** (decision-log rows), **P1** (correct the universal shop-page drawing
  before the owner sees it), **T1-script** (the owner's one-page test script).

**WAVE 2 — once A1 and A2 have merged:** **B1** (#5387) · **B2** (#5390, owner looks before merge;
ask for that look as soon as A2 merges — it is the long pole) · **C3** (#5394, a one-token fix and a
merge; no owner gate).

**TEST ROUND 1** — once A1, A2, A4, A5, B1, B2 and #5404 are served. Supplier = the band shop
(owner-renamed); couple = a non-internal test account with exactly one event. "Add to event" goes
through Inquire in this round.

**WAVE 3:** **C1** (gift reaches the couple, EX-2) · **C2** (marketplace cover + names) · **D2**
(honest shop page). **F0** (correct the six-door drawing, corpus only) any time from here.

**WAVE 4 — after the owner has viewed P1's corrected drawing:** **D1** (fold 5) · **D3** (old verify
page → papers section) · **D4** (#5140, close #5012). **TEST ROUND 2** follows D1, with a couple
that has two ongoing events.

**WAVE 5:** **E1** (share card) · **E2** (contact rule on About/tagline) · **E3** (round-6
government-ID delete guard) · **E4** (close the database door to shop email/phone) — three at a time.

**WAVE 6:** **F1 → F2** (universal shop page port, strictly in order) in parallel with
**G1 → G2 → G3** (six-door My Shop port, strictly in order, after the owner has viewed F0).

**Serialised chains — respect them exactly:**
- **Public shop page file** (`app/v/[slug]/page.tsx`): #5404 → D1 → D2 → E1 → F1 → F2. If D1's
  viewing has not happened when D2 is ready, D2 goes first. Never two at once.
- **Exposure-baseline header** (`supabase/security/exposure-surface.baseline.txt`): #5377 (lands
  itself) → A1 (regenerates again) → B2 → D4/#5140 → C1 if it adds grants → E4.
- **Port-control baseline** (`apps/web/scripts/port-control-baseline.json`, generated): whoever
  merges second regenerates it from the merged tree — A1 · #5404 · D1 · D3 · G1–G3 all touch it.
- **Chat lock card** (`chat-amendment-card.tsx`): #5402 → A2 → B2.
- **Chat lock booking** (`lib/chat-lock-booking.server.ts`): B2 → C1.
- **Service-card files**: A1 → B1 → C1.
- **Couple's supplier card** (`vendor-itemization-card.tsx`): #5404 → B2.
- **Admin verification area + generated admin-map inventories**: C3 → E3.
- **My Shop page file**: D3 → E2 → G1 → G2 → G3.
- **`app/vendor-dashboard/actions.ts`** (shared, large): E2 alone.

---

## 4 · The sessions

Each card: what a person gets · already exists · delta · depends on · gate · model/effort · touches ·
parallel-safe with · must not run with · done means. Session IDs are stable — refer to them by ID.

### A1 · A supplier can publish a card without the Setnayan gift (land #5373 whole)
- **A person gets:** a supplier fills in a price and publishes; the gift is a plain yes/no they can
  leave at no; the two live cards keep their gift wording.
- **Already exists:** PR **#5373** (draft, MERGEABLE at 10:13Z, head `c31b0be`, merged main at
  09:45Z by another actor) already contains **#5375** (merged into the branch 06:41Z): publish
  trigger migration `20271215941485` (gift no longer required; price still required) and save
  function migration `20271216515644` (no "exclusive required" error; an absent key means UNCHANGED
  instead of erasing; `includes_setnayan_gift BOOLEAN NOT NULL DEFAULT FALSE`, no backfill). No later
  migration on main redefines either function.
- **Delta:** nothing to build. (1) Check with `gh` whether another session is driving #5373 (the
  head moved at 09:45Z); if so, this session only watches it to merge. (2) After **#5377** lands,
  #5373 re-conflicts on the exposure-baseline header: merge main, **regenerate** the baseline from
  the merged tree (never pick a side; a clean auto-merge of this file has produced a header that
  disagreed with its body before), confirm the only content diff vs main is the one
  `includes_setnayan_gift` line; regenerate the port-control baseline too if its guard asks. (3) CI
  green incl. db tests. (4) Rehearse both migrations against production inside `BEGIN … ROLLBACK`
  (the permission prompt is the approval; if declined, rely on the replay and verify the live
  objects after deploy). (5) Answer the two stale "DO NOT MERGE ALONE" PR comments. (6) Add one line
  to the PR: the "yes" state promises Papic credits that only C1 delivers. (7) Mark ready; merge as
  ONE change — never the gate without the save function.
- **Depends on:** nothing. **Gate:** none (owner ruled optional + yes/no, 2026-09-09).
- **Model/effort:** default · high.
- **Touches:** `app/vendor-dashboard/services/**` (actions.ts, maker, publish gate, card face,
  wizard, manager) · `lib/service-publish-gate.ts`, `card-health.ts`, `vendor-card-copy.ts`,
  `vendor-services.ts`, `offered-service-card*.ts`, `service-card-snapshot.ts`, `canvas-initial.ts`,
  `service-customization-draft.ts` · `app/_components/chat-offered-service-card.tsx` · the two
  generated baselines · 2 migrations.
- **Parallel-safe with:** A2, A4, A5, B3, L1, P1, T1. **Must not run with:** B1, C1, B2, D4.
- **Done means:** `gh` shows #5373 MERGED; production `/api/health` version has the merge commit as
  an ancestor; read-only prod: `pg_get_functiondef` of `enforce_service_publish_gate` and
  `save_vendor_service` contain no exclusive requirement; the column exists with default false;
  `SELECT exclusive_perk_text FROM vendor_services` still returns both live cards' original text
  ("Free 1-hour extension for Setnayan couples" and "FREE"). (The gift text is not rendered on
  `/explore`, so do not use the marketplace as the check.)

### A2 · "Lock this deal" can no longer lock without a price
- **A person gets:** a Deal struck before the supplier sent a quote shows "ask the shop to send
  their quote first" instead of a lock that books nobody. Nobody is told "locked" or "frozen" unless
  a price was saved and a booking was asked for.
- **Already exists:** `lockDeal` in `app/_components/negotiation-actions.ts` (~852–918): skips the
  booking when `newTotalPhp` (`lib/proposal-amendments.ts`) returns null for a missing base
  proposal, but still stamps `locked_at`, freezes `agreed_price_centavos = NULL` and emits "Deal
  locked". `chat-amendment-card.tsx` (~243–249) renders "🔒 Lock this deal" with no price;
  `lockFreezeLine`'s `none` arm returns "Price agreed and frozen at this amount." The handshake
  (`vendor_agree_to_lock`) is correct and stays untouched. No branch or PR addresses this.
- **Delta:** (1) the card offers Lock only when the amendment has a base-proposal total; otherwise
  one plain line asking the shop for its quote first. (2) `lockDeal` refuses, with a visible outcome,
  when the total is null — never freezes, never emits "Deal locked" without a booking ask. (3) the
  `none` arm of the freeze line can no longer claim a frozen amount. (4) A guard test over the card
  and the action (strip comments before matching; derive the file set), mutation-checked with
  occurrence counts printed before → after. No migration.
- **Depends on:** #5402 merged (it also edits `negotiation-actions.ts`). **Gate:** none.
- **Model/effort:** default · high.
- **Touches:** `negotiation-actions.ts`, `chat-amendment-card.tsx`, `lib/proposal-amendments.ts`
  (read), a new lib test.
- **Parallel-safe with:** A1, A4, A5, B3. **Must not run with:** B2, #5402 until merged.
- **Done means:** merged and served (ancestry); the unit test proves the no-quote card has no Lock
  control and the action refuses; read-only prod shows no thread frozen with a NULL agreed price;
  T1 includes the owner tap "strike a Deal before any quote — no Lock button appears".

### A3 · The shop page and the couple's screens stop sending couples out of the app — **WATCH ONLY, now PR #5404**
- **A person gets:** a stranger on a shop's page no longer sees a tappable email or phone; the
  couple's own supplier card, workspace, budget card and Vendors page stop carrying them too.
- **Already exists:** **PR #5404** (not draft, MERGEABLE, auto-merge armed, head `ed318a49b0`,
  19 files) closes five exits, not two (DECISION_LOG row 2026-09-10 "the doors out are closed"),
  with a derived-file-set guard `lib/no-door-out-of-the-app.test.ts`.
- **Delta:** no session. Whoever next runs checks it served. **Left open by it on purpose:** the
  shop's own website link, portfolio/social link-outs (owner question 3), contact details in the
  shop's own text (E2 applies the settled rule), and the database door — `vendor_profiles.contact_email`
  is SELECT-granted to `anon`, `contact_phone` to `authenticated` (E4).
- **Done means:** #5404 MERGED; served by ancestry; `curl -s https://www.setnayan.com/setnaprod`
  contains neither `mailto:iscasasolaii` nor `tel:+63917`; the band shop's page still shows a
  working signed-out inquiry form.

### A4 · After a couple accepts a quote, the next step is on screen
- **A person gets:** after "Accept proposal", the couple is told plainly that booking means asking
  the shop to lock, with one tap to exactly where Lock lives (or the Lock itself) — not "Accepted on
  <date>" and a Back link.
- **Already exists:** `app/proposals/[publicId]/page.tsx` — `respondToProposal` →
  `respond_vendor_proposal` (production body: shortlists the shop with a price; does NOT book). The
  accepted state prints only `{status label} on {date}` and a Back link to
  `/dashboard/<event>/vendors`. The couple's lock is `finalizeVendor`
  (`app/dashboard/[eventId]/vendors/actions.ts` ~879), which ASKS the supplier (handshake ON).
- **Delta:** RULE 0 first — find the shipped Lock control for one supplier on the vendors page and
  whether it has an anchor. Then: on the accepted state (couple side only), one short next-step
  block — "You've accepted. To book them, ask {shop} to lock — they confirm, then it's booked." —
  with a link to that supplier's Lock (deep link/anchor) or, if an existing action can be reused
  safely, a button calling it. Check whether the chat shows anything after accept; if the chat's
  quote card also dead-ends, give it the same line. No new server action, no migration. Guard it.
- **Depends on:** A1 merged only because it frees the slot (no file overlap). **Gate:** none.
- **Model/effort:** default · medium.
- **Touches:** `app/proposals/[publicId]/page.tsx`, possibly the chat proposal card, a test.
- **Parallel-safe with:** A2, A5, B3. **Must not run with:** anything editing the proposal page.
- **Done means:** merged and served; test proves the accepted couple-side state renders the next
  step and a link that resolves to the supplier's Lock; T1 includes the owner tap.

### A5 · A locked supplier sits at the top of its group on the couple's list (land a stranded fix)
- **A person gets:** once a shop is locked, it leads its category on the couple's list instead of
  sorting like a candidate.
- **Already exists:** commit **`e67420406e`** on `origin/claude/plan-name-overwrites` ("fix(bench):
  a locked vendor leads its category instead of sorting like a candidate", 2026-09-06,
  mutation-checked) is **not on main** (`git cherry` shows `+`; main's `lib/bench-sort.ts` has no
  `hoistLocked`); its PR #5222 merged without it.
- **Delta:** cherry-pick onto a fresh branch from main as its own PR; re-run `bench-sort.test.ts`
  and require a non-zero `# tests`; re-apply one sabotage with the count printed. The sibling
  stranded commit `1ca4989f8c` (Papic credit estimate) is NOT in scope — leave it listed.
- **Depends on:** nothing. **Gate:** none. **Model/effort:** default · low.
- **Touches:** `lib/bench-sort.ts` and its test. **Parallel-safe with:** everything in wave 1.
- **Done means:** merged and served; `git grep hoistLocked origin/main -- apps/web/lib/bench-sort.ts`
  matches.

### B1 · No service card goes live without a name (land #5387)
- **A person gets:** every card a couple sees has a name; a nameless one becomes "<kind> by <shop>";
  the supplier's own words always win.
- **Already exists:** PR **#5387** (draft, MERGEABLE, head `17f84dc557`): trigger
  `fill_blank_service_card_title`, named to fire before the publish gate, migration
  `20271217522970`, no backfill. Its green ran before **#5388** turned `vendor_profiles`'
  authenticated read into a per-column allowlist.
- **Delta:** update from main after A1; re-run CI so the green covers the allowlist (the trigger reads
  `business_name`, `verification_state`, `name_revealed_at` — confirm each is granted). Rehearse in
  `BEGIN … ROLLBACK` against production. Note in the PR: for `live_band` the database display name is
  the wedding-only "Wedding Bands (full ensemble)", so the auto-title reads that way on a band that
  also plays debuts — do NOT widen #5387; the owner types real titles in T1 prep. Mark ready, merge.
- **Depends on:** A1 merged. **Gate:** none (auto-name is owner-locked). **Model/effort:** default · high.
- **Touches:** `app/vendor-dashboard/services/actions.ts`, `lib/service-card-auto-title.ts`, the
  migration, two tests.
- **Parallel-safe with:** B2, C3. **Must not run with:** A1, C1.
- **Done means:** merged and served; read-only prod shows the trigger on `vendor_services`; the db
  test proves a blank title is filled and a typed one wins.

### B2 · After a lock, a price change shows both numbers (rework and land #5390)
- **A person gets:** the couple's budget shows the agreed total AND the change as its own line; a
  price cut never becomes a negative bill.
- **Already exists:** PR **#5390** (draft, CONFLICTING, CI red on "the couple's voice is gone from
  the locked notice"). Migration `20271218458148` re-signs `accept_change_order`, adds
  `is_change_delta`, drops the non-negative CHECK. Owner ruled "Both, shown separately"
  (DECISION_LOG 2026-09-09) — **do not re-ask**.
- **Delta:** (1) decide which lock sentence is TRUE (the couple's voice, or main's freezeLine from
  #5393) and make code and test agree — never just silence the test. (2) Rebase over #5404 (shared
  `vendor-itemization-card.tsx`), A2 (shared `chat-amendment-card.tsx`) and A1 (baseline header);
  regenerate the exposure baseline from the merged tree, reading the diff first. (3) Close the gap NOT
  in the PR: on main the post-lock Deal path (`refresh_fee_only` in `lib/chat-lock-booking.server.ts`,
  from #5355) overwrites `total_cost_php` — make it record a change beside the agreed total too.
  (4) Re-measure the PR's "safe by arithmetic" claim against production, read-only. (5) Rolled-back
  rehearsal. (6) Stay DRAFT until the owner has looked.
- **Depends on:** A1, A2, #5404 merged. **Gate:** owner ACTION — looks before merge.
- **Model/effort:** default · high.
- **Touches:** `chat-amendment-card.tsx`, `app/dashboard/[eventId]/budget/page.tsx`,
  `vendor-itemization-card.tsx`, `lib/budget*.ts`, `lib/agreed-total-and-its-changes.ts`,
  `lib/chat-lock-booking.server.ts`, the migration, exposure baseline.
- **Parallel-safe with:** B1, C3. **Must not run with:** A2, A1, D4, C1, anything on
  `chat-lock-booking.server.ts`.
- **Done means:** merged after the owner's look; served; read-only prod: `accept_change_order` body
  carries `is_change_delta`; db tests prove a post-lock Deal and a change order both keep the
  original total with the change beside it; T1 includes the owner tap.

### B3 · Deploy headroom, then the Next.js security update (#5397)
- **A person gets:** nothing visible. What it protects: a critical-rated security release lands, and
  no ordinary merge can suddenly stop every production deploy.
- **Already exists:** **#5397** (Next 15.5.21 → 15.5.24, auto-merge armed) fails two checks: the
  `vendor-dashboard/clients/[eventId]/mood-board` server function is **252.37 MB** against Vercel's
  250 MB limit, and the shared bundle is 201.5 KB against a 201 KB budget. On main that function
  sits just under the ceiling.
- **Delta:** find what the file tracer drags into that function; slim it with a targeted
  `outputFileTracingExcludes` entry or a dynamic import of the heavy dependency; state the size
  before/after from the Vercel build log. Trim 0.5 KB or raise the budget with a logged reason. Let
  #5397 merge. Do NOT ask the owner for `VERCEL_SUPPORT_LARGE_FUNCTIONS` unless slimming fails.
- **Depends on:** nothing. **Gate:** none. **Model/effort:** default · high.
- **Touches:** `apps/web/next.config.ts`, the mood-board route tree, bundle budget config, lockfile
  via #5397.
- **Parallel-safe with:** A1, A2, A4, A5. **Must not run with:** anything editing `next.config.ts`.
- **Done means:** #5397 merged; its production deploy is READY; `/api/health` is a descendant.

### C1 · The Setnayan gift actually reaches the couple (EX-2)
- **A person gets:** when a supplier says yes, the couple receives free Papic credits sized to the
  booking, and the quote shows the number.
- **Already exists:** planned session **EX-2** in `SESSION_PROMPTS_2026-09-09_WAVE2.md`, all five
  owner gates closed (40% of the booking fee as a ceiling · fee derived from `lib/booking-fee.ts` ·
  credits interpolated along the live Papic ladder · capped at the 50,000-credit rung · count on the
  quote, never the card). The yes/no ships in A1.
- **Delta:** build exactly what EX-2 specifies, using its prompt as the brief. DRAFT PR (money + grant).
- **Depends on:** A1, B1, B2 merged. **Gate:** none to build; DRAFT for review.
- **Model/effort:** default · high.
- **Touches:** card + quote files, `lib/booking-fee*.ts`, the Papic grant path,
  `lib/chat-lock-booking.server.ts` if the fee add-on sits at lock, a migration.
- **Parallel-safe with:** C2, D2. **Must not run with:** A1, B1, B2, anything on the Papic pot.
- **Done means:** merged after review and served; db tests prove the grant amount and cap; a test
  quote shows the credit count. **The pot actually growing is checked in the booking-fee test round**
  — nothing "clears" before then (the fee rail is not enforced and a verified shop's first 5 sourced
  bookings are free).

### C2 · Marketplace cards show their photo and a proper service name
- **A person gets:** a card with a cover photo shows it on the main grid; labels read "Host / MC"
  instead of "Host Mc".
- **Already exists:** #5384 fixed the cover's address, but the grid/folder model reads showcase
  photos only (`lib/service-card-view-model.ts` ~243). `displayServiceLabel` (`lib/vendors.ts` ~514)
  title-cases codes. **The proper label already exists as a pure map:** `WEDDING_TILE_LABEL` in
  `lib/taxonomy.ts` (~563: `host_mc: 'Host / MC'`, `live_band: 'Live Band'`).
- **Delta:** (1) the grid/folder card falls back to the card's cover when it has no showcase photos.
  (2) `displayServiceLabel` consults `WEDDING_TILE_LABEL` first, title-casing as fallback — no
  database round trip, no call-site changes. Tests for both. **No owner/admin action** (production has
  no `host_mc` row in `canonical_service_schemas` to edit).
- **Depends on:** #5404 and A1 merged. **Gate:** none. **Model/effort:** default · medium.
- **Touches:** `lib/service-card-view-model.ts`, `lib/vendors.ts`, the marketplace card component if
  it builds its own label. **NOT** `app/v/[slug]/page.tsx` (D2 owns it).
- **Parallel-safe with:** C1, D2, C3. **Must not run with:** anything editing `lib/vendors.ts`.
- **Done means:** merged and served; signed-out `GET /explore` carries the cover image URL on the
  card that has one in the default grid, and "Host / MC" appears.

### C3 · The admin verification desk: a result per check, open the paper, vouch mounted (land #5394)
- **A person gets:** the reviewer sees each check passed/missing and can open each paper; vouching
  for a shop (reason + 6-month deadline) is reachable.
- **Already exists:** PR **#5394** (draft, "DO NOT AUTO-MERGE", MERGEABLE, head `ed52d5a5ec`; CI red
  on one TypeScript error at `app/admin/verify/the-reviewer-can-open-the-paper.test.ts:332`,
  `select![1]` under `noUncheckedIndexedAccess`). Mounting the vouch control is DECIDED inside the
  PR, applying the owner's 2026-09-07 vouch rulings (same badge · no cap · 182 days).
- **Delta:** fix the one token; update from main; regenerate the admin-map inventories if the guard
  asks; strike the PR-body paragraph about `/admin/verification-docs` (fixed by #5398). **Merge with
  Approve still WARNING** — that is the standing ruling (DECISION_LOG 2026-09-10: "THE BUTTON WARNS;
  IT DOES NOT REFUSE"). If the owner later answers question 2 with "refuse", that is a one-line
  follow-up (the PR says `grantWarning` already holds the message).
- **Depends on:** nothing. **Gate:** none. **Model/effort:** default · medium.
- **Touches:** `app/admin/verify/**`, `app/admin/vendors/verification-bypass-actions.ts`,
  `lib/verification-checks*.ts`, `lib/r2.ts`, `lib/admin-map/*.generated.ts`.
- **Parallel-safe with:** B1, B2, C1, C2, D2. **Must not run with:** E3.
- **Done means:** merged and served; the test (non-zero count) proves a per-check result renders.

### D1 · Fold 5: "Want to add them to your event?" — your events and a create-event tile
- **A person gets:** on a shop's page, a couple sees their ongoing and upcoming events, taps Add on
  the one they mean, or taps Create an event and comes back to this shop. Messaging no longer files
  the shop silently onto the first event. A couple with no event is asked what kind of event.
- **Already exists — REUSE, do not rebuild:**
  `app/_components/marketing/add-to-event.tsx` (+ `add-to-event-data.ts`, `add-to-event-cta.tsx`,
  guard `add-to-event-is-the-only-difference.test.ts`) — the shipped "pick which event" picker with a
  create row, owner-ruled 2026-08-21 ("the ongoing and upcoming only"), filtered **on the server** so
  a stranger's browser never receives event names. It navigates via `addOnHref` today.
  `saveVendorToPicks` (`app/(shell)/explore/actions.ts` ~186–200) already accepts and validates a
  posted `event_id` (`not_your_event` / `no_primary_event`). `startServiceInquiry` already accepts a
  validated `eventId`, but the public composer never passes one. The anon composer already asks the
  event type (`destinationFor`). The drawing is **finished** (corpus `6d20835`, section F).
- **Delta:** mount the shipped picker on the shop page per the (P1-corrected) drawing, with its
  action generalised to call `saveVendorToPicks` for a shop (keep its server-side filtering and its
  existing guard green). Signed out: the existing sign-in-over-the-page, then the same list. Pass the
  chosen event into the inquiry composer so a message files under it. Change the two hardcoded
  `/onboarding/wedding` fallbacks in `inquiry-composer.tsx` (~454, ~506) to the create-event type
  picker. No new table, no new server action. Regenerate the port-control baseline from the merged
  tree (a destination is removed).
- **Depends on:** P1 done + owner has viewed the drawing; #5404 merged. **Gate:** owner ACTION —
  viewed the drawing (fold 5's content is already ruled, 2026-09-10).
- **Model/effort:** default · medium.
- **Touches:** `app/v/[slug]/page.tsx`, the add-to-event component trio, `inquiry-composer.tsx`,
  `anon-inquiry-composer.tsx`, `app/v/[slug]/inquiry-actions.ts` (pass-through).
- **Parallel-safe with:** D3 (mind the port-control baseline — merge in order), D4.
  **Must not run with:** D2, E1, F1, F2, anything on the add-to-event component.
- **Done means:** merged and served; tests prove Add posts the chosen event and a stranger receives
  no event names; T1 round 2: signed in with two events, Add on event B puts the shop on B's list
  (read-only prod row) and a later inquiry opens under B.

### D2 · The shop page tells the truth: songs only for musicians, no zero, lapsed plans lose the paid look
- **A person gets:** a band's page shows its set list and a caterer's never will; a first-year shop
  never reads "0 yrs in business"; a shop that stops paying loses its paid look right away; headings
  stop saying "Wedding" on a debut shop.
- **Already exists:** the public songs block is gated only on `repertoire.length`
  (`app/v/[slug]/page.tsx` ~2382). **Two conflicting music rules:** `isMusicVendor` /
  `MUSIC_CANONICALS` in `lib/songs.ts` (live_band, choir, orchestra, wedding_singer, dj) — matches the
  test band — and `SPECIALIST_TOOLS` in `lib/vendor-service-tools.ts` (~178:
  `categories: ['band_dj','string_quartet','choir']`) — matches **none** of the band's cards
  (`live_band`, `host_mc`), so the band's Services › Tools tab never offers its song bank today.
  More-tools lists Repertoire for every shop (`shop-tool-shelves.ts`). `repertoire/actions.ts` does
  not check music at all. `yearsInBusiness` prints 0 (~2181, ~3073). Four plan gates read
  `tier_state` without `tier_expires_at` although the file's own comment requires both;
  `vendorSeoPlanForVendor` already does the collapse.
- **Delta:** (1) ONE music rule for all four places: the public songs block, `addRepertoireSong`
  refusal, the More-tools card and `SPECIALIST_TOOLS.repertoire` — the union of `MUSIC_CANONICALS`
  and the existing specialist categories (widen, never drop a category). Gate, never delete.
  (2) Never print a zero: when years < 1, print nothing (the drawing replaces the years line with a
  registration year later — F1 — so do not invent "Started <year>" here). (3) Compute the effective
  plan once at the top of `renderVendorBySlug` and pass it to `tierCaps`, `micrositeCan`,
  `isTrueNameTier`, `boothTierCanBrand`; test a past end date renders the Free look.
  (4) "Wedding compatibility" and the "Wedding vendors" breadcrumb become event-neutral.
- **Depends on:** #5404 merged. **Gate:** none (owner stated the songs rule 2026-09-10; row 3838
  rules "never a zero"; the lapse rule is his "downgrade reverts"). **Model/effort:** default · medium.
- **Touches:** `app/v/[slug]/page.tsx`, `repertoire/actions.ts`, `lib/vendor-service-tools.ts`,
  `lib/vendor-experience.ts`, `shop/shop-tool-shelves.ts`, tests.
- **Parallel-safe with:** C1, C2, C3. **Must not run with:** D1, E1, F1, F2, G1–G3,
  anything editing `services-manager`.
- **Done means:** merged and served; `GET /setnaprod` has no "0 | yrs"; the band page still shows
  its songs; tests prove a non-music shop cannot add a song and the band's Tools tab offers the song
  bank.

### D3 · The old 12-document verify page leads to the new papers section
- **A person gets:** "Get verified" anywhere lands on the one current papers screen.
- **Already exists:** `app/vendor-dashboard/verify/page.tsx` (701 lines, "12-document … unlock Pro
  Vendor") still live, linked from `on-the-day/page.tsx:635`, used as the no-profile redirect by 6
  routes and listed in the bottom nav / nav registry. The current flow is My Shop `#get-verified`
  (#5395).
- **Delta:** redirect `/vendor-dashboard/verify` → `/vendor-dashboard/shop#get-verified` keeping
  query params (same pattern `/vendor-dashboard/services` uses); repoint the Event Hub link and the
  nav entries; keep the page's server actions until nothing calls them. Regenerate the port-control
  baseline from the merged tree.
- **Depends on:** nothing. **Gate:** none. **Model/effort:** default · medium.
- **Touches:** `verify/page.tsx`, `on-the-day/page.tsx`, `vendor-bottom-nav.tsx`, nav registry
  defaults, the redirecting routes, port-control baseline.
- **Parallel-safe with:** D1 (merge in order), D4. **Must not run with:** E2, G1–G3.
- **Done means:** merged and served; a test proves the redirect keeps its params; lint-port-no-lost-controls green.

### D4 · Clear the merge train: every film of your day (#5140) and close the stale Stories PR (#5012)
- **A person gets:** Live Studio buyers can attach every film of their day, as `/pricing` promises
  ("unlimited video-link uploads"); nothing half-done lingers.
- **Already exists:** **#5377 needs nothing** — rebased 09:43Z, MERGEABLE, auto-merge armed; it lands
  itself. **#5140** (auto-merge armed, CONFLICTING, 804 behind; conflicts only in two generated files;
  table `event_films`). **#5012** superseded by **#5378** (merged 2026-09-09) + `2f04ea6fa8`.
- **Delta:** after B2 has landed its baseline change: merge main into #5140, regenerate both
  generated files (`tests/db/user-fk-behaviour.generated.txt`, exposure baseline) from the merged
  tree, re-read its migration against today's schema, re-run CI; auto-merge then ships it (intended —
  owner-requested feature). Confirm #5012's second commit is covered by `2f04ea6fa8`; close #5012
  with a note. Do not rebase it.
- **Depends on:** B2 merged. **Gate:** none. **Model/effort:** default · medium.
- **Parallel-safe with:** D1, D3. **Must not run with:** anything regenerating the exposure baseline.
- **Done means:** #5140 MERGED and served; #5012 CLOSED.

### E1 · A shop's link preview never breaks
- **A person gets:** a shared shop link shows a proper Setnayan card (name · category · city ·
  Verified) that does not break tomorrow, even for a shop with no logo.
- **Already exists:** `app/api/og/u/[slug]/route.ts` draws a 1200×630 card for personal profiles
  with a brand fallback. No shop OG route exists. The shop page's own Open Graph settings replace the
  site card and point at a 24-hour presigned logo link (`X-Amz-Expires=86400`); a no-logo shop has no
  `og:image` at all.
- **Delta:** a shop OG route modelled on `/api/og/u`, with the same hide-if-hidden, hide-if-demo and
  name-anonymity checks as `vendorMetadataBySlug`; point `og:image`, `twitter:image` and the
  structured-data image at it; description from category · city · Verified when there is no tagline.
  Take the look from the drawing's share-card panel.
- **Depends on:** D2 (and D1 if it went first) merged. **Gate:** none. **Model/effort:** default · medium.
- **Touches:** new `app/api/og/v/[slug]/route.tsx`, the metadata section of `app/v/[slug]/page.tsx`.
- **Parallel-safe with:** E2, E3, E4. **Must not run with:** D1, D2, F1, F2.
- **Done means:** merged and served; both shop pages carry an `og:image` with no `X-Amz` parameters
  and fetching it returns `200 image/png`.

### E2 · A shop can't slip a phone number or email into its own About or tagline
- **A person gets:** contact details typed into About or the tagline are caught the same way chat and
  card text already catch them.
- **Already exists:** the detector ships for chat (flag ON) and card text (service-text integrity,
  flag ON), ruled 2026-07-23 and 2026-07-27. Neither the tagline save (`shop/public-line-actions.ts`)
  nor the About save (`app/vendor-dashboard/actions.ts` ~900, `microsite_about`) calls it.
- **Delta:** run the existing detector on both saves with the card-text wording and refusal UX. Do
  not touch the shop's own website field (owner question 3). Test and mutation-check.
- **Depends on:** #5404 merged. **Gate:** none (applying settled rulings). **Model/effort:** default · medium.
- **Touches:** `shop/public-line-actions.ts`, `app/vendor-dashboard/actions.ts`, a test.
- **Parallel-safe with:** E1, E3, E4. **Must not run with:** D3, G1–G3, anything on
  `app/vendor-dashboard/actions.ts`.
- **Done means:** merged and served; tests prove a save containing a phone number is refused with the
  card-text wording.

### E3 · Verify and open the "round 6" guard on the government-ID delete
- **A person gets:** the one button that permanently deletes government IDs is protected by tests that
  would actually fail if it broke.
- **Already exists:** branch `claude/the-last-gate-is-guarded` `fe1217634d` (1 commit, no PR, merges
  clean): moves read → judge → delete into `performVerificationDelete` and `verificationDocShelves`.
  It claims six sabotages went green-then-red at 90/90; nothing has re-run it.
- **Delta:** worktree at the branch merged with main, `pnpm install` first; run the test with a
  non-zero count; typecheck printing `TSC_EXIT`; re-apply the six named sabotages with counts printed;
  lint-port-no-lost-controls. Open as DRAFT for one look (irreversible delete path).
- **Depends on:** C3 merged. **Gate:** none to verify; DRAFT. **Model/effort:** default · high.
- **Touches:** `app/admin/verification-docs/**`, `lib/verification-docs.ts`, its test, generated
  admin-map inventories.
- **Parallel-safe with:** E1, E2, E4. **Must not run with:** C3.
- **Done means:** draft PR with the six measured sabotages in its body; merged after a look; served.

### E4 · Close the database door to a shop's email and phone
- **A person gets:** a shop's email and phone cannot be pulled out of the database with the public key,
  so "no talking outside the app" holds even for someone who bypasses the pages.
- **Already exists:** measured by the #5404 session: `vendor_profiles.contact_email` is
  SELECT-granted to `anon`, `contact_phone` to `authenticated`. `vendor_profiles` already runs a
  per-column read allowlist (#5388).
- **Delta:** grep every reader of both columns under a user session (the shop's own dashboard, the
  claim flow, admin, a booked coordinator's hosts page — each KEPT on purpose by #5404) and move each
  to a server read scoped by a session-proved id where needed; then revoke the two columns from the
  public roles, following the #5388 allowlist pattern (a column revoke is inert against a table-level
  grant — check how the grant is actually held). Dry-run in `BEGIN … ROLLBACK`. DRAFT PR (security
  grant).
- **Depends on:** #5404, D4 merged (baseline). **Gate:** none to build; DRAFT.
  **Model/effort:** default · high.
- **Touches:** a migration, the exposure baseline, the reader files found.
- **Parallel-safe with:** E1, E2, E3. **Must not run with:** anything regenerating the exposure baseline.
- **Done means:** merged after review and served; read-only prod `information_schema.column_privileges`
  shows neither column readable by `anon`/`authenticated`; the shop's own dashboard still shows its
  own contact details (test).

### F0 · Correct the six-door My Shop drawing so it keeps everything that ships (corpus only)
- **A person gets:** the owner reviews a My Shop redesign that loses nothing.
- **Already exists:** `prototypes/shop_page_2026-09-10.html` (160 KB, no decision-log row). Its
  inventory omits the Services manager's specialist **Tools** tab (song bank, moodboard, day-of,
  recaps, manpower per trade), the Packages link, the off-season nudge, the Instagram sign-in return,
  anchors/aliases (`#get-verified`, `#manage-shop`, `#auto-reply`, `#earnings`, `?open=`/`?tab=`),
  the "address for good" note and the papers section opening itself at 100%. The request-status list
  it draws already ships. "Permit expiry not kept" is half wrong — `next_renewal_due_at` is written
  at approval.
- **Delta:** edit the drawing, never redraw: give each omitted item a home; door 4's inbox line reads
  the add-on ENTITLEMENT, never the switch; Repertoire only for music trades (the D2 union rule);
  add the row-3838 "see what Solo adds" preview in the shop's own editor; add an "every shipped
  control → its door" table G1 turns into a guard.
- **Model/effort:** Fable · medium. **Touches:** that prototype only. **Parallel-safe with:** everything.
- **Done means:** committed by the orchestrator; every shipped My Shop component and anchor appears
  in its table.

### P1 · Correct the universal shop-page drawing before the owner sees it (corpus only)
- **A person gets:** the owner approves a drawing whose prices and promises are true — a drawing he
  signs off becomes binding.
- **Already exists:** `prototypes/vendor_public_page_universal_2026-09-10.html` — **finished**
  (corpus `6d20835`, 1,410 lines, fold 5 in section F, owner-ruling panels). Measured errors:
  "Enterprise (₱8,000/mo)" at lines ~779 and ~927 (the live `/vendors` page and `vendor_billing_catalog`
  disagree — read the catalog, never retype); "DTI or SEC registration matched against the government
  record" (~769) and "Registered 2019, read off their BIR certificate" (~656, ~770) — neither the
  registry lookup nor a paper reader is built (`parsePaperRead` returns null everywhere). Also: the
  untracked `prototypes/shop_website_by_tier_2026-09-10.html` has three known errors (Enterprise
  price, the retired films rack drawn as new, portfolio drawn Pro-only).
- **Delta:** correct the Enterprise price from the catalog; draw the receipt's checks as "checked by a
  person at Setnayan" until a reader exists, printing each line only when that check passed, and the
  video-call line only when a call was recorded; replace the BIR-year claim with "no year printed until
  one is recorded" (and name recording it as unbuilt); keep the two-column desktop layout Pro-and-up and
  About Solo-and-up (the 2026-07-03 ladder); note fold 5 reuses the shipped add-to-event picker; one
  line for the viewing: row 3838's "never a stock photo" supersedes the 2026-06-04 stock-photo
  directive. Put a "superseded — see the universal drawing" banner on the by-tier file (or correct it).
- **Model/effort:** Fable · medium. **Touches:** those two prototypes only. **Parallel-safe with:** everything.
- **Done means:** no "₱8,000", no "government record", no "read off their BIR" in the file; the
  orchestrator commits; the owner is told it is ready to view.

### F1 · The universal shop page, part 1: the calling card at the top
- **A person gets:** the top of every shop's page looks like something a supplier is proud to share:
  identity, a row of true facts (only ones that exist, no zeros), a Verified receipt listing only
  checks that passed.
- **Already exists:** `renderVendorBySlug` (`app/v/[slug]/page.tsx`, ~3,987 lines); the binding Detail
  archetype `prototypes/archetype_content_editorial_gallery_detail_2026-08-01.html` (owner-approved
  2026-08-04, names `/[vendor-slug]` as its subject); the P1-corrected universal drawing.
- **Delta:** port the drawing onto the existing renderer with existing data: hero identity, fact row,
  receipt from real check results, no stock photo and no empty chart (row 3838), the years/registration
  line only when a recorded value exists. Plan gates stay as shipped (About Solo+, two-column Pro+).
- **Depends on:** P1 viewed by the owner; #5404, D1, D2, E1 merged. **Gate:** owner ACTION — viewed.
- **Model/effort:** default · high. **Touches:** `app/v/[slug]/page.tsx` (top), new components under
  `app/v/[slug]/_components`. **Parallel-safe with:** G-sessions. **Must not run with:** every other
  page.tsx session.
- **Done means:** merged and served; `/setnaprod` and the band page match the drawing's top at phone
  and desktop width; no zero facts; no placeholder photo.

### F2 · The universal shop page, part 2: the body, reviews and the message bar
- **A person gets:** services, portfolio and reviews in the approved layout; a new shop shows one calm
  reviews line instead of five empty star bars; messaging stays in reach.
- **Already exists:** the same renderer; `ReviewsSection` with the empty five-star block; the sticky
  Inquire rail (Pro+ today).
- **Delta:** port the body; the empty-reviews line (row 3838: never an empty chart); keep Pro-only
  features Pro-only; the shop's own website/social links per owner question 3.
- **Depends on:** F1 merged. **Gate:** owner ACTION (viewed) + question 3 for the links.
- **Model/effort:** default · high. **Touches:** `app/v/[slug]/page.tsx` (body), `_components`.
- **Done means:** merged and served; a zero-review shop shows no "0" bars; lint-port-no-lost-controls
  shows no lost destination.

### G1 · Six-door My Shop, part 1: hero, rail and door 1 (shop information and papers)
- **A person gets:** My Shop opens to six clear doors, shop information and papers first, and one
  "Next:" button that says what to fix.
- **Already exists:** `app/vendor-dashboard/shop/page.tsx` (1,829 lines): HeroCard, stat tiles,
  ManageTiles, ProfileChecklistEditor, VenueMatch, VenueType, Visibility, RequestCorrection,
  VerifySection (#5395), BranchManager.
- **Delta:** port the F0-corrected hero, rail and door 1; re-mount, never rewrite, every moved
  component; every anchor and alias opens its door; a guard derived from F0's table fails if a
  shipped component or anchor disappears. Regenerate the port-control baseline from the merged tree.
- **Depends on:** F0 viewed; D3, E2 merged. **Gate:** owner ACTION — viewed F0.
- **Model/effort:** default · high. **Must not run with:** G2, G3, D3, E2.
- **Done means:** merged and served; the guard (mutation-checked) lists every shipped item.

### G2 · Six-door My Shop, part 2: doors 2 and 3 (website and services, specialist tools kept)
- **Delta:** port doors 2 and 3, keeping the Tools tab and every per-trade tool, Packages and the
  off-season nudge; services deep-link parameters keep working. **Depends on:** G1 merged.
- **Model/effort:** default · high. **Done means:** merged and served; G1's guard green with door-2/3 items.

### G3 · Six-door My Shop, part 3: doors 4–6 (inbox & assistant, money, tools)
- **Delta:** port doors 4–6; the inbox line reads the add-on ENTITLEMENT (`ai_addon_expires_at`), never
  the switch — a shop without the add-on is never told it is on. **Depends on:** G2 merged.
- **Model/effort:** default · medium. **Done means:** merged and served; guard green; nothing lost.

### L1 · Write today's rulings and corrections into the decision log (corpus only)
- **Delta:** pull the corpus first (other sessions committed at 17:48, 18:03 and 18:15). Append —
  never overwrite; stage by explicit path; never `git add -A`; never `git stash`. Rows:
  (a) **Service Card Boosting PARKED** — owner: *"if not then continue with original plan first"* —
  line 3824 still reads "BUILT NOW"; (b) **"songs they play is for a music performer. not for
  everybody."** (not logged anywhere); (c) correction: **#5375 merged into #5373's branch, not main**;
  (d) correction: the booking fee is ON (`NEXT_PUBLIC_BOOKING_FEE_ENABLED=true`) but NOT enforced
  (`NEXT_PUBLIC_BOOKING_FEE_RAIL_LIVE` unset) — line 3821 filed it as unconfirmed; (e) correction:
  contact details in a shop's own text are SETTLED by the 2026-07-23 and 2026-07-27 rulings — the
  "open" lists in the 2026-09-10 rows are wrong; (f) correction to row 3838: "Free … cannot be
  messaged" contradicts the 2026-07-24 owner lock *"your inbox is never locked"* (the chat tier gate
  was removed; code agrees) and the tier search gate has no callers — the 07-24 lock stands until the
  owner says otherwise; (g) LAUNCH_CHECKLIST_2026-09-06 items 2/4/5/12/13 are already ruled; (h) the
  verification checklist is the 2026-07-03 lock: profile 100% + the four required papers
  (DTI/SEC · BIR 2303 · Mayor's Permit · bank-account proof) + the post-submit 15-minute Google Meet.
  Update `CLAUDE.md`'s ACTIVE block to point at this register.
- **Model/effort:** default · low. **Done means:** rows committed by the orchestrator; `grep -n
  "PARKED" DECISION_LOG.md` finds boosting and `grep -n "music performer"` finds (b).

### T1 · The live two-sided test: a one-page script, and a watcher on production
- **A person gets:** the owner walks supplier and couple through card → publish → find → shop page →
  message → deal → accept → lock → change price, and after each tap is told in plain words what
  actually happened.
- **Already exists:** `TEST_SCRIPT_E2E_2026-07-27.md` (corpus, five test accounts) and
  `build-sessions/PROVE-THE-FLOW.md` on `origin/claude/handoff-hardening` (code repo, with a liveness
  test `lib/prove-the-flow-doc-is-alive.test.ts`, 289 behind). **Extend these; do not write a third.**
- **Production facts for the script (read-only, 2026-09-10):**
  - Supplier: **Saysay Live Band & Hosting (FIXTURE)** — owned by `testnayan2@test.com`, Solo until
    2027-07-30, services live_band + host_mc, 2 nameless cards, no photos. Solo holds 3 couples per
    date (`vendor-tier-caps.ts`), so the Free one-per-date limit does not apply.
  - The owner's own account is `account_type=admin`, `is_internal=TRUE` — it unlocks every paid
    feature, so a walk on it proves nothing about payment. It organises 3 events and its 2026-12-18
    wedding **already has an accepted thread with Saysay** — re-running there skips the accept step.
    **Do not use it as the couple.**
  - Couple candidates (non-internal): `testnayan4@test.com` (one wedding, **no date yet** — the owner
    sets a future date first) — **recommended for round 1** (exactly one event, so Inquire cannot
    mis-file); `testnayan3@test.com` (one simple event on 2026-09-19). ⚠ `testnayan1@test.com` is a
    poor couple: its only own event is dated 2026-08-01 (finished) and its other membership is a
    coordinator seat on the owner's wedding. Round 2 (fold 5) needs a couple with two ongoing events —
    have the owner add a second event to testnayan4 or 3.
  - A verified shop's first 5 sourced bookings pay no booking fee and the fee is not enforced — **no
    fee order will appear.** The supplier must accept the inquiry before a long chat.
- **Delta:** (1) rebase PROVE-THE-FLOW onto main and rewrite it for today's path in plain English (a
  small docs + liveness-test PR); (2) a one-screen owner script in the corpus extending
  TEST_SCRIPT_E2E with the prep list (rename the shop, titles, cover photos, GCash QR, gift at no,
  couple's event date) and one owner tap per defect fix (A2, A4, B1, B2); (3) the watcher: read-only
  production SELECTs after each step (thread, proposal, amendment, `event_vendors` lock state, change
  row), reported in plain words.
- **Depends on:** writing — nothing; running round 1 — A1, A2, A4, A5, B1, B2, #5404 served.
- **Gate:** owner ACTION — prep and the tapping. **Model/effort:** default · medium.
- **Done means:** round 1 run; every step has a production row matching what the screen said, or a
  named defect filed as a new session.

---

## 5 · Owner questions — genuinely open only

1. **[BLOCKING — your own data, before the test]** Get the test shop and test couple ready. My
   recommendation: rename the band shop (its public name ends in "(FIXTURE)") to a real name, give its
   two cards real titles and cover photos, add a GCash QR, leave the gift at "no". Play the couple as
   **testnayan4**, after giving its wedding a date — not your own account, which unlocks every paid
   feature.
2. **[CAN WAIT]** When a shop's checks aren't all done, should Approve **refuse** (vouching — a written
   reason and a 6-month deadline — as the only way around it) or keep **warning**? On 9 Sept you were
   offered "refuse with an override" and didn't take it; it warns today, and the desk ships warning.
   My recommendation: keep warning while you are the only reviewer; switch to refuse before the first
   outside shop is approved — your 9 Sept rule says verification happens only after the checks.
3. **[CAN WAIT — neither test shop has a website]** Should a shop's own website link and its
   Instagram/Facebook/TikTok links show on its public page before a couple books? My recommendation:
   their videos keep playing on the page, but the tappable website and social links appear only after
   the couple has locked that shop. Nothing deleted; no way out before booking.
4. **[CAN WAIT]** Your two shops were verified before the paper check existed. Keep the badge while
   their papers come in, and for how long? My recommendation: six months — the same deadline you set for
   a vouch.
5. **[CAN WAIT]** When a shop's Mayor's Permit expires, does it leave the marketplace or only lose the
   badge? My recommendation: a reminder 60 days ahead, then the badge comes off but the shop stays
   findable and bookable.
6. **[CAN WAIT]** A supplier has two lists of the same conversations (Messages, and Bookings/inquiries).
   Which stays? My recommendation: keep the conversation list and make bookings a filter inside it.
7. **[CAN WAIT]** The free day-of tools for booked shops during launch: switch off by hand later, or an
   end date now? My recommendation: a dated end — e.g. three months after public launch — shown to shops
   as "free until …".

**Owner ACTIONS, not questions:** view the corrected universal shop-page drawing when P1 says it is
ready (it settles fold 5 and the share card together) · look at "both numbers after a lock" (B2)
before it merges · view the corrected six-door drawing (F0) before G1 starts.

---

## 6 · Deliberately not in this plan

**Already decided — do not ask again:**
- The gift is optional, a yes/no, capped at 40%, up to the 50,000-credit rung (2026-09-09, five gates
  closed). Only the landing is planned (A1, C1).
- A post-lock price change shows both numbers — "Both, shown separately" (2026-09-09).
- Mounting the vouch control — decided inside #5394, applying the 2026-09-07 rulings (same badge, no
  cap, 182 days).
- **Which checks make a shop verified** — the 2026-07-03 lock: profile 100% + the four required papers
  incl. bank-account proof, with a 15-minute Google Meet as the post-submit final confirmation. The code
  carries it (`REQUIRED_DOC_SLOT_KEYS`, `verify-section.tsx`). The 9 Sept sentence is a necessary
  condition, not a replacement list. The only consequence for the shop page: the receipt prints the Meet
  line only when a Meet was recorded (P1).
- Nameless cards auto-name "<kind> by <shop>" (owner-locked).
- Fold 5's content (2026-09-10) and the event list it shows ("the ongoing and upcoming only", 2026-08-21).
- No talking outside the app, including contact details a shop types into its own text (2026-07-23 chat;
  2026-07-27 card text; both filters ON). E2 applies it.
- Different looks per plan: About Solo+, two-column desktop Pro+ (2026-07-03 ladder; row 3838; the
  owner's "different looks for free, solo, pro and enterprise").
- A Free/any page never shows a stock photo, a zero or an empty chart (row 3838, 2026-09-10) —
  superseding the 2026-06-04 stock-photo directive; built in D2/F1/F2, mentioned in one line at the
  viewing, not asked.
- "Songs they play" is for music performers only (2026-09-10) — built in D2.
- Reviews never depend on plan (2026-08-09) · plain-word category names (2026-08-12) · post-lock changes
  stay a single Deal card (reopening offered 2026-09-09, not taken) · the handshake flag is ON · per-plan
  limits are ON (2026-08-29) · LAUNCH_CHECKLIST_2026-09-06 items 2/4/5/12/13 are ruled.
- Which test shop — he already drove Saysay as supplier on 2026-09-08; only the rename/titles/photos
  remain (question 1).

**Left out on purpose:**
- **Service Card Boosting** — parked by the owner. L1 records the park.
- **Booking-fee enforcement and the "no paid booking fee, no connect" reading** — scheduled for the
  booking-fee test round after these builds. The fee is ON but not enforced, so no lock is blocked.
- **A verified shop with a profile gap submitting papers** — SetnaProd is at 100%; a routine reversible
  call later.
- **"Schedule with the service card or this"** — watch whether he looks for per-booking scheduling during
  the test; do not ask.
- **The paper reader and registry lookup** behind "matched by Setnayan" — its own project. Until it
  exists, drawings say "with a person at Setnayan".
- **Checking the bank account's name matches the registered business**; **"on the marketplace since
  <date>"**; a full permit-renewal clock — new data, after questions 4–5.
- **Unused signed-out write grants on `vendor_services`** — inert (no policy admits anon); optional hygiene.
- **Hiding the FIXTURE shop from Google**; **removing the retired Pabati from SetnaProd's services** — the
  owner's own shop and call.
- **Stranded commit `1ca4989f8c`** (Papic credit estimate defers to owner config) on
  `claude/plan-name-overwrites` — off this path; listed so it is not lost.
- **The weak-signal venue, encoder go-live, non-wedding stories, Live Studio page copy** — other streams.
- **#5402, #5404, #5377, #5403** — no session; they merge themselves.
- **`claude/encoder-actually-runs`** (docs-only) — superseded by #5400.
- **`VERCEL_SUPPORT_LARGE_FUNCTIONS`** — only if B3's slimming fails.

---

## 7 · Traps this project has paid for — every session honours all of them

**Where to read and build**
- **Canonical code checkout:** `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform`.
  **Spec corpus:** `/Users/icecasasola/Documents/Claude/Projects/Setnayan`.
- ⛔ **Never read code from `/Users/icecasasola` itself** — a stale checkout ~750 commits behind sits
  there and yields coherent, traced, completely wrong findings with real line numbers.
- **Build in a worktree BESIDE the repo, never in `/tmp`:**
  `git -C /Users/icecasasola/Documents/Claude/Projects/setnayan-platform worktree add /Users/icecasasola/Documents/Claude/Projects/wt-<session> -b claude/<slug> origin/main`.
  A proved change was once lost with a `/tmp` worktree and zero commits. **Commit before the first
  mutation; push early.**
- **`pnpm install` in the worktree FIRST** — a test run in an uninstalled worktree means nothing.
- **Prune each worktree once its PR merges** (`git worktree remove <path> --force`; `git worktree
  prune`); clear `.next` from any you keep. Each is 1–2 GB; a full disk makes every Bash call fail.
- ⛔ **Never `git stash`** — a global stack shared by several sessions. **Never `git add -A`** — stage by
  path. **Never `git reset --soft origin/main`.** Before every push:
  `git diff --diff-filter=D origin/main..HEAD` must show no deletions you did not intend.
- **Another session works this repo concurrently.** `git fetch` and read the new tip before building;
  before any force-push the remote tip must equal your own `ORIG_HEAD`; verify a push landed.

**Evidence**
- **RULE 0 — find it before you build it.** Before any code: grep the feature noun in `apps/web/app` and
  `apps/web/lib`, open the design whose NAME matches the task, grep `DECISION_LOG.md`. State what exists,
  what is missing, the delta. Extend, never re-draw.
- **A doc is not evidence** — this register included. A PR's state is what `gh pr view` says.
- **A merge is not a ship.** Check `/api/health`'s version and test ancestry with
  `git merge-base --is-ancestor <merge-sha> <served-sha>`. Never check by "the version changed".
- **A search that cannot match is not a negative result.** `[slug]` is a glob class in a git pathspec —
  use `git --literal-pathspecs grep`. In zsh, `$VAR:a…` is a path modifier — write `${VAR}:path`.
- **An empty column is not a missing mechanism** — production is pre-launch and nearly empty; grep for
  the WRITER before calling something unbuilt.
- **A decision can look like a defect** — grep `DECISION_LOG.md` for the noun first. Never ask the owner
  what the log answers.
- **A migration comment is not evidence; read the object** (`pg_get_functiondef`,
  `information_schema`) in production, read-only.

**Tests and guards**
- **Require a non-zero `# tests` count.** `npx tsx --test "app/[slug]/…"` runs **0 tests and exits
  green**, and the `[[]slug[]]` "escape" fails identically. Run `npx tsx <path>` (no `--test`) or a
  `**/<name>.test.ts` glob, and read the count.
- **Every mutation prints its occurrence count before → after.** A sabotage that did not land reports a
  pass; a file-level count cannot say which component still renders a thing; an appending sabotage is not
  measured by its own needle count. **Commit before mutating; restore from an explicit backup, never from
  the index.** Strip comments before matching.
- **Typecheck prints `TSC_EXIT`.** Exit 134/144 with an empty log is an OOM or two concurrent typechecks,
  not a clean pass. Use the repo's own heap setting.
- **`server-only` is not installed for node:test** — a module importing it cannot be imported by a unit
  test; split the pure rule into its own file.
- **`test:unit` globs `lib/**` and `app/**` only** — put guards where the glob sees them.
- **`relrowsecurity` is vacuous in the PGlite replay**, and `auth.role()` is never NULL there; the replay
  runs as superuser. A db test can pass while production refuses — rehearse risky migrations in
  `BEGIN … ROLLBACK` against production (the permission prompt is the approval).
- **Generated files** (`exposure-surface.baseline.txt`, `port-control-baseline.json`, admin-map
  inventories, `user-fk-behaviour.generated.txt`): on conflict **regenerate from the merged tree, never
  pick a side**. A *clean* auto-merge of one has produced a header that disagreed with its body. Read the
  baseline diff before accepting it — regenerating can record a mistake as intended.
- **Never re-run CI by hand** (`workflow_dispatch` makes the secret scan sweep the whole tree); closing and
  reopening a PR disarms auto-merge.

**Database and security**
- **Rejected, not thrown.** A Supabase select naming a phantom column, a phantom enum value or an unknown
  RPC argument returns `{ error }` — it does not throw, so a `try/catch` catches nothing and the screen
  goes silently empty. Check `error` on every read.
- **Service-role reads are outside every RLS rule** — the app-side gate is then the whole fence.
  Authorization may use the service role scoped by a session-proved id; event content never does.
- **RLS is a floor, not a scope** — a policy with `OR is_admin()` does not scope the narrower caller.
- **The row is yours, the field is not** — a `FOR ALL` own-row policy admits INSERT and DELETE and says
  nothing about which columns a user may set. A column revoke is inert against a table-level grant;
  `has_table_privilege` answers false while column grants stand. Read the column default before revoking.
- **Migrations:** allocate with `pnpm migration:new`. A low prefix **still applies** in production
  (`supabase db push --include-all`) — the belief that it "creates nothing" is false. Production deploys
  run through a **migrate-then-deploy** hook, but still verify the object after.
- ⛔ **Production is read-only for sessions** except an approved rolled-back rehearsal. Never flip a
  production flag; never `db push` by hand.

**Money and product rules**
- **Never re-type a price** — read `platform_retail_catalog_v2` / `vendor_billing_catalog`. The booking
  fee is not commission — never call it that.
- **Money, security-grant and owner-gated PRs open as DRAFT.** A workflow arms auto-merge on every
  non-draft PR ~12 s after opening; disarming is a pause, drafting is the hold.
- **Colours:** the Tailwind slot named `terracotta` is the GOLD (3.37:1 on cream — fails as text); the
  action colour lives in `mulberry`. `mulberry-700` fails in dark (3.05:1) — use `mulberry-600`.
- **A fix nobody can reach is no fix** — check the control is mounted and reachable on every arm
  (signed out included).
- **Do not delete features** — the owner: *"make sure that we are adding value and not deleting
  feature"*; *"design it properly. not creating a new shell but improving what we have"*.

**Paperwork**
- After any non-trivial code change: add `changelog.d/<branch-slug>.md` with a dated
  `## YYYY-MM-DD · type(scope): summary` block and a `SPEC IMPACT:` line (even "None"). Never edit
  `CHANGELOG.md` or `STATUS.md` in a feature PR.
- If SPEC IMPACT is not "None": edit the corpus directly (standing authorisation), append a row at the
  bottom of `DECISION_LOG.md` (append-only; on conflict keep both sides in date order).
- After `gh pr create`: `gh pr merge <n> --auto --merge` — except DRAFTs for gated work.
- End commit messages with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`; end PR bodies with
  `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- **Talk to the owner in plain English about what a person experiences** — no file paths, function,
  table or flag names in anything written for him. Decide and act on reversible pre-launch work; bring
  him only prices, scope, risk trade-offs or reversing one of his rulings.

---

## 8 · What the critics changed

- **A new session A2 was already in; two more critical-path gaps were added:** A4 (accepting a quote
  dead-ends — verified on main: the accepted state is "Accepted on <date>" and a Back link) and A5 (the
  stranded "locked shop leads its group" commit, verified off main with `git cherry`).
- **The universal drawing is finished, not "only styles"** (corpus `6d20835`) — so the plan now corrects
  it first (**P1**: wrong Enterprise price, two promises of checks that are not built) and D1/F1 wait on
  the owner's viewing, not on the drawing being written.
- **Fold 5 reuses the shipped add-to-event picker** instead of a new one.
- **Owner question "which checks" was removed** — answered 2026-07-03 (four papers incl. bank proof, plus
  the post-submit Meet); the draft's "drop the call" recommendation would have reversed a lock.
- **C3 no longer waits on the owner** — warning is the standing ruling; the refuse/warn question stays
  open (the log calls it "the one open decision") but is reframed with his 9 Sept decline.
- **D2's music rule was wrong** — reusing the specialist-tools list would have hidden the test band's
  songs; one union rule now covers all four places, and it fixes the band's missing song bank.
- **The "Host / MC" admin action was removed** — the label already exists in code (pure map, so C2 needs
  no page changes, which also dissolves the C2/D2 collision).
- **#5377 lands itself** — the baseline chain is now #5377 → A1 → B2 → #5140; D4 shrank to #5140 + #5012.
- **"Started 2026" was dropped** in favour of "never a zero" (row 3838) and the drawing's later year line.
- **Stock photo and empty review stars came off the viewing agenda** — row 3838 rules them.
- **Test accounts are named from production:** not the owner's internal account; testnayan4 for round 1.
- **doneMeans that needed a signed-in tap** now name a test plus an owner tap in T1; C1's pot-growth check
  moves to the booking-fee round; A1's check reads the database instead of a page that never shows the gift.
- **Collisions added:** port-control baseline, `chat-lock-booking.server.ts` (B2/C1),
  `vendor-itemization-card.tsx` (#5404/B2), admin-map inventories (C3/E3, not `lib/r2.ts`),
  `app/vendor-dashboard/actions.ts` (E2).

**Where a critic was wrong, and the plan kept its own line:**
- Critic 1 named `testnayan1@test.com` as the couple "with 2 events". Measured: its only own event is dated
  2026-08-01 (finished) and the other is a coordinator seat on the owner's wedding. The plan uses
  testnayan4 instead.
- Critic 2 said C2 must edit the shop page file to pass taxonomy names in. It does not — the proper label
  is a pure in-code map, so the change stays inside the label function.
- Critic 2 said this register's filename "does not exist" (row 3838 points at it). It exists now.

**New since the critics:** the no-door-out fix became **PR #5404** (auto-merge armed, five exits), which
turned A3 into a watch item and surfaced **E4** — the database still hands a shop's email to the public
key and its phone to any signed-in account.
