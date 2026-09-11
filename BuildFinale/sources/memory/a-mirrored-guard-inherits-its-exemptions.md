---
name: a-mirrored-guard-inherits-its-exemptions
description: Copying a Setnayan column guard copies its exemptions too — re-derive each one's reason for the new table; and a BEFORE DELETE trigger that returns NULL silently skips the delete
metadata:
  type: feedback
---

H4 (#5443, 2026-09-11) mirrored the deposit's refusal guard onto the payments ledger,
including its "a session may CLEAR the refusal to NULL" clause (`IS DISTINCT FROM OLD
AND NEW.x IS NOT NULL`). The deposit has that exemption because its couple re-sends proof
on the same record. The installment has no such path, so on the ledger the copied
clause only let a couple erase the supplier's refusal, and the dispute with it. The
orchestrator caught it at review. The same erasure was also open through DELETE, because
the couple's RLS is FOR ALL.

**Why:** a mirrored guard looks proven because the original is. But every exemption
encodes a reason tied to its first table.

**How to apply:**
- When copying a guard, list its exemptions and re-derive each reason on the new
  table; drop any whose reason doesn't hold there.
- Guard every verb the role holds (check the RLS FOR ALL / DELETE grant), not just
  the verbs you thought about.
- A BEFORE DELETE trigger must `RETURN OLD`. Returning NULL (e.g. falling through
  to `RETURN NEW`) skips the row WITHOUT an error, so erasure and cascade cleanups
  become silent no-ops. Test that non-session deletes still delete, with
  `RETURNING`.
- Prove a guard with a NEUTRALISATION run: rewrite the live function back to the
  weaker clause inside a rolled-back transaction, and show the attack lands.

Related: [[setnayan-guards-must-test-the-claim]].
