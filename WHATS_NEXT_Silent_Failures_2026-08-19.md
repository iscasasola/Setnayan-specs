# WHAT'S NEXT — SILENT FAILURES, and what the owner should do (2026-08-19)

> **Written to be read by a DIFFERENT CLAUDE ACCOUNT on a possibly different machine.**
> Assume you have **no memory files** (`~/.claude/.../memory/` does not travel), no session
> history, and nothing local that is not committed. Everything needed is in this file.
>
> ⚠ **A HANDOFF IS NOT EVIDENCE — including this one.** Every claim below was verified on
> 2026-08-19 against the live site, shipped code at `origin/main`, or the production database,
> and each says which. Re-verify before acting: this document starts rotting the day it is
> written, and the register it supersedes was measurably wrong twice within 48 hours.

---

## 0 · 🛑 THE ONE TRAP THAT WILL COST YOU A WHOLE SESSION

**`/Users/icecasasola` IS A GIT CHECKOUT OF THE CODE REPO AND IT IS 749 COMMITS BEHIND
`origin/main`.** It sits on the #4287 merge, last touched 2026-08-13. It holds **ZERO** commits
`origin/main` lacks — it is a stale MIRROR, not unsaved work, and there is nothing in it to
rescue.

🔑 **NEVER READ CODE FROM `~`, AND NEVER POINT A SUBAGENT SWEEP AT IT.** On 2026-08-19 an agent
fan-out was aimed at `/Users/icecasasola` and returned a confidently-argued finding — with real
line numbers and a full control-flow trace — that a fix was redundant because a value was
"already in scope at line 913". On real `origin/main` that code had been **deleted**; the only
surviving match is a **comment**. The finding was internally coherent and completely wrong.

✅ Read current main with:

```bash
git worktree add --detach /tmp/wt-read origin/main
```

…and give subagents **that** path. A fresh worktree has no `node_modules`, so for anything that
runs (tsc, tests, lint) either reuse a worktree that has them or `pnpm install` first —
otherwise every tool "passes" while resolving nothing.

✅ **CLOSED, do not re-ask:** the 96 uncommitted files that `CLAUDE.md` flagged as a red OWNER
DECISION ("keep or discard that work") were **committed and merged as PR #4424 on 2026-08-13**.
The branch was deleted after merge, which is why the checkout reads clean and the branch cannot
be found locally. Nothing was ever at risk. Verified via `gh pr list --head` 2026-08-19.

---

## 1 · WHAT SHIPPED 2026-08-19 — do NOT rebuild any of it

**Ten PRs.** Seven merged and live — production self-reported the merge commits as it went
(`/api/health`), so that is measured, not inferred from GitHub. Three more (#4586 · #4587 ·
#4588) were opened later the same day and were still in flight when this was written; **verify
their state with `gh pr view` before assuming either way.**

| PR | what a person gets |
|---|---|
| [#4579](https://github.com/iscasasola/setnayan-platform/pull/4579) | Save can no longer delete the photo it is saving; an upload that **dies in silence** now says so |
| [#4580](https://github.com/iscasasola/setnayan-platform/pull/4580) | three screens would have shown a broken image the day a guest had a photo |
| [#4581](https://github.com/iscasasola/setnayan-platform/pull/4581) | the guest detail shows the guest |
| [#4582](https://github.com/iscasasola/setnayan-platform/pull/4582) | your face, not a letter — the home composer, and the call room's fake initials |
| [#4583](https://github.com/iscasasola/setnayan-platform/pull/4583) | a refused read no longer tells a couple they have **no guests** |
| [#4584](https://github.com/iscasasola/setnayan-platform/pull/4584) | the **phone's** guest summary stops inventing zeros |
| [#4585](https://github.com/iscasasola/setnayan-platform/pull/4585) | three regressions introduced by the six above |
| [#4586](https://github.com/iscasasola/setnayan-platform/pull/4586) | the code repo's auto-loaded `CLAUDE.md` points cold sessions here, with the traps inlined |
| [#4587](https://github.com/iscasasola/setnayan-platform/pull/4587) | a refused payments read no longer bills the couple for money they already paid |
| [#4588](https://github.com/iscasasola/setnayan-platform/pull/4588) | the Overview stops counting reads that never happened (**₱0 committed**, "0 of 21 booked") |

### The one disease behind all of it

**A failure that renders identically to success, or to emptiness.** Nothing throws, nothing logs
anything a person sees, CI stays green.

- an upload that **stops** fires no event at all — no `error`, no `abort`, no `load` — so the
  chip sat at 0% with a spinner **forever**, and "still working" and "dead" looked the same;
- a guest read that is **refused** returns `[]`, and the page then says *"No guests yet. Start by
  adding the couple's first invite."* to a couple with 180 names — **byte-identical** to a
  genuinely new event;
- a monogram sliced off a **status string**, so turning your camera off drew a circle reading
  **"C"** ("Camera off"), waiting drew **"W"**, your own voice tile drew **"Y"** ("You").

🔑 **A LOG LINE NEVER CHANGED A PIXEL.** In the guest case the error was already bound and
already sent to Sentry, and the couple was still told their wedding was empty. **The measurement
has to reach the RENDER.**

---

## 2 · ▶ THE IMMEDIATE BUILD — 11 confirmed, money first

The guest-list fix is **the couple's half** of a rule the supplier's side already adopted on
2026-08-18. **READ `apps/web/app/vendor-dashboard/reads-are-honest.test.ts` FIRST** — it is the
precedent and it defines what "fixed" means. Do not invent a new shape. Its three rules:

1. every destructure that pulls `data` out of a Supabase result must also bind `error` (the
   session read that pulls `user` out of `auth.getUser()` is exempt **by shape** — no error half);
2. any screen that **states** an absence gates that sentence on a **measured flag** AND shows a
   "We couldn't load…" line — logging alone is not a fix;
3. a refused read must **never** render as a money figure or a headcount of zero.

⚠ `actions.ts` files are **out of scope**: there an absence DENIES, and failing closed is correct.

The shape now in `apps/web/lib/guests.ts` is the model to copy: `fetchGuestsByEventMeasured`
returns `{ rows, measured }`; the ~30 callers that never state an absence keep the array-only
wrapper, which **delegates** rather than repeating the query, so the two cannot drift.

### The list — 11 confirmed, **1 merged (#4587)**, 10 still live (verified 2026-08-19, each survived an adversarial skeptic)

**Do money first: a wrong number about money is the worst version of this.**

⚠ **ONE MONEY FIX IS MERGED, THE OTHER IS NOT — CHECK BEFORE YOU TRUST EITHER ROW.**
**#4587 (the supplier payments figure) IS merged and live.**
🛑 **#4588 (the Overview's committed total and booked count) WAS STILL OPEN when this was
written, and this document said "FIXED · do NOT rebuild" anyway.** That is the worst possible
direction to be wrong in: a reader would have SKIPPED the item this doc's own ranking puts
FIRST, while a couple is shown **"₱0 committed"** against a real budget. Verify with
`gh pr view 4588 --json state,mergedAt` before believing either state.
🔑 **A PR THAT IS ARMED FOR AUTO-MERGE HAS NOT MERGED.** I armed it, wrote it down as done, and
never re-read the state. **"Merging" is not "merged" — check the object, not your intent.**

| where | who sees it | the false claim |
|---|---|---|
| `app/dashboard/[eventId]/_components/event-dashboard.tsx:657` ⏳ **fix written in #4588, NOT merged as of writing — verify** | couple | Budget tile renders **"₱0 committed"** against their real target, and "Your team — **0 of 21 booked**", and *"No vendors booked yet"* |
| ~~`app/dashboard/[eventId]/vendors/[vendorId]/workspace/page.tsx:630`~~ ✅ **FIXED #4587** | couple | **"Paid ₱0"**, so *remaining* becomes the **full** itemised total — the couple is shown owing money they already paid |
| `app/v/[slug]/page.tsx:858` | supplier | the **public shop page hero** renders a degraded booking count as a trust chip |
| `app/v/[slug]/page.tsx:3822` | couple | package inclusions vanish, so a package reads as offering nothing |
| `apps/web/lib/roles.ts:142` | supplier | a supplier **who already has a shop** is told to *"Create your shop"* |
| `app/_components/account-switcher/get-switcher-data.ts:136` | couple | albums degrade to `[]` → the library states *"You're not hosting…"* as fact |
| `app/dashboard/(account)/creator/page.tsx:165` | creator | **"Your chapters (0)"** over somebody's published work |
| `app/dashboard/(account)/profile/page.tsx:190` | couple | *"Nothing here"* under **Featured** consents they may actually have granted |
| `app/dashboard/(account)/year/page.tsx:79` | couple | *"Nothing on your calendar yet"* |
| `apps/web/lib/communities.ts:192` | couple | **"0 members · 0 events"** on a Samahan page the reader can only reach by being a member |
| *(the 12th was the guest list — **FIXED**, #4583/#4584)* | | |

⚠ **RE-VERIFY EACH ONE BEFORE FIXING IT.** They were confirmed against `origin/main` on
2026-08-19; commits land fast here (288 in five days at one point).

---

## 3 · 🔴 WHAT THE OWNER SHOULD DO — my recommendations, ranked

Written because the owner asked directly on 2026-08-19. Ranked, not a menu.

### 1. Use the product yourself. One real event, on a phone, for an hour.

**This is the top recommendation and it is not code.** Every defect found on 2026-08-19 was
invisible for one reason: **nobody has ever done the thing.** Production holds **8 events, 0
orders ever, and 14 Papic photos** (this sentence said "6 events, 0 photos" and disagreed with
this document's OWN measured section in §5 — the exact rot it warns about). The upload bug needed a connection to drop at the wrong second; the "C"
needed somebody to turn their camera off mid-call. Reading code finds only what someone thought
to read. An hour of real use will surface more than another day of sweeping — and it is the one
thing a session **cannot** do, because a session must not sign in as the owner or push his real
data around.

### 2. ~~Turn on compromised-password checking at sign-up.~~ ✅ **ALREADY SHIPPED — do not ask the owner for this.**

🛑 **THIS RECOMMENDATION WAS WRONG AND WAS GIVEN TO THE OWNER.** It came from the register's §6
"press-a-switch" list, which describes it as a console toggle. It is **not** a toggle: it shipped
**2026-08-18 as application code** — commit `b2d09fd5f`, *"feat(auth): refuse a password that is
already in a public breach list"*. Sending the owner into the database console would have cost him
a trip to find a switch that is not the mechanism.
🔑 **A REGISTER ENTRY IS A CLAIM, NOT EVIDENCE — INCLUDING WHEN IT IS ABOUT SOMETHING SMALL.**
I verified the register's *scariest* item before repeating it and skipped verifying the *easiest*
one, because it sounded cheap. Cheap is not the same as true.

The **supplier handshake flag** (`NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED`) is the other switch, and
it is safe **by arithmetic, not optimism**: no request is in flight and there is no booking that
could be re-opened, so flipping it changes nothing retroactively.

### 3. Treat `WHAT_IS_LEFT_2026-08-17.md` as suspect — it was wrong twice in 48 hours.

Its most alarming privacy item reads: *"The public page selling the photo service still says
photos are not matched by face. Every event is in the mode where they are."* **Both halves were
checked on 2026-08-19 and neither holds:**

- production is **5 events `mode_a` · 3 events `mode_b`** — *five of eight*, not "every";
- the live `/privacy` page is **honest and specific**: it says facial-geometry is derived from a
  selfie you choose to provide, that it is optional, and that matching stays scoped to the one
  event you consented to;
- `/features` does not mention faces at all, and `/papic` makes no such claim.

**Do not action that item as written.** More generally: anything about to be acted on from that
register should be re-verified first — it is cheap, and the failure mode is expensive.

### 4. Finish the money-figure reads (§2 above). Then stop hunting.

Honest assessment: this class of bug could be hunted for a long time and the returns fall off
quickly. After the money ones, switch from bug-hunting to the launch checklist — the rulings and
sign-offs in `WHAT_IS_LEFT_2026-08-17.md` §6 that **only the owner** can make. Those, not code,
are what stands between the product and opening.

### 5. Named, not fixed — a real cost, not a bug

The owner's profile photo is served at **~2 MB for a 40-pixel circle**, twice on the home page
(same URL, so one download). It bypasses the image optimiser deliberately, because the R2 link is
short-lived and `next/image` would re-transform it on every render — which Vercel **bills per
transformation**. Fixing it properly is a cost/design call (stable public URLs, or a rounded
signature window), not a bug fix. ~Zero today; scales with real galleries.

---

## 4 · 🪤 TRAPS FOUND 2026-08-19 — each one cost real time

**A GUARD THAT CANNOT MATCH THE LINE IT WAS WRITTEN TO CATCH.**
`a-guest-face-is-resolved.test.ts` used a lookahead `(?!\s*\?)` so the *fixed* ternary would not
self-trip. It swallowed `??` as collateral — and the Patiktok booth's pre-fix line was
**verbatim** `photoUrl: g.photo_url ?? null`. Proven by running the guard's own pattern against
the string recovered from git history: **false**. The guard shipped in the same commit as the fix
and could never have caught a regression. Now `(?!\s*\?[^?])`, re-verified by reverting the booth
to its historical bug and watching the suite go RED.

**A MUTATION RUN DESTROYED THE FILE IT WAS TESTING.** Backups were keyed on `basename` — and
**both the guest list and the Patiktok booth are called `page.tsx`**. The restore wrote the booth
over the guest list, silently; the "baseline" afterwards was measuring a **394-line** file where
**1568** belonged. Noticed only because two later mutations reported `TARGET ABSENT`.
🔑 **Key backups on the FULL PATH, and commit before you mutate.** This is the **second** time a
mid-mutation restore has eaten work in this repo.

**A FILE-LEVEL MATCH CANNOT SAY WHICH COMPONENT STILL KNOWS.** The measured flag is passed to
three components; a bare `/measured=\{guestsMeasured\}/` stayed **green** after sabotaging one
(count 2 → 1). Anchor per component, and **print the occurrence count before → after** — an
unmeasured mutation proves nothing.

**I VERIFIED THE ONE SIZE THAT COULD NOT FAIL.** The upload watchdog's only real-world check was
a **171 KB** file completing in ~1 s — precisely the size whose tail is instant, so it could
never exhibit the bug the watchdog then shipped with (a 45 s cap on the *server's reply*, which
would have aborted a healthy 300 MB save-the-date at 100%). **Choose the verification input that
can actually fail.**

**A CORS MISDIAGNOSIS SENT THE OWNER INTO A DASHBOARD FOR NOTHING.** An **unsigned** PUT to R2
was probed, "Failed to fetch" came back, and CORS was declared missing. Minting a **real
presigned** URL and doing the actual PUT returned **HTTP 200**. CORS was always correct.
🔑 **Probe with the real credential, or the result means nothing.**

**A CONFLICTING PR RUNS NO CI AT ALL** — `gh pr view` reported zero failing and zero running
checks on a PR that was simply `DIRTY`. Count the checks; absence is not success.

**`PIPESTATUS` IS BASH-ONLY.** In zsh it is empty, so `echo "exit=${PIPESTATUS[0]}"` prints
nothing and reads as success. Use `pipestatus` in zsh, or capture `$?` directly.

**RUN UNIT TESTS FROM `apps/web`.** The `@/…` alias resolves from that package's tsconfig; from
the repo root every such import dies with `Cannot find module '@/lib/…'` — including the
repo's own existing guards, which is the tell that the invocation is wrong, not the test.

---

## 5 · Verified production state, 2026-08-19

Measured against the live database and the live site, not remembered.

- **8 events** · **39 guests** (largest roster 32) · **2 shops** · **0 orders ever** · **14 Papic photos** (13 stills + 1 clip, all on one event, none hidden)
  ⚠ This line said **"0 photos"** when written. It was wrong — measured 14. **Do not treat the
  gallery as empty when reasoning about retention, the compression sweep, face-matching or the
  photo wall.**
- `papic_face_mode`: **5 `mode_a` · 3 `mode_b`**
- The owner's profile photo is set and rendering (top bar **and** home composer)
- `users` RLS: enabled, policies scoped to `{authenticated}` only — the `anon` SELECT/UPDATE
  grants on `profile_photo_url` are **dead grants**, not a hole (verified: no policy admits
  `anon`)
- Main's CI is **green**; the `WHAT_IS_LEFT_2026-08-17.md` §6f "STOP — main's CI is red" gate is
  **stale and closed**, and all four "red for two days" PRs are resolved (3 closed, 4 merged)
