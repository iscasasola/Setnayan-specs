# READY-TO-PASTE PROMPTS — the five unblocked sessions

> Paste the **shared header** and then ONE session block. Each is self-contained and
> assumes **no memory files and no conversation context** — a different Claude account can
> run it cold.
>
> ⛔ **Never more than two at once**, and **never S7 beside S6 or S8** (same file).

---

## SHARED HEADER — paste this above every session

```
You are working on Setnayan, a Philippines wedding/events platform.
Code: github.com/iscasasola/setnayan-platform (Next.js, apps/web). Specs and decisions:
~/Documents/Claude/Projects/Setnayan (a SEPARATE repo). Read that repo's CLAUDE.md first.

ASSUME NO MEMORY EXISTS. Everything you need is in this prompt and in those two repos.

RULE 0 — FIND IT BEFORE YOU BUILD IT. This is ~2 years of code. Almost nothing you are
asked for is new. Before writing anything, grep for the feature noun in apps/web and say
in one line each: what exists · what is missing · the delta you will build. If you cannot
name the existing component, you have not searched enough.

HOW TO REPORT TO THE OWNER: plain English, what a PERSON experiences. No file paths, no
function names, no table or flag names in the reply — those belong in the PR body.

THE MEASUREMENT BAR, non-negotiable:
 • Verify against the SHIPPED CODE and the LIVE DATABASE, never against a doc or a
   comment. Applied migrations are never edited, so their comments go stale.
 • Every guard you write must be MUTATION-TESTED: break the thing it guards, print the
   occurrence count BEFORE and AFTER, and confirm the test goes red. An unmeasured
   mutation proves nothing, and a guard that matches its own explanatory comment guards
   nothing. Assume one of your guards is decoration until you have proved otherwise.
 • Print the exit code beside any test summary. `# tests 0` with `# fail 0` exits GREEN
   and means the run matched nothing — require a NON-ZERO test count before believing a
   pass. A `--test` path containing [brackets] matches nothing.
 • A refused read renders as an empty state in this app. "Nothing yet" and "you were not
   allowed to see that" look identical, so check errors explicitly.

PR WORKFLOW (owner-locked): `gh pr create`, then immediately
`gh pr merge <PR#> --auto --merge`. Never ask whether to auto-merge. Add a
`changelog.d/<branch-slug>.md` fragment; never edit CHANGELOG.md or STATUS.md.
Build in a git worktree that HAS node_modules (a fresh one has none, so tsc and the tests
"pass" while resolving nothing). Commit before you mutate anything you want back.

DESIGN IS BINDING, not a suggestion:
prototypes/chat_interface_v4_2026-09-09.html — port it, never redraw it.
Context for all of it: SESSIONS_Chat_Bench_Exclusive_2026-09-09.md and DECISION_LOG.md
2026-09-09 (four rows).
```

---

## S1 · THE CHANGE / ADJUSTMENT CARD — opus · high · blocks S2

```
A message in a Setnayan conversation can carry one of FOUR structured cards. Three of them
render. The fourth does not.

Measured: `chat_messages` carries `proposal_id` (a quote), `appointment_id` (a meeting),
`amendment_id` (an adjustment to a quote) and `change_order_id` (a CHANGE). Open
apps/web/app/_components/chat-message-stream.tsx: it fetches and renders appointment cards
and amendment cards, each with its own live refetch so a status flip repaints. There is NO
renderer for `change_order_id` at all.

BUILD the change card, in the shape of the two that already work. Do not invent a second
pattern — copy how the amendment card fetches (RLS-scoped, refetched whenever the message
set changes) and how it renders inside the bubble.

WHY THIS IS FIRST AND WHY IT BLOCKS THE NEXT SESSION: a "Decisions" filter is being built
on top of these four markers. Built today it would SILENTLY OMIT every change — and a
filter that silently omits is worse than no filter, because it is trusted.

START by reading the change-order migration (grep supabase/migrations for change_order) and
the shipped amendment card end to end. Report what a change actually IS in this product
before you draw one — if it turns out changes are never created by any live path, say so
plainly and stop: that is a more valuable finding than a card nobody can produce.

⚠ The card must show where the change stands NOW, not what it said when it was sent. That
is the rule the whole Decisions view rests on.
```

---

## S3 · THE CONVERSATION COLUMN — opus · high

```
Build the list of conversations that sits beside the one being read — the left column of
"list · conversation · context" in the binding prototype.

⚠ A BRANCH IS PARKED WITH MOST OF THIS ALREADY WRITTEN: `claude/parked-conversation-column`
(local, unpushed, in the worktree it was built in — check `git branch -a` and
`git stash list`). It holds a working column, a batched row builder
(lib/vendor-conversation-list.ts) and a guard. RECONCILE it with prototype v4 before
shipping — do not start again, and do not ship it unreconciled. If the branch cannot be
found, the builder is worth rewriting from the prototype rather than hunting for it.

WHAT THE ROWS MUST CARRY: avatar initials, the couple's name, a time, a short last-message
preview, an Unanswered-or-stage tag, and the service and date as small tags. Filter chips:
All · Unanswered · Quoted · Booked · Completed · Cancelled. A search box.

REUSE, NEVER RE-DERIVE: the stage comes from `resolveThreadStage` + `rowReadsCompleted`
(apps/web/lib/vendor-thread-stage.ts). Three mechanisms already track a thread's state and
none spells the ladder alone; a fourth private ranking is the failure this repo keeps
producing. Every probe must be BATCHED — one query for the whole list, never one per row.

⚠ NOT BLOCKED, BUT KNOW THIS: a supplier already has TWO lists over the same threads —
/vendor-dashboard/messages (Conversations) and /vendor-dashboard/bookings (inquiries). The
prototype draws one and never says which it replaces. That retirement is an OWNER decision
and is NOT yours. Build the column; change neither existing list.

⚠ The couple's filters differ from the supplier's (All · Has a quote · Booked · Waiting ·
Closed). Both sides get a column.
```

---

## S5 · A SERVICE OFFERED IN CHAT ARRIVES AS A CARD — opus · high

```
When a supplier offers one of their services inside a conversation, the couple receives A
WORD IN A CHIP ROW. Fix that: it should arrive as the CARD the supplier built.

Measured: apps/web/app/vendor-dashboard/messages/[threadId]/_components/vendor-offer-service.tsx
sends `{ vendorServiceId, label }` — an id and a label, nothing else — and its own docblock
says the couple "then sees it in the shared 'Inquiring about' chip row".

Meanwhile a service card carries THREE kinds of media (apps/web/lib/vendor-services.ts):
`primary_photo_r2_key` — the cover, REQUIRED before a service can be published —
`showcase_video_r2_key` (a clip, ≤30s) and `showcase_photo_r2_keys[]`. None of it travels.

Owner: "the service card of each service still needs that photo/image/video."

BUILD: offering a service posts a card into the conversation — cover photo, the clip if
there is one, the price, what is included — because that card is the pitch. A couple
choosing between three caterers is choosing on what they can see.

REUSE: lib/offer-service-core.ts is the shared gate both the server action and the native
endpoint already call. Do not add a second offer path.

⚠ THE MEDIA IS PRIVATE. These are stored-asset refs, not URLs. Resolve them the way the
app already does (`displayUrlForStoredAsset`), and look at how chat attachments are served
— apps/web/app/api/chat/attachment/[messageId]/route.ts proves thread membership on every
request and redirects to a short-lived signed URL. A raw ref in an <img> renders a broken
glyph; a public URL is the defect that route exists to prevent.
```

---

## S7 · SORTING REACHES THE BOTTOM TIER ONLY — opus · xhigh · NEVER beside S6 or S8

```
On the couple's shortlist bench, the SORT BY bar sits above two rows of suppliers and
governs only the first. Pick "Lowest price" and the top row reorders while the search
results below it do not, with nothing saying why.

MEASURED, AND THE SECOND HALF IS A DECISION, NOT A BUG:
 • `sortWithReasons` (apps/web/lib/bench-sort.ts) is called exactly ONCE, on the shortlist
   carousel. Sorting works there, is remembered per event, and survives searching.
 • The "More in {category}" results go through `classifyInlineMoreRow`
   (apps/web/lib/inline-more-row.ts), which PARTITIONS and never orders.
 • Their order comes from apps/web/app/dashboard/[eventId]/vendors/_actions/category-search.ts,
   an OWNER-LOCKED ladder: relationship-depth → BOOSTED (paid placement) → top-reviews →
   tail. Its own comment calls re-ranking "a separate, sign-off-gated change", and a
   shipped smart-sort price re-rank is already confined to the TAIL TIER ONLY.

OWNER RULING 2026-09-09: "bottom tier only." The couple's chosen lens now orders the TAIL
TIER, exactly as that shipped re-rank does. NOTHING PAID MOVES BY ALGORITHM. Getting this
boundary wrong moves money, which is why this session is xhigh and runs alone.

ALSO SHIP THE HONEST SENTENCE: the results row should say what it is ordered by, so the
sort bar stops appearing to govern something it does not.

⚠ The whole bench sits behind NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED and its value cannot be
read from a session — ask the owner before concluding anything about what renders.
⚠ Three guards now protect this file: lint-port-no-lost-controls (never regenerate its
baseline to go green — read the diff and COUNT the removals), the card-element guard
(counts, because the file renders two card shapes), and the contrast guard (add a row if
you add a tinted label). Keep all three green.
```

---

## S9 · THE PUBLIC-PROFILE MESSAGE, AND SOME DEAD CODE — sonnet · medium

```
TWO small things on the way into a conversation.

1. apps/web/app/_components/follow-gate.tsx — pressing "Message" on a supplier's public
   profile or search card does not open a conversation. It opens the couple's conversation
   LIST with the supplier's email typed into a form that still needs submitting. And when
   the couple has NOT created a celebration yet, it sends them to the event picker and
   SILENTLY DROPS the supplier's address, so after making an event they arrive with
   nothing and no explanation.

   Four sibling controls were fixed this way in PR #5344 — read it first. They use the
   shipped ContactShortlistVendorButton → contactShortlistVendor → startServiceInquiry,
   which dedupes on the chat_threads UNIQUE(event_id, vendor_profile_id) index. Reuse it;
   do not add a second resolver. The no-event case needs the supplier CARRIED THROUGH the
   event-creation flow, or an honest sentence saying it will not be.

2. apps/web/app/dashboard/[eventId]/messages/page.tsx — roughly sixty lines (the
   "Follow first, then chat" panel and the vendor lookup feeding it) have had NO CALLER
   since 2026-09-08, when the only thing that sent couples there stopped doing so. Verify
   that independently before deleting a line: grep every caller, and check the branch is
   genuinely unreachable rather than merely rare.

⚠ Give the deletion its OWN commit inside the PR so it reads as one removable diff.
⚠ `lint-port-no-lost-controls` will report a lost destination when a link is repointed —
that is a SUBSTITUTION it cannot model. Read the diff and count the removals before
regenerating its baseline; regenerating blind absorbs a real removal.
```
