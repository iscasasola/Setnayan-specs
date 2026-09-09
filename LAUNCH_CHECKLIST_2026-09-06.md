# LAUNCH CHECKLIST — 2026-09-06

> Interactive page for the owner (checkboxes persist across devices): <https://claude.ai/code/artifact/bb7a615b-86df-4f78-bbbe-ef20120ffff0>

**Why this file exists.** Eight sessions are running against this project right now, each
finding more real things to fix. That is not the same as getting closer to launch — until there
is one list of what "done" actually means, every session finding one more polish item just adds
quality without reducing distance. This file is that list. It does not replace
[`WHAT_IS_LEFT_2026-08-17.md`](WHAT_IS_LEFT_2026-08-17.md) (still the reference for the ~40
non-gating finishing-work items) — it replaces `OWNER_ACTIONS.md`'s "LAUNCH NOW" gate (dated
2026-06-18, and two of its four items had already silently changed) as **the** thing a session
checks before saying "launch-ready."

**Method.** Every item below marked ✅/🔴/🟡 was checked directly today — prod env vars pulled via
`vercel env pull`, prod DB queried via Supabase MCP, the live homepage screenshotted — not carried
forward from an older doc. Items marked ⚠️ CARRIED are copied from the 2026-08-17 corpus register
without re-verification; treat their status as unknown until re-checked, not as current fact.

**What "done" means for launch:** every 🔴 below is closed, every 🟡 has merged, and the S13
physical rehearsal has actually run once on real hardware. Nothing else on this list blocks
opening the doors.

> ⚠ **RE-VERIFIED ~2 hours after this file was first written, on the owner's own instinct that
> some of it was already retired — and he was right.** Eight sessions merged in that window,
> including the fix for the one item this file called RED. **The lesson is the file itself:**
> even the just-merged `S13-PREFLIGHT.md` (PR #5250, merged 06:48:10Z) was already wrong by the
> time it landed — a `build-desktop` run at 06:27:52Z (21 minutes *before* that PR merged) had
> already succeeded with real notarization, on a commit after S11. **A handoff decays fastest
> exactly where it is read most — check the corpus's own recurring lesson.** Do not treat
> anything below as current without re-running the command next to it.

---

## 🔴 Owner-only — no engineering session can close these

| # | Item | Status | What closes it |
|---|---|---|---|
| 1 | `ENCRYPTION_KEY` (Vercel prod env) | 🔴 **Set but EMPTY** — verified via `vercel env pull` today | Paste a real generated key into Vercel → Production. OAuth token decrypt + cron endpoints depend on it. **~5 min.** |
| 2 | `R2_PUBLIC_URL` (Vercel prod env) | 🔴 **Set but EMPTY — and confirmed BROKEN LIVE.** The homepage's own "SetnaProd" shop card renders a blank box where its logo should be; the `<img>` never loads even though the underlying signed R2 URL itself returns 200. Screenshotted 2026-09-06. | Set to the media bucket's `r2.dev` subdomain or `media.setnayan.com` custom domain in Vercel → Production, then reload the homepage and confirm shop logos actually render (not just that the env var is non-empty). **~15 min + redeploy.** |
| 3 | Business identity + payment accounts | ✅ **DONE — verified directly in prod DB today.** `business_tin` = `300-003-455-000` (not the old placeholder), BDO + GCash both `enabled = true` with real account numbers and QR codes on file. | Nothing — closed. Retire this line from `OWNER_ACTIONS.md`, it's stale there. |
| 4 | `dpo@setnayan.com` inbox routing | ⚠️ **Could not verify from here** — this is Cloudflare Email Routing, no API access from this session. | Send a test email to `dpo@setnayan.com` and confirm it lands somewhere a person reads. RA 10173 requires this reachable before collecting PII. |
| ~~5~~ | ~~Apple Developer Program License Agreement~~ | ✅ **CLOSED — re-verified same day, ~2hrs after this file first said "still unaccepted."** `build-desktop` run [34016548173](https://github.com/iscasasola/setnayan-platform/actions/runs/34016548173) (2026-09-06T06:27:52Z, commit `c2a63956`, after S11) shows real notarization succeeding: `codesign`/`spctl` report `accepted` / `source=Notarized Developer ID`. The S13-PREFLIGHT report (merged 06:48:10Z) said this was still broken — it was already stale by the time it merged. | Nothing — closed. ⚠ One residual gap: the `.dmg` itself reports "does not have a ticket stapled to it" (stapling step didn't run/failed) — Gatekeeper still passes online via ticket lookup, but an offline install would fail. Worth a small fix, not a launch blocker. |
| 6 | Windows OV code-signing cert | 🟡 Open, Phase 2 — not a launch blocker. Unsigned `.msi` just shows a SmartScreen warning on first run. | Purchase + configure whenever convenient; not urgent. |
| 7 | Google Play Console account status | 🔴 **Unknown — nobody has confirmed one exists.** An upload keystore exists (2026-06-14) but that doesn't imply an account. The corpus checklist's own line for this is still an unchecked box, and CI has no Play service-account secret. | Confirm whether the account exists, and if so whether personal or organization, and when created. **This single fact reorders the entire Android timeline** — a fresh personal account needs 12 testers for 14 continuous days before production access. |
| 8–22 | The 15 owner rulings from [`WHAT_IS_LEFT_2026-08-17.md`](WHAT_IS_LEFT_2026-08-17.md) §6 | ⚠️ **CARRIED, not re-verified today.** Two of the original 15 (compromised-password checking; the face-matching public-page claim) were already resolved by the time that doc was last touched — those are dropped here. The other 13 are copied below verbatim-in-spirit. | For each, give a one-line **"still open" / "already decided — see PR/commit" / "no longer relevant"**. Anything you confirm here retires permanently; anything you don't gets re-dated, not re-invented, next time this file refreshes. |

### The 13 carried owner rulings — re-checked against `DECISION_LOG.md` today, 3 already closed

1. ~~Turn on the supplier handshake~~ — ✅ **CLOSED.** Ruled 2026-08-18 ("the supplier must agree for the user's request before it is locked") AND actually flipped: `NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED="true"` confirmed in prod today.
2. How much of a couple's private plan may a booked supplier see? (Blocks the last Event Hub step.) — still open.
3. May a coordinator who was booked but never promoted announce things to guests? — ⚠ **LIKELY CLOSED, worth one owner confirm.** `DECISION_LOG.md` 2026-08-24 records the owner saying broadcasts are shipped and settled ("yes on the event hub they have an announcement they can type on") — but that entry doesn't speak to the specific "never promoted" edge case this line names. Confirm rather than assume.
4. Should day-of extras be free during launch? — still open.
5. Should couples be able to invite off-platform suppliers onto Setnayan? (The invite mechanism already ships — `createManualVendorInvite` — so this may really be "should we promote it," not "should we build it.") — still open.
6. Do wedding recordings stay on a channel forever, or get wiped when it's reused? (Specs currently say both.) — still open; no `DECISION_LOG.md` entry found.
7. The features page is frozen — two approved documents describe it as two different shapes. — still open.
8. Guest photo-taking is live while two required privacy sign-offs have never been signed. — still open. Related but distinct: 2026-08-18 also ruled camera-seat photo consent (owner/account holder decides), which unblocked the gate the 14 production photos sit behind — worth checking whether that ruling covers this line too before treating it as separately open.
9. ~~The anti-fraud scoring that can hide a supplier has nobody's name against it.~~ — ✅ **CLOSED 2026-08-18.** Approved and recorded (approver + timestamp written the same day).
10. The corrected lawyer's brief on keeping a dead relative's memories — no record it was ever sent. — still open.
11. The photo service has no "what this would otherwise cost you" figure — needs your honest number. — still open.
12. Should suppliers still see the ~450-cell tier grid, now that each plan states what it adds? — still open.
13. The public category words (*Look, Feast, Documentary, Booths*) are internal jargon — nobody types those. Rename or keep? — still open.

---

## 🟡 In-flight engineering — already has a session or PR on it

| Group | Item | Status |
|---|---|---|
| Vendor | ~~[#5249](https://github.com/iscasasola/setnayan-platform/pull/5249), [#5251](https://github.com/iscasasola/setnayan-platform/pull/5251)~~ | ✅ **MERGED** (re-checked today). Nothing left. |
| Papic | ~~[#5254](https://github.com/iscasasola/setnayan-platform/pull/5254)~~ (drift guard) | ✅ **MERGED**. Nothing left. |
| Setnayan AI | ~~[#5256](https://github.com/iscasasola/setnayan-platform/pull/5256)~~ (deploy-drift monitor frozen-clock fix) | ✅ **MERGED**. Owner call still open: is the 20-min drift grace period still right given ~7min/build real deploy latency? |
| MB | ~~[#5253](https://github.com/iscasasola/setnayan-platform/pull/5253)~~ | ✅ **MERGED** (re-checked today — the migration syntax fix landed and went green). This file called it RED two hours ago; it wasn't by the time anyone read that. |
| Encoder | ~~S12 (updater)~~ | ✅ **MERGED** — [#5252](https://github.com/iscasasola/setnayan-platform/pull/5252), "S12 — auto-updater so a Rust encoder bug doesn't mean reinstalling." |
| Encoder | ~~`build-desktop` clean run~~ | ✅ **SUCCEEDED** — see the Apple-agreement row above. One more dispatch on the current head (post-S12) as a final confirmation before scheduling S13 would be cheap and worthwhile, since this success predates the S12 merge by ~30 min. |
| Desktop | Windows `.msi` | Still open — built, but never run on an actual Windows machine. Needs one verification pass before calling it "working" the way macOS now is. |
| iOS | App Store submission | Still open. Build is ready and already carries the June rejection's fixes. Needs ~1hr of your input in App Store Connect (App Privacy answers, demo account, deletion recording), then submit → 24–48h review. Nothing engineering-side is left. |

---

## ⚪ Needs scoping — no stated "done" bar yet

- **3D** — the "3D Oversight" session is actively running (5,500+ messages) with no stated remaining scope visible from outside. Needs a direct check-in, not a guess.
- **Encoder S13 physical rehearsal** — cannot run inside any coding session by design (it requires disconnecting the network and closing the lid of the machine running it). ⚠ **UPDATE: all three preflight blockers this file originally listed are now closed** (S12 merged, a post-S11 `build-desktop` run succeeded with real notarization, both prod flags confirmed on). What's left is genuinely just scoping now: pick a real Mac + Windows machine + phones window, ideally after one more `build-desktop` dispatch on the current head to confirm post-S12 too.

---

## ✅ Verified done today (2026-09-06) — do not re-litigate

- Business identity, TIN, BDO/GCash accounts — real values in prod DB, not placeholders.
- `CRON_SECRET`, `OAUTH_REFRESH_CRON_SECRET`, `INTERNAL_WORKER_SECRET` — all set in prod (only `ENCRYPTION_KEY` of the four is empty).
- `NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED` and `NEXT_PUBLIC_PANOOD_STREAMING_ENABLED` — both `true` in prod. **This closes S13 pre-flight blocker #4** — the two flag values are no longer unrecorded.
- Guestlist workstream — 8 PRs merged, `deploy-prod` verified matching `origin/main`'s head.
- Android: no Google Mobile Services dependency at all, so Huawei AppGallery distribution is low-effort whenever wanted.

---

## Superseded / relationship to other docs

- **`OWNER_ACTIONS.md`**'s "LAUNCH NOW" gate (2026-06-18) — superseded by the 🔴 table above. Two of its four items (business identity, and half of the crypto-secrets item) were already closed and it didn't say so.
- **`WHAT_IS_LEFT_2026-08-17.md`** — untouched, still the reference for the ~40 finishing-work items that don't gate launch. Its §6 owner rulings are carried into this file's 🔴 table so there's one place to close them, not two.
- **`STATUS.md`** (code repo) currently points to `WHAT_IS_LEFT_2026-08-17.md` §6 as "the launch checklist." That pointer should be updated to this file — flagged here, not changed silently, since `STATUS.md` is a shared snapshot other sessions read cold.

SPEC IMPACT: None — this is a status/tracking document, not a product decision.
