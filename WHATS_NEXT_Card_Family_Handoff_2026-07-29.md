# WHATS_NEXT — Card Family (maker · card · details · customization/inquiry) · 2026-07-29

> **Continuation contract for a FRESH Claude Code session/account with ZERO prior context.**
> Owner (2026-07-29): *"preserve all our plans… so i can continue it on a different claude code
> account. make sure that we are capable of understanding all the information and no errors when
> this is attempted to be built."* Trigger: the owner says **"what's next"** → open
> `WHATS_NEXT_INDEX.md` (the master register + its safety rules), then this file for the card
> family. **Read this whole file before touching anything.**
>
> Repo: `github.com/iscasasola/setnayan-platform`, canonical checkout
> `/Users/icecasasola/setnayan-platform-recovered` (⚠ may sit on a stale branch — ALWAYS
> `git fetch origin main` and work in a NEW worktree off `origin/main`; grep with
> `git grep … origin/main`, never the working tree). This handoff was written at
> **`origin/main` = `441779c1f`** (merge of #3864). Anything after that SHA is newer than this doc.

---

## 1 · What is DONE and verified — do NOT rebuild any of this

Eleven PRs merged 2026-07-28/29, every one adversarially reviewed (4 multi-agent review
workflows, 20 confirmed defects fixed pre-merge). Verified against live prod, not specs.

| PR | What | State |
|---|---|---|
| #3848 | Duplicate-migration-prefix fix; papic free-pool arm finally APPLIED (verified: index live, 2×50pts) | live |
| #3849 | Early-booking lead-time ladder (`vendor_service_discounts.min_lead_months`, resolver `lib/vendor-lead-time-tier.ts`) — display-only | live |
| #3851 | Zero-step CANVAS MAKER (`canvas-maker.tsx`; card IS the form; 38-name parity + JSX-mount pins) | **LIVE** — flag ON |
| #3852 | Coverage serves-editor renders only the leaf's allowed event types (`lib/coverage-allowed-events.ts`) | live |
| #3853 | "Update card" confirm on every canvas sheet (`type="button"` is load-bearing) + ₱0 options render BLANK never "included" (`INCLUDED_PLACEHOLDER=''`) | live |
| #3854 | Congratulations on every card CREATE (`lib/service-card-congrats.ts`; `&created=live\|draft`) | live |
| #3857 | CARD RECORD (`service_card_records(uuid[])` SECURITY DEFINER batch reader, authenticated-only, K=3 floor + completed-months ledger IN SQL; `lib/service-card-record.ts`; medal case) | **LIVE** — flag ON |
| #3861 | SERVICE DETAILS SHEET on `/v/[slug]` + customization picks reach the inquiry with TRUTHFUL delivery (`ok_build_not_sent`) | merged, **flag OFF** |
| #3862 | CHARGE PATH: follow-ups/pick-N/extra-hours bill what they display; **pricing snapshot frozen at lock** | live |
| #3863 | Reversible removal — unticked package lines stay visible (marked), re-tickable | live |
| #3864 | Budget truth — budget ≡ receipt ≡ workspace via `keptItemRows` + `snapshotChargeLines` | live |

**Flag inventory (this wave):** `NEXT_PUBLIC_CANVAS_MAKER_ENABLED` = ON ·
`NEXT_PUBLIC_CARD_RECORD_ENABLED` = ON · **`NEXT_PUBLIC_SERVICE_DETAILS_ENABLED` = OFF —
the owner's one pending flip** (details sheet + picks-into-inquiry both ride it).

**Design references (owner-approved, PRESERVED IN THIS REPO — the original Claude artifacts
belong to the old account):** [`Design_Card_Family_2026-07/service-card-maker-prototype.html`](Design_Card_Family_2026-07/service-card-maker-prototype.html)
(open in a browser; its 80-assertion smoke suite is beside it) and
[`Design_Card_Family_2026-07/veteran-card-prototype.html`](Design_Card_Family_2026-07/veteran-card-prototype.html)
— the Card Record's visual north star.

## 2 · The LOCKED principles — violating any of these is a defect

1. **A LOCKED ORDER IS FROZEN.** At lock, `customizations_json.pricing_snapshot` persists
   `{version:1, credit_model, pax_count, options[{item_id,option_id,label,delta_centavos
   (already pax-resolved)}], extra_hours[{item_id,label,hours,rate_centavos,max_extra_hours}]}`.
   Every later re-price replays the snapshot under the RECORDED model. A vendor
   retiring/repricing anything, or a flag rollback, cannot touch a locked order. **A removal
   never increases `total_locked_centavos`** (enforced + tested).
2. **VISIBILITY BOUNDS CHARGEABILITY.** `chargeableOptionIds`/`chargeableExtraHours…` walk
   `visibleLineTree`; a follow-up with an unpicked parent cannot bill. ONE exception, explicit:
   tree entries marked `removed: true` are visible (so the couple can re-tick) but NEVER
   chargeable — both walkers skip them.
3. **Safety refusals are SHARED code on both pricer branches** (pick_min floor, pick_max cap,
   hour caps, unrevealed follow-ups). A flag chooses the pricing MODEL, never the safety floor.
4. **DISPLAY ≡ COMMIT.** `chargeableOptionIds` is the ONE function the modal's submit and
   `lockPackage`'s pricing both call. Never fork it.
5. **Card Record privacy IN SQL:** K=3 arms-length floor before mix/ledger emit;
   completed-months-only ledger (type · 'YYYY-MM' · pax band); no names/venues/ids/exact dates;
   reader is authenticated-only (NO anon — verified in prod).
6. **Truthful delivery:** an inquiry/picks send that the chat layer rejects surfaces per-reason
   (`ok_build_not_sent`); the UI never claims delivery that didn't happen. The pre-accept gate
   is reported, never bypassed.
7. **Derive, never type** (fees/rates/rules render from constants with parity tests) · **blanks
   auto-name, never block** · **₱0 options render BLANK** (never "included") · the **Setnayan
   Exclusive is never public** (revealed in-thread as the conversation's reward) · every sheet
   gets an explicit "Update card" confirm.

## 3 · UNFINISHED — the build list (each item self-contained)

Gate classes per `WHATS_NEXT_INDEX.md §1`: AUTO-OK = build flag-dark now; OWNER_DECISION /
FLAG_FLIP_PROD = stop at the gate and surface it.

### 3a · Card-duplicate — "copy a card into the maker" (OWNER ASKED · AUTO-OK flag-dark)
Owner (2026-07-28): *"can they copy what they created and place it to the wizard to recreate
it?"* + the rule **"events created for that card stay on that card."** Design settled: a
"Start from one of your cards" entry opens the maker PRE-FILLED from an existing
`vendor_services` row — copies ONLY authored content (title, category, price fields, inclusions,
discounts, Exclusive, media refs); the original keeps ALL history (bookings, card record, event
assignments); the copy saves as a NEW draft (is_active:false). Mechanics: the canvas maker is one
form with server-named inputs — prefill = defaultValues built server-side from the source row +
its child tables (`vendor_service_inclusions/discounts/price_brackets`, showcase keys). ⚠ Media:
reference the same R2 keys; never move/delete objects on copy. Files:
`services/new/[category]/page.tsx` (accept `?from=<service id>`, owner-scoped fetch),
`canvas-maker.tsx` (initial state), the shipped services-manager card menu (the doorway —
wayfinding rule: no orphaned pages).

### 3b · Most-picked options compilation (needs schema · AUTO-OK for the migration+write, display flag-dark)
The veteran-card "What 50 couples picked" panel. Blocked: per-option picks are NOT queryable —
`event_vendors.package_item_id` is a single id; picks live in per-booking
`customizations_json`. **Smallest enabling schema (already designed):** table
`event_vendor_item_options(event_vendor_id, item_id, option_id)` written by `lockPackage`
alongside the snapshot. Then aggregate per service/package (arms-length filter — reuse
`vendor_booking_is_arms_length()`), render on the Card Record with a min-N floor like K=3.
⚠ Migration rules in §5 apply (REVOKE ACL, allocator, verify-object).

### 3c · Reply-time badge + Papic-documented count (feasible, separate PRs · AUTO-OK flag-dark)
Reply-time: `chat_threads` + message timestamps → median first-response; needs a min-N floor so
thin samples don't mislead (the Card Record review's small-N lesson). Papic count: photos→event→
booking cross-lane join — feasible but not trivial; both render on the card's award shelf
(design: veteran-card artifact).

### 3d · Guest-flywheel stat (BLOCKED — no data)
"9 of 50 couples first met this card as guests." Needs guest→couple attribution that does not
exist. Do not fake it. Becomes buildable only after an attribution event lands (e.g. a
guest-session → signup link table). OWNER_DECISION on whether to build attribution at all.

### 3e · Explore mount of the Card Record (CROSS-SESSION handoff)
`apps/web/app/explore/` belongs to the Explore-replan session (slices A–F merged, flag OFF).
Hand them `card-record-section.tsx` + the batched `fetchServiceCardRecords` — the per-service
details screen data problem they were blocked on is SOLVED by `service_card_records`. Do not
touch their tree from a card-family session.

### 3f · Smaller epilogue items (AUTO-OK)
- **Audience-save redirect:** `updateCoverageServes` ends in `redirect(servicesReturnBase())` —
  mid-edit in the canvas the vendor is navigated away (the sheet warns today). Build a
  non-redirecting variant for the canvas call site; keep the shipped panel's behavior.
- **Clip pill duration:** shows `▶ clip` not `▶ 0:30` — `ShowcaseMediaFields` probes duration
  internally but doesn't expose it; expose + persist, never fabricate.
- **Wizard-created package linkage (OWNER_DECISION pending):** the ★ Customization step creates
  a one-service package with NO service↔package link. The smallest fix, designed but not taken:
  one nullable `vendor_packages.vendor_service_id` FK (enables re-opening a service to EDIT its
  customization). Also open: should that package publish with the service instead of landing
  `is_active:false`?
- **`fetchServiceCardRecord`** (singular) in `lib/service-card-record.ts` is a documented
  1-element convenience wrapper with zero callers today — fine to keep; delete only with a reason.

## 4 · OTHER unfinished streams (not this session's — pointers only, do not duplicate)

- **Song Desk** — the OTHER active stream: contract `Song_Desk_BUILD_ORDER_2026-07-27.md`
  (7 PRs in dependency order; PR1 = a live entitlement gap).
- **Papic two-type model (locked 2026-07-29, build NOT started, different session):** Pool rungs
  back on sale (₱1,000/2,000/3,000 — ⛔ **the Pool ladder now runs to 30,000 / ₱9,000, and Papic One is ONE price, 150 credits ₱50; see DECISION_LOG 2026-08-11**) + Papic One, reloadable cameras. Contract =
  memory `project-setnayan-onboarding-papic-ai-cards` (🔒 2026-07-29 block) + the DECISION_LOG
  row 2026-07-29 + artifact `de2cf612`. Build order there: catalog migration → SKU remap → services-step.
- **Everything older** — `WHATS_NEXT_INDEX.md` is the master register (Open-Browse, Google
  OAuth branding, front-desk, etc.), with the HUMAN-GATED taxonomy this file inherits.

## 5 · THE TRAPS — every one of these bit a session in the last 48h. Reread before building.

1. **RULE 0** (repo CLAUDE.md): grep the shipped code + the corpus BEFORE designing. Twice in one
   day an "asked-for feature" already shipped. Use `git grep <noun> origin/main -- apps/web`.
2. **Migrations:** allocate via `pnpm migration:new` INSIDE your worktree; a same-prefix TWIN is
   silently skipped forever (version is the PK — #3848's root cause); after ANY migration merge,
   the workflow may not fire — **verify the OBJECT in prod** (Supabase MCP, project
   `njrupjnvkjkitfctetvi`), then `gh workflow run supabase-migrations.yml --ref main` if absent.
   Every new object: explicit `REVOKE ALL … FROM PUBLIC, anon, authenticated` then targeted
   grants (default ACL ships OPEN). Exposure baseline: the diff must be EXACTLY your objects.
3. **Gates:** `npm run build` CANNOT run locally (7GB OOM) — CI covers it; never pipe a gate
   through `tail`/`head` (hides the exit code). Full unit suite ≈ several minutes — run in
   background. Changelog fragment in ROOT `changelog.d/` per PR; never edit CHANGELOG.md/STATUS.md
   in a feature PR. `gh pr merge --auto --merge` immediately after `gh pr create` (standing).
4. **Worktrees:** always a fresh worktree off `origin/main`; `pnpm install --prefer-offline`
   first (fast); PRUNE after merge (disk). The pre-push hook scans the pushed tree (it was fixed
   to allow deleting main's duplicates — don't "fix" it back).
5. **Verification craft:** control chars survive tsc+lint+tests — byte-scan generated files
   (`LC_ALL=C grep -P '[\x00-\x08\x0b\x0c\x0e-\x1f]'`); python/perl heredocs can inject BOM/NUL.
   Probe your own guards (a pin that matches the wrong line passes while the defect returns).
   Prod is PRE-LAUNCH-EMPTY — paid gates render locked for everyone; test accounts
   `testnayan1..5@test.com`/`12345`; never test a paywall on the owner account.
6. **Agent/network flakiness (2026-07-29):** long agent streams stalled 6× in one afternoon;
   work SURVIVED in the worktree every time — resume from transcript, or verify + finish inline.
   A timed-out `git push` may have LANDED server-side (`git ls-remote` before re-pushing;
   `gh pr create --head <branch>` works without local upstream tracking).
7. **Money:** the booking fee is ARMED in prod (5% first ₱100k then 1% — derive, never type).
   A pricing change is never a side effect of a fix. `event_vendors.service_id` is nullable —
   per-card counts read lower than shop-level counts; both on one page needs owner awareness.

## 6 · How to resume (the first 10 minutes of the fresh session)

1. Read this file fully + `WHATS_NEXT_INDEX.md` §1 (gates) + repo `CLAUDE.md` RULE 0.
2. `git -C /Users/icecasasola/setnayan-platform-recovered fetch origin main` — if `origin/main`
   moved past `441779c1f`, `git log 441779c1f..origin/main --oneline` and read newer
   `DECISION_LOG.md` rows (`grep -n "2026-07-3\|2026-08" DECISION_LOG.md`) before trusting §1/§3.
3. Confirm the flag states in Vercel match §1's inventory (they are owner-controlled and may
   have changed).
4. Pick from §3 in order (3a is the owner's own ask; 3b unlocks the veteran card's best panel),
   or execute the owner's specific instruction. Build flag-dark, review adversarially, stop at
   every HUMAN gate.
