# Part 07 — September registers, plans and handoffs (other than the orchestrator's sequence) + code-repo plan files

Read-only sweep, code measured on `origin/main` **9663550cb** (2026-09-11 16:24 +0800) via `git grep` / `git show`;
PR states from `gh pr view` at write time. Excludes everything in `WHATS_NEXT_Build_SEQUENCE_2026-09-10.md` (bundles D1→F2,
G1→G3, TEST ROUND 1/2 + findings 1–10, gift snapshot at lock, vendor-date-demand precision) and the excluded streams
(Papic/gifts, Story, Invite themes, encoder/Live Studio encoder, prod flags inventory, August registers, NEEDS_THE_OWNER).

**Register verdicts (which docs are live):**
- `WHATS_NEXT_Build_Plan_2026-09-10.md` — live register, but §1–§5 are fully carried by the SEQUENCE Status table; only §6 "Left out on purpose" (lines 887–907) and SEQUENCE owner item 9 ("Beyond reach") carry work nobody owns. Covered below.
- `HANDOFF_Continue_The_Build_2026-09-10.md` — SUPERSEDED by the SEQUENCE (every item it lists is a SEQUENCE row; all served).
- `WHATS_NEXT_2026-09-09.md` — SUPERSEDED for sequencing (its BENCH/STORY/EX/FIX sessions all merged); leftovers = owner errands + two security items, below.
- `WHATS_NEXT_HANDOFF_2026-09-08.md` — SUPERSEDED (its PRs #5302/#5303/#5304 merged); owner-only list + OAuth plaintext item still open, below.
- `BUILD_PLAN_Chat_And_Exclusive_2026-09-09.md` and `SESSIONS_Chat_Bench_Exclusive_2026-09-09.md` — SUPERSEDED 2026-09-10 (SESSIONS' own header); every A/B session merged (list in SUPERSEDED). Leftovers = design calls + one deferred clause set.
- `SESSION_PROMPTS_2026-09-09.md`, `_WAVE2`, `_A_AND_BC`, `SESSION_PROMPT_S6`, `SESSION_PROMPTS_S2_S4_S8` — all SUPERSEDED; every prompt's PR is merged (see SUPERSEDED).
- `Service_Card_Boosting_SPEC_2026-09-09.md` — PARKED by owner 2026-09-10 (DECISION_LOG 3841); nothing built.
- `Test_Script_Live_Two_Sided_2026-09-10.md` — the orchestrator's TEST ROUND; nothing extra here.
- `EVENT_HUB_CONTROLLER_DESIGN_2026-09-02.md` — built (EH1–EH6 merged); S6 money card + four owner decisions remain.
- `WHATS_NEXT_Item_7b/7d_PROMPT_2026-09-02.md` — Papic Build Order item 7 → skipped (Papic agent owns).
- Code repo `build-sessions/MB-PLAN.md` (MB0–MB15) — ALL MERGED. `MB-GALLERY-PLAN.md` / `MB-OVERSIGHT*.md` (MB16–MB28, RV1–RV3, RA1) — all merged; only the 500-sunset + three art cells remain. `RECEPTION-ART-PLAN.md` — current. `STORE-SHELL-CLOSEOUT-2026-09-07.md` — current for its owner items. `PROVE-THE-FLOW.md` — stale (couple side still "Cale & Ice"). `STATUS.md` (2026-09-09) and `COWORK_INBOX.md` (historical, last edit 2026-07-25) — leftovers below.

---

## WORKSTREAM: Supplier verification — what is left after the desk
Source: Build Plan §6 "Left out on purpose" (`WHATS_NEXT_Build_Plan_2026-09-10.md`:887–907) + DECISION_LOG 2026-09-09 rows 3818–3823 and 2026-09-11 row 3870. The desk (#5394), the papers screen (#5395), badge deadlines (#5433) and badge spots (#5456) are served; these are the remainders.

| Item | What a person would get (plain English) | State | Evidence | What's needed to finish | Owner question (if any) + choices the docs already list |
|---|---|---|---|---|---|
| The paper reader + registry lookup behind "matched by Setnayan" | A shop uploads its DTI/SEC, BIR 2303 and permit; Setnayan reads them, checks the government registry and compares them to the profile; clean papers pass by themselves, only mismatches reach a person | NOT STARTED | Seam only: `PaperRead`/`parsePaperRead` in `apps/web/lib/verification-pairs.ts`:205–307, rendered by `vendor-dashboard/shop/_components/verify-pairs.tsx`:169. `git grep -n "registryOutcome" origin/main -- apps/web ':!*.test.ts'` → only the parser in verification-pairs.ts (no writer). `git grep -ln "anthropic\|claude-" -- apps/web/lib/verification* apps/web/app/admin/verify apps/web/app/vendor-dashboard/verify` → 0 | A reader that writes `doc_uploads[slot].read`; DTI BNRS / SEC / BIR lookups that "fail toward manual" (504 = park); per-check mismatch names (DL 3820); subprocessor disclosure | DPO sign-off on sending papers to an outside reader (DL 3819: "the RA 10173 processor question — documents leaving our infrastructure is a subprocessor change and he is the registered DPO"). Ruled a new capability 2026-09-09; Build Plan: "its own project" |
| Bank account name matches the registered business | The admin sees whether the bank proof's account name is the business name or owner's name | PARTLY BUILT | The check line exists and routes to a person: `verification-pairs.ts`:170–180 (`bank_account_name`, "with a person at Setnayan"); no automated match (no reader, row above) | Automatic name match once the reader exists | — (Build Plan §6: "new data, after questions 4–5"; Q4/Q5 now ruled) |
| Approve switches from WARN to REFUSE before the first outside shop | Once real outside suppliers apply, Approve can't grant the badge with checks missing (a vouch is the only way round) | BLOCKED ON OWNER | Still warns: `grantWarning(` at `apps/web/app/admin/verify/page.tsx`:1529 and :2114. Ruling Q2 asked for a launch-checklist line; `grep -rl "before the first outside shop"` in the corpus → only SEQUENCE, DECISION_LOG and a BuildFinale part — **no line in `LAUNCH_CHECKLIST_2026-09-06.md`** | Add the checklist line now; flip warn→refuse (one line) at the moment the first outside shop is reviewed | Ruled "Warn now, refuse later" (DL 3870). Only the trigger moment remains |
| An already-verified shop with a profile gap submitting papers | The two early shops (badge until 12 Mar 2027) can send their papers even if one profile field is blank | NOT STARTED | Submit gate refuses any incomplete profile: `apps/web/lib/vendor-verification.ts`:691 `if (!input.profileComplete) missing.push('Finish your business profile')`; early-shop deadline `EARLY_SHOPS_PAPERS_DUE_ISO` in `lib/verified-badge.ts` | Decide exemption vs. keep the gate; Build Plan: "SetnaProd is at 100%; a routine reversible call later" | — (Build Plan §6 calls it routine; no owner question written) |
| "On the marketplace since <date>" | A shop page says how long the shop has been on Setnayan | NOT STARTED | `git grep -n "marketplace since\|Member since\|On Setnayan since" origin/main -- apps/web/app apps/web/lib` → 0 (only invites' "Joined Setnayan" label, `lib/vendor-invites.ts`:64). Candidate store `vendor_profiles.last_verified_at` is rewritten at each approval, so it is not a "since" date | A first-listed date (new column or derivation) + render on the shop page (F1/F2 area) | — ("new data, after questions 4–5", both ruled 2026-09-11) |
| Full permit-renewal clock | A shop is reminded to renew, uploads this year's permit, and its badge date moves forward | PARTLY BUILT | Built by #5433: reviewer types the permit date at approval (`app/admin/verify/actions.ts`:334–394 → `next_renewal_due_at`), badge off on read + 60-day reminder (`lib/verified-badge.ts`, `lib/verified-badge-sweep.ts`). `git grep -n -i "renew" -- apps/web/app/vendor-dashboard/shop apps/web/app/vendor-dashboard/verify` → 0 (no supplier-side renewal path) | A "send this year's permit" path that resets the date without a full re-application; permit date read off the paper (needs the reader) | — |

## WORKSTREAM: Booking fee & money (outside the orchestrator's bundles)
Source: Build Plan §6; `Service_Card_Boosting_SPEC_2026-09-09.md` (PARKED); `BUILD_PLAN_Chat_And_Exclusive_2026-09-09.md` C5.
⚠ Booking-fee enforcement itself is in the Production flags table (`NEXT_PUBLIC_BOOKING_FEE_RAIL_LIVE` row). Verified by the sweep orchestrator: the fee is NOT "on but not enforced" as DECISION_LOG l.3844 says — `lib/booking-fee-lock.server.ts:69-83` bills on `NEXT_PUBLIC_BOOKING_FEE_ENABLED` alone ("ONE KEY, NOT TWO … Flipping that single env var therefore starts billing vendors on the next lock of a sourced booking"), writing a real `orders` row on the manual QR rail from a shop's 6th sourced booking. Only the proposal send-gate (`isBookingFeeEnforced`, `lib/booking-fee-gate.ts:38-40`) is two-key and dormant pending PayMongo KYC + checkout (PR #3146 was closed unmerged).

| Item | What a person would get (plain English) | State | Evidence | What's needed to finish | Owner question (if any) + choices the docs already list |
|---|---|---|---|---|---|
| "Starts at" becomes the floor for earning the gift (BENCH-C5) | A quote below the card's "from ₱X" still sends, but doesn't earn the Setnayan gift | NOT STARTED | `git grep -n -i "starts.at" origin/main -- apps/web/lib/setnayan-gift.ts` → 0; the only floor is the ₱3,500 booking floor (`setnayan-gift.ts`:156). Named "the easiest to lose" in `WHATS_NEXT_2026-09-09.md`:113 | Compare quote to the card floor at gift sizing; never block the quote | ⚠ Gift-related — Papic/gift agent may also carry it |
| Service Card Boosting (Featured slots) | A shop pays a flat price for days on screen for ONE card in ONE coverage, once ≥20 cards compete | BLOCKED ON OWNER | Parked: DL 3841 ("PARKED, NOT BUILT"). `git ls-tree --name-only origin/main supabase/migrations \| grep -i "boost\|featured"` → 0; `git grep -n "card_boost\|featured_slot"` → 0. Only `ad_rank` ladder rung exists | Owner un-parks; then ~3 PRs + 1 migration per spec | "Is Featured a tier benefit, a separate purchase, or both?" (spec:132). DL 3826 also flags two prior locks it re-opens (2026-05-28 "add it later"; 2026-07-25 monetization lock) |

## WORKSTREAM: Chat & bench — leftovers after S1–S12 and the H stream
Source: `BUILD_PLAN_Chat_And_Exclusive_2026-09-09.md`, `SESSIONS_Chat_Bench_Exclusive_2026-09-09.md` (both SUPERSEDED), DECISION_LOG 3780/3788/3796, `build-sessions/PROVE-THE-FLOW.md` §4. Every session in these plans merged (see SUPERSEDED).

| Item | What a person would get (plain English) | State | Evidence | What's needed to finish | Owner question (if any) + choices the docs already list |
|---|---|---|---|---|---|
| Suggest-then-send AI reply for suppliers (replaces the auto-poster) | A supplier sees a drafted reply above the box and chooses to send it; nothing posts in their name by itself | NOT STARTED | `git grep -n -i "suggest.then.send\|draft strip\|suggestReply\|suggested reply" origin/main -- apps/web/app apps/web/lib` → 0. The auto-poster is still wired: `apps/web/lib/chat-send.ts`:411 `after(() => runVendorAutoReply(...))` (dormant only because no shop has a bot config + add-on, DL 3788 ⓼). PROVE-THE-FLOW §4 phase 5 lists the same strip | Draft strip in the thread composer; switch the auto-post path off | "OPEN, OWNER'S: whether a paid add-on that has never sold should stay paid." (DL 3788) |
| Richer standing-sentence clauses on the bench | Under each supplier: "tasting confirmed · you paid ₱50,000 · 170 guests vs 150 quoted" | NOT STARTED | `apps/web/lib/supplier-standing.ts`:202–265 builds only reply/quote/waiting segments; DL 3796 "STILL OPEN, DELIBERATELY NOT BUILT" | Plug Decisions facts into the same segment list | — |
| The database refuses a forged "offered service" | A couple can't post a message pretending a rival supplier offered them a service | NOT STARTED | `GRANT INSERT (offered_service_id) … TO authenticated` (`supabase/migrations/20271214894972_…sql`:73); guard `tg_chat_messages_guard_end_user_write` (`20271221089848_the_chat_cannot_leave_the_app.sql` ~300–345) checks thread/vendor/attachment/body, not service ownership; refusal is reader-side only (SESSIONS §S5 "Still not proven") | Guard clause or trigger + a `tests/db` behavioural test | — (low severity; reader already hides it) |
| Put "changes" back into chat (or keep Deal as the one money card) | — | BLOCKED ON OWNER | Retired on purpose (commit `d3350b8e2`, 2026-07-24); held by `apps/web/lib/the-change-marker-is-retired.test.ts` | Nothing unless the owner reverses | "OWNER'S CALL, RAISED NOT TAKEN: reverse the 2026-07-24 verdict and put changes back in chat, or leave Deal as the single money card?" (DL 3788) |
| Couple's conversation column: "they owe you a reply" + the search box | Couple sees which suppliers are waiting on them; search box kept or removed | BLOCKED ON OWNER | SESSIONS_Chat_Bench_Exclusive:186–190 — mirror of "Unanswered" "nobody designed"; search box added in #5347 though the prototype does not draw it | A design ruling | Keep/remove the couple-side search box; design the "owes you a reply" chip or not |
| Couple-facing "N couples inquired for your date" | — (already shows on the bench, floored at 3) | BLOCKED ON OWNER | Disclosed in `app/(shell)/privacy/page.tsx`:576; SESSION_PROMPTS_A_AND_BC:110–112 "runs the OPPOSITE direction and was never ruled on" | Ruling only | Keep as is / remove / change floor |
| Supplier rail clipped labels | The supplier's six-item rail stops truncating "Performan…" and "Hub" | NOT STARTED | `app/vendor-dashboard/_components/vendor-rail-context.tsx`:61–62 (`performance: 'Performance'`, `'on-the-day': 'Hub'`); DL 3829 ⓷ | Likely absorbed by six-door My Shop (G1–G3, orchestrator) — flag, don't duplicate | — |

## WORKSTREAM: Mood board (MB plans) & reception art
Source (code repo, `origin/main`): `build-sessions/MB-PLAN.md` (MB0–MB15 all merged, e.g. MB12 #5169, MB15 #5173), `MB-GALLERY-PLAN.md` + `MB-OVERSIGHT.md` (MB16–MB28, RV1–RV3, RA1/RA2 all merged), `RECEPTION-ART-PLAN.md` (current).

| Item | What a person would get (plain English) | State | Evidence | What's needed to finish | Owner question (if any) + choices the docs already list |
|---|---|---|---|---|---|
| Reception art — the welcome-signage zone | The welcome sign in the couple's reception preview is a real drawing tinted to their palette, not a flat shape | NOT STARTED | `PILOT_DECOR_ZONES` (`apps/web/lib/reception-decor-layers.ts`:50–61) = backdrop, ceiling, stage, tables, feast, booths, program, walls, photo_wall, tunnel — no `welcome_signage`; `git grep -n welcome_signage origin/main -- supabase/migrations` → only theme-template seeds | 5 cells on the RECEPTION-ART-PLAN recipe (~1 keeper / 2.25 generations), migration + zone id + pixel guard | — (Q10 ruled GO on the staged plan) |
| Reception art — two uncovered cells | Tropical-heritage stage and modern-minimalist program also get drawings | PARTLY BUILT | Stage: tropical range deleted (RA1 #5274, board row RA1); program: "FOUR ROWS, NOT FIVE. `modern minimalist` is UNSEEDABLE" (`supabase/migrations/20271212747087_ra2_program_decor_four_families.sql`:10). Both fall back to flat SVG by design | Re-cut the artwork (MB28b precedent), never widen tolerance | — |
| The 500 sunset for gallery back-catalogue | When a category has 500 approved event-linked photos, old back-catalogue intake closes (nothing deleted) | NOT STARTED | `git grep -n -i "sunset\|intake.*close" -- apps/web/lib/moodboard* apps/web/app/vendor-dashboard/moodboard-library` → 0 relevant hits; MB-OVERSIGHT-HANDOFF §5 "Deferred deliberately … build it when a category passes ~100" | Build when a category passes ~100 | — |
| Community theme gallery (couple-to-couple) | — | BLOCKED ON OWNER | MB-PLAN "What we are not building": parked behind a Terms amendment indefinitely | Terms amendment + fresh scope | Whether couple-to-couple sharing is still wanted |

## WORKSTREAM: Store shell, desktop & app-store distribution
Source: `build-sessions/STORE-SHELL-CLOSEOUT-2026-09-07.md` §4–§6, `WHATS_NEXT_HANDOFF_2026-09-08.md`, `WHATS_NEXT_2026-09-09.md` "Only you can do these".

| Item | What a person would get (plain English) | State | Evidence | What's needed to finish | Owner question (if any) + choices the docs already list |
|---|---|---|---|---|---|
| Windows `.msi` actually run | — | BLOCKED ON DEVICE | Never run on a Windows machine (HANDOFF 09-08; owner has none) | A Windows machine | — |
| iPhone App Store resubmission | Setnayan on the App Store | BLOCKED ON DEVICE | Build `Setnayan_1.0_build2.ipa` ready; needs App Privacy answers, a demo account, and a physical-iPhone recording of Delete my account (STORE-SHELL §4c) | Owner + real iPhone | — (Individual enrolment already decided) |
| Android on Google Play | Setnayan on Play Store | BLOCKED ON OWNER | D-U-N-S requested 2026-06-25 from CRIF, day 74+ with no reply (STORE-SHELL §5) | Owner chases CRIF; then $25 org account | — (do not re-ask the Play Console question) |
| Apple in-app purchase (durable answer to guideline 3.1.3(b)) | Buying inside the iPhone app | NOT STARTED | `git grep -l -i "storekit\|in-app-purchase\|revenuecat" origin/main -- apps/mobile apps/web/package.json apps/web/lib` → 0; scheduled v1.1 (STORE-SHELL §6) | IAP integration in v1.1 | — |

## WORKSTREAM: Security, ops & repo hygiene
Source: `WHATS_NEXT_HANDOFF_2026-09-08.md` "Still genuinely open", `WHATS_NEXT_2026-09-09.md` live problems, Build Plan §6, `PROVE-THE-FLOW.md` §7, `STATUS.md` (2026-09-09), `COWORK_INBOX.md`.

| Item | What a person would get (plain English) | State | Evidence | What's needed to finish | Owner question (if any) + choices the docs already list |
|---|---|---|---|---|---|
| Google keys stored encrypted | A couple's/the Setnayan YouTube + Drive + Photo Delivery keys are not readable text in backups | NOT STARTED | `app/api/oauth/drive/callback/route.ts`:208 `refresh_token: token.refresh_token` (same in youtube :157/:281, photo-delivery :157); `git grep -c "encryptToken" origin/main -- apps/web/app/api/oauth` → 0 | Encrypt on write + decrypt on read; add the site to `lib/secrets/reencrypt.ts`; re-seal existing rows | — |
| Livestream channel health tells the truth | Admin sees "needs reconnect" when a channel's key never refreshed, not "connected" | NOT STARTED | `lib/live-studio-channel-grants.ts`:101 `health = connection_health === 'needs_reauth' ? … : 'ok'`; file unchanged since `68179d672` (wave 9) | Derive health from `last_refreshed_at`/expiry | ⚠ Live-Studio adjacent — encoder agent may own |
| Close unused signed-out write grants on `vendor_services` | — (hygiene; inert today) | NOT STARTED | `supabase/security/exposure-surface.baseline.txt`:577 `public.vendor_services\|anon SIUD` | One REVOKE migration + baseline regen | — (Build Plan §6: "optional hygiene") |
| Dependabot alerts triaged | — | NOT STARTED | `gh api …/dependabot/alerts` today: 13 open (5 high · 7 medium · 1 low); STATUS said 10 on 2026-09-09 | Triage pass | — |
| Sentry SDK upgrade | — | NOT STARTED | `apps/web/package.json`:63 `"@sentry/nextjs": "^8.0.0"` (STATUS listed a 9→10 bump; it is on 8) | Upgrade | — |
| Seat-plan follow-ups (rigid-group linking rebuild, many-walker collision, fit-framing, RSVP→seat auto-rules, R6 radius sweep) | Smoother seat-plan editing | UNVERIFIED | STATUS.md: "still unverified 2026-07-16 follow-ups"; partial sign: `lib/seating-oracle.test.ts`:403 "a link group is placed as ONE rigid unit" (auto-layout only). Not settled per item | Measure each item separately | — |
| Deploy-drift alerts reach someone | A production outage is noticed without opening GitHub | BLOCKED ON OWNER | `.github/workflows/deploy-drift-monitor.yml` has no notify/email step (PROVE-THE-FLOW §7.2) | Choose a channel (email via Resend) | Where alerts should go |
| Required checks on `main` | — | BLOCKED ON OWNER | Required contexts (gh api) = 13, none Vercel (PROVE-THE-FLOW §7.1). Note memory: this repo has no Vercel previews, so requiring it may be moot | Owner setting | Require the Vercel check or not |
| Two events flagged primary | — | UNVERIFIED | No partial unique index on `events.is_primary` (`git grep -n is_primary -- supabase/migrations \| grep -i unique` → only a cluster comment); the 2 rows are prod data (not read) | Data cleanup + index | — |
| Category label stored humanised | Category names can be fixed later without rewriting rows | NOT STARTED | `apps/web/lib/vendor-category-progress.ts`:31 humanises and stores (PROVE-THE-FLOW §7.6) | Store keys, label on read | Overlaps TEST ROUND findings 2–4 (orchestrator) — do not duplicate |
| `brand.config.ts` claim | — (doc) | NOT STARTED | `git ls-tree -r origin/main \| grep brand.config` → 0, yet CLAUDE.md "Locked decisions" names it | Fix the CLAUDE.md line or create the file | — |
| PROVE-THE-FLOW refresh | Engineering resume doc matches today's test (testnayan4 couple, B1/B2 live) | PARTLY BUILT | Last edit `cc740a815` 2026-09-09; §0 still names couple "Cale & Ice" (internal); §4 phase 4 not marked built (#5347 merged) | T1 delta (1): rewrite for today's path | — |
| COWORK_INBOX historical backlog | — | UNVERIFIED | `COWORK_INBOX.md` (last edit 2026-07-25) still holds 169 `[PENDING]` rows dated 2026-05-14 → 06-04; header says "winding down … no new items" | Apply-or-delete pass against the corpus | Delete the file's backlog, or apply each |

## WORKSTREAM: Marketplace hygiene & the owner's own shop data
Source: Build Plan §6; SEQUENCE owner item 9 (no bundle).

| Item | What a person would get (plain English) | State | Evidence | What's needed to finish | Owner question (if any) + choices the docs already list |
|---|---|---|---|---|---|
| Hide the FIXTURE shop from Google | Search engines don't index a test shop | BLOCKED ON OWNER | `app/sitemap-vendors.xml/route.ts`:90–97 excludes only unverified and `is_demo`; the Saysay "(FIXTURE)" shop is verified | Owner's rename (test prep) or mark it demo | "the owner's own shop and call" (Build Plan §6) |
| Remove retired Pabati from SetnaProd's services | The owner's shop stops listing a retired product | BLOCKED ON OWNER | Pabati retired 2026-08-21 (`apps/web/lib/entitlements.ts`:432); data is the owner's own shop (not read) | Owner edits his shop | — |
| "Schedule with the service card" | A booking picks a time on the card itself | UNVERIFIED | Build Plan §6: "watch whether he looks for per-booking scheduling during the test; do not ask". Per-card slots already exist (`lib/vendor-time-slots.ts`; daily limit enforced #5441) | Observe in TEST ROUND | — (deliberately not asked) |

## WORKSTREAM: Event Hub controller (non-invite parts)
Source: `EVENT_HUB_CONTROLLER_DESIGN_2026-09-02.md` (EH1–EH6 merged) + DECISION_LOG 3746.

| Item | What a person would get (plain English) | State | Evidence | What's needed to finish | Owner question (if any) + choices the docs already list |
|---|---|---|---|---|---|
| S6 — the money card on the Event Hub | The couple sees what their event owns as a filling meter | NOT STARTED | Design §0a: "S6, the money meter, is NOT built"; `git grep -n -i "money\|meter\|S6"` in `launch/_components/hub-stage.tsx` + `lib/event-hub-control.ts` → 0 | A figure with a home (design rule 5 "don't guess") | — |
| Seat plan opens only once the guest list is final | — | BLOCKED ON OWNER | DL 3746: "OWNER CALL LEFT OPEN … shown as a fact + a wait next step, NOT enforced as a gate on Publish" | Ruling | Enforce as a gate, or keep as advice |

## WORKSTREAM: Legal & compliance documents (no code)
Source: `WHATS_NEXT_HANDOFF_2026-09-08.md` owner-only §5–§6, DECISION_LOG 3727, `LAUNCH_CHECKLIST_2026-09-06.md`:56.

| Item | What a person would get (plain English) | State | Evidence | What's needed to finish | Owner question (if any) + choices the docs already list |
|---|---|---|---|---|---|
| dpo@setnayan.com reaches a person | A data-protection email is actually read | BLOCKED ON OWNER | Never verified (handoff 09-08; `WHATS_NEXT_2026-09-09.md` owner task 7) | Owner sends one test email | — |

---

## OPEN OWNER QUESTIONS
- "Is Featured a tier benefit, a separate purchase, or both?" — plus whether to un-park boosting at all (owner: "if not then continue with original plan first"). — Source: /Users/icecasasola/Documents/Claude/Projects/Setnayan/Service_Card_Boosting_SPEC_2026-09-09.md:132. Checked DECISION_LOG: `grep -n "PARKED\|Featured"` → 3841 (2026-09-10) parks it; no ruling on the entitlement. Choices: tier benefit · separate purchase · both.
- "OPEN, OWNER'S: whether a paid add-on that has never sold should stay paid." (the vendor AI auto-reply add-on; design ships suggest-then-send instead) — Source: /Users/icecasasola/Documents/Claude/Projects/Setnayan/DECISION_LOG.md:3788. Checked DECISION_LOG rows after 3788 for "autoreply|chatbot|AI add-on" → no ruling. Choices: keep paid · make free · retire.
- "OWNER'S CALL, RAISED NOT TAKEN: reverse the 2026-07-24 verdict and put changes back in chat, or leave Deal as the single money card?" — Source: /Users/icecasasola/Documents/Claude/Projects/Setnayan/DECISION_LOG.md:3788. Checked rows after 3788 for "change marker|change_order_id|changes back in chat" → no ruling. Choices: reverse · leave Deal as the one card.
- "A COUPLE-FACING VERSION ALREADY SHIPS ELSEWHERE — a 'N couples inquired for your date' line on the marketplace bench, floored at 3. That runs the OPPOSITE direction and was never ruled on." — Source: /Users/icecasasola/Documents/Claude/Projects/Setnayan/SESSION_PROMPTS_A_AND_BC_2026-09-09.md:110. Checked DECISION_LOG `grep -n "inquired for your date"` → no ruling. Choices (implied): keep · remove · change the floor.
- "whether the couple's column should ever say *they owe you a reply* (the mirror of 'Unanswered' — a real idea nobody designed, deliberately not invented); and the **search box on the couple's side**, which the prototype does not draw and #5347 added anyway." — Source: /Users/icecasasola/Documents/Claude/Projects/Setnayan/SESSIONS_Chat_Bench_Exclusive_2026-09-09.md:186–190. Checked DECISION_LOG for "owe you a reply|search box" → no ruling.
- "⚖ ONE READING RECORDED FOR THE OWNER (reversible, reverses no ruling): the two are judged when a card GOES LIVE, never on a card that is already live." (cover photo + what's included; the two live cards stay live without them) — Source: /Users/icecasasola/Documents/Claude/Projects/Setnayan/DECISION_LOG.md:3882. Checked later rows (3883–3891) → not ratified. Choices: accept the reading · also require it of already-live cards.
- Approve warn→refuse trigger: "Approve keeps WARNING while the owner is the only reviewer and switches to REFUSE (vouching the only way round) before the first outside shop is approved; `grantWarning` already holds the message, so it is a one-line change at that moment." — Source: /Users/icecasasola/Documents/Claude/Projects/Setnayan/DECISION_LOG.md:3870 (partially ruled 2026-09-11). Open part: the owner must say when the first outside shop is about to be approved; the promised launch-checklist line is missing from LAUNCH_CHECKLIST_2026-09-06.md.
- "OWNER CALL LEFT OPEN, deliberately: 'the seat plan can be activated once the guest list is finalized' is shown as a fact + a wait next step, NOT enforced as a gate on Publish" — Source: /Users/icecasasola/Documents/Claude/Projects/Setnayan/DECISION_LOG.md:3746. Checked later rows → no ruling. Choices: gate · advice only.
- DPO on the paper reader: "the RA 10173 processor question — documents leaving our infrastructure is a subprocessor change and he is the registered DPO." — Source: /Users/icecasasola/Documents/Claude/Projects/Setnayan/DECISION_LOG.md:3819. The capability is ruled in; the subprocessor sign-off is not.
- Community theme gallery: "Park it behind the Terms amendment indefinitely; if couple-to-couple sharing is still wanted later, scope it fresh" — Source: code repo `origin/main:build-sessions/MB-PLAN.md` ("What we are not building"). No ruling.
- PayMongo KYC for the booking-fee rail (enforcement is two-key) — Source: `origin/main:apps/web/lib/booking-fee-gate.ts`:29–36 + /Users/icecasasola/Documents/Claude/Projects/Setnayan/WHATS_NEXT_Build_Plan_2026-09-10.md:889. Owner action, not a question.

## SUPERSEDED / ALREADY DONE
- **SEC registration slot** (DL 3822 "there is NO SEC slot") — the one slot accepts either: `apps/web/lib/vendor-verification.ts`:252–256 label "DTI or SEC Registration", hint names SEC for corporations; `verification-pairs.ts`:205 `PaperRegistry` includes `'sec'`. Only the key name `dti_certificate` is legacy.
- **Vendor Today page date in UTC** (DL 3829 ⓵) — fixed: `app/vendor-dashboard/page.tsx`:125–131 `timeZone: 'Asia/Manila'` (commit `98ec16a72`, 2026-09-10). ⓶ markdown/slug in "What's new" is TEST ROUND finding 3 (orchestrator).
- **Register Q6 "keep both message lists"** (G7) — ruled "Keep both — no change" (DL 3870); nothing to build.
- **2026-09-11 H2 card gate** — merged #5442 (SEQUENCE); only its recorded reading is open (above).
- **Chat/bench sessions** — all merged on main: A1 #5327 · A2 #5336 · A3 #5328 · A4 private+compressed files #5339 · A5/B1 #5341/#5344 · A6/S4 #5369 · S1 retired #5345 · S2 Decisions #5372/#5402/#5411 · S3 column #5347 · S5 service card in chat #5350 · S6 standing sentence #5360 · S7/B6 sort bottom tier #5351 · S8/H3 drag #5367 · S9 follow-gate #5358 · date-rendering fix #5359 · bench legibility #5343 · "A" Files tab #5362 · "B+C" guest-count provenance + who-else-wants-this-date #5363 · EX-1 #5375 (into #5373's branch) + #5373 · EX-2/C1 #5436. S10 → H2 #5442; S11 deleted by the one-item ruling; S12 → C1.
- **Delta line on a headline-billed supplier** (SESSIONS S1 "Still open") — closed by B2 (DL 3831 "This CLOSES … Do NOT re-ask it"; #5390).
- **Deal card "booked vs asked"** (DL 3831 "NAMED, NOT BUILT") — built: `app/_components/chat-amendment-card.tsx`:55 + `lockFreezeLine` tone `booked`.
- **WHATS_NEXT_2026-09-09 live problems 3–4** — #5140 merged 2026-09-10 (D4); #5012 CLOSED. Biggest-things 1 (coordinator access) → #5377 served; 3 (non-wedding stories) → STORY-VIS #5378 merged (Story agent).
- **WHATS_NEXT_HANDOFF_2026-09-08 in-flight PRs** — #5302, #5303, #5304 all MERGED 2026-09-07. `ENCRYPTION_KEY`/`R2_PUBLIC_URL`/deploy pipeline items were already verified done in that doc.
- **STATUS.md "until AUTOMERGE_PAT is set"** — `AUTOMERGE_PAT` now present in `gh secret list`.
- **Download page "not notarized" string** (STORE-SHELL §8.2) — page now branches: `app/download/page.tsx`:139–146 ("Signed & notarized by Apple" vs "Not yet notarized").
- **MB-PLAN MB0–MB15** — all merged (e.g. MB8 #5164, MB9 re-scoped to "renders become inspiration" #5170, MB12 #5169, MB13 #5159, MB14 #5167, MB15 #5173). MB-PLAN decision 7 (existing 3D rooms opt in?) resolved 2026-09-04: auto-upgrade, no opt-in (`build-sessions/MB15.md`:49–91).
- **MB gallery arc** — MB16–MB28, MB14b, MB28b, RV1, RV2 #5273, RV3 #5281, RA1 #5274 + #5277 (base main), RA2 zone PRs (tables/feast/booths/program/walls/photo_wall/tunnel migrations on main). MB-OVERSIGHT-HANDOFF §6 Q1–Q5 ruled 2026-09-05 (MB26/MB27); Q6 ceremony drawing → MB25 #5199; Q7 bride re-cut → MB24 #5198; Q9 suggest-never-write → RV2; Q10 → RECEPTION-ART-PLAN.
- **Vendor video watermarking** — deferred to Phase 2 by ruling (DL 3743); refuse-not-pass shipped (`assertNotVideoBytes`/`assertNotVideoFile`). Not a V1 item.
- **Event Hub decisions 2, 6, 9** — shipped (EH3 #5108, catalog already titled, EH6 #5116).
- **HANDOFF_Continue_The_Build_2026-09-10** — every item is a SEQUENCE Status row now SERVED (#5412, #5413, #5414, N1, N3, B1, B2, C3).
- **Build Plan §6 "Left out" items owned by other streams (not re-listed):** weak-signal venue (Papic offline queue), encoder go-live, non-wedding stories (#5378), Live Studio page copy (mis-sale fixed by #5140), stranded commit `1ca4989f8c` (Papic), `claude/encoder-actually-runs` (superseded by #5400), `VERCEL_SUPPORT_LARGE_FUNCTIONS` (B3 served).
- **Item 7b / 7d prompts** — Papic Build Order item 7 → Papic agent.

## FILES THE PACK SHOULD INCLUDE
/Users/icecasasola/Documents/Claude/Projects/Setnayan/WHATS_NEXT_Build_Plan_2026-09-10.md — §6 "Left out on purpose" list (lines 887–907)
/Users/icecasasola/Documents/Claude/Projects/Setnayan/Service_Card_Boosting_SPEC_2026-09-09.md — parked boosting spec, ready if un-parked
/Users/icecasasola/Documents/Claude/Projects/Setnayan/prototypes/shop_verification_2026-09-09.html — binding verification screen incl. registry-down frame
/Users/icecasasola/Documents/Claude/Projects/Setnayan/prototypes/chat_interface_v4_2026-09-09.html — binding chat/bench design (richer standing clauses)
/Users/icecasasola/Documents/Claude/Projects/Setnayan/BUILD_PLAN_Chat_And_Exclusive_2026-09-09.md — bench "additive only" rule + C5 floor
/Users/icecasasola/Documents/Claude/Projects/Setnayan/SESSIONS_Chat_Bench_Exclusive_2026-09-09.md — §S3/§S5 notes: open design calls, forged-service gap
/Users/icecasasola/Documents/Claude/Projects/Setnayan/EVENT_HUB_CONTROLLER_DESIGN_2026-09-02.md — S6 money card + §7 owner decisions
/Users/icecasasola/Documents/Claude/Projects/Setnayan/WHATS_NEXT_HANDOFF_2026-09-08.md — owner-only distribution list, OAuth plaintext finding
/Users/icecasasola/Documents/Claude/Projects/Setnayan/WHATS_NEXT_2026-09-09.md — owner errands table (Mac secrets, cert, D-U-N-S, DPO email)
/Users/icecasasola/Documents/Claude/Projects/Setnayan/03_Strategy/Phase3_Minors_and_Legacy_Counsel_Brief_2026-07-05.md — brief needing the 2026-09-08 correction
/Users/icecasasola/Documents/Claude/Projects/Setnayan/LAUNCH_CHECKLIST_2026-09-06.md — where the Approve-refuse line should be added
/Users/icecasasola/Documents/Claude/Projects/setnayan-platform (origin/main) build-sessions/STORE-SHELL-CLOSEOUT-2026-09-07.md — store/desktop owner steps with re-measure commands
/Users/icecasasola/Documents/Claude/Projects/setnayan-platform (origin/main) build-sessions/RECEPTION-ART-PLAN.md — per-zone art recipe for the remaining cells
/Users/icecasasola/Documents/Claude/Projects/setnayan-platform (origin/main) build-sessions/MB-OVERSIGHT.md — mood-board board, rulings, deferred 500 sunset
/Users/icecasasola/Documents/Claude/Projects/setnayan-platform (origin/main) build-sessions/MB-PLAN.md — community-gallery park rationale
/Users/icecasasola/Documents/Claude/Projects/setnayan-platform (origin/main) build-sessions/PROVE-THE-FLOW.md — stale resume doc; §7 ops owner items
/Users/icecasasola/Documents/Claude/Projects/setnayan-platform (origin/main) apps/web/lib/verification-pairs.ts — the paper-reader seam (`PaperRead`) to write into
/Users/icecasasola/Documents/Claude/Projects/setnayan-platform (origin/main) apps/web/lib/booking-fee-gate.ts — two-key fee enforcement switch
/Users/icecasasola/Documents/Claude/Projects/setnayan-platform (origin/main) STATUS.md — seat-plan/Sentry/dependabot follow-ups (2026-09-09 snapshot)
