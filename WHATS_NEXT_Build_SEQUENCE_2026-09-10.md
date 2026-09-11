# THE BUILD SEQUENCE — what goes first, and the prompt, model and effort for every session (2026-09-10, 23:30 Manila)

> Companion to **`WHATS_NEXT_Build_Plan_2026-09-10.md`** (the register: why each session exists,
> what ships, the chains) and **`WHATS_NEXT_Build_Plan_PROMPTS_2026-09-10.md`** (the full prompt for
> every session). This file is **the order**. Where the three disagree, re-measure — never trust a row.
> ⚠ A plan goes stale in hours: three sessions in wave 1 found their work already done by another
> session. Every prompt tells the session to re-verify first and stop if it is done.

---

## ⭐ RE-PLANNED 2026-09-11 ~00:15 Manila — 22 remaining sessions → 8 bundles (owner: "make it less … only focus on the adjustments")

Every remaining row was re-measured against `origin/main` `0d3a1e0` (= production) before bundling.

**Dropped — already built, nothing to change:**
- **H3** (drag your suppliers into your own order) — **LIVE since 2026-09-09** (`ad2787fda5`: table
  `event_bench_arrangement` + its RLS, long-press drag, "Your order", per-category Reset, no flag). The
  register's "unclaimed, no branch" line was wrong. H5 no longer waits on it.

**Folded into a session that already owns the same files or the same principle:**
- **E4** (close the database door to shop email/phone) → **N1, part 2** — same "no talking outside the
  app" principle, same grants/RLS pattern, same Opus session; a second DRAFT PR.
- **N2 item 2** (the budget card's "Ask them for pricing" link) → **B2** — it is in
  `vendor-itemization-card.tsx`, which B2 already owns (running them apart would collide).
- **D4** no longer waits on B2 — it only shared the exposure baseline, and the standing rule already
  covers that (whoever merges second regenerates from the merged tree).

| # | Bundle (runs its sections IN ORDER, one PR each unless noted) | What a person gets | Model · effort | Waits on |
|---|---|---|---|---|
| **1** | **LAND** = B1 → C3 → E3 → D4 — four pieces of work that are **already built**; only fix, rebase, rehearse, merge | every card has a name · the verification desk · the government-ID delete guard (DRAFT) · every film of your day | Opus · high | nothing |
| **2** | **B2** (+ N2 item 2) | after a lock a price change shows both numbers · "Ask them for pricing" opens the conversation | Opus · high | **your look** before merge |
| **3** | **HONEST SHOP** = C2 → D2 → E1 | marketplace cards show their photo and "Host / MC" · songs only for musicians, no "0 yrs", a lapsed plan loses its paid look · a shop's link preview never breaks | Sonnet · medium | nothing |
| **4** | **CLEANUPS** = D3 → E2 → N2 item 1 (+ H5 if your question 10 is answered by then) | "Get verified" lands on the one papers screen · no phone/email typed into a shop's own About · no coordinator email on the couple's Hosts page | Sonnet · medium | nothing |
| — | **TEST ROUND 1** | your first live two-sided test — ✅ UNBLOCKED 2026-09-11 (B1 + B2 live) | — | **your prep** only |
| **5** | **GIFT & CARD GATE** = C1 → H2 | the gift reaches the couple as free photos · a card also needs a cover photo and what's included | Opus · xhigh (C1 money) · high (H2) | B2 merged |
| **6** | **NEW SHOP PAGE** = D1 → F1 → F2 | "Want to add them to your event?" · then the new shop page, top then body | Opus · high | **your look** at the shop-page drawing (D1) and at P2 (F1); bundle 3 merged |
| — | **TEST ROUND 2** | a couple with two events | — | D1 live |
| **7** | **SIX-DOOR MY SHOP** = G1 → G2 → G3 | My Shop in six doors, nothing lost | Opus · high | **your look** at F0; bundle 4 merged |
| **8** | **H4** | a supplier can say a payment never arrived — ✅ Q9 RULED 2026-09-11: one path for every payment | Opus · xhigh (DRAFT) | B2 merged |
| **9** | **H5** | "Lock this" hidden (with the reason) for a supplier who said "not free on your date"; an unavailable supplier is not shown as planned — ✅ Q10 RULED 2026-09-11 | Opus · high | a free slot (H3 is live; reuse the shipped availability data) |
| **N4** | **N4** = chat_threads fields + E4 (see overrides) | a couple can't move a conversation, accept their own inquiry or stamp a lock; a shop's email/phone can't be pulled from the database | Opus · high (DRAFT) | a free slot; B2's files untouched |
| **L2+L4** | **SMALL RULINGS** (Sonnet · medium): L2 = no website/social link on a shop's public page (owner Q3 "never show links"; keep saved values, keep embedded videos) + switch the shop page's own Verified badge (`app/v/[slug]/page.tsx` ~2105) and the ~12 other badge spots listed in #5433's PR body to `hasVerifiedBadge` (lib/verified-badge.ts) so the badge follows its deadline everywhere; also `lib/vendors.ts` `fetchEventVendors` could fold the change lines (B2-FINISH note; callers already fold) → then L4 = the free day-of tools get a dated end in ONE config value and shops see "free until …" (owner Q7) | a couple can't tap out of a shop page; shops know when free tools end | Sonnet · medium | L2 after HONEST SHOP's E1 merges (same file) |
| **L3** ✅ released #5433 | **BADGE DEADLINES** (Opus · high): the two early shops keep Verified for 6 months while papers come in (Q4); a permit reminder 60 days ahead, badge off at expiry, shop stays bookable (Q5). RULE 0: reuse `next_renewal_due_at` and the vouch's 182-day deadline machinery; never unpublish a shop | badges tell the truth over time | Opus · high | a free slot |

**Running now (not bundles):** N0-finish · N1 (then E4) · N3 — code, Opus · P2 · F0 — drawings, Fable.
**Slot order as each security session finishes:** LAND → B2 → HONEST SHOP → CLEANUPS; then 5, 6, 7, 8
as their gates open. Still at most three code sessions at once. Bundles 1 + 2 + 3 share no file
(checked); bundle 4 shares none with 1–3 (the port-control baseline is regenerated by whoever merges second).

**Bundle launcher** (the one prompt below, with this change to step 2):
`2. Then read and execute, IN THIS ORDER, the sections headed "## B1 —", "## C3 —", "## E3 —", "## D4 —"
(or the bundle's list), one PR each, finishing each PR's CI before starting the next section. Apply the
bundle overrides in WHATS_NEXT_Build_SEQUENCE_2026-09-10.md.`

**Bundle overrides (outrank the PROMPTS sections where they differ):**
- LAND · D4: start as soon as E3 is up — do NOT wait for B2.
- B2: also do N2 item 2 (point the budget card's "Ask them for pricing" at the existing thread opener).
  Read the never-committed migration `an_adjustment_never_erases_the_price` in
  `/Users/icecasasola/Documents/Claude/Projects/setnayan-rescue-2026-09-10/` (and worktree
  `/private/tmp/wt-s1d`) first — reuse, do not re-invent.
- GIFT & CARD GATE · H2: also give `host_mc` a proper database label so a blank host card auto-names "Host / MC by …", not "Host Mc by …" (B1's trigger reads the database label; C2 fixes only the app's label). Data/migration, same service-card area.
- CLEANUPS: N2 item 1 only (the Hosts page coordinator email + the package-lock copy); item 2 is B2's.
  ALSO (from #5414's release): the two app-side verification-upload gates (`app/vendor-dashboard/verify/actions.ts`,
  `app/vendor-dashboard/shop/inline-docs-actions.ts`) still pass an `R2://` / padded value that the database now refuses
  with a raw RLS error — normalise it the way the #5414 policy does, and show a plain refusal. Do it inside D3 (same chain).
- ~~N1 part 2 = E4~~ → replaced 2026-09-11 by **N4** below (the N1 session ended before part 2; E4 rides with N4).
- **N4 (NEW, Opus · high, DRAFT) = "a couple cannot rewrite their own conversation" + E4.** Found by N1 (measured in the
  replay as a real `authenticated` couple, 1 row each): a couple can UPDATE their own `chat_threads` row's
  `vendor_profile_id` (move the thread into any supplier's inbox), `inquiry_status`/`accepted_at` (accept their own
  inquiry) and `locked_at`/`agreed_price_centavos` (stamp a lock at a price). Delta: find every LEGITIMATE user-session
  writer of those columns first; move each to the server (service role scoped by a session-proved id, or a SECURITY
  DEFINER function) and revoke the columns / add a guard trigger. ⚠ If a legitimate writer lives in a file B2 owns
  (`chat-lock-booking.server.ts`, `chat-amendment-card.tsx`, `negotiation-actions.ts`), wait for B2 to merge — never
  edit B2's files in parallel. Then the E4 section (shop contact_email/phone columns), its own DRAFT PR.
  Takes the next free slot after B2 is up for the owner's look; runs beside HONEST SHOP / CLEANUPS (no shared file).
  PART 3 (found by N3, #5415): the generic signer `displayUrlForStoredAsset` signs a file in ANY bucket for any caller,
  and three browser-writable columns reach it — `event_editorial.draft_json`, `guests.photo_url`,
  `vendor_profiles.logo_url`. Make the generic signer public-bucket-only (private reads keep their own dedicated,
  scoped signers); list every caller first and prove none legitimately signs a private bucket through it.
  PART 4 (owner ruling 2026-09-11): only the couple (and admins) may start a mood-board render on the couple's credits
  or give share consent — narrow `moodboard_render_caller_may_act` and the consent path; keep every other member's
  read access as it is.

---

## (superseded 2026-09-11 — kept for the record) For the owner — one screen

**Already live today:** the gift is optional (a supplier can publish without it) · "Lock this deal"
can no longer lie about a booking · a locked shop leads its group · no email or phone for couples to
tap · a meeting can be moved from Decisions · the critical Next.js security update · coordinator
access you can take back.

**Moving by itself now:** the next step after accepting a quote (#5412) · the test watcher (#5413).

**What goes first — in this order:** ⚠ SUPERSEDED by the bundle table at the top of this file — do not launch from this table or the "safe trios" below; launch bundles.

| # | Session | What a person gets | Model · effort | Waits on |
|---|---|---|---|---|
| **1** | **N0** | Our cleanup jobs can never delete someone else's file | Opus · high | its build finishing (running now) |
| **2** | **N1** | The chat can't be used to swap numbers, open WhatsApp, or post into someone else's conversation | Opus · high | nothing (owner confirmed the filter is ON) |
| **2b** | **N3** | A mood-board render can't be used to read a stranger's payment receipt | Opus · high | nothing |
| **3** | **B1** | No service card goes live without a name | Opus · high | nothing |
| **4** | **B2** | After a lock, a price change shows both numbers | Opus · high | **your look** before merge |
| **5** | **C3** | The admin verification desk | Sonnet · medium | nothing |
| — | **TEST ROUND 1** | Your first live two-sided test | — | 3 + 4 live, **your prep** |
| **6** | **C1** | The Setnayan gift actually reaches the couple | Opus · high | B2 |
| **7** | **C2** | Marketplace cards show their photo and a proper name | Sonnet · medium | nothing |
| **8** | **D2** | The shop page tells the truth (songs only for musicians) | Sonnet · medium | nothing |
| **9** | **F0** | Correct the six-door My Shop drawing | Fable · medium | nothing |
| **10** | **H2** | A card also needs a cover photo and what's included | Opus · high | C1 |
| ~~**11**~~ | ~~**H3**~~ | ~~Drag your suppliers into your own order~~ — **ALREADY LIVE (#5367), DO NOT LAUNCH** | — | — |
| **12** | **D1** | Fold 5: "Want to add them to your event?" | Opus · medium | **your look** at the shop-page drawing |
| **13** | **D3** | The old verify page leads to the new papers section | Sonnet · medium | nothing |
| **14** | **D4** | Every film of your day (#5140) | Sonnet · medium | B2 |
| — | **TEST ROUND 2** | Test with a couple who has two events | — | D1 live |
| **15** | **E1** | A shop's link preview never breaks | Sonnet · medium | D2 |
| **16** | **E2** | No phone or email in a shop's own About | Sonnet · medium | nothing |
| **17** | **E3** | Verify the government-ID delete guard | Opus · high | C3 |
| **18** | **E4** | Close the database door to shop email and phone | Opus · high | nothing |
| **19** | **N2** | The last two email leaks on couple screens | Sonnet · medium | nothing |
| **19b** | **P2** | Draw the minimal Free look, so a shop wants Solo | Fable · medium | nothing — can run any time |
| **20** | **F1 → F2** | The new shop page, top then body | Opus · high | E1, your look at the drawing **and at P2** |
| **21** | **G1 → G2 → G3** | Six-door My Shop, in three parts | Opus · high (G3 Sonnet · medium) | your look at F0 |
| **22** | **H4** | A supplier can say a payment never arrived | Opus · xhigh | **your question 9**, B2 |
| **23** | **H5** | "Lock this" stops showing for a supplier who declined | Sonnet · medium | **your question 10** |

**What only you can do, in the order it unblocks things:**
1. ~~Chat contact filter~~ — ✅ confirmed ON in Vercel, 2026-09-10.
2. **Look at "both numbers after a lock"** when B2 is ready (unblocks 4, then the test).
3. **Prep the test:** ⚠ ORDER MATTERS (B1 is live) · ⚠ NEW (H2 live): a card can only GO LIVE with a cover photo AND at least one "what's included" line — the two cards already live stay live and still save, but add both anyway so couples see them: rename the shop and type the two card titles BEFORE saving any card with a blank title — a blank card saved first is auto-named "… by Saysay … (FIXTURE)" and a later rename does not change it. Rename the "(FIXTURE)" band shop, real titles + cover photos on its two cards,
   a GCash QR, leave the gift at "no", play the couple on **testnayan4** (give its event a date).
4. ✅ **Stock photo RULED 2026-09-11: the clean card design, no stock photo** (F1 builds it). **Look at the corrected shop-page drawing** (unblocks 12 and 20) —
   while you are there: keep it (your 4 June order) or replace it?
5. **Look at the corrected six-door drawing** once F0 finishes (unblocks 21).
5b. **Look at the Free-vs-Solo drawing** once P2 finishes — approve or strike each line (unblocks 20).
6. ✅ Questions 9 and 10 RULED 2026-09-11 (H4, H5 unblocked).
8. ✅ Register Q2–Q8 RULED 2026-09-11 (DECISION_LOG): Approve warns now, refuses before the first outside shop · never show shop website/social links · early badges 6 months · permit: remind 60 days, badge off · keep both message lists · free day-of tools get a dated end · keep the "where you stand" wording.
9. **(can wait)** PR-G2's other half, "Beyond reach" — once a venue is locked, suppliers too far from it. Outside the Q10 ruling (that was about schedule); noted by S2 in the Explore Replan spec and the register's H5 card. Not a session yet.
7. ✅ Mood-board credits RULED 2026-09-11: only the couple (and admins) — N4 part 4.

---

## How to launch any session — the one prompt

Every session's full instructions are committed in the PROMPTS file, so the prompt to paste is the
same shape for all of them — change only the ID:

```
You are a build session for the Setnayan platform.

1. Open /Users/icecasasola/Documents/Claude/Projects/Setnayan/WHATS_NEXT_Build_Plan_PROMPTS_2026-09-10.md.
   Read the "## SHARED HEADER" section in full and obey every rule in it.
2. Then read and execute ONLY the section headed "## <ID> —" in the same file. Nothing more.
3. Read the register WHATS_NEXT_Build_Plan_2026-09-10.md for context, including the CORRECTION block
   at its very top (the stock photo is an OPEN owner question — no session removes it).
4. Before building, re-verify your section's "what exists" against origin/main and the live site.
   Other sessions merge constantly. If it is already done, prove it (served by ancestry) and stop.
5. Build BESIDE the repo (a worktree under /Users/icecasasola/Documents/Claude/Projects/), never in
   /tmp, and commit early. Never git stash. Never git add -A. Never read code from /Users/icecasasola
   itself. Money, security-grant or owner-gated work opens as a DRAFT PR.
6. Done means production's /api/health contains your merge commit by ancestry — not "PR opened".
   When done, mark your row in WHATS_NEXT_Build_SEQUENCE_2026-09-10.md.
```

Set the model and effort from the table above. **If a prompt section carries its own `MODEL:` line, it agrees with this table** — checked 2026-09-10 (H2 re-signs the SECURITY DEFINER save function where two silent defects were found; H3 is the hardest UI piece left, with a new RLS table). **Opus** for anything touching money, the lock,
database grants, migrations or deletion; **Sonnet** for screens, copy, wiring and landing finished
work; **Fable** only for drawings.

---

## Run order and parallel rules

**At most three code sessions at once. Never two on the same file.** These chains are strict:

- **Public shop page** (`app/v/[slug]/page.tsx`): D2 → D1 → E1 → F1 → F2 (D1 may go before D2 only
  if your drawing look comes first).
- **Chat lock card / booking:** B2 → C1.
- **Service-card files:** B1 → C1 → H2.
- **The couple's supplier list (bench):** H5 only (H3 is already live).
- **Admin verification area:** C3 → E3.
- **My Shop page file:** D3 → E2 → G1 → G2 → G3.
- **Security baseline** (a generated file): whoever merges second regenerates it — N0, N1, B2, D4, C1,
  E4 all touch it. Regenerate from the merged tree, never pick a side, then check header = body.

**Safe trios to run together** (no shared files): ⚠ SUPERSEDED 2026-09-11 by the bundles at the top — kept for the record; the chains above still hold.
- Round A: **N0 · B1 · C3**
- Round A2: **N3** alongside Round A if a slot frees (touches mood-board files only)
- Round B: **N1 · B2 · C2**
- Round C: **C1 · D2** (+ F0, a drawing, alongside anything) — H3 already live
- Round D: **H2 · D3 · E4**
- Round E: **D1 · N2 · E3**
- Round F: **E1 · E2 · D4**
- Round G: **F1 → F2** alongside **G1 → G2 → G3**
- Gated, whenever answered: **H4**, **H5**

---

## Status — update this table, never trust it

| Session | State | Proof |
|---|---|---|
| A1 gift optional | ✅ SERVED | #5373 · a2cc050 in prod |
| A2 lock needs a price | ✅ SERVED | #5408 · f302cd5 ancestor of prod 0d3a1e0 (15:42Z) |
| A3 no door out | ✅ SERVED | #5404 |
| A4 next step after accepting | ✅ SERVED | #5412 · ae08688 ancestor of prod a3996d5 |
| A5 locked shop leads | ✅ SERVED | #5406 |
| B3 deploy headroom + security | ✅ SERVED | #5407, #5397 |
| H1 meeting from Decisions | ✅ SERVED | #5411 · 55e2d4d |
| L1 · P1 · T1-script | ✅ done | corpus; P1 drawing re-checked: stock photo drawn as the owner's open question |
| T1 watcher | ✅ SERVED | #5413 · e4e55e0 ancestor of prod ba93a8f — also fixed two phantom vendor_services columns (b39d82c) |
| N0 cleanup-delete pin | ✅ SERVED | #5414 · ba93a8f in prod; read-only prod: 5 RESTRICTIVE policies live, authenticated UPDATE on papic key columns gone, migration 20271219262486 recorded |
| N1 chat door | ✅ SERVED | #5417 · prod bcd621f; orchestrator prod rehearsal passed; live: guard trigger on, attachment_url INSERT revoked, rules fn not exposed |
| N3 render keys | ✅ SERVED | #5415 · prod bcd621f; live: events site-media CHECK validated, render CHECKs present |
| P2 Free-vs-Solo drawing | ✅ DRAWN — waits on the owner's look | `4facf58` · prototypes/shop_page_free_vs_solo_2026-09-10.html · 2 proposals (plain strip on Free; shop-only Solo preview), stock photo drawn both ways |
| F0 six-door drawing | ✅ CORRECTED — waits on the owner's look | prototypes/shop_page_2026-09-10.html · 91-row "every shipped control → its door" table (`data-shipped`) for G1's guard; moodboard-library and permit-renewal claims corrected |
| H3 drag your own order | ✅ ALREADY LIVE — dropped | `ad2787fda5` (2026-09-09) on main = prod `0d3a1e0`; table `event_bench_arrangement`, long-press, "Your order" |
| LAND · B1 card names | ✅ SERVED | #5387 · a3996d5; trigger `trg_before_enforce_fill_service_card_title` live (orchestrator read prod) |
| LAND · C3 verification desk | ✅ SERVED | #5394 · c902d5f; Approve still WARNS |
| LAND · E3 ID-delete guard | ✅ SERVED | #5420 · reviewed by orchestrator (behaviour-preserving; 100/100; 9 sabotages RED) |
| LAND · D4 every film | ✅ SERVED | #5140 · 8947934; `event_films` live, RLS on, anon no SELECT (orchestrator read prod); #5012 CLOSED |
| HONEST · C2 marketplace photo + names | ✅ SERVED | #5421 · 5df29f4 |
| CLEANUPS · D3 old verify page → papers | ✅ SERVED | #5424 · 171e65e |
| CLEANUPS · E2 contact filter on About/tagline | ✅ SERVED | #5426 · baa88bf |
| CLEANUPS · N2-1 Hosts page coordinator email | ✅ SERVED | #5427 · d1d5a29 (a Setnayan coordinator gets "Message them"; the DB copy is kept — coordinator-broadcasts reads it) |
| B2 both numbers after a lock (+ total now everywhere, fee follows every change) | ✅ SERVED | #5390 · e2a07f6; live: is_change_delta column, 7 functions carry change lines, recorder not exposed, 2 triggers, both migrations recorded (orchestrator read prod) |
| H6 bench search hides full cards | ✅ SERVED (S2) — fcc2bc3; live: definer, service_role only (orchestrator read prod) | #5434 · server-only definer function (service_role), baseline unchanged; per-card daily limit joins via LOCK-PATH CAPACITY |
| H4 payment never arrived | ✅ SERVED (S2) | #5443 · 21ffe0a; orchestrator prod rehearsal + live check (migration recorded, anon cannot refuse) |
| FOLLOW-UP · data export gap | ⬜ small, unowned | Found by S2 (H4): the couple's payment ledger (event_vendor_payments) is event-tier and NOT included in the personal data export (RA 10173 right of access) — predates H4. Check what the export's roster says and add it, or record why not. |
| FOLLOW-UP · a re-sent deposit erases its refusal | ⬜ small, unowned | Found by S2 (H4): `guard_event_vendor_deposit_ack` lets a session clear deposit_declined_* / deposit_dispute_*, and `recordDeposit` (vendors/actions.ts ~4491) does so when a couple re-records — so a refused deposit leaves the admin queue with no trace. Existing, deliberate re-send design; the fix is to keep the earlier refusal as history (audit row) while still allowing the re-send. Installments can't do this (a re-send is a new row). |
| L3 badge deadlines | ✅ MERGED | #5433 · guard fn +2 lines vs live (orchestrator line-hash diff) |
| N4 part 1 conversation record | ✅ SERVED (ce858a1; guard trigger live, INVOKER as designed) | #5435 · orchestrator prod rehearsal passed |
| N4 part 3 generic signer public-only | ✅ SERVED (ce858a1) | #5432 |
| N4 part 4 render credits couple-only | ✅ SERVED (ce858a1; view fn live) | #5431 |
| N4 part 2 (E4) shop contact closed at the DB | ✅ SERVED | #5429 · 368859b; live: anon/authenticated cannot SELECT contact_email/contact_phone (orchestrator read prod) |
| N5-A deposit receipts private | ✅ SERVED | #5437 · 6848bfe |
| N5-B receipt reader pinned | ✅ MERGED | #5438 |
| N5-C supplier can't open a thread on any event | ✅ MERGED | #5439 · prod rehearsal by the session |
| N5-D grants hygiene (TRUNCATE, next_renewal_due_at) | ✅ MERGED | #5440 |
| N5-E LOCK-PATH CAPACITY | ✅ MERGED | #5441 · the per-card daily limit really refuses; bench search mirrors it; tripwire removed |
| LOCK-PATH 2 | ✅ MERGED | #5444 · 9b65f47 |
| H2 card needs cover + what's included (+ host_mc label) | ✅ MERGED | #5442 · 27373ab; prod line-diff: save_vendor_service + fill_blank_service_card_title keep every live line; publish gate keeps the price rule |
| C1 the Setnayan gift reaches the couple | ⏳ auto-merge | #5436 · bill = fee + gift, capped; photo counts match EX-2; B2's fee base untouched; gift columns SELECT-only for sessions |
| FOLLOW-UP · gift snapshot at lock | ⬜ small | C1's two bounded gaps: a supplier could switch the gift off between the couple's lock and accepting payment; the booking's card sits on a couple-editable row — both close with a lock-time snapshot of the card + gift answer |
| FOLLOW-UP · plan cap counts month-only dates | ⬜ small | Found by LP2: `enforce_vendor_whitelist_per_date`'s own count ignores date precision — a month-only couple being chased made a Free shop refuse a real 1-March couple (replay). Latent in prod (1 chased couple, day-precise). Make it day-precision-only like the other counts. |
| running now | 🔨 FIX-DASHBOARD-BUTTON (#5446) · GREY-OUT (#5447) · NEW-NOT-ZERO · HONEST SHOP finish (#5423 → E1) · C1 #5436 auto-merge · S2 offered FOLLOW-UPS A | TEST ROUND 1 paused by the owner until the bugs he hit are live |
| H5 Lock after "not free" + unavailable not planned | ✅ SERVED (S2) | #5425 · c913c6e in prod (S2 + orchestrator ancestry) |
| H6 bench search hides a card with no bookings left on the date | 🔨 BUILDING (S2) · DO NOT LAUNCH A SECOND | hides on blocked day + full time slots (the two paths that really refuse); per-card daily limit waits for LOCK-PATH CAPACITY (tripwire test pins it); month = full every day |
| LOCK-PATH CAPACITY | ✅ MERGED as N5-E #5441 | see N5-E row |

**Rescue copies** of every unsaved workspace from today: `/Users/icecasasola/Documents/Claude/Projects/setnayan-rescue-2026-09-10/` (restore guide inside).
