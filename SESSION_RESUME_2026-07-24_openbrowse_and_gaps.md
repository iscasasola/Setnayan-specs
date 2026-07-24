# ▶▶ RESUME HANDOFF — Open-Browse PR6–11 + Gap-Audit tail (2026-07-24)

> **COLD-START (paste into the new session):** *"Read `~/Documents/Claude/Projects/Setnayan/SESSION_RESUME_2026-07-24_openbrowse_and_gaps.md` end-to-end, verify the state it describes against `origin/main`, then continue — gogogo."*
>
> This one doc carries the whole state. A fresh session (even a different Claude account) can resume from it alone.

## Repo + workflow (non-negotiable — battle-tested this session)
- **Canonical checkout = `/Users/icecasasola`** (git root; `apps/web/` + `supabase/migrations/` both under it). NEVER use the stale `~/Documents/.../setnayan-platform` clone.
- **One task = one worktree off latest `origin/main` = one branch = one PR**, then `gh pr merge <#> --auto --merge`. `git fetch origin main` first.
- **⚠ PRUNE EACH WORKTREE THE MOMENT ITS PR MERGES** (`git worktree remove <path> --force` → `git worktree prune`; clear `.next`). Worktrees are ~1–2 GB each; letting them pile up filled the disk to 100% mid-session and ENOSPC-deadlocked the shell. Prune as you go, never batch.
- **Migrations auto-apply on merge** (`supabase db push` via `supabase-migrations.yml`). Ship INERT: `DEFAULT`/flag-off IS the go-live hold. Allocate stamps STRICTLY ABOVE `origin/main`'s current max (was `20270921698789` at handoff — re-check). Non-round only. CI `migration-timestamp-guard` enforces.
- **CI now runs the FULL `test:db` (102+) + `test:unit` (lib/** AND app/**)** — my #3609 fix. So every db + unit test gates PRs.
- **Verify before arming:** `tsc --noEmit` · `next lint` · `next build` (public-page changes) · `test:db` replay · relevant unit tests · migration timestamp-guard. changelog.d fragment per PR.
- **When a decision is genuinely the owner's, ASK — in plain English, real-world trade-offs, no jargon** (owner instruction 2026-07-24). Surface anything reversing an owner-locked decision.

## What shipped this session — 18 PRs (17 merged, #3614 armed)
- **Security (prod-verified live):** #3601 public-media fail-closed · #3602 biometric erasure + temp-pw-out-of-URL · #3603 money-write-guard · #3604 RLS guest-scope (guests/orders → **couple+coordinator**, owner-decided) · #3605 self-grant tier guard.
- **Open-browse:** #3599 PR4 inert schema (`events.website_open_browse`, `invitation_widgets.mode`) · #3600 PR5a analytics scrub + noindex · #3607 seat-finder exact-match · #3608 PR5 live-media gate + `invitation_widgets.audience` · **#3619 PR6 menu shell (flag-dark, anonymous tree only)**.
- **Gaps:** #3598 widget-seed 16-reconcile · #3609 CI full test suites · #3611 Batch-B correctness (email joins, `/gallery`→`/galleries`, `/settings`→`/date-selection`, papic points-release, vendor-meter fail-closed) · #3612 nsfw-sweep poster-less-clip starvation · #3613 force-majeure ESCALATE-not-resolve (new `escalated` status) · #3614 guest-cap UGC block+terms gates (armed) · #3615 purge-chat FK CASCADE · #3617 dead guest-photo recap reads removed.
- **Prod DB verified 4×:** all migrations applied; seat-lookup exact-match, guests/orders couple+coordinator, entitlement guard, open-browse + live-media + audience columns all live.

## Owner decisions already made (do NOT re-ask)
- Invite/name-claim "identity-takeover" is **owner-LOCKED (2026-06-25 name-as-answer-key)** — NOT a bug; do not reverse.
- Seat-finder: **exact/prefix, own seat only** (shipped #3607).
- `orders` read scope: **couple + coordinator** (shipped #3604).
- Guest-PHOTO public showcase: **removed the empty section** (shipped #3617) — photos are not publicly showcasable.
- Prioritization: **do both tracks in parallel** (gap-tail + open-browse PR6–11).

## ▶ REMAINING WORK (resume here)

### A. Open-browse PR6–11 (the guest-website program) — council `Guest_Event_Website_Open_Browse_Council_Verdict_2026-07-22.md §3`
- **PR6 guest-tree slice (NEXT):** PR6 landed the ANONYMOUS menu only. Add `SiteMenuBar` to the GUEST tree in `apps/web/app/[slug]/_components/site-body.tsx` (`guestTree`, ~line 605) with the same `SITE_MENU_ANCHORS` stamped on the guest sections, and absorb the GuestHubBar QR-modal (the `useModalA11y` block) into the "Me" tab. Model + component already exist: `app/[slug]/_lib/site-menu.ts` + `_components/site-menu-bar.tsx`. Flag stays `NEXT_PUBLIC_WEBSITE_MENU_ENABLED` (off; sample-on).
- **PR7 open-everything** (dual-path `WIDGET_SPOTLIGHT` + `hasContent()` alongside `WIDGET_PHASES`, branched on `events.website_open_browse`; consumes `invitation_widgets.audience`; keeps the 15 goldens as the flag-off byte-lock). **Owner: editorial keeps the menu below it (§5 item 1).**
- **PR8 empty states** — ⚠ **OWNER COPY PASS** (send the copy as one read-through).
- **PR9 couple manager mirror** (`/dashboard/[eventId]/website` — Auto/Shown/Hidden via `mode`, audience dial, live-media + pool toggles). **MUST ship + be communicated before ANY flip.**
- **PR10 writer dedup** (`lib/host-gate.ts`, `revalidateGuestSite`).
- **PR11 rollout** — ⚠ **OWNER WALKTHROUGH** (4 phases × 3 identities) then flip `NEXT_PUBLIC_WEBSITE_MENU_ENABLED` + default new events on; retire GuestHubBar + PublicEventDayBar.

### B. Gap-audit Batch-B tail (`0012_papic/Verified_Gap_Audit_2026-07-23.md` — Batch A + most of B done)
Each is a self-contained fix (locations in the audit):
- **Sweep cursors (migrations):** `papic-fullres-drop.ts:211` Drive-deferred starvation; `anon-draft-sweep.ts:49` unordered 50-row wedge — add a cursor column + `.order()`.
- **`photo-delivery/actions.ts:166`** — Drive delivery stalls past ~240; needs a **new `claimPeriodicJob` drainer** (bigger).
- **`editorial/data.ts` consent filter** — verify against #3601 first (may already be closed by the `moderation_state='clean'` gate); if still open, add the `photo_tags → guests.photo_consent=FALSE` NOT-EXISTS veto.
- **Copy:** `llms.txt` retired SKUs/prices; `help.ts`/privacy vs code (**parts DPO-gated** — ask owner).
- **Routes:** `shortlist-taxonomy.ts:350` → `/vendors/${vendorId}/workspace` (service-scoped; 3 emitters — verify); Live-Studio `studio/panood/cameras/print` page (build mirroring `studio/papic/crew/print`, or drop the button).

## Recommended first move for the new session
1. `gh pr view 3614` — confirm merged (guest-cap gates). Re-fetch main.
2. **PR6 guest-tree slice** (fast — model + component exist), then **PR7**.
3. Interleave the migration-bearing gap-tail (cursors, then the consent-filter verify).
4. Ask the owner (plain English) at: PR8 copy · PR11 walkthrough · B4 legal copy · the two `/vendors/[vendorId]` + `cameras/print` route calls if ambiguous.
