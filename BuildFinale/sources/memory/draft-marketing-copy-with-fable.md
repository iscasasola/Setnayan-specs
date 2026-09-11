---
name: draft-marketing-copy-with-fable
description: "Owner wants public product-page / product-description copy on Setnayan drafted with the Fable model, grounded only in shipped features"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0c2ad91d-67d2-4ff7-9128-605e73f22fc4
  modified: 2026-09-05T02:21:57.416Z
---

When writing or redesigning a public product-description page for Setnayan (e.g. `/setnayan-ai`),
draft the copy with the **Fable** model (`Agent` tool, `model: "fable"`), not by hand — owner,
2026-09-05: *"use Fable to design our Page Product Description for us to be able to show
truthfully what this feature brings to the table."*

**Why:** the owner wants benefit-led, editorial marketing prose in the site's voice, and the
word "truthfully" is load-bearing — the pages carry an owner-locked accuracy guardrail.

**How to apply:** give the Fable agent the verified list of SHIPPED capabilities as grounding
(for Setnayan AI that is `setnayan-ai-value-copy.ts`), the page's existing hero/closing copy as
a tone sample, and a hard "no unshipped claims" rule. Verify every claim the owner suggests
against code first (see [[setnayan-mood-board-not-ai-linked]]); drop anything that isn't in the
tree and say so. Then place the result yourself — the `DoorwayPage` `children` slot is the
sanctioned home for a page-specific section.
