---
name: setnayan-read-prod-flag-values
description: "How to read a Setnayan NEXT_PUBLIC_* flag's real production value — it is never in the repo, only in Vercel"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 0c2ad91d-67d2-4ff7-9128-605e73f22fc4
  modified: 2026-09-06T00:56:47.594Z
---

Setnayan sets **no** feature-flag values in the repo (`.env.example` has none, `vercel.json` has
none) — the live values exist only in Vercel, so "the flag defaults OFF" in a docblock says nothing
about production. The Vercel MCP does not expose env values, but the CLI is already logged in:

```bash
vercel env ls production --scope icasa-offroad          # names + which environments
vercel env pull <scratchpad>/prod.env --environment=production --scope icasa-offroad
```

Pull into the session scratchpad, grep the one flag, `rm` the file immediately. Never into the repo
(gitleaks is a required check).

🪤 **A FRESH `/private/tmp/wt-*` WORKTREE IS NOT LINKED, and `--scope` does not rescue it.** The link
lives in `.vercel/project.json`, which is gitignored, so `env pull` from a new worktree fails
`not_linked` and tells you to run `vercel link` (interactive). Don't. Copy the link in, pull, then
delete it so it never reaches a commit:

```bash
mkdir -p <wt>/.vercel && cp ~/Documents/Claude/Projects/setnayan-platform/.vercel/project.json <wt>/.vercel/
# … vercel env pull … grep … rm the env file …
rm -rf <wt>/.vercel
```

Measured again 2026-09-09: `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` **and**
`NEXT_PUBLIC_SMART_SORT_ENABLED` are both `"true"` in Production, so the couple's bench sort bar and
the tail-tier price re-rank are live for real users. ⚠ A build-plan gate can say a flag "is not
readable from a session" and be **wrong** — this one did; measure before repeating it.

⚠ **`env pull` does NOT write every value — an encrypted var comes back as the literal string
`[encrypted]`, and a session cannot read it at all.** Measured 2026-09-06: 49 of 134 production vars
were `[encrypted]`, `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` read `"true"`, and all three
`GOOGLE_DRIVE_OAUTH_*` read `[encrypted]`. Adding `--scope icasa-offroad` changes nothing.

🔑 **So `[encrypted]` means UNREADABLE, never UNSET** — the two are indistinguishable from here, and
reporting "that secret isn't configured" from an 11-character value is a false negative waiting to
happen (it nearly became "the Drive OAuth isn't set up", about credentials that may well be fine).
When a feature's liveness depends on a secret, say it is unverifiable and name the 30-second UI
check that answers it instead.

**Why:** several sessions have shipped a "flag-dark, changes nothing in prod" claim in a PR body
without ever checking, and the flag was on. Whether a gate is a kill-switch or a dark corridor is a
fact about Vercel, not about the code.

Measured 2026-09-06: `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED`, `NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED` and
`NEXT_PUBLIC_PAYMENT_GATED_LOCK_ENABLED` were all `"true"` in Production — re-read them rather than
trusting these values later. Related: [[setnayan-local-ci-parity-traps]].
