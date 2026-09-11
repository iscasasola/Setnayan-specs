---
name: setnayan-has-no-vercel-previews
description: setnayan-platform cancels every Vercel PREVIEW build, so a PR's green "Vercel" check is not a rendered page — verify on production after merge
metadata:
  type: project
---

`setnayan-platform` builds **production targets only**. Every preview deployment
comes back `state: CANCELED` with `errorLink: .../projects#ignored-build-step`,
and the PR's `Vercel` check still reports **pass**, with the words
`Canceled by Ignored Build Step` in its description column.

**Why:** the branch alias (`setnayan-platform-web-git-<branch>-icasa-offroad.vercel.app`)
then serves Vercel's own "instant preview" stub — an HTML page from
`instant-preview-site.vercel.app`, HTTP 200, a few KB. Fetching it looks like a
working deploy and is not one.

**How to act on it:** there is no preview URL for a feature branch. A page's
render can only be read back **after merge, off production** — `www.setnayan.com`,
against the served HTML. Before merge you have typecheck, lint, the guards and
CI's `production build` job, and nothing that proves the page renders.

**Measured 2026-09-09** on PR #5365 (S11): every preview deployment in the
preceding hour was CANCELED; `list_deployments` showed the only `READY` ones were
`target: "production"` from `main`.

Related: [[setnayan-migrate-then-deploy-is-active]], [[setnayan-local-ci-parity-traps]].
