# WHATS_NEXT — SAMAHAN (2026-08-24)

> The contract for the samahan stream. Written the day a samahan stopped being a roster and
> became a place. **Everything in § 1 SHIPS — do not rebuild it.** § 2 is what is left, in the
> order I would do it. § 3 is what the owner still has to decide. § 4 is the trap list.

**Anchored to `origin/main` the day this was written; verify before acting** —
`gh pr view <#> --json state,mergedAt`. This register has been wrong about a PR's state
four separate times.

---

## 1 · WHAT SHIPPED 2026-08-24 — six PRs, do NOT rebuild any of it

| PR | What a member gets |
|---|---|
| [#4781](https://github.com/iscasasola/setnayan-platform/pull/4781) | **Stories** — one short clip per member per clock hour, invisible past 24h by RLS, files swept after |
| [#4783](https://github.com/iscasasola/setnayan-platform/pull/4783) | The composer is a **camera**: records exactly 3 seconds, stops itself, the phone compresses it |
| [#4784](https://github.com/iscasasola/setnayan-platform/pull/4784) | **Anyone** may rename the samahan + set a group photo |
| [#4790](https://github.com/iscasasola/setnayan-platform/pull/4790) | Those edits happen **on the header** — tap the photo, tap the name (pencil affordance) |
| [#4786](https://github.com/iscasasola/setnayan-platform/pull/4786) | **Usapan** — the group chat |
| [#4795](https://github.com/iscasasola/setnayan-platform/pull/4795) | 🚨 **Leaving worked for nobody** (below) + a samahan lives while one person stays |

### Rulings that must not be re-litigated

- ⛔ **Group chat does NOT reuse `chat_threads`, and that overturns the 2026-07-15 owner lock
  saying "reuse 0019 chat".** Read out of prod, that table is a couple↔vendor **booking
  negotiation** — `event_id` NOT NULL, `vendor_profile_id` NOT NULL, plus `inquiry_status` ·
  `agreed_price_centavos` · `locked_at`. A samahan has neither an event nor a vendor. "Reuse"
  meant nulling both FKs and re-reasoning every policy and consumer that assumes a vendor
  thread — touching the live booking system to ship a group chat. **One query against prod
  overturned a plan estimate.**
- ⚖ **"The only way to close a group/samahan is when all members leave. For as long as there is
  one, the group lives."** Closing is a CONSEQUENCE, not an act performed on other people.
  `archiveCommunity` is deleted; the DB refuses a close while any membership row remains.
- **Controls live ON the thing.** Rename/photo first shipped in a card below the header; the
  owner caught it by looking at the real screen. **Ability without discoverability is not the
  feature.**
- **Stories: one per member per clock hour; 24h; take-down soft; no unscreened state can exist**
  (the poster frame is classified synchronously, before any row).

---

## 2 · WHAT IS LEFT — the order I would do it

### ✅ 2a · NOTHING RINGS — BUILT 2026-08-25 (PR #4841). Do NOT rebuild it.
🛑 **CORRECTION: I told the owner twice that we have no push infrastructure. That was FALSE.**
It ships and is mounted: `PushToggle` on the profile page · `savePushSubscription` /
`removePushSubscription` · `emitNotification` with **61 files · 108 call sites** (measured 2026-08-25) · `/api/notify` sending via
`web-push` + VAPID. `push_subscriptions` exists in prod with **0 rows** — nobody has switched it
on.
⏭ **The work was therefore:** (1) confirm the VAPID keys are set in the hosting settings —
**not readable from a session**, `/api/notify` merely warns *"VAPID keys not set — skipping web
push"* and continues; (2) emit a nudge through the machinery that already exists. **Do not scope a
push build.**

**WHAT SHIPPED 2026-08-25 — PR [#4841](https://github.com/iscasasola/setnayan-platform/pull/4841).**
Measured first: **61 files · 108 `emitNotification` call sites · ZERO of them in the samahan
tree.** Two new types (`samahan_story`, `samahan_message`), one shared fan-out called from the
story route and the Usapan post action through `after()`.
- **Collapsed to one unread notice per samahan per person, WITHIN AN HOUR.** 🔑 The window is not
  decoration: the tray's **Open** button marks nothing read — clearing is a separate press many
  people never make — so collapsing on "holds any unread notice" would have **muted a samahan
  permanently** for anybody with one stale notice. Bursts are minutes apart; a mute is forever.
- **The collapse read fails toward RINGING** (a refused read looks exactly like "nobody is
  ringing"), and **no message preview is stored** — take-down is soft, and a preview in a
  notification row has no inverse.
- **Neither type is on the email or push allowlist**, deliberately: § 3.2 below is still the
  owner's. The tray rings; no phone buzzes.
🚨 **AND IT FOUND THREE TYPES THE DATABASE HAS NEVER HAD** — `connection_request` (2 sites),
`connection_confirmed`, `order_cancelled` — emitted by four live call sites with **no migration,
ever**. 70 labels in the migrations, the same 70 in prod, 72 in the union. **Refused, not thrown**;
`lib/connection-notifications.test.ts` has 11 passing tests about two of them and could not see it.
Added, plus a floored guard that derives BOTH sides from the code.
⏭ **STILL OPEN and deliberately NOT built:** the **hourly nudge** ("post your story this hour") —
it needs § 3.2 answered AND this project is cron-free, so it must hang off a trigger, not a
schedule. And **nothing announces that somebody JOINED** a samahan (verified: the join action
emits nothing) — named, not built, because a third notice type is a decision, not an oversight.

### ◐ 2b · THE DAY DOES NOT COME BACK AS ANYTHING — HALF BUILT 2026-08-25 (PR #4842)
Setlog's actual engine is the nightly stitch — everyone's clips as one continuous vlog. Ours
expire one by one and nothing is assembled. **The renderer already exists and is shared by four
features** (`compressVideoForWeb` / the browser render path used by Patiktok, the thank-you film,
guest stories, the Papic reel maker), so this is a screen on a working engine, not a render farm.
⚠ Interacts with 2c: a stitched film that also expires at 24h may be worth less than the clips.

**SHIPPED 2026-08-25 — the WATCHING half, PR
[#4842](https://github.com/iscasasola/setnayan-platform/pull/4842).** Measured first: the viewer
opened ONE clip, on `loop`, behind a close button — so a day made of 3-second clips could never be
watched through, and `loop` was the mechanism (a looping clip has no end, so nothing could come
next). Now **Play the day**: oldest → newest, each clip plays once and hands over, with position,
a segment bar, Back/Next and arrow keys; tapping any clip plays from there to now. The strip stays
newest-first.
🔑 **NOTHING IS STITCHED AND NOTHING IS KEPT** — same clips, same 24 hours, played in order. The
**stitch** (one continuous file that outlives the clips) is still unbuilt and is gated on § 3.1,
because a stitch that survives IS a decision about what a samahan keeps.

### ▶ 2c · A SAMAHAN KEEPS NOTHING — and this is where money could sit
Stories die by design; chat is text. There is no shelf where a group's good moments survive.
**OWNER DECISION (see § 3).**

### ✅ 2d · A WHOLE SAMAHAN, IN ONE GO — BUILT 2026-08-25 (PR #4843)
🛑 **THE PREMISE HERE WAS HALF FALSE AND MEASURING IT CHANGED THE BUILD.** This row used to say
*"today a barkada and a guest list are strangers — you retype every name."* Against `origin/main`:
`getPeopleYouCanInvite` has carried a **`samahan` source since 2026-08-21**, second-degree members
included, so a barkada already appeared in the guest-list picker and **nobody retyped anything**.
What was missing was the GROUP — twelve taps for twelve friends.

So the smaller fix shipped: **a chip per samahan** (derived from the rows, never hand-listed) that
filters the picker, and **"Choose all N shown"**, which never touches somebody already on the list
and never disturbs a pick that is not currently shown. Every pick still goes through
`quickAddGuest` — a way to choose, not a second way to write.

🔑 **THE GROUP IS A FILTER, NOT A STORED LINK.** `guest_groups.source_community_id` is still
verified absent and was deliberately NOT added: a wedding list that changed because somebody left
a group chat is not a list the couple owns. **That also retires the snapshot-vs-live question that
deferred this item since 2026-07-15 — it never has to be answered.**

### ▶ 2e · SMALLER, VERIFIED ABSENT
- No photos/attachments in Usapan (deliberate: another moderation surface).
- **Nesting** — `communities.parent_community_id` absent; cascade semantics still undecided.
- **Discovery / public address** — `communities.slug` absent; every samahan is invite-link-only.
- **Memories tab** — never built.
- **Hard delete** — soft `archived` only. ⚠ Now interacts with the close ruling.

---

## 3 · OWNER DECISIONS — do not make these yourself

1. 🔴 **What a samahan KEEPS, and whether keeping is what we sell.** The 24-hour feed is the
   hook; Papic on a group event is the existing archive product. Whether a samahan gets its own
   permanent shelf — and whether it is free — is pricing, not engineering.
2. **Whether the hourly nudge is opt-in per samahan or per person**, and its quiet hours.
   (PH weddings/barkadas at 2am is a real complaint waiting to happen.)
3. **Whether a samahan should ever be findable** by someone not invited.

---

## 4 · TRAPS THIS STREAM ALREADY PAID FOR

### Added 2026-08-25, by an adversarial audit of that day's own merged work

- 🚨 **RLS IS A FLOOR, NOT A SCOPE — AND THE STORY ROUTE LEANED ON IT.** Its gate asked whether the
  caller could READ the community row, with a comment calling that airtight. The policy is
  `USING (community_id IN (SELECT current_community_ids()) OR public.is_admin())`, so a Setnayan
  admin who was never a member could post a clip into any private samahan — and, after the bell
  shipped, ring every member with it. **Usapan never had the hole**: a message is written through
  the caller's own session and its INSERT policy demands membership; a story is written with the
  service-role client, which is exactly when a read policy stops being defence in depth and becomes
  the entire fence. Ask a FACT (is there a membership row), with a client no policy can widen.
- ◐ **AUTOPLAY IS A GESTURE RULE, AND A REEL THAT ADVANCES ON `ended` IS A CHAIN OF NON-GESTURES.**
  Every clip after the first is mounted from an `ended` handler; iOS refuses to autoplay audio
  without a user gesture, and these clips always carry audio — so on a phone the film **stopped
  advancing by itself**. ⚠ **THE FIRST WRITE-UP OF THIS SAID "DEAD" AND "COULD NEVER MOVE AGAIN",
  AND THE REFUTATION PASS KILLED THAT**: the viewer renders Back/Next, binds the arrow keys, and
  the video carries `controls`, so the browser's own play button is both a retry and a gesture —
  nobody is stranded. What breaks is the AUTOMATIC promise, which is the whole feature.
  **If the only thing that advances a sequence is the media ending, the sequence stops the first
  time the media does not start.** Fall back to muted and keep going; step over a clip that cannot
  load. 🔑 And **unmuted-with-controls is the house shape** for a clip somebody tapped to watch
  (`papic-gallery-grid.tsx`); every muted `<video>` in this app is an ambient one.
- 🪤 **A LABEL IS NOT A MEMBERSHIP.** The samahan chip filtered by typing the group's name into the
  search box — a substring match over `from`, which carries `via[0]` only and is replaced entirely
  when cross-source de-duplication keeps a richer row. Real members were silently left out of "the
  whole barkada", and a group called "Ana" swept up Diana. Carry every group on the candidate and
  test membership exactly.
- 🪤 **NO SILENT CAPS.** `picks.slice(0, 200)` counted nothing past 200, so a 340-pick add returned
  `added: 200, failed: 0` and the sheet closed as if it had worked. The cap was old; a one-tap
  bulk control made it reachable.
- 🪤 **A PICK YOU CANNOT SEE CAN HOLD A BUTTON SHUT.** Add is disabled while a chosen one-word name
  has no surname — computed over EVERY loaded row, while the "Last name" box that satisfies it
  renders only for rows ON SCREEN. Chip → *choose all 12* → clear the chip, and three picks sat off
  screen holding Add shut, unnamed and uncounted; closing the sheet was the only escape and it
  discarded the selection. **Samahan rows are the population it bites** — one display-name string,
  and a group-chat handle is one word far more often than a guest-list entry. Fixed in PR #4847:
  the footer names the blockage and IS the control. ⚖ **A rule computed over everything, with a
  remedy rendered for a subset, is a dead end waiting for a bulk control to make it reachable.**
- 🛑 **AND THE AUDIT ITSELF NEARLY READ AS A CLEAN RESULT.** Five finders completed; **all eleven
  skeptic and critic agents died on a session usage limit**, so the run returned an empty survivor
  list. The findings were in `journal.jsonl` the whole time. **When a fan-out reports nothing,
  check whether it ran** — and verify unrefuted findings by hand rather than discarding them.
  ✅ **Resumed after the limit reset: 16/16 agents, finders replayed from cache. 7 of 10 survived,
  3 refuted, and the completeness critic found an 8th defect nobody had looked for.**


- 🚨 **A POLICY WITHOUT ITS GRANT CAN NEVER FIRE.** `community_members` had a DELETE policy and
  no DELETE grant, so **leaving was refused for every member since `20271023100000`** — whose own
  comment says it granted back *"the three verbs the shipped paths actually use"*, a list written
  from **remembered paths** while a DELETE policy sat in the same schema. **Enumerate the verbs
  from the POLICIES.** New guard: `a-samahan-lives-while-one-stays.db.test.ts` § *every verb a
  POLICY declares is a verb the role was GRANTED* — it must count **column** grants too, or it
  reports `events` (deliberately revoked) and cries wolf: 25 false rows → 9 real.
- 🚨 **A BRANCH WHOSE BASE PREDATES A MERGE WILL REVERT IT.** Twice today. One push would have
  deleted the 3-second recorder (338 lines + its test). **`git diff --diff-filter=D --name-only
  origin/main..HEAD` before every push.**
- 🚨 **A REBASE CONFLICT WHERE BOTH SIDES APPENDED FUNCTIONS** offers mine-or-theirs, and either
  choice silently deletes a working feature. Keep both, then **grep-count each function**.
- 🪤 **A PROGRAMMATIC DELETE CAN OVERSHOOT.** Removing `archiveCommunity` by searching backwards
  for a docblock took **five** functions; `tsc` caught it. Delete by an exact span and assert the
  span contains exactly one `export`.
- 🪤 **`npx tsx --test 'path/[communityId]/x.test.ts'` prints `# tests 0` and exits GREEN** —
  brackets are a glob character class. Escape as `[[]communityId[]]`. **An unrun suite prints the
  same green as a passing one.**
- 🪤 **`SECURITY DEFINER` disarms a `current_user` check** — inside a definer function
  `current_user` is the function OWNER, so every caller reads as privileged. Mutation-proved on
  both samahan field guards.
- 🪤 **The exposure baseline drifts on main by design** (the freeze only fails on WIDENING), so
  regenerating absorbs other people's narrowings. **Measure attribution before blaming your own
  diff:** with the migration removed it still moved 174/189 lines.
- 🪤 **A stale page is not a missing feature.** The owner reported Usapan as "still coming soon"
  after it merged; prod had it — the browser did not. **Check `/api/health` against the merge
  commit before diagnosing.**
