# Setnayan — Handoff for a new Claude Code account, 2026-09-08

> **Load this file first, before `CLAUDE.md`'s own "NEWEST" section (dated 2026-08-20) — this one
> is newer and corrects/extends it.** Everything below was verified directly (database queries,
> live-site checks, `gh`/`vercel` CLI, or reading the actual code) in the 48 hours before this was
> written, not carried forward from memory. Where a claim can go stale, it says exactly what
> command re-measures it — run that command before acting on the line, not after.
>
> Repo: `github.com/iscasasola/setnayan-platform` (code) · `github.com/iscasasola/Setnayan-specs`
> (spec corpus, at `~/Documents/Claude/Projects/Setnayan/` locally). Owner: Indalecio Casasola
> (`iscasasolaii@gmail.com`).

---

## 🔴 Do this first — a live thing is broken right now

**The Setnayan YouTube pool-channel OAuth token expired ~2026-09-08 04:20 UTC and has not been
refreshed.** `connection_health` in the database still reads `"ok"` — this is a known false-green:
the health field has never distinguished "refreshed" from "never refreshed."

```sql
select external_account_display, last_refreshed_at, connection_health,
       (granted_at + interval '7 days') - now() as time_left
from public.oauth_grants where provider = 'youtube';
```

**Fix (owner, ~2 min):** Admin → Live Studio channels → disconnect, reconnect. Re-issues the token
under the published OAuth app. Nothing else is blocked by this specifically, but any livestream
attempted on the Setnayan-owned pool channel right now would fail.

---

## ✅ Verified done — do not re-investigate these

- **The production deploy pipeline, which was broken for ~30 hours (2026-09-06 06:39 →
  2026-09-07 16:20), is fixed and healthy again.** Root cause was two stacked issues on Vercel's
  build machine specifically (not GitHub CI, which stayed green throughout): a hard 250MB
  Vercel-Function uncompressed-size ceiling, plus a separate flaky build-step OOM. Both fixed —
  `VERCEL_SUPPORT_LARGE_FUNCTIONS` env var set, and PR #5299 (heap 7168MB→12288MB) merged
  2026-09-07T16:19:51Z. Re-measure: `gh pr view 5299 --repo iscasasola/setnayan-platform --json
  state,mergedAt` and check the current prod deployment's commit is recent, not stuck.
- **`ENCRYPTION_KEY`** — set in Vercel production, confirmed by the owner directly in the
  dashboard (a real generated value, not empty).
- **`R2_PUBLIC_URL`** — set to `https://pub-37d64fe618584c2981a88610a55dd439.r2.dev` (R2's free
  built-in public dev URL — deliberately NOT a custom domain, since `setnayan.com`'s DNS lives on
  GoDaddy, not Cloudflare, and binding a custom R2 domain would mean migrating DNS for one
  feature). The live site's build config now references this host, confirming a rebuild picked it
  up — a full pixel-level re-check of a previously-broken shop-logo image is still worth doing
  once you have browser access, but the config-level evidence is strong.
- **`macOS` desktop build is genuinely signed + notarized** — verified in a real CI run
  (`34016548173`): Gatekeeper reports `accepted`, `source=Notarized Developer ID`. **But it has
  never reached `/download`** — see the R2 GitHub-secrets item below, that's why.
- **46 days'-worth of `DECISION_LOG.md` rows (2026-09-04 → 2026-09-08) that sat uncommitted in the
  shared checkout for 4+ days were rescued and pushed** — real decisions across 3D avatars, the
  encoder transport choice, several Papic rulings, and more. The shared checkout
  (`~/Documents/Claude/Projects/setnayan-platform`) is now fully reconciled with `origin/main`
  (confirmed via a clean `git pull`). It had also survived two near-miss destructive git
  operations from other sessions in the same window — treat that checkout as fragile; prefer an
  isolated `git worktree` for any write, especially to `DECISION_LOG.md` or anything deploy-related.
- **The 3D avatar maker is genuinely built and verified live** (not "in progress" — this closes a
  gap `WHAT_IS_LEFT` had flagged as real: "0 of 39 guests has a figure"). Three styles shipped —
  Heritage, Chibi, Blocky — with body-type/gender/hair customization, live cross-guest presence
  (verified across 3 browser tabs), and chibi dance animations. One known gap: "Gown" isn't a real
  gown silhouette yet, just a mannequin torso in gown-colored cloth.
- **13 owner rulings from the launch-checklist register are resolved** (5 closed with nothing to
  build, 2 built+PR-open as of this writing, 6 more see below). Full detail:
  `~/Documents/Claude/Projects/Setnayan/DECISION_LOG.md`, entries dated 2026-09-07 and 2026-09-08.

---

## 🟡 In-flight — has a PR, not yet merged (re-check before assuming state)

| PR | What | Re-check |
|---|---|---|
| [#5302](https://github.com/iscasasola/setnayan-platform/pull/5302) | Supplier's Desk widens: a booked vendor now sees the vendor roster (who else is locked + category) and a finalized/not flag on pax. Guest names, per-guest RSVP/dietary, seating chart, exact budget all still hidden. | `gh pr view 5302 --repo iscasasola/setnayan-platform --json state,mergedAt` |
| [#5303](https://github.com/iscasasola/setnayan-platform/pull/5303) | Off-platform-supplier invite promoted — a "Not on Setnayan yet — invite them" badge on locked vendor cards. The invite mechanism itself is unchanged, just more visible. | same pattern, PR 5303 |
| [#5304](https://github.com/iscasasola/setnayan-platform/pull/5304) | Papic gets a "what this would otherwise cost you" comparison, derived live from the catalog (`PAPIC_GUEST_400` = ₱280/400 credits), never hardcoded. | same pattern, PR 5304 |

All three were healthy (no failing checks) as of last check, just waiting on required CI. **Once
merged, they still need an actual successful production deploy to go live** — check the deploy
pipeline is still healthy, not just that CI passed.

---

## 🔴 Owner-only — nothing an engineering session can close

1. **Desktop download is 503 — separate secrets store from what you think.** `R2_ACCOUNT_ID` /
   `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_PUBLIC_URL` are set in **Vercel**, but
   `build-desktop.yml` needs them as **GitHub Actions secrets** — a completely separate store.
   `gh secret list -R iscasasola/setnayan-platform | grep -E '^R2_'` currently returns nothing.
   This is why the signed, notarized Mac build has never actually reached a customer. **~10 min,
   highest value-to-effort item on this whole list.** After setting them, re-dispatch
   `build-desktop` and confirm `curl -s -o /dev/null -w '%{http_code}\n'
   https://www.setnayan.com/api/download/mac` returns 200, not 503.
2. **Android is blocked on one external, slow-moving thing — do not re-ask this a third time.**
   The Play Console question was already settled 2026-06-25
   (`09_Operations/Google_Play_Org_Launch_Runbook_2026-06-25.md` in the spec corpus): a **personal**
   Play Console account exists but can't be used (needs a 12-tester/14-day test AND device
   verification on a real Android phone the owner doesn't own); an **organization** account waives
   both, verified by D-U-N-S instead. **D-U-N-S was requested 2026-06-25 from CRIF D&B
   Philippines — as of 2026-09-07 it's day 74 with no reply**, against an estimated ~30 days.
   Owner action: chase CRIF by phone/email with the DTI certificate (BN 8297508, already
   registered) in hand. This is the entire Android blocker.
3. **Windows code-signing cert** — SSL.com OV + eSigner, 3-4 weeks lead time, ~$129/yr. CI is
   already wired to use it the moment the four `SSL_COM_ESIGNER_*` secrets exist. Order now if you
   want Windows unblocked before other things clear.
4. **iOS App Store Connect package** — build `Setnayan_1.0_build2.ipa` is ready (Apple Distribution
   signed, build number fixed from the June rejection's duplicate-build-number issue). Still
   needs: App Privacy answers ("Data Not Used to Track You", declare Crash/Diagnostics since
   Sentry loads), a working demo account in Review Notes, and **a screen recording on a physical
   iPhone** of Profile → Delete my account → type DELETE → confirm — this is the entire fix for
   the June 5.1.1 rejection (the reviewer never got past sign-in to see the feature exists).
   ⚠ `account_deletion_requests` is empty in production — this flow has never run end-to-end;
   the App Reviewer will be the first real execution of it, worth testing yourself first.
5. **Both engineering-side "genuinely open" items from the 13-ruling register:**
   - **Day-of extras (song desk / script&cues / run-the-floor) free during launch** — ruled yes,
     but no end-date was specified for the promotion window. Needs a decision: how long?
   - **Privacy gates 0d/0e (guest-photo ROPA entry + RSVP consent wording)** — ruled to proceed,
     but nobody has actually produced the ROPA filing text or reviewed the consent copy yet. This
     is real compliance-document work, not code.
6. **The dead-relative's-memories legal brief** — ruled to re-send for a written reply, and the
   model was refined to one record/one payer/degrade-not-delete (lower legal risk than the
   original several-holders draft). **The brief document itself
   (`Phase3_Minors_and_Legacy_Counsel_Brief_2026-07-05.md`) needs a second correction pass**
   reflecting this before it goes back to counsel — this has NOT been done yet, only decided.

---

## ⚠ Corrects the previous handoff's optimism — the encoder is NOT ready for S13

The 2026-08-20 handoff (and this session's own earlier tracking) said the S13 physical rehearsal
was blocked only on S12 landing + one clean `build-desktop` run + two prod flags — **all three of
those did clear**. But a deeper, more serious gap was found 2026-09-07 that supersedes that
optimism:

**The encoder pipeline has never actually been joined end-to-end**, despite S0 through S12 + W1
all being individually merged and tested (13 PRs, 83 Rust tests green). `src-tauri/src/
encoder_ipc.rs` still carries a literal `STUB SINK` comment — the canvas worker, the WebCodecs
encoder, and the Rust RTMP sender are never actually wired together in the running app; the only
caller of the real sender is a standalone test probe (`crates/encoder/examples/publish_probe.rs`).

```bash
grep -rn "STUB SINK" src-tauri/src/encoder_ipc.rs
```

Nobody owns closing this — it fell through the cracks because each session shipped its own stage
green and assumed a later one would wire it up (S5 said S6 would; S6 merged before S5 and didn't;
S9 flagged it as "follow-up needed" and nobody picked it up). **One integration session is needed
before S13 can be attempted at all** — it doesn't exist yet. Also unmeasured: Windows/WebView2
WebCodecs support (only macOS has been checked; WebView2 is a different rendering engine), and the
owner has no Windows machine to test it on regardless.

---

## Still genuinely open, low-effort, not yet touched

- **A security gap found but not assigned:** YouTube, Google Drive, and Photo Delivery OAuth
  callback routes (`apps/web/app/api/oauth/{youtube,drive,photo-delivery}/callback/route.ts`) all
  write `refresh_token` to `oauth_grants` in **plain text** — no encryption — unlike the three
  sites `apps/web/lib/secrets/reencrypt.ts` documents as the actual encrypted set. 2 YouTube + 3
  pooled-channel grants in prod currently hold live plaintext tokens.
- **`dpo@setnayan.com` inbox routing** — never verified from any session (Cloudflare Email
  Routing, no API access). Send a test email and confirm a person reads it.
- **Windows `.msi`** — builds successfully but has never been run on an actual Windows machine.
- **Two smaller open owner rulings** (no engineering blocked): the ~450-cell vendor tier grid was
  ruled to stay (no action); off-platform-supplier-invite promotion is built (PR #5303 above).

---

## Traps that cost real time in the last 48 hours — do not re-learn these

- **`vercel env pull` cannot reliably read back a value written via `vercel env add` in the same
  CLI session** — confirmed with two disposable throwaway env vars, even after a 45-second wait.
  `vercel env ls` confirms existence but not value; the Vercel dashboard, or the live app's own
  behavior, are the only trustworthy checks.
- **`vercel --prod` run from the shared local checkout deploys whatever branch happens to be
  checked out there** — not necessarily `main`. This actually happened: a dirty side-branch went
  briefly live on `setnayan.com` this way. It was caught and rolled back via `vercel rollback`
  within minutes, verified via the Vercel API directly (not just CLI output) that the domain alias
  pointed back to the correct deployment. **Never run a deploy command from that shared checkout —
  use an isolated worktree pinned to `origin/main`, or trigger it via the GitHub-integrated
  redeploy path instead.**
- **The shared checkout accumulates uncommitted work silently.** Multiple sessions had left
  real, valuable `DECISION_LOG.md` additions uncommitted for days without realizing it (probably
  each hit a pull conflict and moved on rather than resolving it). Check `git status` there before
  trusting anything you read from it, and prefer reading `origin/main` fresh over reading that
  checkout directly for anything decision-critical.
- **A pipeline's exit code is the LAST command's, not the whole pipeline's.**
  `pnpm test:unit | grep ... | head -15` can report `exit 0` on a killed or empty run — redirect
  to a file and capture `$?` on its own line.
- **A citation into `DECISION_LOG.md` should be verified, not trusted** — two different background
  agents this session were briefed with a decision-log citation that turned out not to exist as
  described (the row existed, but agents checking the *shared checkout* saw a stale, pre-rescue
  version of the file that didn't have it yet). Both correctly re-derived the underlying facts
  independently rather than either blocking or shipping on faith — that is the right instinct to
  copy.

---

## Where to look for more

- `~/Documents/Claude/Projects/Setnayan/LAUNCH_CHECKLIST_2026-09-06.md` — the fuller version of
  this file's "in-flight" and "owner-only" sections, with more context per item.
- `~/Documents/Claude/Projects/Setnayan/DECISION_LOG.md` — search `2026-09-07` and `2026-09-08`
  for the full text of every ruling summarized above.
- `build-sessions/STORE-SHELL-CLOSEOUT-2026-09-07.md` (code repo) — the source for everything in
  the "owner-only" and "encoder" sections above; more detail than fits here.
- Interactive tracking artifact (owner-only, ask them for the link) — checkboxes persist across
  devices; each open item has a "Request fix" button that flags it for a session to act on.
