---
name: setnayan-a-new-gate-reddens-other-branches-fixtures
description: "Merging a PR that tightens an insert/publish rule (e.g. H2's \"a live card needs a cover\") turns OTHER merged PRs' db-test fixtures red on main; merge-tree \"clean\" does not catch it"
metadata: 
  node_type: memory
  type: project
  originSessionId: f25a0ccb-6fe2-46a1-ab74-c5d37ef9adcb
  modified: 2026-09-11T02:50:55.216Z
---

On 2026-09-11 the orchestrator merged #5442 (a service card can only go live with a cover photo + one "what's included" line, enforced by the publish trigger) right after #5439 and #5441, whose db tests insert a live card without a cover. main went red on those two suites; every open PR that merged main inherited the red until a fixture-only PR (#5445) landed.

**Why:** `git merge-tree` and GitHub's mergeable check only see textual conflicts. A gate that changes what the database ACCEPTS breaks fixtures in files the gate PR never touched.

**How to apply:** when releasing a PR that adds or tightens a trigger/CHECK/publish rule, first grep open branches and recently merged tests for fixtures that insert into that table (e.g. `is_active` service cards), and either merge the gate FIRST and then update every open branch with main, or require the dependents to adapt their fixtures before the gate lands. After it lands, run `gh pr update-branch` (or merge main) on every open PR and watch main's CI once. See also [[setnayan-guard-count-headers-are-merge-conflicts]].
