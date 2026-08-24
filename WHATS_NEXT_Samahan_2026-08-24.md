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

### ▶ 2a · NOTHING RINGS *(and it is far smaller than previously claimed)*
🛑 **CORRECTION: I told the owner twice that we have no push infrastructure. That was FALSE.**
It ships and is mounted: `PushToggle` on the profile page · `savePushSubscription` /
`removePushSubscription` · `emitNotification` with **61 call sites** · `/api/notify` sending via
`web-push` + VAPID. `push_subscriptions` exists in prod with **0 rows** — nobody has switched it
on.
⏭ **The work is therefore:** (1) confirm the VAPID keys are set in the hosting settings —
**not readable from a session**, `/api/notify` merely warns *"VAPID keys not set — skipping web
push"* and continues; (2) emit an hourly nudge for stories through the machinery that already
exists. **Do not scope a push build.**

### ▶ 2b · THE DAY DOES NOT COME BACK AS ANYTHING
Setlog's actual engine is the nightly stitch — everyone's clips as one continuous vlog. Ours
expire one by one and nothing is assembled. **The renderer already exists and is shared by four
features** (`compressVideoForWeb` / the browser render path used by Patiktok, the thank-you film,
guest stories, the Papic reel maker), so this is a screen on a working engine, not a render farm.
⚠ Interacts with 2c: a stitched film that also expires at 24h may be worth less than the clips.

### ▶ 2c · A SAMAHAN KEEPS NOTHING — and this is where money could sit
Stories die by design; chat is text. There is no shelf where a group's good moments survive.
**OWNER DECISION (see § 3).**

### ▶ 2d · YOU CANNOT INVITE A WHOLE SAMAHAN TO AN EVENT
Verified absent: `guest_groups.source_community_id` does **not** exist. Today a barkada and a
guest list are strangers — you retype every name. **This is the bridge between samahan and the
products Setnayan actually sells**, and the 2026-07-15 plan deferred it on unresolved fan-out
design (snapshot vs live membership, plus-ones, cap interactions) — still unresolved.

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
