# Live Studio → INTERNAL consent · owner cutover sheet (2026-07-27)

> **Decision (owner, 2026-07-27): "go internal."** Live Studio takes the Cloud Identity → Internal-audience path, which removes Google OAuth verification **entirely** — no brand verification, no sensitive-scope review, no unverified-app screen, no 100-user cap. This sheet is the part **only the owner can do**, in order, with the traps that cost time if hit in the wrong sequence.
>
> Everything on the code side is already shipped. Nothing here is waiting on engineering.

---

## Why Internal, in one paragraph

Google waives verification when the consent screen's Audience is **Internal**, and Internal means *only members of your own Google organisation may authorise*. Live Studio qualifies because under the owner-locked pool model only Setnayan's own admin account ever grants consent. `auth/youtube` is a **sensitive** scope, so the External alternative is the full review pipeline — brand verification (2–3 days) plus sensitive-scope review (2–4 weeks realistically), re-triggered on every branding change. **And External may be unsatisfiable at all** under the pool: its demo video must show *"the OAuth grant process that users will experience"*, and under the pool no user ever grants.

---

## ⛔ THE ONE UNKNOWN — do this before anything else (15 minutes)

Google documents in **neither** direction whether a **Cloud Identity Free** organisation can own a YouTube channel with live streaming. Everything below depends on it, so buy the answer for 15 minutes instead of three weeks.

**Step 0 (2 min) — check for conflicting accounts.** Any existing Google account on an `@setnayan.com` address (`hello@`, `admin@`, `billing@` used to sign up for some SaaS) becomes a "conflicting account" mid-signup. Find them now, not halfway through.

**Step 1 (15 min) — THE KILL TEST.**
1. Sign up at `https://workspace.google.com/gcpidentity/signup?sku=identitybasic` — **the `identitybasic` SKU matters. Refuse any upsell into a Workspace trial.**
2. Verify `setnayan.com` by **DNS TXT record only**. **Never touch MX.** Cloud Identity Free has no Gmail, so nothing legitimately needs your mail records.
3. Create one user: `live@setnayan.com`.
4. Open **Admin console → Apps → Additional Google services** and answer one question:

> ### Is YouTube in the list?

- **YES** → the ₱0 path is alive. Continue to Step 2.
- **NO** → the ₱0 path is dead at that instant. Fall back to External verification — and merge the public-copy realignment first, because it becomes mandatory rather than merely correct.

---

## If the test passes — the rest, in order

**Step 2 (10 min) — turn YouTube on for the org.** Enable it as an additional service, **and set YouTube content restriction to "No restrictions"** — Restricted Mode silently blocks uploads even when the service is on, so "on" is not enough.

**Step 3 (10 min + 24 h wait) — gate G1, the long pole.** Sign in to youtube.com as `live@setnayan.com`, create the channel, then at `youtube.com/verify` phone-verify it and enable live streaming. **YouTube imposes a 24-hour wait before the first stream** — this is the only multi-week-shaped item and it starts only when you do. Do not skip the ₱30 "eligibility" prompt if it appears: the criteria are an **OR** (`$30 processed` **or** `account is 30+ days old`), so waiting is free and identical.

**Step 4 (15 min) — a BRAND-NEW Cloud project inside the organisation.** Do not reuse the existing `SETNAYAN` project and do not migrate it.

> ⚠ **WHY A NEW PROJECT — this one bites hard.** The consent-screen **Audience is a PROJECT-level setting**, and the existing project also carries Papic's Google **Drive** OAuth client. Flipping that project to Internal would return `org_internal` to **every couple connecting their own Drive** and silently kill Papic photo delivery. `drive.file` is non-sensitive, so the existing project needs no verification and is fine exactly where it is. **Leave it alone.**

In the new project: set **Audience → Internal**, create a **new OAuth client**, and register the redirect URI **exactly**:

```
https://www.setnayan.com/api/oauth/youtube/callback
```

**Step 5 (5 min) — credentials into Vercel.** Set `YOUTUBE_OAUTH_CLIENT_ID`, `YOUTUBE_OAUTH_CLIENT_SECRET`, `YOUTUBE_OAUTH_REDIRECT_URI` for the new client. Prefer `/admin/secrets` so the rotation board stays accurate.

> 🚨 **SET `NEXT_PUBLIC_LIVE_STUDIO_POOL_ONLY=true` IN THE SAME CHANGE.**
>
> The BYO route and the pool route **share one OAuth client** (`getYoutubeOAuthConfig`). The moment Internal credentials are live, the couple-facing "Connect YouTube" door starts answering `org_internal`. Pool-only closes that door properly. The code now translates `org_internal` into the same plain notice even if the flag lags, so nobody sees a raw error either way — but flip them together and the window never opens.

**Step 6 (5 min) — connect the channel.** `/admin/live-studio-channels` → connect → verify (a human attestation; Setnayan cannot see whether YouTube enabled live streaming) → set the channel's **`concurrent_cap`**.

> ⚠ **The default is 4.** It caps YouTube broadcasts per Setnayan channel per event, so a couple who sets up 8 cameras silently gets 4 — and `skippedOverCap` is computed and then **discarded by its only caller**, so nobody is told. Set it deliberately now: 12 matches `MAX_ROAM_ZONES`.

**Step 7 — G4, the quota increase.** Not blocking the first wedding; file early. The ceiling is roughly 12–15 weddings/day.

---

## Then, and only then: prove it

**Do not sell a dated broadcast before one has actually reached YouTube.** Production still holds **0 broadcasts ever created**. The unified controller's path to air has never been exercised end to end, and a wedding cannot be the first attempt (the B6 gate).

Run one non-paying mock event: cameras join by QR → cut between them → OBS window-captures `/panood/program/[eventId]` → confirm it arrives on the Setnayan channel → End → confirm the recording resolves on the couple's Live Studio page.

**⚠ The encoder is still yours.** Browsers cannot push RTMP and the native capture app was never built, so the couple's own OBS window-captures the program output. Internal removes the *YouTube-account* requirement, **not the encoder**.

---

## What is already done (no action needed)

- **Pool-only switch** — `NEXT_PUBLIC_LIVE_STUDIO_POOL_ONLY`, closes the BYO consent door at the route, ahead of auth and any Google call (PR #3792, default OFF).
- **`org_internal` translated** into a plain status instead of a raw failure, on every couple-facing surface.
- **The recording handoff** — End completes the per-camera broadcasts, tears the guest picker down, and resolves the archives on both setup surfaces.
- **The paid-day anchor** — a free go-live no longer starts the ₱2,999 clock, so buying ahead genuinely costs nothing.
- **Ownership keys** — a couple who pays is no longer shown "Add" instead of "Go live" at their wedding.

## What is still open (owner calls, not blockers)

1. **Wipe vs. indefinite retention** of recordings on the Setnayan channel — two corpus docs contradict each other; wiping would delete a wedding, so nothing was built.
2. **The pool-side file handoff** — on a Setnayan channel the couple is not the channel owner and cannot download from YouTube Studio.
3. **The legacy retirement sequence** — redirects are safe now; deletion waits for proof of air.
4. **The public-copy realignment** — required for truthfulness regardless of path, and *mandatory* if the kill test fails and you go External.
