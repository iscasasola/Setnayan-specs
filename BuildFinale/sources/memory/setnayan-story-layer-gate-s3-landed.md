---
name: setnayan-story-layer-gate-s3-landed
description: "Story build step 0.3 (S3) shipped in PR #5331 — the guests' layer is gated by DERIVATION, not a column, so S4/S9/S15 must not add a per-layer flag; owner gate Q1 is still open behind one constant"
metadata:
  node_type: memory
  type: project
---

**S3 / `08_Build_Order.md` step 0.3 is DONE — PR #5331, merged 2026-09-08T17:39:50Z
(`6fab7df29`), deployed to production and verified on the live objects.**
Do not rebuild it.

`apps/web/lib/the-guests-layer-is-theirs-until-you-publish.ts`:
`storyLayerAdmits(layer, status, viewer)` over host / guest / edition;
`redactStoryLayers(data, viewer)` strips the withheld layers from the payload;
`drawnBins()` is the only source of dial bar heights.

🔑 **THERE IS NO PER-LAYER COLUMN, AND THAT WAS THE DECISION.**
`03_Data_Requirements.md` §2.5 says "a per-layer flag", which reads like schema —
but the mapping (`published` → `published`, else `event`) is **total**, so it is
derived from `event_editorial.status`. A column would only add a second opinion
that can disagree with `status`. §2.5 in the corpus now carries a
🛑 **"S4: DO NOT ADD A PER-LAYER FLAG"** banner. S4 (PR #5330) correctly added
none — verified in prod: `events` has `story_cover_kind`, `story_cover_ref`,
`previous_event_id`, and `panood_broadcasts.peak_concurrent_viewers`, and no
layer column anywhere.

⛔ **OWNER GATE Q1 IS STILL UNANSWERED.** "Are aggregate counts and bar heights
public before publish?" Built to the default **no**. The whole answer is one
named constant, `COUNTS_ARE_THE_GUESTS_LAYER` — flipping it needs no other edit.
Do not decide it in code.

⚠ **Two things left open on purpose.** `galleryPhotos`/`essayPhotos` merge the
couple's own uploads with Papic captures before the redaction sees them, so both
are taken (the safe direction) — separating them needs provenance carried at
load. And `/[slug]/recap` is on the guard's written baseline because it is gated
by its **own** `event_recaps.status`, independent of the story's.

🔗 When **PR #5329** (S2, `story_dial_bucket_counts` RPC) lands, route its
per-bucket counts through `drawnBins()` — its own note names this consent veto as
S3's job. Measured 2026-09-08: that RPC did **not** yet exist in prod.

🪤 **Production cannot prove the withholding end-to-end today.** Every
draft-status event has zero guest content, and the only event with captures
(`movie-night`, 14) is already published — so there is no live event that is both
pre-publish and non-empty. The proof is the payload test; what production shows
is the published story still printing (200) and both drafts refusing a stranger
(307). Say so rather than implying a live proof.

See [[setnayan-guards-must-test-the-claim]] — the guard here asserts the
serialised payload, because a test matching `data-layer` or a CSS rule would have
passed on the exact page the design review rejected.
