---
name: setnayan-live-drive-needs-a-person-signin
description: "How step 8 drove the LIVE Setnayan site as a testnayan host in Playwright without anyone's password passing through code — a person signs in once in a headed persistent-profile window"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 444932b7-6d6a-48b3-9602-16b2cca797f1
  modified: 2026-09-11T08:49:47.756Z
---

Driving www.setnayan.com as a signed-in host in Playwright (Story step 8, 2026-09-11): the corpus
folder `Design_Editorial_By_The_Minute_2026-09-07/step8_end_to_end_drive/` holds `signin.cjs` —
it opens a VISIBLE Chromium on `/login` with `launchPersistentContext(E2E_PROFILE)`; the owner
types the testnayan password himself; every later headless run reuses that profile
(`e2e-lib.cjs` `hostContext`). Keep the profile in the session scratchpad, never the repo/corpus.
`whoami.cjs` confirms which account the profile holds (read from the page, never a cookie).

- The in-app Browser pane's sign-in does NOT reach Playwright — they are separate browsers. The
  owner signed into the pane first; he had to sign in again in the Playwright window.
- `signin.cjs` must wait for OUR host again (a hop to accounts.google.com is not "signed in");
  tell him to use the email+password form, not Google (Google = his internal account).
- Guests need no sign-in: open `/{slug}?invite={guests.qr_token}` or
  `/papic/me/{qr}/session?next=pool` in a fresh context.
- Resetting a test arrangement between runs is a direct SQL write as postgres (the one-door
  trigger only blocks authenticated/anon) — NEEDS_THE_OWNER item 2 (writing prod to test) is
  still unruled, so say so in the report. Never create scratch tables in prod public schema.

Related: [[setnayan-make-it-yours-step4-landed]], [[setnayan-has-no-vercel-previews]].
