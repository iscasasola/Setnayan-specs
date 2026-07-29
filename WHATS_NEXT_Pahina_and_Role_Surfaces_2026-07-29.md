# WHAT'S NEXT — Pahina guest site + the role surfaces (compiled 2026-07-29)

> Registered in [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md). Its § 1 safety gates and § 2 repo rules
> **govern this doc too** — read them first, then this. Trigger phrase: **"what's next"**.
>
> **Repo root for everything below:** `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform`
> (the index § 2 records three competing roots for the same GitHub repo — this workstream used the
> `Documents/Claude/Projects` one throughout, and every path in this doc is relative to it).
> **Corpus root:** `/Users/icecasasola/Documents/Claude/Projects/Setnayan`.

---

## 0 · Sixty-second orientation

The **guest event website** (`apps/web/app/[slug]/**`) was redesigned and is **LIVE in production**.
The **vendor day-of surface** got a frame, a styling pass, and all **three specialist toolsets**.
Two tracks were planned and **never built**: the coordinator→guest **messaging layer**, and the
Papic **allowance economy**. Those two are the bulk of §4 below.

Nothing here is blocked on code. Two things are blocked on the owner, and one on a human's eyes.

---

## 1 · What is DONE — verified on `origin/main` 2026-07-29, do not rebuild

| # | What | PR |
|---|---|---|
| 1 | Pahina guest-site reskin, Wave A — tokens, masthead, chapters, reply card, keepsake, motion, Candlelight | #3712 #3745 #3748 #3750 #3752 #3754 #3759, merged to main as **#3760** |
| 2 | Owner-tier gate — `resolveOwnerCapability`, host-membership gated, 3 firewall layers | **#3764** |
| 3 | Owner ribbon — host sees their own live site + editor doorway + phase previews | **#3766** |
| 4 | Editor "RSVP'd" 5th preview tab — simulated guest from **fabricated constants** | **#3773** |
| 5 | Cover-plate zero-height FIX + parallax + after-event memento | **#3781** |
| 6 | Vendor specialization entitlement gate — capability, **still unwired** | **#3778** |
| 7 | Vendor day-of frame + specialization seam + Pahina restyle | **#3796** |
| 8 | Song desk (`song_desk`) + guest song-request data layer | **#3803 #3813** |
| 9 | Script & cues (`stage_script`) + emcee activity catalogue | **#3812 #3831** |
| 10 | Floor command (`floor_command`) — coordinator day-of surface | **#3819** |
| 11 | Requests inbox + vendor status updates (build plan §10 #2 + #6) | **#3810** |
| 12 | Date-selection vendor pool — column guard + 2 further silent failures | **#3795** |
| 13 | Two owner rulings recorded (tier floor; memento presence) | **#3783** |

**All three specialization surfaces are registered** in `SPECIALIZATION_SURFACES`
(`apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/specialization-registry.tsx`):
`song_desk` · `stage_script` · `floor_command`. Verified by reading the file on `origin/main`.

---

## 2 · 🚨 Read before touching ANY of this — traps that already bit us

1. **`gild` and `terracotta` resolve to the SAME value on light surfaces.** A gild mark on a
   `bg-terracotta` fill is invisible. Use `cream`/`ink` on accent fills.
2. **`gild` is decor-only** — it fails contrast below ~0.85rem. Small copy uses `text-ink/70`.
   Gild belongs on rules, borders, icons, numerals and heading-scale type only.
3. **`.pahina-*` classes CANNOT be reused on a dashboard.** They are written
   `.sn-editorial .pahina-x` — descendant selectors, unreachable outside the guest tree. Unscoping
   them leaks guest styling into every dashboard and marketing page, which is owner-forbidden.
   Recompose from the `:root` tokens instead (`gild`/`veil`/`paper-deep`/`font-pahina` are global) —
   see `apps/web/app/vendor-dashboard/on-the-day/_components/pahina-console.tsx` for the pattern.
4. **No `success-*` / `warn-*` / `danger-*` / `emerald-*` anywhere under `apps/web/app/[slug]/`.**
   The functional-color exile is complete; a grep over that tree must return only the one comment
   line in `venue-widget.tsx`. Treat a new hit as a regression.
5. **This repo has NO generated Supabase types.** A column name inside `.select()` / `.eq()` / `.or()`
   is unchecked free text. Two features shipped dead this way. The existing `select-column-scan.test.ts`
   scans **selects only** — `.eq()`/`.or()`/`.not()` predicates are invisible to it. When you add a
   query, add a columns test that parses the migration (pattern:
   `apps/web/lib/date-selection-vendor-pool.columns.test.ts`).
6. **Every new table or view in `public` ships OPEN.** Default privileges grant `arwdDxtm` to `anon`
   and `authenticated` on creation. Every migration creating a relation needs an explicit
   `REVOKE ALL … FROM anon, authenticated` before any `GRANT`. See
   [[project_setnayan_default_acl_root_cause]].
7. **New columns must be added to the explicit `.select()` lists too.** `[slug]/_lib/loaders.ts` and
   the editor `page.tsx` enumerate columns; a column absent there exists in the DB, accepts writes,
   and silently never reaches the page.
8. **Migrations auto-apply UNRELIABLY.** After a migration merges, VERIFY the column/table exists in
   prod, and run `gh workflow run supabase-migrations.yml --ref main` if it was skipped.
9. **`git add -A` in a shared checkout commits other sessions' uncommitted work.** Stage exact paths.
   Write `DECISION_LOG.md` via absolute path + `git -C`, never `cd`. See
   [[feedback_decision_log_absolute_path]].
10. **Only ONE session in `apps/web/app/[slug]/**` at a time** — `site-body.tsx` is the conflict
    magnet, and a stale-tree merge has silently deleted shipped work in this repo before.

---

## 3 · 🔴 Blocked on a human — surface, never auto-run

| # | Item | Gate |
|---|---|---|
| B1 | **Nobody has ever looked at the guest site on a phone.** 7 PRs of visual change verified only by tsc/lint/tests/build. This already shipped a **broken hero photo to production for ~half a day** — the plate rendered at zero height and every automated gate stayed green. Open a couple's site at 375px and look. | `OWNER_DECISION` (do it) |
| B2 | **Switch the specialization gate ON?** #3778 ships **unwired** on purpose. An ungated specialization layer is already live (`SPECIALIST_TOOLS` in `apps/web/lib/vendor-service-tools.ts`, incl. `/vendor-dashboard/repertoire`). Enforcing the lock **REMOVES tooling free vendors have today** — a pricing/customer decision, and free-during-launch is active. Note `setlist` was deliberately left in the generic kit for this reason. | `OWNER_DECISION` + `FLAG_FLIP_PROD` |
| B3 | The Pahina cover plate's aspect ratio (`aspect-[4/5]` → `sm:aspect-[3/2]`, `pahina-masthead.tsx`) is an unreviewed judgement call — it is the first time the plate shows a picture at all. | `OWNER_DECISION` |

**Already ruled, do NOT re-open:** specialization tier floor = **Solo and up** (any paid tier,
`SPECIALIZATION_MIN_TIER`); after-event memento presence = **`arrived` OR `rsvp_status='attending'`**
(the stricter door-scan-only rule was offered and declined).

---

## 4 · ⬜ NOT BUILT — the actual work queue

### 4A · Coordinator → guest messaging layer  ⭐ highest value remaining

**Status:** guest side confirmed **not built** (`git grep coordinator_broadcast` over `app/[slug]`
returns nothing). A `20270825364600_coordinator_p3_broadcasts.sql` migration exists — **verify what
it actually contains and whether it applied in prod before writing a new one.**

This is the only remaining piece that needs new schema, and it is what makes the day feel connected:
the schedule already syncs across roles, but **no role can send a message to another**.

Build: `coordinator_broadcasts` + `broadcast_acknowledgments` per build plan §10 #1 → the
coordinator's send surface → the **guest announcement card** on the day-of page → the **phones-down
banner** (a broadcast kind driving an ink plate). Ship flag-dark.

⚠ Touches `apps/web/app/[slug]/**` — so it owns the guest tree while it runs (trap 10).
⚠ New tables ⇒ trap 6 applies (explicit REVOKE).
Reference: `Design_Premium_Guest_Site_2026-07-25/BUILD_INSTRUCTIONS_FOR_OPUS_2026-07-25.md` §10 #1,
and spec §11c #16 for the phones-down owner call.

### 4B · Papic allowance economy

**Status:** confirmed **not built** — no `fee_proportional` anywhere; no `VENDOR_TOPUP_SMALL` /
`VENDOR_PRO_PACK` SKUs. (#3860 touched the *free-pool* allowance, which is a different thing.)

Owner-locked formula, no ask needed: `points = clamp(50, 50 + (fee_php − 500)/30, 200)`.
Grant sources on the shipped #3388 `vendor_event_unlocks` substrate: `fee_proportional` (50–200
clamp) · `byo_gift_10` (couple-imported vendors, no fee) · `topup_small` (₱100 → +250) ·
`pro_pack` (₱1,000 → +3,000). The two purchase sources are **repeatable rows**; balance =
SUM(grants) − usage; **the 200 cap applies ONLY to the `fee_proportional` computation, never the
balance.** Seed both SKUs `is_active=false`. **`VENDOR_PAPIC_UPGRADE` is SUPERSEDED — do not build it.**
Reference: build plan §10 addenda 2 + addenda 6.

### 4C · 3D booth doorway
Entitlement-gated doorway + placeholder only (`vendor_3d_booth`, ₱1,500/28d). The in-app maker is
NOT in scope. ⚠ Migrations `20270908863003_vendor_3d_booth_sku_and_trial.sql` and
`20270928120000_booth_studio.sql` already exist — **check what shipped before building.**

### 4D · Owner layer, beyond wayfinding
The ribbon (#3766) is read-only links. The locked model gives the event owner an owner *layer* on
the guest site. Decide what controls actually belong there — and remember every one of them is a
**privileged control on a PUBLIC route**, so each gates server-side on `ownerCapability`, never by
hiding UI. Reuse the #3764 gate; do not invent a second.

### 4E · Smaller tails
- Cover parallax exists; the **guest-site visual pass** (B1) may change it.
- Coordinator console + host "run the day" restyle in Pahina materials (parameterize the existing
  console for the host — it is host-access by definition; do not fork a surface).
- `Taxonomy gap — Ceremony Venue tile EMPTY` (`ceremony_venue` has 0 canonicals → live empty tile).

---

## 5 · How to plug a NEW specialization in (if a 4th trade is ever added)

Two steps, neither touching the page:
1. Component in its **own new subdirectory**, exporting `SpecializationSurfaceProps`
   (`eventId`, `vendorProfileId`, `coupleName`). May be `async` and read the DB.
2. **One line** in `SPECIALIZATION_SURFACES` in `specialization-registry.tsx`.

The registry is **not** a permission list — the page resolves
`resolveVendorSpecializationAccessForVendor` on the SERVER and membership grants nothing.

---

## 6 · Definition of done for this workstream

- [ ] B1 visual pass done (phone + desktop, palette-rich and palette-empty event, all four phases)
- [ ] 4A messaging layer shipped flag-dark; migration verified applied in prod
- [ ] 4B allowance economy shipped, both SKUs seeded `is_active=false`
- [ ] 4C booth doorway shipped (after checking what already exists)
- [ ] B2 answered — gate wired or explicitly left unwired with the reason recorded
- [ ] Guest-tree colour-exile grep still returns only the `venue-widget.tsx` comment
- [ ] `DECISION_LOG.md` row appended for each (absolute path + `git -C`)

## 7 · Standing workflow

Worktree → PR → `gh pr merge <N> --auto --merge` (standing default, never ask). Changelog fragment
at **repo-root** `changelog.d/` (a CI guard fails on `apps/web/changelog.d/`). Verify BEFORE arming
auto-merge: `tsc --noEmit` · `next lint` · `pnpm --filter @setnayan/web test:unit` · production build.
Prune each worktree once its PR merges. Prove every gate by **neutralising it** — a test that passes
against broken code is worthless.
