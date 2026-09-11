# Build prompts: every remaining session, ready to paste

**How to use:** paste the **SHARED HEADER** first, then one session block. Every block tells the session
to re-verify first and to stop if the work is already done (plans go stale in hours).

## Gate status at the time of this pack (2026-09-11)

| Session | Its written gate | State now |
|---|---|---|
| D1 · "Want to add them to your event?" | owner has viewed `prototypes/vendor_public_page_universal_2026-09-10.html` §F · #5404 merged | #5404 ✅ served. ⏳ **Only the owner's look is missing.** |
| F1 · shop page, top | owner has viewed the drawing, plus `prototypes/shop_page_free_vs_solo_2026-09-10.html` (P2) · #5404, D1, D2, E1 merged | D2 ✅ #5423, E1 ✅ #5450/#5458. ⏳ Waiting on D1 and the owner's look at both drawings, including the **stock photo** ruling. |
| F2 · shop page, body | F1 merged | Its "question 3" is **answered**: never show a shop's website or social links (shipped in L2, #5457). |
| G1 · six-door My Shop | owner has viewed `prototypes/shop_page_2026-09-10.html` (F0) · D3, E2 merged | D3 ✅ #5424, E2 ✅ #5426. ⏳ **Only the owner's look is missing.** |
| G2 / G3 | the previous G merged | — |
| FU-1 … FU-7 | see each block | new from test round 1; FU-4 and FU-6 need an owner yes first |

**Models:** D1, F1, F2, G1–G3 → Opus · high. FU-2, FU-5 → Opus. FU-1, FU-3, FU-4, FU-6 → Sonnet · medium.
Run at most three at once, never two on the same file. D1 → F1 → F2 share `app/v/[slug]/page.tsx` and
must run in order. G1 → G3 share `vendor-dashboard/shop/page.tsx`. FU-2 and FU-4 both touch the quote
builder, so run them in order.

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

---

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

---

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

---

## F2 — The universal shop page, part 2: body, reviews, message bar

```
(Paste after the SHARED HEADER — or read it from the top of this file.)

START AFTER F1 HAS MERGED. DELTA: port the body per the drawing — services, portfolio, reviews; a
zero-review shop shows one calm line instead of five empty bars (row 3838); Pro-only stays Pro-only; the
shop's own website/social links follow the owner's answer to question 3 in the register (if unanswered,
leave them exactly as shipped). PROVE IT: merged + served; no "0" review bars; lint-port-no-lost-controls
shows no lost destination.
```

---

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

---

## G2 — Six-door My Shop, part 2: doors 2 and 3

```
(Paste after the SHARED HEADER — or read it from the top of this file.)
START AFTER G1 HAS MERGED. DELTA: port doors 2 (website) and 3 (services) — keep the Tools tab and every
per-trade tool, Packages, the off-season nudge; services deep-link parameters keep working.
PROVE IT: merged + served; G1's guard green with door-2/3 items.
```

---

## G3 — Six-door My Shop, part 3: doors 4–6

```
(Paste after the SHARED HEADER — or read it from the top of this file.)
START AFTER G2 HAS MERGED. DELTA: port doors 4 (inbox & assistant), 5 (money), 6 (tools). The inbox line
reads the add-on ENTITLEMENT (vendor_profiles.ai_addon_expires_at live), never the on/off switch — a shop
without the add-on must never be told it is on.
PROVE IT: merged + served; guard green; nothing lost.
```

---

# Follow-ups from test round 1 and C1

## FU-1 — Release the held test-round fixes (#5463) — the moment TEST ROUND 1 ends

```
(Paste after the SHARED HEADER.) Model: Sonnet · effort: medium. Not a build, a release.

PR #5463 (S2, DRAFT, auto-merge off on purpose) fixes the four things the owner saw in test round 1:
 (1) the bench's "More in …" card showed the shop's letters although its card has a cover photo;
 (2) Inquire from the Live Band row filed the shop as "Band / DJ";
 (3) the perk messages printed raw "**" and raw keys ("live_band", "host_mc") and said "Exclusive";
 (4) an old thread read "Inquiring about Miscellaneous".
Wording ruled by the orchestrator: "🎁 A perk for Setnayan couples · Live Band — <perk text>", preview
"🎁 Perk: Live Band". Never call the supplier's own perk "the Setnayan gift" (that name is the Papic-photo
gift on the quote, ruled 2026-09-09). Old stored messages are cleaned AT RENDER; stored text untouched.

STATE AT PAUSE (S2, 2026-09-11): head f48aef9 · main merged in after #5464–#5467 (0 behind, clean) · 51/51 related
tests + #5467 5/5 · tsc + root lint clean · CI 14 pass, "typecheck + lint" was STILL PENDING — check it first.
Worktree kept: /Users/icecasasola/Documents/Claude/Projects/wt-bench-round1 (remove after merge).
STEPS: gh pr view 5463 → merge origin/main into it (it shares
app/vendor-dashboard/messages/[threadId]/page.tsx with #5467 — different lines) → rerun its 10 tests +
tsc + the neighbouring suites → `gh pr ready 5463` → `gh pr merge 5463 --auto --merge` → prove served by
ancestry → read the owner's two threads in prod (read-only) and confirm the chip now reads "Live Band".
KNOWN LIMIT (say it in the PR): existing picks keep service_id NULL until re-saved from the bench; no backfill.
```

## FU-2 — The supplier sees the Setnayan gift while building a quote

```
(Paste after the SHARED HEADER.) Model: Opus · effort: high (money display). Open as a normal PR only if
no number can differ from the bill; otherwise DRAFT.

WHY (owner, test round 1, 2026-09-11: "i also cannot see the exclusive setnayan"): the ruling of 2026-09-09
is "the NUMBER appears on the QUOTE". Today it appears only on the COUPLE's proposal page
(app/proposals/[publicId]/page.tsx ~203–360, via quoteSetnayanGift in lib/setnayan-gift.server.ts). The
supplier's builder (app/_components/proposal-maker.tsx, mounted as toolNodes['build-quote'] in
app/vendor-dashboard/messages/[threadId]/page.tsx) never shows it, although the supplier sentence already
exists and is unused: giftQuoteLine(gift, 'supplier') in lib/setnayan-gift.ts ("Includes your Setnayan gift
— your couple gets N free Papic photos.").

RULE 0: reuse quoteSetnayanGift / setnayanGiftForFee / giftLadderFrom / getBookingFeeSchedule. NEVER re-type
the ladder or the fee (read platform_retail_catalog_v2 + papic_pass_tiers at runtime, as the server file does).
The line shows ONLY when setnayan_gift_quote_applies(event, supplier) = 'applies' (the card said yes, the
client is Setnayan-sourced, and the booking is past the supplier's first five free ones — "no fee, no gift").
Every doubt shows NOTHING, never a number.

DELTA: the builder's total changes live, so either (a) the server passes the resolved inputs (applies? ·
schedule · ladder) as props and the pure setnayanGiftForFee computes per total on the client, or (b) a
debounced server action. Prefer (a) — same arithmetic as the bill, pinned by the existing mirror test.
Show giftQuoteLine(…, 'supplier') under the Total. When it does NOT apply, show one quiet line saying why
only if the card says yes but the booking is one of the first five ("Your first five bookings carry no
booking fee, so no gift is added") — otherwise nothing.
PROVE IT: a test that the builder's number equals quoteSetnayanGift's for the same total (≥5 totals incl.
₱3,500 and ₱1M); sabotage a hand-typed ladder → RED. Served by ancestry.
TEST DATA NOTE: Saysay (the test supplier) has gift OFF on both cards and 0 locks → the line must NOT show.
```

## FU-3 — "Propose schedule" is greyed out until the couple books

```
(Paste after the SHARED HEADER.) Model: Sonnet · effort: medium.

WHY (owner, test round 1): the rail's Tools list (lib/vendor-thread-tools.ts VENDOR_THREAD_TOOLS,
key 'propose-schedule', link 'client-schedule') is offered at inquiry stage, and it leads to the client
page's Schedule tab, which is locked until booking ("Unlocks when they book you"). Owner's standing
principle (2026-09-11, the Lock ruling): don't offer what can't be used yet — say why.
DELTA: the rail already knows the stage (railStage === 'booked' in
app/vendor-dashboard/messages/[threadId]/page.tsx). Before booking, render the launcher disabled with
"Opens once they book you" (visible text, not a tooltip). After booking, unchanged. Same in the mobile
sheet (ChatInfoRailTrigger) and the desktop column. Keep lint-port-no-lost-controls green (the
destination still exists — it is disabled, not removed). Owner may prefer HIDING it — the default here is
greyed + reason, matching his Lock ruling; note it in the PR.
PROVE IT: a test per stage (asked/quoted → disabled + reason; booked → link). Served by ancestry.
```

## FU-4 — One "Send a quote" door instead of "Build a quote" + "Send proposal" — ⚖ OWNER CONFIRMS FIRST

```
(Paste after the SHARED HEADER.) Model: Sonnet · effort: medium. DO NOT START until the owner says yes.

WHY (owner, test round 1: "what is the difference of quote and proposal?"): both produce the same thing —
a vendor_proposals row + the in-chat card the couple accepts. "Build a quote" (ProposalMaker) builds from
scratch; "Send proposal" (send-proposal-card.tsx) sends a saved template (needs one made at
/vendor-dashboard/proposals first). Two names for one thing.
RECOMMENDED DELTA (orchestrator): one launcher "Send a quote" that opens ProposalMaker with a first choice
"Start from a template ▾ / Build from scratch"; picking a template seeds the builder's lines (reuse the
template → line mapping sendProposalFromChat already uses). Keep /vendor-dashboard/proposals (template
authoring) as is. No schema change. Remove nothing a supplier can do today.
PROVE IT: both paths still create the same proposal shape (existing tests green); a guard that the rail
offers ONE quote launcher. Served by ancestry.
```

## FU-5 — Gift snapshot at lock (C1's two bounded gaps)

```
(Paste after the SHARED HEADER.) Model: Opus · effort: xhigh (money). DRAFT.

WHY: C1 (#5436) decides the gift at billing time from LIVE data:
 (a) setnayan_gift_offered_on(event_vendor_id) reads vendor_services.includes_setnayan_gift NOW — a
     supplier could switch the gift off between the couple's lock and the booking-fee charge;
 (b) the booking's card is event_vendors.service_id, a column the couple's own session can write — the
     function only requires the card to belong to the SAME supplier, so a couple could point the booking at
     a sibling card whose gift answer differs.
DELTA: at lock (the one lock path — chat-lock-booking.server.ts / the lock RPC), snapshot the card id and
its gift answer onto the booking (ledger or event_vendors, whichever the lock already writes; RULE 0: look
for an existing snapshot column first — lib/service-card-snapshot.ts exists). setnayan_gift_quote_applies and
the bill read the snapshot when present, live data only before a lock. Re-sign functions from their LIVE
bodies (pg_get_functiondef, line-hash diff in the PR). Adding a column to a couple-writable table → guard
it from the couple's session (revoke UPDATE on the snapshot columns).
PROVE IT: replay tests — gift switched off after lock → bill still carries it; couple repoints service_id
after lock → gift answer unchanged; before lock both follow live data. BEGIN…ROLLBACK prod rehearsal.
```

## FU-6 — "Who else wants this day" counts month-only dates — ⚖ PRODUCT CALL FIRST

```
(Paste after the SHARED HEADER.) Model: Sonnet · effort: medium. DO NOT START until the owner rules.

WHY: lib/vendor-date-demand.ts (the supplier-facing "You're chasing N of 3 customers for 13 Mar" /
who-else-wants-this-day count) counts couples whose date is month-only as if they wanted that exact day.
The same gap in the plan cap was fixed as a bug (#5452, day-precision only). Here it is a product question:
should a couple who only said "March 2027" count toward "who else wants 13 March"?
RECOMMENDED: count day-precise dates only (matches #5452 and the booking counts), and optionally show a
separate soft line "N more are looking at March". Build only after the owner picks.
```

## FU-7 — The generic-onboarding tiles (optional, from GREY-OUT)

```
Recorded for completeness — ALREADY RESOLVED by #5455: birthdays/debuts etc. get an entrance NOTICE, tiles
deliberately NOT greyed because the plan cap depends on who the event is for (asked later in the flow).
Re-open only if the owner asks for the tiles to be greyed like weddings.
```
