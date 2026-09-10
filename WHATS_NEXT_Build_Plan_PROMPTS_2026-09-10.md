# Ready-to-paste prompts — the build plan for the live two-sided test (2026-09-10)

Register (the plan, the order, the chains, the owner questions):
`/Users/icecasasola/Documents/Claude/Projects/Setnayan/WHATS_NEXT_Build_Plan_2026-09-10.md`

**How to launch a session:** paste the **SHARED HEADER** below, then that session's block. Every block
also tells the session to read the header from this file if it was given the block alone. Respect the
waves and chains in the register § 3: at most three code sessions at once, never two on one file.

---

## SHARED HEADER — paste this first, every time

```
You are one session of a multi-session build for Setnayan, a Philippines-first life-events platform.
Assume NO memory files exist — everything you need is in this header, your session block, and the
register at /Users/icecasasola/Documents/Claude/Projects/Setnayan/WHATS_NEXT_Build_Plan_2026-09-10.md
(read its § 2, § 3 and your session's card in § 4 before starting).

THE OWNER'S GOAL — a LIVE TWO-SIDED TEST, in his words:
  "test the whole vendor and user build to look for the vendor's service cards until they negotiate,
   book, and lock" · "fixing the vendor's service card creation, chat page, and the whole interface
   around it until they lock and continue to adjust pricing."
  Also: "our goal is to let them integrate their event with the vendor they find. not to let them
  communicate outside the app" · "design it properly. not creating a new shell but improving what we
  have" · "make sure that we are adding value and not deleting feature".

WHERE THINGS LIVE
  Code (canonical): /Users/icecasasola/Documents/Claude/Projects/setnayan-platform  (github iscasasola/setnayan-platform)
  Spec corpus:      /Users/icecasasola/Documents/Claude/Projects/Setnayan
  ⛔ NEVER read code from /Users/icecasasola itself — a stale checkout ~750 commits behind lives there and
     produces confident, line-numbered, wrong findings.
  Build in a worktree BESIDE the repo, never in /tmp:
    git -C /Users/icecasasola/Documents/Claude/Projects/setnayan-platform fetch origin
    git -C /Users/icecasasola/Documents/Claude/Projects/setnayan-platform worktree add \
      /Users/icecasasola/Documents/Claude/Projects/wt-<SESSION-ID> -b claude/<slug> origin/main
  Then `pnpm install` in the worktree BEFORE running anything. Commit before your first mutation test;
  push early. After your PR merges: `git worktree remove <path> --force && git worktree prune`
  (each worktree is 1–2 GB; a full disk kills every command). Clear .next from any worktree you keep.

HOUSE RULES — each one has cost real time
  1. RULE 0 — FIND IT BEFORE YOU BUILD IT. This is ~2 years of code; assume it exists. Before any code:
     grep the feature noun in apps/web/app and apps/web/lib; open the design whose NAME matches; grep
     DECISION_LOG.md. Write one line each: what exists · what is missing · the delta. Extend, never
     re-draw. Never ask the owner a question the decision log answers.
  2. VERIFY, DON'T TRUST. A doc is not evidence — the register included. A PR's state is what
     `gh pr view <n> --json state,isDraft,mergeable,mergedAt,headRefOid` says. A migration comment is not
     evidence — read the live object (pg_get_functiondef, information_schema) in production, read-only.
     An empty column in production is not a missing mechanism (prod is pre-launch and nearly empty) —
     grep for the WRITER. A search that cannot match proves nothing: use `git --literal-pathspecs grep`
     for [slug] paths; in zsh write ${VAR}:path, never $VAR:path.
  3. MERGED ≠ SHIPPED. Done means production's /api/health version contains your merge commit BY
     ANCESTRY: curl -s https://www.setnayan.com/api/health  →  git merge-base --is-ancestor <merge> <served>.
  4. TESTS: require a non-zero `# tests N` count. `npx tsx --test "app/[slug]/…"` runs 0 tests and exits
     green — so does the "[[]slug[]]" escape. Use `npx tsx <path>` (no --test) or a **/<name>.test.ts
     glob. Typecheck: print TSC_EXIT beside the error count; exit 134/144 with an empty log is NOT clean.
     `server-only` is not installed for node:test — split pure logic into its own module. test:unit only
     globs lib/** and app/**.
  5. MUTATIONS: every sabotage prints its occurrence count before → after, and must go RED. A sabotage
     that did not land reports a pass. Commit first; restore from an explicit backup, never from the git
     index. Strip comments before matching source.
  6. GENERATED FILES (supabase/security/exposure-surface.baseline.txt, apps/web/scripts/port-control-
     baseline.json, lib/admin-map/*.generated.ts, tests/db/user-fk-behaviour.generated.txt): on conflict
     REGENERATE from the merged tree — never pick a side; a clean auto-merge of one once produced a header
     that disagreed with its body. Read the diff before accepting a regenerated baseline.
  7. DATABASE: Supabase returns { error } for a phantom column, enum value or RPC argument — it does not
     throw, so check `error` on every read. Service-role reads bypass all RLS — the app gate is then the
     whole fence. RLS is a floor, not a scope. A FOR ALL own-row policy admits INSERT/DELETE and says
     nothing about columns. Allocate migrations with `pnpm migration:new`; a low prefix STILL applies in
     prod (`db push --include-all`). The PGlite replay runs as superuser, so rehearse a risky migration in
     production inside BEGIN … ROLLBACK (the permission prompt is the approval); otherwise verify the live
     object after deploy.
  8. PRODUCTION IS READ-ONLY for you (GET requests and SELECTs), apart from an approved rolled-back
     rehearsal. Never flip a production flag. Never `db push` by hand.
  9. GIT: never `git stash` (global stack shared by sessions); never `git add -A` (stage by path); never
     `git reset --soft origin/main`; before every push check `git diff --diff-filter=D origin/main..HEAD`.
     Other sessions push concurrently — fetch and read the tip before building; never force over work you
     have not seen. Never re-run CI by hand (workflow_dispatch) and never close+reopen a PR (it disarms
     auto-merge).
 10. PAPERWORK: add changelog.d/<branch-slug>.md with a dated `## YYYY-MM-DD · type(scope): summary`
     block and a `SPEC IMPACT:` line (even "None"). Never edit CHANGELOG.md or STATUS.md. If SPEC IMPACT
     is not None, edit the corpus directly and append a row at the BOTTOM of DECISION_LOG.md
     (append-only; on conflict keep both sides in date order; stage by path).
 11. PRs: after `gh pr create`, run `gh pr merge <n> --auto --merge` — the default. EXCEPTION: money,
     security-grant or owner-gated work opens as a DRAFT (`gh pr create --draft`), because a workflow arms
     auto-merge on every non-draft PR ~12 s after it opens. Commit messages end with
     `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`; PR bodies end with
     `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
 12. PRODUCT: never re-type a price (read platform_retail_catalog_v2 / vendor_billing_catalog); the
     booking fee is never "commission". The Tailwind slot `terracotta` is the GOLD (fails as text) — the
     action colour is `mulberry`; use mulberry-600, not -700, on tinted blocks. A fix nobody can reach is
     no fix — check every arm, signed out included. Do not delete features.
 13. REPORTING: your final reply to the owner is plain English about what a PERSON experiences — no file
     paths, function, table or flag names. Decide and act on reversible work; bring the owner only prices,
     scope, risk trade-offs or reversing one of his rulings.
```

---

## A1 — A supplier can publish a card without the Setnayan gift (land #5373 whole)

```
(Paste after the SHARED HEADER. If you have only this block, first read the SHARED HEADER at the top of
/Users/icecasasola/Documents/Claude/Projects/Setnayan/WHATS_NEXT_Build_Plan_PROMPTS_2026-09-10.md.)

GOAL (owner, 2026-09-09): "exclusive setnayan gift then should be optional" · "it is either a yes or a
no". A supplier must be able to publish a card with a price and no gift.

WHAT EXISTS: PR #5373 (draft) already contains #5375 (merged into its branch 06:41Z, NOT into main):
migration 20271215941485 (publish trigger stops requiring the gift; price still required) and
20271216515644 (save_vendor_service loses the "exclusive required" RAISE; an absent perk key means
UNCHANGED instead of erasing; adds includes_setnayan_gift BOOLEAN NOT NULL DEFAULT FALSE, no backfill).
No later migration on main redefines either function. At 10:13Z it was MERGEABLE, head c31b0be, and
another actor had merged main into it at 09:45Z. #5377 (auto-merge armed) will land first and re-conflict
#5373 on the exposure-baseline header.

DELTA — nothing to build:
 1. `gh pr view 5373` — if another session is actively driving it, only watch it to merge and do step 7.
 2. After #5377 lands: merge origin/main into the branch; REGENERATE the exposure baseline (and the
    port-control baseline if its guard asks) from the merged tree; confirm the only content line #5373
    adds is the includes_setnayan_gift grant line.
 3. CI green including db tests.
 4. Rehearse both migrations against production inside BEGIN … ROLLBACK (ask; if declined, rely on the
    replay and verify the objects after deploy).
 5. Reply to the two stale "DO NOT MERGE ALONE — does not touch save_vendor_service" comments (now false).
 6. Add one PR line: the "yes" state promises Papic credits that nothing grants until session C1.
 7. Mark ready and merge as ONE change — never the gate without the save function.

GATE: none. MAY TOUCH: #5373's own files and the two generated baselines. MAY NOT TOUCH: anything
outside #5373's diff; do not run alongside B1, C1, B2, D4.

PROVE IT: gh shows MERGED · /api/health served version has the merge commit as ancestor · read-only:
pg_get_functiondef of enforce_service_publish_gate and save_vendor_service contain no exclusive
requirement · the column exists, default false · SELECT exclusive_perk_text FROM vendor_services still
returns both live cards' original text ("Free 1-hour extension for Setnayan couples", "FREE"). Do not use
/explore as the check — it never renders the gift text.
```

## A2 — "Lock this deal" can no longer lock without a price

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: the owner wants to test "until they negotiate, book, and lock". Today a Deal struck in chat before
the supplier sends a formal quote shows "🔒 Lock this deal"; pressing it books nobody, freezes the thread
with agreed price NULL, sends the supplier "Deal locked", and the card says "Price agreed and frozen at
this amount." Nobody may be told "locked" or "frozen" unless a price was saved and a booking was asked.

WHAT EXISTS: app/_components/negotiation-actions.ts `lockDeal` (~852–918): skips bookVendorAtChatLock
when newTotalPhp (lib/proposal-amendments.ts ~47) returns null for a missing base proposal, but still
stamps locked_at, freezes agreed_price_centavos = NULL and emits the notice. chat-amendment-card.tsx
(~243–249) renders the Lock with no price; lockFreezeLine's `none` arm claims a frozen amount. The
handshake RPC vendor_agree_to_lock is correct — do not touch it. No branch/PR covers this.

START ONLY AFTER #5402 HAS MERGED (it edits negotiation-actions.ts) — check with gh.

DELTA:
 1. Card: offer Lock only when the amendment has a base-proposal total; otherwise one plain line asking
    the shop to send its quote first.
 2. lockDeal refuses, with a visible outcome, when the total is null — no freeze, no "Deal locked".
 3. The `none` arm of the freeze line can no longer claim a frozen amount.
 4. A guard test over the card and the action (derive the file set; strip comments), mutation-checked
    with counts printed. No migration.

GATE: none. MAY TOUCH: negotiation-actions.ts, chat-amendment-card.tsx, a new lib test (read
proposal-amendments.ts). MAY NOT TOUCH: vendor_agree_to_lock, the handshake, budget files (B2 owns them).
Do not run alongside B2.

PROVE IT: merged + served by ancestry; the test (non-zero count) proves no Lock on a no-quote Deal and a
refused lockDeal; read-only prod shows no chat thread locked with a NULL agreed price; add a line to the
register's T1 owner script: "strike a Deal before any quote — no Lock button appears".
```

## A3-WATCH — the doors out of the app (PR #5404) — no build

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL (owner): "not to let them communicate outside the app". PR #5404 closes five exits (the public shop
page's mailto/tel, the couple's supplier card, the workspace summary, the budget card's pre-filled
address, contact fields riding in the Vendors page payload). It had auto-merge armed at 10:20Z.

DO: watch it with gh until MERGED; do not edit it. Then prove it shipped:
  · /api/health served version has #5404's merge commit as ancestor
  · curl -s https://www.setnayan.com/setnaprod contains neither "mailto:iscasasolaii" nor "tel:+63917"
  · the band shop page (https://www.setnayan.com/saysay-live-band-and-hosting-fix) still shows a working
    signed-out inquiry form.
Report in plain English. If it fails CI, report why and stop — do not force it.
```

## A4 — After a couple accepts a quote, the next step is on screen

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: the test path is "negotiate, book, and lock". After a couple presses "Accept proposal", the page
shows only "Accepted on <date>" and a Back link. Accepting only shortlists the shop at a price; booking
means asking the shop to lock. Nothing tells the couple that — a dead end on day one of the test.

WHAT EXISTS: app/proposals/[publicId]/page.tsx — respondToProposal → respond_vendor_proposal
(production body shortlists with a price; does not book). The couple's lock is finalizeVendor in
app/dashboard/[eventId]/vendors/actions.ts (~879), which ASKS the supplier (handshake ON).

DELTA: RULE 0 — find the shipped Lock control for one supplier on the couple's vendors page and whether it
has an anchor/deep link. Then, couple side only, on the accepted state: one short next-step block, e.g.
"You've accepted. To book them, ask {shop} to lock — once they confirm, it's booked." with a link to that
supplier's Lock (or a button reusing an existing action if that is clean). Check what the chat shows after
an accept; if its quote card also dead-ends, give it the same line. No new server action, no migration.
Guard it with a test.

GATE: none. MAY TOUCH: the proposal page, possibly the chat proposal card, a test. MAY NOT TOUCH:
negotiation-actions.ts / chat-amendment-card.tsx (A2), the vendors lock actions' behaviour.

PROVE IT: merged + served; test (non-zero) proves the accepted couple-side state renders the next step and
a link that resolves to the Lock; add the owner tap to the T1 script.
```

## A5 — A locked supplier leads its group on the couple's list (land a stranded fix)

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: after the test locks a supplier, the couple's list should show that shop first in its category,
not sorted like a candidate.

WHAT EXISTS: commit e67420406e on origin/claude/plan-name-overwrites ("fix(bench): a locked vendor leads
its category instead of sorting like a candidate", mutation-checked) is NOT on main (`git cherry` shows
+; main's lib/bench-sort.ts has no hoistLocked). Its PR #5222 merged without it.

DELTA: cherry-pick it onto a fresh branch from origin/main as its own PR; resolve against today's code;
run bench-sort.test.ts with a non-zero count; re-apply one sabotage with the count printed. Leave the
sibling stranded commit 1ca4989f8c alone (listed in the register, out of scope).

GATE: none. MAY TOUCH: lib/bench-sort.ts, its test, a changelog fragment. PROVE IT: merged + served;
`git grep hoistLocked origin/main -- apps/web/lib/bench-sort.ts` matches.
```

## B1 — No service card goes live without a name (land #5387)

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: every card a couple sees has a name. A nameless card becomes "<kind> by <shop>" (owner-locked);
the supplier's own words always win. Both live production cards have title NULL today.

WHAT EXISTS: PR #5387 (draft, MERGEABLE, head 17f84dc557): trigger fill_blank_service_card_title firing
before the publish gate, migration 20271217522970, no backfill. Its CI ran before #5388 turned
vendor_profiles' authenticated read into a per-column allowlist.

START ONLY AFTER A1 (#5373) HAS MERGED (shared services/actions.ts).

DELTA: update from main; re-run CI; confirm business_name, verification_state and name_revealed_at are
all readable under the new allowlist; rehearse in BEGIN … ROLLBACK against production; note in the PR
that for live_band the database display name is the wedding-only "Wedding Bands (full ensemble)" — do not
widen the PR, the owner types real titles as test prep; mark ready and merge.

GATE: none. MAY TOUCH: #5387's files. MAY NOT TOUCH: other card files (C1 comes later).
PROVE IT: merged + served; read-only prod shows the trigger on vendor_services; db test (non-zero) proves a
blank title is filled and a typed title wins.
```

## B2 — After a lock, a price change shows both numbers (rework and land #5390)

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL (owner 2026-09-09, do NOT re-ask): "Both, shown separately" — after a lock the couple's budget shows
the agreed total AND the change as its own line; a price cut never becomes a negative bill.

WHAT EXISTS: PR #5390 (draft, CONFLICTING, CI red on "the couple's voice is gone from the locked notice"
because its last merge took #5393's freezeLine). Migration 20271218458148 re-signs accept_change_order,
adds is_change_delta, drops the non-negative CHECK. On main: a −₱15,000 change on ₱100,000 would bill
−₱15,000, and the post-lock Deal path (refresh_fee_only in lib/chat-lock-booking.server.ts, from #5355)
OVERWRITES total_cost_php — the PR does not cover that branch.

START ONLY AFTER A1, A2 and #5404 HAVE MERGED.

DELTA:
 1. Decide which lock sentence is TRUE and make code and test agree — never just silence the test.
 2. Rebase; regenerate the exposure baseline from the merged tree, reading the diff first.
 3. Make the post-lock Deal reprice record a change beside the agreed total too.
 4. Re-measure the PR's "safe by arithmetic" claim against production, read-only.
 5. Rehearse the migration in BEGIN … ROLLBACK against production.
 6. KEEP IT A DRAFT — the owner looks before merge (money function). Tell the orchestrator when ready.

GATE: owner ACTION — his look. MAY TOUCH: #5390's files + lib/chat-lock-booking.server.ts. MAY NOT
TOUCH: negotiation-actions.ts beyond what A2 left. Do not run with C1 or D4.

PROVE IT: merged after the look; served; read-only prod: accept_change_order body carries is_change_delta;
db tests (non-zero) prove a post-lock Deal and a change order both keep the original total with the change
beside it; add the owner tap to T1.
```

## B3 — Deploy headroom, then the Next.js security update (#5397)

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: a critical-rated Next.js security release lands, and no ordinary merge can suddenly stop every
production deploy.

WHAT EXISTS: #5397 (Next 15.5.21 → 15.5.24, auto-merge armed) fails "Vercel": the server function
vendor-dashboard/clients/[eventId]/mood-board is 252.37 MB against Vercel's 250 MB limit; and "bundle size
check": 201.5 KB vs a 201 KB budget. On main that function sits just under the ceiling. Vercel project
prj_7VTNk7sjPejgXNsSkZsyiPQRLnwA, team team_dHILOMWD1LWoDGDT5udD8JV5 (build logs are readable).

DELTA: find what the file tracer drags into that function; slim it (targeted outputFileTracingExcludes,
or a dynamic import of the heavy dependency); state size before/after from the Vercel build log. Trim
0.5 KB or raise the bundle budget with a logged reason. Let #5397 merge. Do NOT ask the owner for
VERCEL_SUPPORT_LARGE_FUNCTIONS unless slimming fails.

GATE: none. MAY TOUCH: apps/web/next.config.ts, the mood-board route tree, the bundle budget config.
PROVE IT: #5397 MERGED; its production deploy READY; /api/health a descendant; stated headroom.
```

## C1 — The Setnayan gift actually reaches the couple (EX-2)

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: when a supplier says "yes" to the gift, the couple really receives free Papic credits sized to the
booking, and the quote shows the number. All five owner gates are closed: 40% of the booking fee as a
ceiling · fee derived from lib/booking-fee.ts · credits interpolated along the live Papic ladder · capped
at the 50,000-credit rung · the count on the quote, never the card.

THE CAP — ALREADY RULED, DO NOT ASK (DECISION_LOG 2026-09-09, "THE GIFT IS CAPPED AT 50,000 PAPIC CREDITS"):
grant = min(40% of the booking fee, the price of the 50,000-credit rung). The supplier is charged for the gift, so
THE CHARGE CAPS WITH IT: above the cap they pay fee + that rung's price, not fee + 40%. It binds at about a
₱3,350,000 booking (fee ₱37,500). ⚠ Implement the cap on CREDITS, then price it: read the 50,000 rung from
platform_retail_catalog_v2 at its REGULAR price. Never hard-code ₱15,000, or the cap becomes a different number of
photos the day that rung is repriced. The 100,000 rung stays on sale to couples; it only comes off the gift ladder.
⛔ The old register's G1 "no cap" (SESSIONS_Chat_Bench_Exclusive_2026-09-09.md) is SUPERSEDED.


BRIEF: use session EX-2 in /Users/icecasasola/Documents/Claude/Projects/Setnayan/SESSION_PROMPTS_2026-09-09_WAVE2.md
as the specification. Do not re-plan it. RULE 0 still applies — re-measure against today's main.

START ONLY AFTER A1, B1 and B2 HAVE MERGED.

GATE: none to build — open as a DRAFT (money + grant). MAY TOUCH: card/quote files, lib/booking-fee*.ts,
the Papic grant path, lib/chat-lock-booking.server.ts if needed, a migration, the exposure baseline (after
B2's change). MAY NOT TOUCH: the Papic ladder prices.

PROVE IT: merged after review; served; db tests (non-zero) prove the grant amount and the cap; a test quote
shows the credit count. The pot actually growing is checked in the booking-fee test round — nothing clears
before then (fee not enforced; a verified shop's first 5 sourced bookings are free).
```

## C2 — Marketplace cards show their photo and a proper service name

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: the couple's first impression in the test. A card with a cover photo shows it on the main grid;
labels read "Host / MC", not "Host Mc".

WHAT EXISTS: #5384 fixed the cover address, but the grid/folder model (lib/service-card-view-model.ts
~243) reads showcase photos only — the cover appears only in search. displayServiceLabel (lib/vendors.ts
~514) title-cases codes. The proper labels ALREADY exist in a pure map: WEDDING_TILE_LABEL in
lib/taxonomy.ts (~563: host_mc 'Host / MC', live_band 'Live Band').

DELTA: grid/folder card falls back to the cover when there are no showcase photos; displayServiceLabel
consults WEDDING_TILE_LABEL first, title-casing as fallback (no database call, no call-site changes);
tests for both. No admin data action.

START AFTER #5404 AND A1 HAVE MERGED. GATE: none. MAY TOUCH: lib/service-card-view-model.ts,
lib/vendors.ts, the marketplace card component if it builds its own label. MAY NOT TOUCH:
app/v/[slug]/page.tsx (D2 owns it).
PROVE IT: merged + served; signed-out GET /explore carries the cover URL on the card that has one in the
default grid, and "Host / MC" appears.
```

## C3 — The admin verification desk (land #5394)

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL (owner 2026-09-09): "we need to be informed which on the verification needs manual checking … we want
an automation to also tell us if there are mismatches." The reviewer sees a result per check, can open
each paper, and can vouch for a shop (reason + 182-day deadline — the owner's 2026-09-07 rulings).

WHAT EXISTS: PR #5394 (draft, "DO NOT AUTO-MERGE", MERGEABLE, head ed52d5a5ec). CI red on ONE TypeScript
error: app/admin/verify/the-reviewer-can-open-the-paper.test.ts:332 (`select![1]` under
noUncheckedIndexedAccess). Mounting the vouch is decided inside the PR.

DELTA: fix the token; update from main; regenerate admin-map inventories if the guard asks; strike the
PR-body paragraph about /admin/verification-docs (fixed by #5398). MERGE WITH APPROVE STILL WARNING — that
is the standing ruling ("THE BUTTON WARNS; IT DOES NOT REFUSE", DECISION_LOG 2026-09-10). Refusing is a
later one-line follow-up if the owner asks for it.

GATE: none. MAY TOUCH: #5394's files. Do not run with E3.
PROVE IT: merged + served; its tests (non-zero) pass; /admin/verify renders per-check results (test).
```

## D1 — Fold 5: "Want to add them to your event?"

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL (owner 2026-09-10): "Want to add them to your event. [Link/Create and Event] shows their on going
events and a create event icon." Today a shop lands on a couple's list only as a side effect of Inquire,
silently, onto the first event.

START ONLY WHEN: the owner has viewed the P1-corrected drawing
(/Users/icecasasola/Documents/Claude/Projects/Setnayan/prototypes/vendor_public_page_universal_2026-09-10.html,
section F) AND #5404 has merged AND no other session is editing app/v/[slug]/page.tsx.

WHAT EXISTS — REUSE, DO NOT REBUILD:
 · app/_components/marketing/add-to-event.tsx + add-to-event-data.ts + add-to-event-cta.tsx, guarded by
   add-to-event-is-the-only-difference.test.ts — the shipped "pick which event" picker with a create row,
   owner-ruled 2026-08-21 ("the ongoing and upcoming only"), filtered ON THE SERVER so a stranger never
   receives event names. Today it navigates via addOnHref.
 · saveVendorToPicks (app/(shell)/explore/actions.ts ~186–200) validates a posted event_id
   (not_your_event / no_primary_event).
 · startServiceInquiry accepts a validated eventId; the public composer never passes one.
 · The signed-out composer already asks the event type (destinationFor).

DELTA: mount the shipped picker on the shop page per the drawing, its action generalised to call
saveVendorToPicks for a shop, keeping server-side filtering and its existing guard green. Signed out: the
existing sign-in-over-the-page, then the list. Pass the chosen event into the inquiry composer. Replace the
two hardcoded /onboarding/wedding fallbacks in inquiry-composer.tsx (~454, ~506) with the create-event type
picker. No new table, no new server action. Regenerate the port-control baseline from the merged tree.

GATE: owner has viewed the drawing. MAY TOUCH: app/v/[slug]/page.tsx, the add-to-event trio,
inquiry-composer.tsx, anon-inquiry-composer.tsx, inquiry-actions.ts (pass-through). MAY NOT TOUCH: the
picker's server-side filtering rule.
PROVE IT: merged + served; tests (non-zero) prove Add posts the chosen event and a stranger gets no event
names; test round 2 (owner taps): with two events, Add on B puts the shop on B's list (read-only prod row)
and a later inquiry opens under B.
```

## D2 — The shop page tells the truth

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL (owner 2026-09-10): "songs they play is for a music performer. not for everybody." · a page never
shows "a stock photo, a zero, or an empty chart" (row 3838) · a downgrade REVERTS the paid look.

WHAT EXISTS: public songs block gated only on repertoire.length (app/v/[slug]/page.tsx ~2382). TWO music
rules disagree: isMusicVendor/MUSIC_CANONICALS in lib/songs.ts (live_band, choir, orchestra,
wedding_singer, dj) and SPECIALIST_TOOLS in lib/vendor-service-tools.ts (~178: band_dj, string_quartet,
choir) — the latter matches none of the test band's cards (live_band, host_mc), so its Services › Tools
tab never offers the song bank. More-tools (shop/shop-tool-shelves.ts) lists Repertoire for everyone;
repertoire/actions.ts checks nothing. yearsInBusiness prints 0 (~2181, ~3073). tierCaps, micrositeCan,
isTrueNameTier, boothTierCanBrand read tier_state without tier_expires_at (the file's own comment requires
both; vendorSeoPlanForVendor already does the collapse).

START AFTER #5404 HAS MERGED, and only when no other session edits app/v/[slug]/page.tsx.

DELTA:
 1. ONE music rule for the public block, addRepertoireSong (refuse), the More-tools card and
    SPECIALIST_TOOLS.repertoire: the union of MUSIC_CANONICALS and the existing specialist categories.
    Widen, never drop; gate, never delete. Leave the moodboard's owner-locked category alone.
 2. Never print a zero: years < 1 prints nothing. Do NOT add "Started <year>" — the drawing replaces this
    line later (F1).
 3. Compute the effective plan once at the top of renderVendorBySlug; pass it to the four gates; test a
    past end date renders the Free look.
 4. "Wedding compatibility" and the "Wedding vendors" breadcrumb become event-neutral.

GATE: none. MAY TOUCH: page.tsx, repertoire/actions.ts, lib/vendor-service-tools.ts,
lib/vendor-experience.ts, shop-tool-shelves.ts, tests. MAY NOT TOUCH: lib/vendors.ts (C2).
PROVE IT: merged + served; GET /setnaprod has no "0 | yrs"; the band page still shows its songs; tests
(non-zero) prove a non-music shop cannot add a song, the band's Tools tab offers the song bank, and a lapsed
plan renders Free.
```

## D3 — The old 12-document verify page leads to the new papers section

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: "Get verified" anywhere lands on the one current papers screen, not an old page promising "12
documents" to "unlock Pro Vendor".

WHAT EXISTS: app/vendor-dashboard/verify/page.tsx (701 lines) is live; linked from on-the-day/page.tsx
(~635); the no-profile redirect of 6 routes; in the bottom nav and nav registry. The current flow is My Shop
#get-verified (#5395).

DELTA: redirect /vendor-dashboard/verify → /vendor-dashboard/shop#get-verified keeping query params (copy
the /vendor-dashboard/services redirect pattern); repoint the Event Hub link and nav entries; keep the old
page's server actions until nothing calls them (grep). Regenerate the port-control baseline from the merged
tree.

GATE: none. MAY NOT RUN WITH: E2, G1–G3. PROVE IT: merged + served; test proves the redirect keeps params;
lint-port-no-lost-controls green.
```

## D4 — #5140 (every film of your day) and close #5012

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: Live Studio buyers can attach every film of their day, as the live /pricing page promises
("unlimited video-link uploads"); nothing stale lingers.

WHAT EXISTS: #5377 needs NOTHING (it lands itself). #5140 (auto-merge armed, CONFLICTING, ~804 behind;
conflicts only in two generated files; adds table event_films). #5012 is superseded by #5378 (merged
2026-09-09) plus commit 2f04ea6fa8.

START AFTER B2 HAS MERGED (shared baseline header).

DELTA: merge main into #5140; regenerate tests/db/user-fk-behaviour.generated.txt and the exposure baseline
from the merged tree; re-read its migration against today's schema; CI green — auto-merge then ships it
(intended). Check #5012's second commit is covered by 2f04ea6fa8, then close #5012 with a note. Do not
rebase #5012.

PROVE IT: #5140 MERGED and served; #5012 CLOSED.
```

## E1 — A shop's link preview never breaks

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL (owner): "a universal representation of a vendor that they will be proud of to share to the public".
Today a shop with a logo gets a preview image that expires after 24 h (X-Amz-Expires=86400); a shop without
a logo gets none (its page's own Open Graph replaces the site card).

WHAT EXISTS: app/api/og/u/[slug]/route.ts draws 1200×630 cards for people with a brand fallback; no shop
OG route exists.

START AFTER D2 (and D1 if it went first) HAVE MERGED — shared page.tsx.

DELTA: app/api/og/v/[slug]/route.tsx modelled on /api/og/u with the same hide-if-hidden, hide-if-demo and
name-anonymity checks as vendorMetadataBySlug; point og:image, twitter:image and the structured-data image
at it; description from category · city · Verified when there is no tagline; look from the drawing's
share-card panel.

PROVE IT: merged + served; both shop pages' og:image has no X-Amz parameter and returns 200 image/png.
```

## E2 — No phone or email in a shop's own About or tagline

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: applying the owner's settled rules (2026-07-23 chat; 2026-07-27 card text: "no placing of contact
information or anything to bypass our app") to the shop's About and tagline. This is NOT an open decision.

WHAT EXISTS: the detector ships for chat and card text (both flags ON). The tagline save
(app/vendor-dashboard/shop/public-line-actions.ts) and the About save (app/vendor-dashboard/actions.ts ~900,
microsite_about) do not call it.

DELTA: run the same detector on both saves, with the card-text wording and refusal UX; do not touch the
shop's own website field (owner question). Tests + mutation check.

START AFTER #5404 HAS MERGED. MAY NOT RUN WITH: D3, G1–G3, anything on app/vendor-dashboard/actions.ts.
PROVE IT: merged + served; tests (non-zero) prove a save containing a phone number is refused.
```

## E3 — Verify and open the round-6 government-ID delete guard

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: the one button that permanently deletes government IDs is protected by tests that would really fail.

WHAT EXISTS: branch claude/the-last-gate-is-guarded fe1217634d (1 commit, no PR, merges clean): moves
read → judge → delete into performVerificationDelete and verificationDocShelves. It claims six sabotages
went green-then-red at 90/90; nobody re-ran it.

START AFTER C3 HAS MERGED.

DELTA: worktree at the branch merged with main; pnpm install; run its test (non-zero count); typecheck with
TSC_EXIT; re-apply the six sabotages named in its changelog with counts printed, each RED;
lint-port-no-lost-controls. Open as a DRAFT with the six measurements in the body.

PROVE IT: draft PR with measurements; merged after a look; served.
```

## E4 — Close the database door to a shop's email and phone

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL (owner): "not to let them communicate outside the app". The pages no longer print a shop's email or
phone (#5404), but production still grants vendor_profiles.contact_email SELECT to `anon` and
contact_phone to `authenticated` — one PostgREST call away.

WHAT EXISTS: vendor_profiles runs a per-column read allowlist (#5388) — follow that pattern.

START AFTER #5404 AND D4 HAVE MERGED (baseline chain).

DELTA: read the live grants (information_schema.column_privileges AND table-level grants — a column revoke
is inert against a table-level grant). Grep every user-session reader of both columns (the shop's own
dashboard, the claim flow, admin, a booked coordinator's hosts page — all kept on purpose by #5404); move
each to a server read scoped by a session-proved id where needed; then revoke both columns from the public
roles. Rehearse in BEGIN … ROLLBACK. DRAFT PR (security grant).

PROVE IT: merged after review; served; read-only prod shows neither column readable by anon/authenticated;
a test proves the shop's own dashboard still shows its contact details.
```

## F0 — Correct the six-door My Shop drawing (corpus only)

```
(Paste after the SHARED HEADER — or read it from the top of this file.) Model: Fable.

GOAL: the owner reviews a My Shop redesign that loses nothing ("adding value and not deleting feature").

FILE: /Users/icecasasola/Documents/Claude/Projects/Setnayan/prototypes/shop_page_2026-09-10.html — EDIT, never redraw.
Read today's shipped My Shop first (apps/web/app/vendor-dashboard/shop/page.tsx on origin/main, read with
`git show origin/main:<path>`).

ADD homes for what its inventory omits: the Services manager's specialist Tools tab (song bank, moodboard,
day-of, recaps, manpower per trade) · Packages link · off-season nudge · Instagram sign-in return · anchors
and aliases (#get-verified, #manage-shop, #auto-reply, #earnings, ?open=, ?tab=, services deep links) · the
"address for good" note · the papers section opening itself at 100%. Door 4's inbox line reads the add-on
ENTITLEMENT, never the switch. Repertoire only for music trades (union of MUSIC_CANONICALS and the existing
specialist categories). Add row 3838's "see what Solo adds" preview in the shop's own editor. Correct "permit
expiry not kept" (next_renewal_due_at is written at approval). Add a table "every shipped control → its
door" for G1 to turn into a guard.

Do NOT commit — the orchestrator commits the corpus. PROVE IT: every shipped My Shop component and anchor
appears in the table.
```

## P1 — Correct the universal shop-page drawing before the owner sees it (corpus only)

```
(Paste after the SHARED HEADER — or read it from the top of this file.) Model: Fable.

GOAL: a drawing the owner signs off becomes binding — so its prices and promises must be true first.

FILE: /Users/icecasasola/Documents/Claude/Projects/Setnayan/prototypes/vendor_public_page_universal_2026-09-10.html
(finished, corpus commit 6d20835, 1,410 lines). EDIT, never redraw.

FIX (measured):
 · "Enterprise (₱8,000/mo)" (~779) and "₱8,000 / mo" (~927) — read the real figure from production
   vendor_billing_catalog (read-only) or the live https://www.setnayan.com/vendors page; never retype from
   memory.
 · "DTI or SEC registration matched against the government record" (~769) — no registry lookup is built;
   draw each receipt line as "checked by a person at Setnayan", printed only when that check passed; the
   video-call line prints only when a call was recorded.
 · "Registered 2019, read off their BIR certificate" (~656, ~770) — no paper reader is built and no year
   is stored; draw "no year printed until one is recorded" and name recording it as unbuilt.
 · Keep the two-column desktop layout Pro-and-up and About Solo-and-up (2026-07-03 ladder) — a drawing
   without a gate is not a decision to remove one.
 · Note fold 5 reuses the shipped add-to-event picker.
 · One line for the viewing: row 3838 ("never a stock photo, a zero, or an empty chart") supersedes the
   2026-06-04 stock-photo directive.
ALSO: the untracked prototypes/shop_website_by_tier_2026-09-10.html has three errors (Enterprise price, the
retired films rack drawn as new, portfolio drawn Pro-only) — correct it or put a "superseded — see the
universal drawing" banner on it.

Do NOT commit. PROVE IT: grep finds no "8,000", no "government record", no "read off their BIR" in the file.
Tell the orchestrator, in plain English, that it is ready for the owner to view.
```

## F1 — The universal shop page, part 1: the calling card

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL (owner): "a universal representation of a vendor that they will be proud of to share to the public" ·
"we have different looks for free, solo, pro and enterprise" · "not creating a new shell but improving what
we have".

START ONLY WHEN: the owner has viewed the P1-corrected drawing AND #5404, D1, D2, E1 have merged AND no
other session edits app/v/[slug]/page.tsx.

WHAT EXISTS: renderVendorBySlug (app/v/[slug]/page.tsx, ~3,987 lines); the binding Detail archetype
prototypes/archetype_content_editorial_gallery_detail_2026-08-01.html (owner-approved 2026-08-04); the
corrected universal drawing.

DELTA: port the drawing's top onto the existing renderer with existing data — hero identity, a fact row of
only true facts (no zeros), the receipt printed from real check results, no stock photo, no empty chart.
Plan gates stay as shipped (About Solo+, two-column Pro+). Keep every shipped control
(lint-port-no-lost-controls).

PROVE IT: merged + served; /setnaprod and the band page match the drawing's top at phone and desktop
width; no "0" fact; no placeholder photo.
```

## F2 — The universal shop page, part 2: body, reviews, message bar

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

START AFTER F1 HAS MERGED. DELTA: port the body per the drawing — services, portfolio, reviews; a
zero-review shop shows one calm line instead of five empty bars (row 3838); Pro-only stays Pro-only; the
shop's own website/social links follow the owner's answer to question 3 in the register (if unanswered,
leave them exactly as shipped). PROVE IT: merged + served; no "0" review bars; lint-port-no-lost-controls
shows no lost destination.
```

## G1 — Six-door My Shop, part 1: hero, rail, door 1

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL (owner): easier to fix "shop profile, shop website and service cards" — "improving what we have".

START ONLY WHEN: the owner has viewed the F0-corrected drawing AND D3, E2 have merged.

DELTA: port the hero, rail and door 1 (shop information + papers) onto apps/web/app/vendor-dashboard/shop/
page.tsx; re-mount, never rewrite, every moved component; every anchor and alias opens its door; a guard
derived from F0's table fails if a shipped component or anchor disappears (mutation-checked). Regenerate the
port-control baseline from the merged tree.
PROVE IT: merged + served; guard green and red under sabotage with counts printed.
```

## G2 — Six-door My Shop, part 2: doors 2 and 3

```
(Paste after the SHARED HEADER — or read it from the top of this file.)
START AFTER G1 HAS MERGED. DELTA: port doors 2 (website) and 3 (services) — keep the Tools tab and every
per-trade tool, Packages, the off-season nudge; services deep-link parameters keep working.
PROVE IT: merged + served; G1's guard green with door-2/3 items.
```

## G3 — Six-door My Shop, part 3: doors 4–6

```
(Paste after the SHARED HEADER — or read it from the top of this file.)
START AFTER G2 HAS MERGED. DELTA: port doors 4 (inbox & assistant), 5 (money), 6 (tools). The inbox line
reads the add-on ENTITLEMENT (vendor_profiles.ai_addon_expires_at live), never the on/off switch — a shop
without the add-on must never be told it is on.
PROVE IT: merged + served; guard green; nothing lost.
```

## H1-WATCH — a new meeting time from Decisions + the supplier's standing line (PR #5411) — no build

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

WATCH ONLY. PR #5411 has auto-merge armed; it shares no file with #5408, #5387 or #5390 (checked).
PROVE IT: merged + served by ancestry. On a thread where the SUPPLIER proposed a meeting time, the
couple's Decisions view offers Confirm · New time · Decline, and the supplier's thread page shows
"Where you stand with <couple> · … · waiting on them" — never "waiting on you".
If CI goes red: read the failing step, fix on the branch, never regenerate a baseline to quiet a guard.
```

## H2 — No service card goes live without a cover photo and what's included

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: a couple never meets a card that is only a price and a category word. A supplier who tries to
publish without a cover or without "what's included" is told which one is missing.

ALREADY RULED — DO NOT ASK: DECISION_LOG 2026-09-09 ("THE SETNAYAN EXCLUSIVE IS OPTIONAL"): "the
cover-photo · title · inclusions requirements stay". B1 (#5387) already covers the title.

WHAT EXISTS: after A1, PUBLISH_REQUIREMENTS = ['price'] (lib/service-publish-gate.ts ~64). The cover is a
hard blocker in lib/card-health.ts but NOT in the shared gate. Three layers enforce publishing — the app
gate, the publish trigger and save_vendor_service — and #5373 proved that moving only the TypeScript
leaves the database answering differently ("app says yes, database says no").

DELTA: add cover + inclusions to the shared gate AND to all three layers, in one change. A card that is
ALREADY LIVE and missing one is flagged in card health — never silently unpublished.
⚠ service-card-face.tsx carries S5's `footer` prop: `undefined` = draw the preview chip, `null` = draw
nothing. Keep that distinction.

START AFTER A1, B1 AND C1 HAVE MERGED (service-card chain: A1 → B1 → C1 → H2). NOT BEFORE TEST ROUND 1.
GATE: none. MODEL: opus · high. MAY TOUCH: lib/service-publish-gate.ts, app/vendor-dashboard/services/
actions.ts, lib/card-health.ts, one new migration (pnpm migration:new) re-signing the publish trigger and
save_vendor_service. MAY NOT TOUCH: anything else on the service-card chain while it is open.
PROVE IT: merged + served; read-only prod — the publish trigger's body refuses a card with no cover; the
owner's prepped test cards still save.
```

## H3 — Drag your suppliers into your own order (S8), per category

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL: long-press a supplier card and drag it; the row says "Your order" with a Reset that clears THAT
CATEGORY ONLY; keyboard move-left/right; every host of the celebration sees one order; pins beat sort; a
card they placed stays put when new suppliers arrive.

ALREADY RULED — DO NOT ASK: PER CATEGORY (owner 2026-09-09, "per category"). Keyed (celebration, tile).

BEFORE STARTING: check the register's H3 row for an owner or a branch. As of 2026-09-10 the orchestrator confirmed no one has S8: no branch, no worktree.

WHAT EXISTS: S7 (#5351) — orderInlineMoreRow orders the tail by writing back into the SAME indices, so a
protected row cannot move. Nothing stores an arrangement.
⛔ DO NOT reuse event_category_build_state.pinned_vendor_id — same word, different fact (the Build
solver's Locked pick, dark behind BUILD_3STATE_ENABLED, and a single pin where you need an ordered set).

DELTA: its own table, ONE ROW PER PIN, keyed (event_id, tile, vendor_id), ON DELETE CASCADE off
event_vendors — removing a supplier is a real DELETE (vendors/actions.ts: releaseSchedulePools then
.delete()), and manual suppliers are event_vendors rows too (20260604080000), so one FK covers every card.
RLS at CREATE TABLE time (canonical patterns only). The bench reads it.

START AFTER A5 HAS MERGED (same file). GATE: none. MODEL: opus · xhigh. MAY TOUCH:
app/dashboard/[eventId]/vendors/_components/shortlist-categories.tsx, one new migration + RLS,
supabase/security/exposure-surface.baseline.txt (regenerate AFTER merging main, read every added line),
apps/web/lib/ugat/graph.ts (CLAUDE.md rule 4). lint-port-no-lost-controls stays green with its baseline
UNTOUCHED — if it fires, put the control back.
PROVE IT: merged + served; two hosts of one celebration see the same order after a drag; removing a
dragged supplier leaves no pin row (read-only prod).
```

## H4 — A supplier can say a logged payment never arrived (after owner question 9)

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

DO NOT START until the owner has answered question 9 in the build plan's § 5. Build what he chose.

GOAL: a supplier who did not receive what the couple logged can say so, with a reason, from the Decisions
view and from the payment section; the couple sees it; a deposit goes to Setnayan to referee.

WHAT EXISTS — MEASURED 2026-09-10:
- The DEPOSIT has the whole path: reject_vendor_deposit → /admin/disputes → settle_vendor_deposit_dispute
  → the couple sees the note; fenced by the trigger guard_event_vendor_deposit_ack (migration
  20271177105435_a_dispute_is_not_an_eraser.sql holds the current bodies).
- The deposit is ALSO an event_vendor_payments row. confirm_vendor_payment (20270202160006) stamps ONLY
  that row's vendor_confirmed_at — never deposit_acknowledged_at. One sum can already carry two
  independent supplier answers, linked only by a substring in `notes`.
- INSTALMENTS HAVE NO REFUSAL. The v4 design drew "Not received"; the product has none.
- Decisions' payment reply today is "Confirm received" only (PR #5402, lib/thread-decisions.ts).

DELTA (the recommended answer — confirm it matches the owner's): the deposit's ledger row routes to the
EXISTING reject_vendor_deposit, never a second refusal path for the same money; instalments get a mirror
of the deposit's columns and SECURITY DEFINER function on event_vendor_payments, and a second section on
/admin/disputes; confirming the deposit's row also acknowledges the deposit. Add the reply to
DecisionReply and keep `reply ⇔ needsYou` true — its test sweeps every kind.

START AFTER question 9, #5411 AND B2 HAVE MERGED. GATE: owner. MODEL: opus · xhigh. OPEN AS DRAFT (money).
MAY TOUCH: one new migration, app/admin/disputes, app/vendor-dashboard/messages/[threadId]/pay-confirm-
actions.ts and page.tsx, app/_components/chat-thread-views.tsx, lib/thread-decisions.ts, and the
field-parity guard lib/a-decision-reply-posts-what-the-action-reads.test.ts (add the new reply's case).
PROVE IT: merged + served; a refused instalment appears on /admin/disputes; the couple's Decisions line
reads the supplier's reason; a refused deposit takes the existing path.
```

## H5 — "Lock this" stops being offered on a supplier who said they aren't free (after owner question 10)

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

DO NOT START until the owner has answered question 10 in the build plan's § 5.

GOAL: a couple is not invited to lock a supplier who already declined their date.

WHAT EXISTS: prototypes/chat_interface_v4_2026-09-09.md § 4 point 6 — the bench keeps "Lock this" after an
INQUIRY decline because resolveBenchCardActions does not read the thread. That is correct after a
LOCK-REQUEST decline (they may be asked again).

DELTA (recommended): after an inquiry decline, withhold Lock and say why; keep it after a lock-request
decline. Adds a line; removes no control from any other card.

START AFTER question 10 AND H3 HAVE MERGED (same bench file). GATE: owner. MODEL: sonnet · medium.
MAY TOUCH: app/dashboard/[eventId]/vendors/_components/bench-vendor-actions.tsx, shortlist-categories.tsx.
lint-port-no-lost-controls stays green with its baseline UNTOUCHED.
PROVE IT: merged + served; a declined supplier's card shows the reason, not Lock.
```

## L1 — Today's rulings and corrections into the decision log (corpus only)

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

FILE: /Users/icecasasola/Documents/Claude/Projects/Setnayan/DECISION_LOG.md — APPEND ONLY, at the bottom,
format `| 2026-09-10 | … | … |`. Pull first (other sessions committed at 17:48, 18:03, 18:15). Stage by
explicit path. Never git add -A. Never git stash. Do NOT commit — the orchestrator commits.

ROWS:
 a. Service Card Boosting PARKED — owner: "if not then continue with original plan first" (line ~3824 still
    says "BUILT NOW").
 b. "songs they play is for a music performer. not for everybody."
 c. Correction: #5375 merged into #5373's branch, not main (verify with gh first).
 d. Correction: booking fee ON (NEXT_PUBLIC_BOOKING_FEE_ENABLED=true) but NOT enforced
    (NEXT_PUBLIC_BOOKING_FEE_RAIL_LIVE unset).
 e. Correction: contact details in a shop's own text are SETTLED (2026-07-23 chat; 2026-07-27 card text);
    the "open" lists in the 2026-09-10 rows are wrong. Still open: the website link and social link-outs.
 f. Correction to the "Free gets a minimal website" row: "Free … cannot be messaged" contradicts the
    2026-07-24 owner lock "your inbox is never locked" (the chat tier gate was removed; check
    lib/chat-send.ts on origin/main) and the tier search gate has no callers — the 07-24 lock stands until
    the owner says otherwise.
 g. LAUNCH_CHECKLIST_2026-09-06 items 2/4/5/12/13 are already ruled.
 h. The verification checklist is the 2026-07-03 lock: profile 100% + four papers (DTI/SEC · BIR 2303 ·
    Mayor's Permit · bank-account proof) + a post-submit 15-minute Google Meet.
Also point CLAUDE.md's ACTIVE block at WHATS_NEXT_Build_Plan_2026-09-10.md.

PROVE IT: grep finds "PARKED" for boosting and "music performer".
```

## T1 — The live two-sided test: script + watcher

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

GOAL (owner): "test the whole vendor and user build to look for the vendor's service cards until they
negotiate, book, and lock" — and after each tap, be told in plain words what actually happened.

EXTEND, DO NOT WRITE A THIRD: corpus TEST_SCRIPT_E2E_2026-07-27.md (five test accounts) and code-repo
build-sessions/PROVE-THE-FLOW.md on origin/claude/handoff-hardening (with liveness test
lib/prove-the-flow-doc-is-alive.test.ts, ~289 behind).

PRODUCTION FACTS (read-only, 2026-09-10 — re-check):
 · Supplier: "Saysay Live Band & Hosting (FIXTURE)", owner account testnayan2@test.com, Solo to
   2027-07-30 (Solo holds 3 couples per date), services live_band + host_mc, 2 nameless cards, no photos.
 · The owner's account is admin + is_internal=TRUE — it unlocks every paid feature, so it proves nothing
   about payment; its 2026-12-18 wedding already has an accepted thread with Saysay. Not the couple.
 · Round-1 couple: testnayan4@test.com (one wedding, NO date — owner sets a future date first); fallback
   testnayan3@test.com (one simple event, 2026-09-19). Not testnayan1 (its own event is finished).
   Round 2 needs a couple with two ongoing events.
 · No fee order will appear (fee not enforced; first 5 sourced bookings free). The supplier must accept
   the inquiry before a long chat.

DELTA:
 1. Rebase PROVE-THE-FLOW onto main and rewrite it for today's path in plain English (small docs + test PR).
 2. A one-screen owner script in the corpus: prep (rename the shop, card titles, cover photos, GCash QR,
    gift at "no", couple's event date) and the walk, including one tap per fix (A2 no Lock without a
    quote · A4 next step after accept · B1 named cards · B2 both numbers after a lock).
 3. The watcher: read-only production SELECTs after each step (thread, proposal, amendment, event_vendors
    lock state, change row), reported in plain words. Sessions never sign in as test accounts — the owner
    taps.
Running round 1 requires A1, A2, A4, A5, B1, B2 and #5404 served — check by ancestry first.

PROVE IT: round 1 run; each step has a production row that matches the screen, or a named defect filed
as a new session in the register.
```

---

## N0 — Review and land the cleanup-delete pin (the file-deletion pattern)

```
(Paste after the SHARED HEADER.)

GOAL: no cleanup job can ever permanently delete a file that does not belong to the record it is cleaning.
A non-admin could point a record they own at someone else's file (a government ID, a permit, a couple's photo),
and our own service-role sweeps — the Papic full-res drop, the vendor identity sweeps — would delete it.

WHAT EXISTS: branch `claude/every-cleanup-delete-is-pinned` (six+ commits, some marked "wip"): one choke point
every sweep/erasure delete passes through (bucket AND tenant prefix), write-side restrictive policies so a
browser cannot choose a stored file key, behavioural guards, a derived scan of delete callers, a regenerated
exposure baseline. It may already be a DRAFT PR — check `gh pr list --head claude/every-cleanup-delete-is-pinned`.

YOUR JOB: review it as a skeptic, then land it.
· Read every commit. Treat "wip" commits as an unreviewed colleague's draft.
· Re-run every guard's mutation yourself, print needle counts before -> after; both `inScope = [...present]`
  and `true || verificationRefIsInScope(...)` must go RED.
· Prove, as a genuine `authenticated` non-superuser session in the replay, that a foreign-tenant key is refused
  on write, AND that every legitimate upload still works: Papic guest capture, seat capture, vendor capture,
  verification upload, shop logo.
· Read the exposure-baseline diff and COUNT it: only narrowings and the new restrictive policies, no widening.
· Full db suite + affected unit suites + tsc, sequential, non-zero test counts.
· It changes grants and policies on live upload tables: it stays a DRAFT until the orchestrator reads your review.
DONE MEANS: a written review in the PR, every guard proven RED under mutation, CI green, PR left DRAFT with a
one-line "ready to release" or a named blocker.
```

## N1 — The chat cannot be used to leave the app

```
(Paste after the SHARED HEADER.)

GOAL, owner verbatim: "our goal is to let them integrate their event with the vendor they find. not to let them
communicate outside the app."

MEASURED 2026-09-10 (post-merge review of #5404, executed in the replay, read in prod):
1 · A couple or a shop can POST straight to /rest/v1/chat_messages from their own session with any text and any
    `attachment_url`. INSERT on the message text and the legacy `attachment_url` column is granted to every
    signed-in user; no trigger screens either.
2 · The contact screen `lib/chat-contact-filter.ts` runs only in app code and only when
    NEXT_PUBLIC_CHAT_CONTACT_FILTER_ENABLED is on (defaults OFF; its prod value is unknown — the OWNER must say).
3 · `app/api/chat/attachment/[messageId]/route.ts` (~66-73) treats any non-`r2://` attachment_url as a legacy URL
    and 302-REDIRECTS to it — so `https://wa.me/…`, `viber://…` or `m.me/…` shows as a file card on setnayan.com
    and opens WhatsApp/Viber. That is a door out AND an open redirect.

WHAT TO SHIP:
A · The attachment route redirects ONLY to our own storage. A non-r2 value is refused (or shown as plain text,
    never a link). Check whether any legitimate legacy URL rows exist in prod first (read-only SELECT) and say so.
B · The database, not the app, stops a browser writing an arbitrary `attachment_url`: revoke the column from
    authenticated if no client legitimately writes it, else a trigger that accepts only an r2 ref under the
    thread's own prefix. Read the legitimate writers first.
C · Contact screening of message TEXT enforced where a direct PostgREST insert cannot skip it (a BEFORE INSERT
    trigger calling the same rules, or moving the insert behind a SECURITY DEFINER function). Decide which, and say
    why. ⚠ Screening text is a product decision about false positives (a price like "0917" vs a phone number):
    reuse the shipped filter's rules exactly; do not invent new ones.
D · Guards that fail if a door reopens; mutation-test each.
Security grants + trigger on a live table ⇒ DRAFT PR. Name in the body that the prod BEGIN…ROLLBACK rehearsal
needs the owner's go-ahead.
DONE MEANS: the three doors proven closed in the replay as a real `authenticated` session; CI green; DRAFT.
```

## N2 — The last two couple-facing email leaks

```
(Paste after the SHARED HEADER.)

GOAL: same principle as N1. Two leftovers found by the post-merge review of #5404:
1 · The couple's Hosts page "Promote your coordinator" row prints the booking row's email in plain text
    (`app/dashboard/[eventId]/hosts/page.tsx` ~436, plus a hidden input ~444). A package lock COPIES a Setnayan
    shop's own email into that row (`vendors/packages/actions.ts` ~495), and the gate checks only the category and a
    booked status — never whether the supplier is off-platform. Gate it with the same `isOffPlatformSupplier(ev)`
    #5404 used, and route a Setnayan coordinator into the in-app delegate path instead. Also stop the package lock
    COPYING a Setnayan shop's contact into the couple's row at all, if nothing legitimate reads the copy (grep the
    readers first).
2 · The budget card's "Ask them for pricing" link now can never prefill or open the thread (its branch renders only
    for Setnayan shops and #5404 nulls the address for them). Point it at the existing thread opener instead of the
    bare Messages list.
Extend #5404's guard (`lib/no-door-out-of-the-app.test.ts`) bill so the Hosts line's gate is proven, and
mutation-test it. Not money, not grants — ordinary PR with auto-merge.
DONE MEANS: merged and served; guard green; a Setnayan coordinator's email appears nowhere a couple can see it.
```
