# SECURITY HANDOFF — 2026-07-26

> **New Claude Code session: read this file top to bottom before touching anything.**
> Same computer, so every path, worktree and PR below is still valid.
> Repo: `iscasasola/setnayan-platform` · Supabase project `njrupjnvkjkitfctetvi`.

---

## 0 · START HERE — the 60-second version

A one-day security review of the Setnayan platform found **seven vulnerabilities plus several more discovered while fixing them.** They are not seven unrelated bugs. They are **one mistake found seven times**:

> The UI was treated as the security boundary, while the database sits directly on the internet.
> Supabase publishes every table as a REST endpoint and the anon key is in the page source *by design*.
> Every screen was written as though the only way in is through the pages we designed.

**Nothing was breached.** `auth.users` has exactly **one** signup ever (the owner, 2026-05-12) and `public.orders` has **zero** rows ever. There were no other tenants, so there was no other tenant's data to steal. **No RA 10173 notification is owed.** This was verified by direct query, not assumed — see §2.

**Four fixes are live. Four are stuck in CI. Several findings are not yet fixed at all.** §3 and §4 are the work list.

---

## 1 · The rule that would have prevented all of it

Adopt this and most of the class disappears:

1. **RLS policies are the only gate.** 361 of 368 tables grant `SELECT`+`INSERT` to **anon**, and 360 grant `INSERT`/`UPDATE`/`DELETE` to **authenticated** — the stock Supabase `GRANT ALL` default. There is no second line of defence. One wrong policy on one table = that table fully exposed.
2. **RLS is ROW-level and can never hide a COLUMN.** Any table mixing sensitive columns with columns a wider audience legitimately reads has a hole no policy can close. It needs a column `REVOKE`, a split table, or a view. This is the SEC-2b shape and it recurs.
3. **Nothing the customer can edit may set a price or unlock a product.** Every money bug found today broke exactly this.
4. **Fail closed.** Several bugs were "we couldn't resolve it, so we used the value the browser sent."

---

## 2 · Scale context — read before judging urgency

```sql
select count(*) from auth.users;      -- 1  (owner, 2026-05-12)
select count(*) from public.orders;   -- 0  (ever)
select count(*) from public.events;   -- 2  (owner test events)
select count(*) from public.guests;   -- 38 (test data)
```

Rank everything by **"how bad would this be with 5,000 weddings"**, never by who is affected today (nobody is). Do not write urgency theatre. But also: every one of these becomes live-fire the moment the first real vendor uploads a DTI certificate — so they must be closed **before launch**, not after.

---

## 3 · PR BOARD — exact state as of handoff

### ✅ Merged and live

| PR | What |
|---|---|
| #3729 | **SEC-1** R2 presign oracle. Any user could get 24h signed URLs to the 4 **private** buckets — vendor government IDs (DTI/BIR/Mayor's Permit), payment screenshots, dispute evidence, contracts. Also closed an **SSRF** (a "payment QR" field accepted a plain URL and the server fetched it → reachable internal/metadata endpoints) and an ownership bug in `finalizeChapterTeaser` (PostgREST returns no error on 0 rows, so the check passed for chapters the caller didn't own). |
| #3727 | **SEC-2** guests could `SELECT` the whole `events` row — master QR token + Google OAuth token. |
| #3735 | **SEC-5** Setnayan AI price-tier lock + purchase snapshot. ⚠ Was **latent, not live** — `setnayan_ai_per_event_pricing_enabled = FALSE` in prod, so checkout charges flat ₱1,499 today. Arms the instant that flag flips. Also closed a genuinely live cross-tenant bug: `orders_owner_write` never checked `event_id` was yours, so a stranger could point a `SETNAYAN_AI` order at a victim's event and **freeze their event type**. Migration `20271007917549` is **applied in prod** (verified). |
| #3726 | Privacy disclosure for P2P/WebRTC IP visibility. |

### 🔴 Blocked in CI — fix these first

| PR | Branch | Failing | What to do |
|---|---|---|---|
| **#3728** | `fix/sec3-xss-pax-reveal` | `typecheck + lint` — 5 Papic metering subtests (2120–2124) | **The XSS + pax-price fix is NOT live.** main is green, so this PR caused the regression — almost certainly the `estimated_pax` snapshot, since camera points are pax-driven. **Do NOT fix by relaxing the snapshot or the tests** — the snapshot IS the security fix (host-writable pax turned a ₱2,800 order into ₱0). Decide per call-site which value is right: *pricing* must use the order-time snapshot; *granting capture points* may legitimately want live pax if a guest list grows. If those genuinely conflict, that is an owner question. An agent was launched for this; it will not have survived the account switch — re-launch. |
| **#3736** | `claude/sec2b-event-private-details` | `typecheck + lint` — `not ok 699 - T9 · no read on the export route is unwrapped with a bare ?? []` | Its **own** auditor test. Decide honestly which side is wrong: either the export route really has an unwrapped `?? []` (fix the route — a bare `?? []` turns a failed read into "no rows", the fail-open shape this PR is about) or the auditor over-matches (fix the auditor). Do not delete the assertion to go green. Also **rebase**: #3735 added `events.setnayan_ai_tier_at_purchase`, a new column on the table this PR revokes and rebuilds the view for — its COVERAGE test exists precisely to force a decision on whether that column is host-only or readable. Answer it. |
| **#3732** | `fix/pilot-banner-capture-gate` | was `typecheck + lint` | **Already fixed and pushed** (commit `18945d607`) — a `noUncheckedIndexedAccess` narrowing error in the new test file. Re-check CI; if green it will auto-merge. Lesson recorded in §6. |

### 🟢 Ready for review

| PR | Branch | What |
|---|---|---|
| **#3738** | `claude/sec4-db-revoke-orders-insert` | **SEC-4b** — revokes direct `INSERT` on `orders`/`payments` from `anon`+`authenticated` and makes the server the only minter; 10 call sites moved to service_role **with explicit ownership assertions** (moving to service_role removes the RLS authorization those sites relied on — that was the main risk). CI green, DRAFT. **Review the authorization assertions carefully before merging**, then mark ready + `gh pr merge 3738 --auto --merge`. |
| **#3731** | `fix/sec4-createorder-server-price` | SEC-4 app-layer half — deleted the legacy `createOrder` that took `requested_total_php` from the form. CI green, DRAFT. Verdict was **HOLDS-WITH-GAPS**; the gaps are #3738 and SEC-7 below. |
| **#3734** | `fix/sec6-nsfw-verdict-binding` | **SEC-6 round two.** Round one was reviewed and came back **BROKEN** — see §5. |

---

## 4 · OPEN FINDINGS — not fixed, no PR yet

### 🚨 SEC-7 · ₱0.01 buys 28 days of Setnayan AI — LIVE, exploitable through the ordinary app

The single most urgent item. No database trickery required.

**Chain:** `apps/web/app/dashboard/[eventId]/checkout/actions.ts:288` seeds `originalCentavos` from `formData.get('original_centavos')`. Lines 414–424 only **overwrite** it when a catalog row resolves. `resolveServiceSellability` returns `'unknown'` for keys in neither catalog, and `'unknown'` is deliberately **allowed** (`:375`).

**Verified in prod:** `platform_retail_catalog_v2` holds `SETNAYAN_AI` (₱1,499, active) and `SETNAYAN_AI_RENEW` (₱799, inactive) — **no row for `SETNAYAN_AI_SUB`.**

**Exploit:** `submitOrderAction` with `service_key=SETNAYAN_AI_SUB, original_centavos=1, cycles=1`. The `event_members` check is explicitly **skipped** when `isAiSub` (`:315`) so no event is needed. Sellability `unknown` → allowed; both resolvers null → price stays 1 centavo. On approval `lib/sku-activation.ts:866-873` reads the unit price → null → `cyclesFromAmount(0.01, null)` hits `lib/setnayan-ai-subscription.ts:50` (`if (!Number.isFinite(unit) || unit <= 0) return 1`) → grants a **full 28-day cycle**. Repeatable; `extendUserAiSubscription` stacks windows.

**NOT exploitable the same way:** `PAPIC_CAMERAS` — `papic_grant_camera_points` counts `paparazzi_seats WHERE paid_order_id=<order> AND tier='mini'`, of which a checkout-minted order has none → grants 0. Do not lump them together.

**Related fail-open:** `resolvePaxPricedOrderCentavos` returns `null` on **DB error** too, so a failure isolated to the price read leaves `sellable` + null resolve → client price survives.

**Fix shape:** fail closed. No server-resolvable price → refuse the sale. Decide deliberately what `'unknown'` sellability should mean; today it means *trust the browser*. Make `cyclesFromAmount` refuse rather than grant 1 cycle when the unit price is unknown.

**⚠ SEQUENCING:** #3738 edits this same file. Do **not** start until #3738 merges.

**Test gap to close at the same time:** `lib/order-price-authority.test.ts`'s taint trace slices object literals after `.insert(`; checkout uses `.insert(insertPayload)` — a **variable** — so the one file where a client price genuinely survives contributes **zero** assertions. Tests 6/7 assert ordering/presence, not that the catalog resolve is mandatory: deleting the override entirely still passes both.

### 🟠 SEC-2b residue and neighbours (found while fixing #3736, not fixed)

1. **Vendor auto-reply leaks an exact budget past the opt-in.** `vendor-autoreply/inbox-hook.ts:229` does `select('*')` into `buildEventBrief`, and `adapter.ts:120` derives `budgetPerHeadPhp` from the couple's **exact** figure. The SQL `vendor_event_brief()` gates on `share_budget_band` (default FALSE) and emits only a rounded range. **This TS path honours neither.** A consent violation, different subsystem.
2. **`vendors/page.tsx:181` filters the wrong primary key** — `.eq('id', eventId)`, a UUID against a `BIGSERIAL`. The query permanently `22P02`s, so the budget-fit block silently degrades to neutral. Masked by null-guards. Deliberately not fixed.
3. **`wizard_state` duplicates data the erase/export routines target by column name** — see §5 (erasure).

### ✅ Deferred presign lanes — **ALL FIVE CLOSED 2026-07-30**

| lane | state |
|---|---|
| #1 `/api/upload` generic branch | private-bucket root binding — [#3905](https://github.com/iscasasola/setnayan-platform/pull/3905) |
| #2 five stored-ref write paths | all five — [#3902](https://github.com/iscasasola/setnayan-platform/pull/3902) · [#3909](https://github.com/iscasasola/setnayan-platform/pull/3909) · [#3911](https://github.com/iscasasola/setnayan-platform/pull/3911) · [#3912](https://github.com/iscasasola/setnayan-platform/pull/3912) |
| #3 `editorial-vendor/` untenanted | [#3918](https://github.com/iscasasola/setnayan-platform/pull/3918) |
| #4 `/papic/media/` rate limit | [#3914](https://github.com/iscasasola/setnayan-platform/pull/3914) |
| #5 7-day admin TTLs | **won't-fix** — the TTL is load-bearing; pinned as an invariant instead ([#3914](https://github.com/iscasasola/setnayan-platform/pull/3914)) |

🔑 **The finding that outlived the lanes: every stored-ref oracle was a policy that EXISTED but was not applied at every WRITER of the column — never a missing policy.** Five for five (paperwork · budget-proof · vendor portfolio · RSVP selfie · site-chrome), two of them exposing a private bucket to the OPEN INTERNET. So the sweep question is not *"is there a policy for this flow?"* but ***"is it applied at every writer?"*** — one `git grep` of the policy name against that column's writers. ⏭ Remaining beyond the lanes: per-flow tenancy binding for the ~40 public-media call sites (hardening now), CSP `script-src`, RoPA for WebRTC/TURN.

_(original list, for lineage:)_

### 🟡 Deferred presign lanes (from #3729, prioritised in its PR body)

1. `/api/upload` generic branch — any user can presign a `PUT` under any prefix/bucket. **Write pollution, not disclosure** (server-side `randomUUID()` prevents overwrite). ~40 call sites → own PR.
2. Five more stored-ref **write** paths reaching private buckets, same pattern, ~one guard line each: `paperwork`, `budget` proof, `invite` proofs, `site-chrome`, `portfolio_r2_keys[]`.
3. ~~`editorial-vendor/` is a **flat untenanted prefix** → containment only.~~ ✅ **CLOSED 2026-07-30, PR [#3918](https://github.com/iscasasola/setnayan-platform/pull/3918).** The uploader now writes `editorial-vendor/{vendorProfileId}/{eventId}/` and the policy requires it, so **two** things became impossible: another vendor's media on this event, AND *your own* media from a different couple's event — the second is what a flat prefix could never catch, and the one that puts one wedding's photos on another's public page. 🪤 **The pinning had to MOVE**: it ran before `fetchOwnVendorProfile`, and a tenanted policy cannot be built before the vendor is known — passing a placeholder to keep the early call is how a tenanted policy silently degrades to a flat one (guarded). 🔑 **Migration-free only by luck of timing** — `editorial_vendor_media` had 0 rows; a test now asserts the old flat layout is REFUSED, which is exactly why a populated table would need backfilling first.
4. `/papic/media/[...key]` is unauthenticated. Media bucket is public by design so no confidentiality delta — wants a rate limit.
5. Admin surfaces still issue **7-day** TTLs. `assertAdmin`-gated, so not urgent.

**Reuse `lib/r2-client-ref.ts`** (merged in #3729) — a fail-closed allowlist with deliberately non-specific refusals so it is not an existence oracle. Do not write a second guard.

### 🟡 Other

- **CSP `script-src`** hardening — logged, not done.
- **RoPA entry** owed for WebRTC signalling + TURN relay processing (task #42).
- **`events.estimated_pax` is still host-writable** and read live by `resolvePaxPricedOrderCentavos` for `is_pax_priced` SKUs. Latent today (no prod catalog row is pax-priced); re-arms the moment one is added. Same bug shape as SEC-5; wants its own PR.
- ~~**Price display mismatch:**~~ ✅ **CLOSED 2026-07-30, PR [#3915](https://github.com/iscasasola/setnayan-platform/pull/3915) — and this entry was STALE in its advice.** The diagnosis was right (`/studio/setnayan-ai` resolved the per-event-type price **ungated**, while `order-charge-authority.ts:143` takes the per-type branch only when `setnayan_ai_per_event_pricing_enabled` is true and otherwise charges the flat ₱1,499 row ⇒ a `date` event shown ₱99, charged ₱1,499). But **`platform_settings.setnayan_ai_per_event_pricing_enabled` is already TRUE in prod**, so both sides call the same resolver and agree today — *flipping the flag on is what closed the gap*, which makes "settle before flipping the flag" moot. Fixed anyway, because the correctness of a customer-facing price was a property of a **setting** rather than of the code, and the display's own comment asserted checkout re-resolved it unconditionally — so turning the flag OFF would have silently re-opened an overcharge while that comment reassured the reader. One shared resolver (`resolveSetnayanAiDisplayPricePhp`) now decides both: flag on ⇒ both per-type · off ⇒ both flat · Tier E ⇒ nothing either way. No price moved. 🪤 **Trap recorded from my own regression while fixing it:** `lib/setnayan-ai-event-pricing.ts` is deliberately free of `server-only` so the tier ladder stays testable under `tsx --test` — reading a FLAG there pulls `server-only` in transitively via `integration-config` and breaks that module's own test. **Flag-reading resolvers belong in `lib/setnayan-ai-server.ts`**; now guarded by a test.

---

## 5 · WORK THAT WAS IN FLIGHT — it died with the session, re-run it

Background workflows do **not** survive an account switch. All three below were still running. **The scripts are saved and can be re-invoked directly**, which is far cheaper than re-authoring them — each embeds its full brief, every trap, and the lane rules.

They have been **copied next to this document** (the original location is session-scoped and may be garbage-collected):

```
~/Documents/Claude/Projects/Setnayan/_security_workflows_2026-07-26/
```

That folder also contains `sec6-round1-adversary-journal.jsonl` — the full adversary report that broke SEC-6 round one. **Round two needs it**; find the SEC-6 verify agent's `{"type":"result"}` line for the exact bypass mechanics.

| Script | What it was doing | Priority |
|---|---|---|
| `setnayan-exposure-audit-and-freeze-wf_cb062f85-26e.js` | **The big one.** Audits all 368 tables + views + SECURITY DEFINER functions for what `anon`/`authenticated` can actually reach, then builds a **CI guard** that fails any PR widening the exposure surface. This is the durable fix for the whole bug class. | **HIGHEST** |
| `sec6-nsfw-binding-round2-wf_c77a2634-acd.js` | SEC-6 round 2 (see below) | HIGH |
| `erasure-completeness-wf_34259418-6d1.js` | Make account deletion actually finish (see below) | HIGH |

Re-invoke with:
```
Workflow({ scriptPath: "<path above>" })
```
Read the script first — each embeds the full brief, all the traps, and the lane rules. Adjust the "concurrent work" lane warnings to match reality at that time.

### SEC-6 · the NSFW filter — round 1 was BROKEN

**Defect:** a direct `PATCH` of `std_media.nsfw` publishes an **unscreened video** to the public guest page. The NSFW filter is owner-locked as ON and **not disableable**, so a bypass is a hard product violation.

**Round 1 (PR #3734) was attacked and failed.** Adversary verdict:

> "The privilege half is genuinely solid — I attacked it hard and could not move it. The **binding half is bypassable**: the fingerprint is computed against a **different resource** than the one the guest's browser fetches, so an attacker can get a real `approved` verdict for a decoy object while serving arbitrary unscreened video."

Classic screen-A-serve-B. **Keep the privilege half; replace the binding.**

**The bar:** the verdict must bind to **the bytes the guest actually receives** — not a key, not a row id, not a URL, not anything the uploader can influence between screening and serving. Close or prove unreachable every divergence point: re-upload to the same key, pointer swap, variant/web-copy generated after screening (`clip_web_r2_key`), signed URL minted pre-swap, range requests, media row re-parented, approved row cloned onto different bytes.

Content-addressing (identify the served object *by* its digest) is usually the honest answer. Full adversary report is in that workflow's journal:
`.../subagents/workflows/wf_962281ba-0a9/journal.jsonl` — find the SEC-6 verify agent's `{"type":"result"}` line.

### Erasure · "make it finish" — owner directive

`apps/web/app/admin/users/actions.ts` → `purgeOwnedEventBirthData` erases **by column name** (5 birth/consent columns + `owner_email`, `owner_display_name`, `photo_delivery_account_email`, `photo_delivery_oauth_token_encrypted`).

**`events.wizard_state` (JSONB) keeps a second copy and is never opened.** Contents include the wedding and prenup dates, **the budget again**, pax counts, monogram initials, the site slug, per-task vendor ids, and an unbounded `meta_*` passthrough whose task ids are `cenomar_bride` / `church_paperwork` / `marriage_license` — i.e. slots designed for **PSA and CENOMAR reference numbers** (Philippine civil-registry documents).

**Verified:** `wizard_state` is **empty in prod** — this is preventative, no backfill needed.

**Preserve from the existing code** (read its docstrings, they are good):
- The **own-data vs shared-record** line. It clears both partners' birth data but leaves bride/groom names and venue, because a wedding has two partners plus coordinators. Whether partial erasure of a shared record should go further is explicitly a **DPO/counsel** question — do not resolve it in code.
- **Best-effort semantics:** a purge failure logs to `admin_audit_log` (`action='erasure_purge_failed'`) and never blocks deletion, because a stuck purge must not trap an account in an undeletable state.
- Service-role client, so partially torn-down RLS cannot block it.
- `purgeUserAuthoredChat`'s counter interaction with `countCoupleMessages` in `lib/chat.ts`.

**Prefer an ALLOW-LIST of keys that may survive over a deny-list of keys to strip** — a deny-list fails open for every key added later, which is exactly how this gap was born.

**Also in scope and unanswered:** does account deletion remove **R2 objects** (photos, uploaded IDs, contracts, payment screenshots) or only DB rows? If files survive, that is the most important finding of the three. Also `face_enrollments.vector_blob` — biometrics are **sensitive personal information** under RA 10173.

---

## 6 · TRAPS — every one of these has already bitten, most of them twice

1. **Vacuous DB tests.** A psql connection that **owns** the table **skips RLS entirely**, so an RLS test run as the owner passes no matter what the policy says. This repo has shipped it twice. Every DB test needs a meta-test asserting the role is `authenticated`, is **not** the table owner, and lacks `BYPASSRLS` — plus a **neutralisation proof** (remove the fix, tests must fail, report the count).
2. **Vacuous typecheck.** *(New, 2026-07-26 — I did this.)* A fresh worktree has **no `node_modules`**, so `npx tsc --noEmit` resolves almost nothing and reports only trivia. It looks like it passed. **It checked nothing.** Symlink deps from an installed checkout before believing a local typecheck:
   ```bash
   ln -sfn /Users/icecasasola/setnayan-db-push/node_modules <worktree>/node_modules
   ln -sfn /Users/icecasasola/setnayan-db-push/apps/web/node_modules <worktree>/apps/web/node_modules
   ```
   Then **prove the check is real** by injecting a deliberate type error and confirming it is reported. **Remove the symlinks before `git add`.**
3. **Migration timestamp collisions** — bitten three times today. `ls supabase/migrations/ | tail -30` before committing. And **order matters**: Supabase can silently skip a migration whose timestamp is earlier than one already applied, so if two PRs both add migrations, **merge the earlier-numbered one first and verify it applied**:
   ```sql
   select version, name from supabase_migrations.schema_migrations order by version desc limit 5;
   ```
4. **Stale-tree merges silently delete shipped work** — PR #3668 erased two merged PRs with **no git conflict**. Before merging a behind branch, genuinely diff the file lists. ⚠ And beware the **vacuous overlap check**: if one `gh` query returns empty, `comm -12` reports "no overlap" and proves nothing. Assert both lists are non-empty.
5. **`is_active = false` is OVERLOADED.** On `SETNAYAN_AI_RENEW` it means *"not independently sellable"*, **not** *"retired"* — see the comment above `resolveServiceSellability` in `apps/web/lib/v2-catalog.ts`. A naive "reject inactive SKUs" guard breaks **every AI renewal**.
6. **PostgREST returns NO error on a 0-row match.** An ownership `UPDATE`/`SELECT` used as an authorization check must verify the **row count**, not merely the absence of an error. This was a real bug in `finalizeChapterTeaser`.
7. **Changelog fragments go in the ROOT `changelog.d/`**, never `apps/web/changelog.d/` — there is a CI guard (`lint-changelog-dir`).
8. **`setnayan-media` is PUBLIC BY DESIGN** (`R2_PUBLIC_URL` bound to it, `r2PublicUrl()` serves unsigned — locked rule). The private buckets are `thread-files`, `vendor-contracts`, `vendor-verification`, `samples`. A "fix" assuming media is private is wrong.
9. **7 unit tests fail on clean main** (pHash native deps, `vendor-deep-search`). Always reproduce against the unmodified base before attributing a failure to your change. **But `test:db:ci` DOES run in CI** (`.github/workflows/ci.yml` ~line 42) — an earlier claim that DB tests never run was **wrong**.
10. **"Armed" ≠ "merged."** `gh pr merge --auto` only merges when CI passes. Three PRs sat red for hours while being described as done. **Re-check status before reporting anything as shipped.**
11. **Prune worktrees after their PR merges** — they are 1–2 GB each and fill the disk until Bash deadlocks with ENOSPC.

---

## 7 · THE METHOD THAT ACTUALLY WORKED — keep using it

**Every fix got an independent adversary whose job was to break it, briefed to default to "still exploitable" and to read the real diff rather than the implementer's description.**

It earned its keep immediately:
- **SEC-6 round 1** looked correct and was **BROKEN**.
- **SEC-4** looked complete and the adversary found the **live ₱0.01 exploit** nobody had asked about.
- **SEC-3**'s own agent found a **fourth** `?reveal=` bypass its brief hadn't mentioned (`?reveal=constructor` resolved truthy off `Object.prototype`).

Without that step, at least two wrong fixes would have shipped looking green. Budget for it.

**Also require a neutralisation proof on every fix:** remove the fix, show the tests fail, restore, show they pass, report the exact count. "Tests pass" means nothing on its own.

---

## 8 · OWNER DECISIONS PENDING — needs the owner, not an engineer

1. **Setnayan AI event-type changes** (from #3735): (a) should upgrading an event type to a dearer tier be allowed with a top-up charge? Today it is refused cleanly with a `TODO`. (b) should downgrading to a cheaper tier be self-service? (c) the price-display mismatch in §4.
2. **Shared-record erasure:** when one partner deletes their account, the wedding's shared details (bride/groom names, venue) currently **survive**, because the other partner still needs them. Is that right? The existing code deliberately defers this to a DPO ruling.
3. **Audit-log retention vs erasure:** audit records may need to survive for accountability, which directly conflicts with a deletion request. Needs a stated policy.
4. **`/pricing` — Live Studio is still hidden.** `apps/web/lib/v2-catalog.ts:194-199` hardcodes `.neq('service_code','LIVE_STUDIO_ROAM')` and `.neq('service_code','LIVE_STUDIO')`, plus `LIVE_STUDIO: 'partial'`. **This is not a feature flag** — it is a code change. Removing those two lines and bumping `'partial'` → `'live'` lists it for sale. Deliberately not done: listing it means anyone can buy it, and it has never been used in a real dry run.
5. **Outside penetration test before the first real peso.** Strongly recommended. The same author wrote much of this code and found these bugs — shared blind spots. The pax bug and the event-type bug are literally the same bug shipped twice.

---

## 9 · RECOMMENDED ORDER OF WORK

1. **Unblock #3728 and #3736** (§3) — two already-written security fixes are sitting red.
2. **Review and merge #3738**, then **#3731**. Check the authorization assertions on #3738 carefully.
3. **SEC-7** (§4) — the ₱0.01 hole. Only after #3738 merges.
4. **Re-run the exposure audit + freeze workflow** (§5). This is the highest-value item overall: it converts whack-a-mole into a bounded, finished job, and the CI guard stops the class recurring as the owner keeps building fast.
5. **SEC-6 round 2** (§5) — the NSFW binding.
6. **Erasure completeness** (§5).
7. Deferred presign lanes, `estimated_pax`, vendor auto-reply budget leak, CSP, RoPA.
8. **Do not launch** — no `/pricing` listing, no broad vendor signups, no real payments — until 1–6 are done.

---

## 10 · USEFUL COMMANDS

```bash
# PR board with failures
gh pr list --repo iscasasola/setnayan-platform --state open --limit 20 \
  --json number,title,isDraft,autoMergeRequest,statusCheckRollup \
  --jq '.[] | "#\(.number) \(if .isDraft then "DRAFT" else "READY" end) \([.statusCheckRollup[]?|select(.conclusion!="SUCCESS" and .conclusion!="SKIPPED" and .conclusion!=null and .conclusion!="NEUTRAL")|.name]|join(","))  \(.title[0:60])"'
```

```bash
# Why is a PR red? (replace 3728)
gh api "repos/iscasasola/setnayan-platform/actions/jobs/$(gh pr checks 3728 --repo iscasasola/setnayan-platform --json name,link --jq '.[]|select(.name=="typecheck + lint")|.link' | head -1 | grep -oE '[0-9]+$')/logs" | grep -E "error TS|##\[error\]|not ok [0-9]+" | head
```

```sql
-- The exposure surface, in one query
select count(*) tables,
       count(*) filter (where not c.relrowsecurity) rls_off,
       count(*) filter (where has_table_privilege('anon', c.oid, 'SELECT')) anon_read,
       count(*) filter (where has_table_privilege('authenticated', c.oid, 'INSERT')) authed_insert
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='r';
```

**Standing repo rules** (from `CLAUDE.md`): auto-merge is the default — `gh pr merge <PR#> --auto --merge`, never `--squash`/`--rebase`. Changelog fragment per change. Spec corpus at `~/Documents/Claude/Projects/Setnayan/` is directly editable; log notable decisions at the bottom of `DECISION_LOG.md`.
