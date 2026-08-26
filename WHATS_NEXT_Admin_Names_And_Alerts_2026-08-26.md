# WHAT'S NEXT — the admin's names, and whether it can reach you

**Written 2026-08-26 at the owner's instruction ("save all unfinished to what's next now").**
Everything here was measured against `origin/main` and the live site on the day. ⚠ **A handoff is
not evidence — re-verify before acting.** Every PR state below should be confirmed with
`gh pr view <n> --json state,mergedAt`; this project's registers have been wrong about a PR's
state five separate times.

---

## 1 · SHIPPED TODAY — do NOT rebuild any of it

| PR | what a person gets | state |
|---|---|---|
| [#4874](https://github.com/iscasasola/setnayan-platform/pull/4874) | the six menus finally **show** their new names — rail + phone | **MERGED**, merge `5219cc3`, verified live at width 1133 and 375 |
| [#4881](https://github.com/iscasasola/setnayan-platform/pull/4881) | the **destination pages** say what the menus say | **MERGED**, merge `73a89dc`, verified live on all 8 pages |
| [#4885](https://github.com/iscasasola/setnayan-platform/pull/4885) | a blocked device is **told how to unblock**, per device — on the admin/couple toggle **and** the vendor card | ✅ **MERGED** `2026-08-26T08:35:08Z`, all 15 checks green |
| [#4887](https://github.com/iscasasola/setnayan-platform/pull/4887) | the vendor card's "Enable" button **actually enables** instead of pointing at a banner that may be hidden | ⏳ **OPEN, auto-merge armed** |

✅ **UPDATE 2026-08-26, LATER SAME DAY — #4885 CONFIRMED MERGED, AND THE ONE REMAINING GAP IT LEFT
IS NOW #4887.** #4885's "cannot enable at all" fix only reached the DENIED branch (it told a
blocked vendor how to unblock). The DEFAULT branch — permission never asked yet — still said
*"Allow via banner below"*, and `PushNotificationRegistrar` hides that banner for **30 days** once
a vendor dismisses it once. A vendor who dismissed the banner and later opened Settings meaning to
turn push on found a sentence pointing at nothing on screen. #4887 makes the card enable inline
(same `registerPushToken('web')` path the registrar uses) so the button always does something,
regardless of the banner's own state. `deactivateAllPushTokens` (disable) is unchanged — still the
reason this card is not simply replaced by the shared admin/couple toggle.
🔑 **`ADMIN_NAV_ALIASES` was checked against #4874/#4881 and needs nothing added** — both renames
that reach the search index (`overview`→"Today", `app-performance`→"Numbers") already have alias
entries, added in the same 2026-08-26 session that made the renames.
`the-menu-name-has-one-source.test.ts` passes its "renamed item keeps its old name findable"
assertion (9/9). The bottom-nav-only caption changes ("Accounts"→"People", the retired
"Performance" tab) do not feed the search index at all — `admin-destinations.ts` never reads
`NAV_SLOT_DEFAULTS` — so there is no alias gap to fill for them.

🚨 **THE VENDOR CARD WAS THE WORST OF THE THREE AND WAS FOUND ONLY BY A COMPILER ERROR.** It is a
*different component* from the shared toggle. It **cannot enable at all** — it defers to a banner
mounted by the vendor layout — and when blocked it rendered five words (*"Blocked in browser
settings."*) followed by `: null`: a dead card, no control, nowhere to go. It now shows the same
per-device steps. It was **not** replaced by the shared toggle, because it owns a server-side
switch-off the shared one lacks.

### 🔑 THE ONE LESSON WORTH CARRYING: a rename that misses the copies is a diff

The menu recut merged on 2026-08-25, deployed, and the owner opened the console the next morning
and said **"it still looks the same."** He was right and the rename was real — **the name he READS
was a different copy.** The menu name lived in **three** places and only one had been renamed:

1. `ADMIN_NAV_GROUPS[].label` — the wide rail above 1280px. **Renamed.**
2. `STRIP_CAPTION` in `admin-rail-context.tsx` — the word under the icon **between 1024 and
   1280px**, where the stylesheet hides `.fd-label-text` and shows `.fd-icon-caption`. **At that
   width the caption IS the menu.** Not renamed.
3. `NAV_SLOT_DEFAULTS['admin.bottom-nav.*']` — overlaid **on top of** the hardcoded label, so
   **the registry wins on every phone.** Not renamed.

**The tell was in the product the whole time: Money was the one phone tab reading correctly, and
it is the one tab with NO registry slot.** When a change lands unevenly, the odd one out names the
cause.

### The sidebar is a THIRD overlay of the same kind
`applyAdminRegistry` overlays `admin.sidebar.*` onto **item** labels too — 62 slots. A scan found
one already drifting invisibly: code **"Real Stories"**, registry **"Stories"**, registry winning.
Now zero drift, and guarded.

### ⚠ Renaming a menu label silently deletes a search word
A menu item's searchable words are `label + group label + description + alias`. **The route is NOT
among them** — only redirect stubs contribute their address. So renaming "App Performance" to
"Numbers" would have made *"app performance"*, typed for months, return **nothing** — which looks
identical to a page that does not exist. `ADMIN_NAV_ALIASES` is the existing mechanism; put the
retired name there **in the same commit as the rename**, and prove it by running the search.

### ⚠ An `<h1>` in the HTML proves nothing about what is visible
`PageMasthead` renders its title **`sr-only`** in this repo — clipped to 1×1. A regex over fetched
HTML, and even `offsetParent !== null`, both report it present. Only `getBoundingClientRect()`
width/height tells you a person can see it. **Of six "wrong page names", exactly ONE was on
screen** (the entity map's heading at 391×23px); the rest were browser-tab titles and
screen-reader names. All worth fixing — but say which is which.

---

## 2 · IN FLIGHT — the only thing not finished

### ✅ PR [#4885](https://github.com/iscasasola/setnayan-platform/pull/4885) — "the switch says how to unblock" — MERGED
Confirmed `2026-08-26T08:35:08Z`, all 15 checks (typecheck+lint, e2e, lighthouse, prod build,
bundle size, secret scan, 8 admin lints, migration guard) SUCCESS. **Do not re-verify this one —
it is done.**

### ⏳ PR [#4887](https://github.com/iscasasola/setnayan-platform/pull/4887) — "the push card can enable itself"
**OPEN, auto-merge armed.** Closes the one thing #4885 left open (see § 1 update above): the
vendor card's DEFAULT-state "Enable" pointed at a banner that hides itself for 30 days once
dismissed. Now enables inline. Local `tsc --noEmit` ran clean (0 errors) and both test files it
touches pass in full (9/9, 11/11) — nothing here needs re-checking beyond confirming the merge.

**To finish (#4887):**
1. `gh pr view 4887 --json state,mergedAt,statusCheckRollup` — confirm it merged and no check failed.
2. Confirm production serves it: `curl -s https://www.setnayan.com/api/health` and check the merge
   commit is an **ancestor** of the served version (other sessions merge constantly, so the served
   commit will not equal yours).
3. Then verify the thing itself, in **`/vendor-dashboard/notifications`** on a device that has
   dismissed the layout's push banner (or never seen it): confirm an "Enable" button appears and
   pressing it opens the browser's own permission dialog, rather than a sentence with nothing to
   press.

**What it does:** `Notification.requestPermission()` opens a dialog **once per device**. After a
denial it resolves to `'denied'` instantly with **no prompt, ever again**, and no code can re-open
it. The screen used to meet that with one sentence and no way out. It now shows numbered steps for
the detected device, names the **second silent gate on macOS** (site allowed, OS swallowing), and
**watches for the unblock** via the Permissions API `change` event plus `visibilitychange`/`focus`
— so the switch flips itself when you come back from settings instead of looking dead.

**It also fixes a defect I introduced in #4853:** the shared toggle carried **couple copy into the
admin console**, promising the operator *"when a vendor messages you or a new inquiry comes in."*
It now takes an `audience`. 🔑 **A shared component inherits the copy of whichever tree it was born
in; moving it does not re-audience it.**

---

## 3 · OWNER ACTIONS — not engineering

| # | what | why it is yours |
|---|---|---|
| 1 | **Unblock notifications for setnayan.com** in the browser you actually work in | Measured live: `notificationPermission: "denied"`. Everything else is ready — push supported, service worker registered, VAPID keys already set. **A site can never re-prompt itself.** #4885 puts the steps on screen. |
| 2 | **Press Force-complete on the `SONGDESK TEST` row** | It is the only "1 overdue" in the console and it is a **seeded test fixture**, not real work. Clearing production data is your call, not mine. |
| 3 | **Rule on the AI search box being built in another session** | It appears to reverse your own `DECISION_LOG.md` 2026-08-03 ruling — *"remove the concept of Admin AI … AI for admin if ever there is should run autonomously."* You may supersede your own ruling; you should just be doing it knowingly. Three shipped constraints it must respect are in [[project_setnayan_admin_ai_search_box_other_session]]. |
| 4 | **Decide whether the Ugat subsystem itself should be renamed** | Only the *words a person reads* were changed. `UGAT_TYPES`, `lib/ugat/graph.ts`, the two required db tests, the route `/admin/ugat` and every address are untouched. Renaming a named subsystem is a real change with a blast radius, not a label fix. |

---

## 4 · NAMED, NOT BUILT — small, honest, and deliberately left

1. 🛑 **A CLAIM I WROTE HERE AND THEN DISPROVED — corrected in place, an hour later.** This line
   said `app/vendor-dashboard/notifications/push-toggle.tsx` was *"a dead file, verified mounted
   NOWHERE (0 import sites)"*. **It is mounted** — `vendor-dashboard/notifications/page.tsx`
   imports it by relative path (`./push-toggle`), not the shared one. **`tsc` is what proved it**:
   passing the new `audience` prop there failed to compile. 🔑 **The false claim came from a grep
   whose `--include` flag errored under zsh — it printed a "no matches found" error and I read the
   zero as a result.** *A grep that errored is not a zero result.* The card is now fixed rather
   than deleted (see § 1) and **must not be replaced by the shared toggle**: it owns
   `deactivateAllPushTokens`, a SERVER-side switch-off across every device the vendor has
   registered, which the shared toggle does not have. Swapping it deletes that inverse.
   Consolidating the two properly is real work, not a tidy-up.
2. **A second push implementation that is FINE:** `push-notification-registrar.tsx` (248 lines) is
   mounted on the vendor layout. **Checked: it does NOT auto-prompt** — it renders a banner and
   only calls `requestPermission()` from a click, with a dismiss cooldown. It is consolidation
   debt, **not** the cause of any block. Do not "fix" it as if it were.
3. **16 admin nav items have no registry slot**, so they cannot be renamed from `/admin/menus`:
   `chat-flags · repost-watch · corrections · data-privacy · integrity-watch · verification-docs ·
   founder-seats · patiktok · integrations · secrets · papic-storage · demand · seo · booking-fees ·
   custom-plans · referrals`. Same for the **Money** phone tab. Harmless asymmetry; adding slots is
   a product surface change, not a bug fix.
4. **`/admin/ugat`'s browser title names the active tab, not its menu** ("Menus & icons · Admin").
   Left deliberately — it names something true. A uniform `<tab> · <menu> · Admin` shape across the
   tabbed hubs would be nicer and is a design call.
5. **`relrowsecurity` is VACUOUS in the PGlite replay** (inherited, from earlier work): a brand-new
   table with no policy already reports row security ON, and **15 db test files assert that flag
   where none of them can fail.** Pinned with a live probe; **named, not fixed.**

---

## 5 · TRAPS PAID FOR TODAY — assume a sixth

- 🪤 **`tsc` printed `errors=0` at EXIT 134** — SIGABRT, an out-of-memory crash, not a pass.
  Re-running with `NODE_OPTIONS=--max-old-space-size=8192` surfaced two real errors.
  **Print the exit code BESIDE the error count, and read the exit code first.**
- 🪤 **`git checkout --` silently reverted an un-committed guard widening** during a mutation run.
  Caught only because the next `git commit` said *"nothing to commit"* — the guard and the code
  agreed, so everything was green. **Commit before you mutate; restore from an explicit `cp`
  backup, never from the index.** Already on record here, and it still happened.
- 🪤 **Two of my own guards were decoration, both caught only by mutation.** One walked `page.tsx`
  and matched `title:`, so it caught five browser-tab titles and **missed the one genuinely
  VISIBLE offender** (JSX text in a `_components` file) — putting the old name back left the suite
  GREEN. The other asserted a copy map *existed* while nothing checked the render *used* it;
  hardcoding one audience for everybody — the exact bug — stayed GREEN.
  **A grep cannot tell a name appearing from a name being used.**
- 🪤 **A DOM probe that filtered to leaf nodes could not match** the one heading it was looking
  for, because that heading contains a `<span>`. It reported the string absent when it was
  visible at 391×23px. **A search that cannot match is not a negative result.**
- 🪤 **An existing guard correctly refused a rename** by pinning each ported surface's exact
  masthead title — a *fifth* copy of the page name. Updated deliberately and commented as a pin,
  **not edited reflexively to go green.**
