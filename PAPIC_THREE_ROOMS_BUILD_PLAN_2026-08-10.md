# Papic page → three rooms · BUILD PLAN (2026-08-10)

> Authored by Fable from a 37-agent survey whose every finding was adversarially
> verified against `origin/main`. To be executed by Opus.
>
> **Authority stack:** owner corrections of 2026-08-10 (binding) >
> `design_handoff_papic_redesign/` > the survey's verified findings > this plan's
> line anchors. **Re-verify any line number before editing.**
>
> Companion: [`Papic_Page_Redesign_Brief_2026-08-10.md`](Papic_Page_Redesign_Brief_2026-08-10.md)
> — the brief sent to Claude Design, plus the owner's four corrections to what
> came back.

**Target:** `apps/web/app/dashboard/[eventId]/studio/papic/page.tsx` (1,785 lines)
→ three rooms behind a tab strip: **Photos · Cameras & shots · Set up**.

## Preflight — before writing a line

- `/Users/icecasasola/wt-read` is **stale** (50+ commits behind). Never read it
  directly. Work from a fresh branch + `git worktree add` **immediately after
  branching** (the shared main checkout has been clobbered 3× before). Read
  current main with `git show origin/main:<path>`.
- Prune each worktree the moment its PR merges. Never batch cleanup.
- Every PR: a `changelog.d/<branch-slug>.md` fragment with a `SPEC IMPACT:` line.
  PRs 8, 9, 11, 12 have real spec impact — apply the corpus edit per the
  `COWORK.md` sequence and add the `DECISION_LOG.md` rows in the same commit.
- Auto-merge is the standing default (`gh pr merge --auto --merge`) for every PR
  here **except PR 11**, which inherits `do-not-auto-merge` from #4304.
- Local `npm run build` is impossible (7 GB heap); only CI's `next build` sees an
  RSC break, and CI's `tsc` is stricter than local. CI is the sole detector for
  those two classes.
- `npx tsx --test "app/[eventId]/…"` — the brackets are a glob character class;
  it runs **nothing** and exits green printing `# tests 0`. Run suites via
  `pnpm --filter @setnayan/web test:unit`, and after any targeted run confirm
  `# tests` > 0.

## The two governing principles

1. **Structure first, corrections second.** PRs 1–6 are pure moves — every moved
   block byte-comparable to what it replaced, so review is a content-equality
   diff and the five source-text guards break only on paths, never on substance.
   PRs 7–12 are behaviour/copy changes, each small. **Never mix a move and a
   change in one PR.**
2. **The landing rule is already decided.** `captureWindowState(validFrom,
   validUntil, now)` (`apps/web/lib/papic-window.ts:148`) returns exactly
   `'not_started' | 'open' | 'closed'`, and the accepted handoff maps them:
   before the window → **Set up** · open → **Cameras** · closed → **Photos**.
   One deliberate override: `captureWindowState` **fails OPEN on null bounds**
   (by design — never brick a legacy seat), so the landing derivation must branch
   **before** calling it: if `ev.papic_window_start` is null (page.tsx:299), land
   **Set up** with the unset-window attention row (pinned atop Cameras *and* Set
   up). Do not touch the fail-open capture semantics themselves.

Room resolution precedence: **(1)** explicit valid `?tab=` → **(2)** outcome-param
map → **(3)** window-state derivation. Param is `?tab=` with values
`photos | cameras | setup` — matching the six shipped `?tab=` shells and the
handoff's own state names. Do not invent `?room=`.

---

## A · What ships to the couple, in order

1. **The page opens on the right room for where they are.** Before the window:
   Set up. On the day: Cameras. After: Photos. Three tabs, everything from today
   still reachable, nothing lost. — *PR 1: tab strip + in-place conditional
   groups, zero file moves.*
2. **Every save now answers.** Changing the look, photo quality, face matching or
   vendor-capture visibility — all of which currently save (and fail) in complete
   silence — now confirm or explain. — *PR 2: eight emitted-but-unread outcome
   params wired into `StatusBanners`.*
3. **The page gets lighter on a phone.** Each room loads only its own data instead
   of all twenty cards' worth. — *PRs 3–5: room extractions with per-room fetch
   gating; PR 6 tidies the header. No visible change beyond speed.*
4. **The mission board shows what missions cost and what's left to spend.** Nobody
   commits guests to shots on a screen with no balance in sight. — *PR 7.*
5. **New events start on Optimal photo quality.** All three choices stay; existing
   events don't move. — *PR 8, owner correction #3.*
6. **A multi-day celebration keeps its originals a full three months after the
   LAST day**, not the first. — *PR 9, owner correction #4.*
7. **Choosing to keep a photo sharp actually keeps it sharp — video included.**
   Today the choice would be silently ignored. — *PRs 10–11.*
8. **The preserve story tells the truth:** what's included, for how long, what
   paid preservation adds, and that nothing is ever deleted — only compressed. —
   *PR 12, owner correction #2, with drift guards.*

---

## B · The PR sequence

Every PR leaves the page fully working on main. Verification for every PR
includes: the full unit suite, **all** `apps/web/scripts/lint-*.mjs` (CI's "lint"
is a family of ~12 scripts), and the suite under `Asia/Manila` as well as UTC
wherever dates are touched.

### PR 1 — `feat(papic): three rooms behind a tab strip, nothing moves yet` · **M**

**Changes.** In `page.tsx` only:
- `TABS = ['photos','cameras','setup'] as const` + whitelist coercion, copied
  from the shipped shape at
  `apps/web/app/dashboard/(account)/samahan/[communityId]/page.tsx:49` and `:78-80`.
- Strip = `<Link href="?tab=…">` items styled with the shipped `.sn-seg` /
  `.sn-seg-item` primitive (`apps/web/app/globals.css:403-438`, active via
  `aria-current="page"`).
- Wrap the existing JSX into three `{tab === '…' && (…)}` groups **in place**.
  **Photos** = preserve/Keep-Full-Res block (~523–563), `GalleryPreviewCard`,
  `VendorMediaControls`, `PoolGalleryCard`, `MagazineCard`, `RecapCard`,
  moderation link. **Cameras** = unlock CTA, "Your cameras" (QR links,
  `LimitedCard`, `ExtraCamerasPicker`, and — until PR 4 — `PapicWindowPicker`),
  `HostPoolMeterCard`, `PapicPoolCard`, `PapicOneCard`, `GuestContributionsCard`,
  `GuestCamerasChoice`. **Set up** = `StylePicker`, `QualityPicker`,
  `StorageChoiceCard`, `FaceTaggingChoice`, `CoupleChallengesManager`,
  `VendorChallengesApproval`, `LiveWallCard`, DSLR/shutter/capture-defaults + help.
- Shell (never inside a room): back link, header, `StatusBanners` **above the
  strip** (a banner is visible whatever room resolves — belt and braces against a
  map miss), the five render-time writes, `MiniTour`.
- Outcome-param map (one pure function, unit-tested): `storage_*` / `drive_*` /
  `papic_window_*` → setup; `papic_purchased` / `papic_ref` / `papic_amount` /
  `papic_error` / `papic_one_error` / `papic_pool_error` /
  `papic_unlock_provisioned` / `limited_*` → cameras. **Do not touch the ~95
  `redirect()` sites** (83 in `actions.ts` alone, plus `face-tagging-actions.ts`,
  `vendor-visibility-actions.ts`, `guest-window-actions.ts`) — they rebuild the
  query string from scratch; the map achieves the same landing in one function
  and cannot be half-applied.
- Delete the dead `await` at page.tsx:234 (`ownsPapicSeats` — destructured,
  referenced nowhere else): one wasted query per render.

**Why first.** The only structurally complete step that changes no file
boundaries, so every source-text guard and both baselines stay green **by
construction**.

**Verification.** All five page-pinning tests pass untouched:
`papic-pool-buyable.test.ts:38/:80-87`, `papic-camera-capacity.test.ts:41/:69-81`,
`papic-gallery-scope.test.ts:67,80`, `vendor-media-switch.test.ts:22`,
`couple-face-choice.test.ts:86`. `node apps/web/scripts/lint-port-no-lost-controls.mjs`
— the route's baseline entry (`port-control-baseline.json:5129` — 29 files / 11
destinations / 17 actions / 51 blocks) unchanged. **Mutation:** delete one room's
`&&` branch, confirm the port guard goes red on lost destinations; restore,
confirm green.

**Ships alone?** Yes. Worst failure: a wrong map entry lands the couple on the
wrong tab with every card still two taps away.

### PR 2 — `fix(papic): eight save confirmations that were written and never shown` · **S**

**Changes.** `style_set` / `style_error` (actions.ts:382), `quality_set` /
`quality_error` (:421), `showcase_set` / `showcase_error` (:647, :700), plus
`faceTagging` and `vendorMedia` from their action files, are each emitted by a
redirect and read by **nothing** — none appears in the searchParams type at
page.tsx:124-141. Add all eight to the type, render them in `StatusBanners`, and
extend PR 1's map: `style_*` / `quality_*` / `faceTagging` → setup; `showcase_*` /
`vendorMedia` → photos.

**Why here.** Completes the room map before any extraction, and correction #3 is
about to put more traffic through the quality control while its confirmation goes
nowhere.

**Verification.** Extend `apps/web/lib/guards-can-actually-fire.test.ts` (it
already enforces "every settle-style outcome must have somewhere to be shown").
Mutation: remove one param from the banner render, confirm the guard fires. Keep
its scan scoped to the query/param chain — a guard that cries wolf teaches
skimming.

**Ships alone?** Yes — pure addition.

### PR 3 — `refactor(papic): extract the Cameras & shots room` · **M** ← **RISKIEST**

**Changes.** Move the Cameras JSX (including both purchase forms and both money
components) into `_components/rooms/cameras-room.tsx`. Gate cameras-only **reads**
on the active tab using the samahan pattern (`[communityId]/page.tsx:93-106` —
ternary branches inside one `Promise.all`).

**The five render-time writes stay in the shell, above the room switch,
unconditionally:** `provisionFreeCamerasAdmin` (~:352),
`ensureFreePapicPoolGrantAdmin` (~:365), `ensureFreePapicOneCameraAdmin` (~:372),
`reconcileLimitedSnapshot` (~:393), `syncGuestCameras` (~:397). All five are
Cameras-flavoured; filing them with the room is the natural and **wrong** move —
see §C. The window data also stays in the shell: the landing derivation needs it
on every render anyway.

**Folder name is load-bearing:** `port-controls.mjs:148` walks only `_components`
and `_lib` (at any depth), so `_components/rooms/` is free while a sibling
`rooms/` or `_rooms/` silently strips the route's actions off the baseline.

**Verification.** Re-point `papic-pool-buyable.test.ts:38` and
`papic-camera-capacity.test.ts:41` at the new file — never delete them (§D). Run
`lint-port-no-lost-controls.mjs` — all 11 destinations and 17 actions must
survive. **Add the reachability test:** render the page path for a Photos-tab
request and assert all five self-heal calls fired (mock the admin client, count
invocations). Mutation: gate one write behind `tab === 'cameras'` and confirm
that test fails.

**Ships alone?** Yes, if the side-effect boundary holds — which is what makes it
riskiest.

### PR 4 — `refactor(papic): extract the Set up room; the window control moves in, Cameras keeps a read-only echo` · **M**

**Changes.** Move Style, Quality, Storage, Faces, Challenges manager, Vendor
approvals, LiveWall, DSLR/shutter/capture-defaults + help into
`_components/rooms/setup-room.tsx`. Move `PapicWindowPicker` (currently ~:616,
inside "Your cameras") into Set up. **Resolve the window conflict decisively:**
`LimitedCard` and `ExtraCamerasPicker` consume `windowStart`/`windowEnd` because
the window sets billable days — so Cameras renders a one-line **read-only**
window summary (dates + day count via `inclusiveDays`) linking to Set up. The
control lives in Set up; the quote keeps its explanation. The unset-window
attention row renders atop **both** Cameras and Set up.

**Two files must not move:** `guest-camera-tier-picker.tsx` and
`extra-cameras-picker.tsx` are pinned **by path** in
`papic-copy-guardrails.test.ts:52/:61` with unguarded `readFileSync` — moving
them turns a readable failure into ENOENT. Leave them at the route root; mount
from the room.

**Verification.** Re-point `couple-face-choice.test.ts:86`.
`face-choice-readable.test.ts:41` pins `_components/face-tagging-choice.tsx` at
its current depth — don't re-file it. Add `setup-room.tsx` to
`papic-copy-guardrails.test.ts`'s **authored list** (it is a list, not a glob).
`papic-guest-copy.test.ts` walks all `.tsx` automatically.

**Ships alone?** Yes.

### PR 5 — `refactor(papic): extract the Photos room` · **M**

**Changes.** Move gallery, preserve/Keep-Full-Res block, `VendorMediaControls`,
`PoolGalleryCard`, `MagazineCard`, `RecapCard`, moderation link into
`_components/rooms/photos-room.tsx`. **Keep all child-route links as links**
(`/crew`, `/crew/print`, `/gallery-zip`, `/magazine`, `/moderation`, `/recap`) —
absorbing moderation into an inline panel deletes a baselined destination.
`_components/papic-pool-card.tsx` and `_components/face-tagging-choice.tsx` stay
at their pinned depths.

**Verification.** Re-point `papic-gallery-scope.test.ts:67,80` and
`vendor-media-switch.test.ts:22`. `:80` pins the literal caveat copy
`aren&rsquo;t\s*\n?\s*shared with you` — move it byte-identical (a Prettier
reflow breaks it; if forced, loosen only the whitespace, keep the words).

**Ships alone?** Yes.

### PR 6 — `chore(papic): mount PageMasthead, shrink the baseline` · **S**

**Changes.** Replace the hand-rolled header (`<header className="sn-reveal
space-y-2">` + `<p className="sn-eye">Capture</p>`, :463-465) with
`<PageMasthead>`; delete **only** line 81 of `page-masthead-baseline.json`.
`PageMasthead` deliberately has no eyebrow prop — "Capture" does not come along,
and must not be re-added as a `<header>`-wrapped room label.

**Why after the extractions.** `lint-page-masthead.mjs` scans every `.tsx` under
`app/dashboard` — each room file is a fresh offender surface, so those PRs must
be born masthead-clean and this one closes out the page.

**Verification.** `node apps/web/scripts/lint-page-masthead.mjs`. Mutation: add a
`<header>` + `.sn-eye` to a room file, confirm exit 1, revert. The baseline
shrinks only — never add a line.

**Ships alone?** Yes.

### PR 7 — `feat(papic): the mission board shows what missions cost and what's left in the pool` · **S**

**Changes.** Challenges sit in Set up while every mission spends the shared pool
whose balance lives in Cameras. `couple-challenges-manager.tsx` contains zero
occurrences of shots/points/cost today, but the schema already carries the type —
`papic_challenge_library.capture_kind` (`photo|clip|pabati`) and
`papic_missions.capture_kind` both ship in migration `20271117738153`. **No new
schema.** Thread the pool balance (already fetched for `HostPoolMeterCard`) plus
per-mission cost into the board; derive every figure from `capturePointsFor(kind)`
/ `PAPIC_POINTS_PER_CLIP = 8` (`lib/papic-cameras.ts:770`) — never re-type a
number (a photo is 1, a clip is **8**; the corpus's stale "7 points" line must not
be trusted over the code). Footer totals "N shots / guest".

**Verification.** Follow `papic-camera-capacity.test.ts:92`'s model — build the
assertion regex **from the constant**. Add the board component to
`papic-copy-guardrails.test.ts`'s list. Mutation: hard-code `8` in the new copy
and confirm the derived-figure assertion fails.

**Ships alone?** Yes.

### PR 8 — `feat(papic): new events start on Optimal quality` · **S**

**Changes.** Owner correction #3. All three choices stay; only the default moves.
The column is `events.papic_quality_tier TEXT NOT NULL DEFAULT 'full_res'`
(migration `20270825539466`) — **NOT NULL means every existing row already has its
value materialized**, so `ALTER TABLE public.events ALTER COLUMN
papic_quality_tier SET DEFAULT 'optimal';` touches only future rows. The five prod
events stay on Full resolution untouched.

**The constant must be split, not flipped.** `DEFAULT_PAPIC_FIDELITY = 'full_res'`
(`lib/papic-fidelity.ts:37`) serves **two masters**: the new-event default *and*
the ingest **error-path fail-safe** (`papic-ingest-fidelity.ts:62,67` returns it
when the read fails). Flipping it wholesale would make a failed database read
**downscale someone's originals** — destroying resolution on an error path,
silently. Split into `NEW_EVENT_PAPIC_FIDELITY = 'optimal'` and
`FIDELITY_READ_FAILSAFE = 'full_res'`, and point each consumer at the right one.

**Verification.** `papic-fidelity.test.ts:21-22` pins the merged constant — its
premise changed by owner ruling; rewrite as two assertions (§D). Add a
migration-text assertion that the DB default is `'optimal'` while the CHECK still
lists all three tiers. Allocate with `pnpm migration:new`; after merge **verify
the object in prod**, never `schema_migrations`.

**Ships alone?** Yes.

### PR 9 — `fix(retention): the 3-month floor counts from the event's END` · **M**

**Changes.** Owner correction #4. The floor today reads `e.event_date` only
(migration `20271102113000`, body `:62`, predicate `:72-74`);
`public.events.event_end_date` exists and is not consulted. New migration
replacing the date term with `GREATEST(COALESCE(e.event_end_date, e.event_date),
e.event_date)` — the COALESCE is the owner's stated fallback; the GREATEST is
defensiveness so a malformed end date can only *extend* the promise. **Sweep every
site that computes or describes the floor:** the function,
`lib/papic-fullres-drop.ts`, `daily-email-jobs.ts:423/:493` (the warning email
must not warn later than the sweep runs), `papic-fullres-clock.test.ts`, and
page.tsx:197's event select. *Matching a twin means matching what it MEANS.*

**Do not** re-litigate the `::timestamptz` cast or the 92-day figure — 92 covers
the longest 3-calendar-month span and already absorbs the offset.

**Verification.** PGlite replay applies in filename order — allocate forward with
`pnpm migration:new`. The guard must match the **arithmetic with word
boundaries**, not a prefix. Run under `Asia/Manila` and `UTC`. After merge, check
the function body **in prod by the object**.

**Ships alone?** Yes — it can only lengthen retention, never shorten it.

### PR 10 — `fix(preservation): the per-capture choice never reaches the sweep` · **S**

**Changes.** Confirmed live-on-main defect: `papic-fullres-drop.ts:481` reads
`if (keep && !it.preserve_declined_at)`, but none of the four mappers in
`papic-fullres-drop-core.ts` assigns the field — it is optional in the type,
always `undefined`, and the predicate collapses to the old per-event behaviour.
Separately the two **clip** selects (`:387/:400`) omit the column the photo
selects (`:350/:364`) carry — so preservation would never apply to video,
directly against correction #2 ("chosen photos **and videos**"). Fix: assign in
all four mappers, add the column to both clip selects, make the field
**non-optional** in `PapicDropItem` so the compiler enforces every future mapper.

**Why before PR 11.** A picker shipped on top of this writes declines the sweep
ignores — a control that changes no outcome.

**Verification.** `preserve-picks.test.ts` **cannot catch this** — it reads the
sweep as a string and regex-matches it. Keep it, and add one **executing** test:
run the drop decision over a fabricated row carrying `preserve_declined_at` and
assert the capture is skipped/kept correctly both ways. Mutation: revert one
mapper's assignment and confirm the executing test fails.

**Ships alone?** Yes — and it is inert in prod today (`HIGH_RES_ARCHIVE`
deactivated), so land it before anything sells.

### PR 11 — `feat(preservation): land the picker on the Photos room` · **M**

**Changes.** **Do not author a preserve picker — PR #4304 already is one**
(OPEN, `do-not-auto-merge`). It contains the column's only writer
(`setCapturePreserved`), the per-tile toggle, the "Kept sharp" filter and the
meter. Rebase it onto the Photos room (post-PR 5) rather than duplicating it.
While rebasing, fix its four known defects: the meter computed over
`GALLERY_LIMIT = 120`-truncated filtered arrays; vendor captures inflating the
denominator while never preservable; the allowance hard-coded to one block while
`papic-storage-telemetry.ts` models several; the toggle gated on an **optional**
`eventId` prop (make it required). **Strip the "stay full resolution forever"
copy during the rebase** — correction #2 rejected it; it must not land even
transiently. Coordinate with PR #4315 (also OPEN): the preserve badge must be
select-mode-only, not another always-visible corner decoration. Route its six
outcome params through PR 2's shared banner machinery.

**Gate.** **Keeps `do-not-auto-merge`** and stops for the owner's look.

**Ships alone?** Yes, once PR 10 is in.

### PR 12 — `fix(papic): the preservation copy tells the truth, and cannot drift` · **S**

**Changes.** Owner correction #2, applied last so every sentence is true when
written. Copy corrected to the locked model: originals kept 6 months from first
capture, never less than **3 months after the event ends**; then replaced by the
compressed copy; compressed gallery free for 5 years; **nothing is ever deleted —
"compressed", never "deleted"**; paid preservation exempts the chosen photos and
videos. Add the irreversibility warning migration `20271125158531:27-32` mandates:
a decline cannot be undone once the sweep has run. **Derive every figure**: months
from `FULL_RES_POST_EVENT_GRACE_DAYS`, prices from the catalog. RA 10173 binds us
to what we declare.

**Verification.** Add touched files to `papic-copy-guardrails.test.ts`'s list;
assert the derived-figure pattern. Grep the **whole route** for `forever`,
`delete`, and stale month figures — a correction at one site is not a correction.

**Ships alone?** Yes.

---

## C · The riskiest PR — PR 3, precisely why

The correct move and the safe-looking move point in opposite directions, and the
failure is invisible. Five idempotent render-time writes sit in the page prologue
and every one is Cameras-flavoured. Filing them with the Cameras room is what a
tidy engineer does by reflex. The consequence: `provisionFreeCamerasAdmin` is the
**sole production materializer** of the three free seats and their claim QR
tokens, and the pool-grant call's own comment (page.tsx:357-364) states that with
no grant, `papic_reserve_event_points()` takes its "fence absent → allow" branch
and capture runs **unmetered**. Post-PR 1, a couple whose event is past lands on
**Photos by default** — so gating those writes behind the Cameras tab means free
cameras silently stop being created and capture silently stops being metered for
exactly the population least likely to visit Cameras. Nothing throws, nothing
logs, CI stays green: the same absence-only symptom family as the phantom column,
the phantom enum, the phantom RPC argument and the blocked iframe. PR 3 also
carries both money paths and two of the five source-text pins. The mitigation is
baked into its verification: the writes stay in the shell, and a mutation-tested
reachability test asserts all five fire on a Photos-tab render.

## D · Guards that will break, and the right move for each

| Guard | Breaks at | Premise still right? | Move |
|---|---|---|---|
| `papic-pool-buyable.test.ts:38/:80-87` | PR 3 | **Yes** — it caught a shipped fake door | Re-point the path constant. Never delete. |
| `papic-camera-capacity.test.ts:41/:69-81` | PR 3 | **Yes**, but the regex sits on a Prettier wrap boundary | Re-point + loosen to whitespace-tolerant while still pinning `serviceCode === papicRungSku(rung)`. Keep `:92` as-is. |
| `papic-gallery-scope.test.ts:67,80` | PR 5 | **Yes** | Re-point; `:80` pins literal copy — move byte-identical. |
| `vendor-media-switch.test.ts:22` | PR 5 | **Yes** | Re-point to `photos-room.tsx`. |
| `couple-face-choice.test.ts:86` | PR 4 | **Yes** | Re-point to `setup-room.tsx`. |
| `page-masthead-baseline.json:81` | PR 6 | Premise is that this page is **debt** — pay it | Delete line 81 only. The baseline shrinks, never grows. |
| `port-control-baseline.json:5129` | Should **not** break | **Yes** — the hard wall proving nothing is lost | Files stay under `_components/`; destinations stay links; actions stay bound. A reported *loss* is a real loss — fix it. |
| `papic-fidelity.test.ts:21-22` | PR 8 | **Premise changed** by owner ruling | The one genuine re-premise: split into two assertions — fail-safe stays `full_res`, new-event default is `optimal`. |
| `preserve-picks.test.ts` | PR 10 | **Insufficient**, not wrong | Keep every assertion, respect `:55`'s ban on a `preserved_at` column, add the executing test beside it. |
| `papic-copy-guardrails.test.ts:49-62` | PRs 4, 5, 7, 12 | **Yes** | Add each new file to the list in the same PR. |
| `guards-can-actually-fire.test.ts` | PR 2 (extended) | **Yes** | Extend; keep the scan query-chain-scoped. |
| `papic-guest-copy.test.ts` | Never | **Yes** | No action. Do not add exclusions. |

## E · What still needs an owner decision

1. **The preservation SKU and price.** Two figures on record: the deactivated
   legacy SKU at ₱999/yr, and the migration comment's ₱500/yr per 5,000 points.
   Correction #2 makes per-item preservation a paid product — which SKU sells it,
   at which price, is parked ("not selling yet"). PRs 10–11 merge without it.
2. **What a couple who hasn't bought preservation sees** — a visible "this exists"
   surface with the buy path dark, or hidden entirely until the SKU flips.
3. **The three handoff §5 recommendations** — two-way cross-links, retiring "Papic
   One" in couple-facing copy, the low-pool tint. Owner-optional; not in this plan.
4. **The owner's look at #4304 / #4315** and at PR 11 once rebased.

Explicitly **not** owner decisions: the landing rule (decided — capture-window
state), the end-date fallback (decided — correction #4), and where the capture
window lives (decided — control in Set up, read-only echo in Cameras).

## F · What I would NOT do

- **Use `ManagerTabs`.** It renders every panel and merely `hidden`s the inactive
  ones — all twenty cards' data and DOM on every load, defeating the split.
- **Use `RelationshipTabShell`.** `'use client'`, takes every room as a
  pre-rendered node, and is gated behind a flag set nowhere. (Its `bg-mulberry`
  pill is on-palette — never "fix" it.)
- **Use `SubNav`.** Bottom-docked, `lg:hidden` — cannot host a top strip. The name
  is the only match.
- **Promote a room to its own route.** `port-controls.mjs` excludes nested routes
  by design; and a room route with its own `loading.tsx` re-opens the
  streamed-200-before-guards soft-404 family that bit `v/[slug]`.
- **Name the folder anything but `_components/…`.**
- **Sweep the ~95 redirects to carry `?tab=`.** One derivation function achieves
  the same landing and cannot be partially applied; ninety-five edits can.
- **Gate any of the five render-time writes behind a room.** The one
  non-negotiable.
- **Rebuild the preserve picker.** It exists, open, in #4304.
- **Introduce a `preserved_at` opt-in column.** `preserve-picks.test.ts:55` fails
  on it deliberately: decline-not-pick is what makes "nothing picked = everything
  kept" work without a backfill.
- **Migrate the five prod events' quality tier.**
- **Flip the ingest error fallback to `optimal`.** A failed read must never
  downscale originals.
- **Re-type any money or points figure in copy.** Rungs from the catalog
  (₱1,000/3,000 · ₱2,000/6,000 · ₱3,000/10,000 — the handoff's ₱2,500/8,000 never
  existed), clip cost from `PAPIC_POINTS_PER_CLIP` (8 — the corpus's "7 points" is
  stale), months from `FULL_RES_POST_EVENT_GRACE_DAYS`.
- **Write "forever" or "delete" in retention copy.** Both retired by the owner.
- **Delete a failing source-text assertion, add a masthead-baseline line, or
  weaken a lint script to go green.** Re-point, pay, or raise thresholds.
- **Arm auto-merge on PR 11.**
- **Edit the applied migrations.** Corrections ship as new migrations.
- **Trust a green targeted test run without reading `# tests`.**
