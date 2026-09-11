---
name: setnayan-desk-sources-were-opt-out
description: "Two of the story desk's four sources had NO host-decision column — a challenge answer published on the guest's consent alone and a supplier's frame published unless hidden; S5 added `status` to both, and a table-level grant audit lied about who could write them"
metadata: 
  node_type: memory
  type: project
  originSessionId: e4b74d75-12c4-409f-a057-0c851fe19aa5
  modified: 2026-09-08T21:47:08.951Z
---

Measured against production 2026-09-09 (S5, PRs #5337 rename + #5338 desk):

**`03_Data_Requirements.md` § Bonus said all four desk sources "each [have] their own status
column" and that "nothing new is stored". FALSE for two of the four**, and they failed in
opposite directions:

- `papic_mission_completions` — no status, no moderation_state, no hidden flag. A **challenge
  answer reached the public story the moment the GUEST consented; the host was never asked.**
- `editorial_vendor_media` — no status either. Its only lever, `hidden_by_couple`, is
  `DEFAULT FALSE` (**shown unless hidden**) and **has never had a writer anywhere in the repo**
  (recorded in `gates-have-handles.baseline.txt` and `lib/editorial-vendor-media.ts`).

Migration `20271214724787` adds `status TEXT NOT NULL DEFAULT 'pending'` to both, required by
the public readers in `app/[slug]/_components/editorial/data.ts`. All four tables held **0 rows**
in prod at the merge, so nothing published changed.

🪤 **A TABLE-LEVEL GRANT AUDIT LIES HERE.** `information_schema.role_table_grants` reports
`authenticated` holding **no UPDATE** on `editorial_vendor_media` — the grant is held **per
column, on all 14**. Query `column_privileges`, never `role_table_grants`, when the claim is
about what a caller may write. (14 pre-existing grants there let a couple PATCH a supplier's
`still_r2_key`, `caption` and `vendor_profile_id`; named in the migration, deliberately NOT
narrowed.)

🪤 **`col = TRUE` IN A FUNCTION BODY REGISTERS AS A WRITER.** `gates-have-handles` scans
`\mcol\M\s*=[^=]`, which a comparison matches as an assignment does — so a trigger comparing
`consent_to_public = TRUE` retired a baseline line about **`papic_photos`**, a table the
migration never touches, and the failure looked unrelated. Write the bare boolean / `NOT col`
on NOT NULL columns. Second migration in the repo to pay for this.

**Why:** the desk's whole promise is *accept is the only way anything enters*; without these
columns it was unbuildable, and the brief asserted they already existed.

**How to apply:** verify a "status column exists" claim against `information_schema.columns` in
prod before designing around it; see [[setnayan-local-ci-parity-traps]] for the full-suite rule
that caught the rest.
