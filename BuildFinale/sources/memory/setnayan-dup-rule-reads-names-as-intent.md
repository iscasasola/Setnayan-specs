---
name: setnayan-dup-rule-reads-names-as-intent
description: In Setnayan, an exported *_SELECT/*_COLUMNS constant becomes its table's CANONICAL list for lint:dup-rule; name a purpose-specific projection otherwise, or every narrow read of that table gets accused
metadata:
  type: feedback
---

`lint:dup-rule` (GUARD 2, lib/security/select-column-scan.ts) treats any EXPORTED
constant named `*_SELECT` or `*_COLUMNS` as the canonical column list of the table it
is first `.select()`ed from. It then flags every hand-typed select of that table that
reproduces enough of the list ("near-copy with a hole"). The name is the ONLY
declaration of intent the scanner has.

Two outcomes seen on 2026-09-11:
- A genuinely canonical list (H4's `DEPOSIT_DISPUTE_COLUMNS`) caught a real narrow
  read on the couple's workspace, and the right fix was to USE the constant there.
- A disclosure-specific list (the data export's ledger projection) named
  `LEDGER_EXPORT_SELECT` accused 59 legitimate narrow reads. The fix was renaming it
  `LEDGER_EXPORT_PROJECTION`, not baselining 59 lines.

**Why:** the guard's baseline header says "do not regenerate to go green, use the
definition", which is right only when the constant really is the table's shape.

**How to apply:** before exporting a column-list constant, decide whether it is the
table's canonical shape (`_SELECT`/`_COLUMNS`, and adopt it at the reads it flags) or
one purpose's projection (any other suffix, with a comment saying why).

Related: [[setnayan-guards-must-test-the-claim]] — and the host-means-host sweep
example there: a read can pass a windowed text scan only because a NEIGHBOURING
statement satisfies it.
