---
name: setnayan-vendor-papic-portfolio-g3-landed
description: G3 (vendor-portfolio Papic surface) built 2026-09-06 as PR #5267 from a fresh worktree; buy-pack action + new private album table; pack is 100 credits not 25 (repriced same day, before this PR); video-800 question is now closed
metadata:
  type: project
  originSessionId: 546a30ec-cd0d-49a0-9a9b-b1886f63f048
  modified: 2026-09-07T09:46:03.646Z
---

G3 of `build-sessions/GIFTS-PLAN.md` (`setnayan-platform`) landed 2026-09-06 as
PR [#5267](https://github.com/iscasasola/setnayan-platform/pull/5267)
(`claude/vendor-papic-portfolio-album`) — **MERGED** 2026-09-06T13:47:24Z (merge
commit `c16f771cf`), all worktrees pruned. This closes the whole
`GIFTS-PLAN.md` G1–G6 series — all six are now merged (G1 #5192/#5193, G2
#5201, G3 #5267, G4 #5211+#5225, G5, G6 #5246); DECISION_LOG row added for G3
(the corpus repo had ~9 other files uncommitted from other sessions, so the
row was appended but nothing was committed there — same pattern as every prior
Papic session). CI caught two hidden-roster gaps my local scoped checks
missed before merge — see [[setnayan-order-mint-and-table-rosters]] for the
generalizable lesson. Built:
buying a Papic credit pack (apply-then-pay, mirrors `booth-addon-actions.ts`) and
a NEW private portfolio album table (`vendor_papic_portfolio_photos`, migration
`vendor_papic_portfolio_photos`) where a supplier imports finished photos into
their own business page — deliberately a fourth table on Ugat joint J49, not a
spend-source bolted onto `vendor_papic_captures` (an import isn't a camera
event: no consent gate, no event-day window, own storage prefix
`papic/vendor-{id}/portfolio/{eventId}/…`). `fetchVendorPapicPortfolioCredits`
now folds spend from BOTH doors (capture + import) into one `left`.

**Why:** the next Papic session must not re-derive the pack size from the
2026-09-05 G2 memory (`[[setnayan-vendor-papic-credits-g2-landed]]`), and must
know the "3 owner questions" gating G3 in `GIFTS-PLAN.md` were ALL resolved
before this PR started, not by it.

**How to apply:** the ₱500 pack grants **100 credits, not 25** —
`VENDOR_PAPIC_PORTFOLIO_PACK_CREDITS` was raised same-day (2026-09-06, commit
`76688d9a6`, *"the ₱500 pack is worth buying"*) because 25 was 29× a couple's
per-credit rate and nobody bought it. That same commit also CLOSED the
video-at-800 question: the threshold is UNCHANGED (still 800), re-priced back
to its original ₱4,000-equivalent by the pack repricing rather than moved. The
**50-point Lite on-the-day gift question is still genuinely OPEN** — untouched
by either commit, flagged again in `lib/vendor-papic-tier.ts`. Corpus
DECISION_LOG update for this PR is still pending (SPEC IMPACT line written in
the changelog fragment, not yet applied to the corpus — check before assuming
it's recorded). See [[setnayan-shared-checkout-is-switched-by-other-sessions]]
for why this was built in `/private/tmp/wt-vendor-papic-portfolio-album`
rather than the shared checkout (which was 122 commits behind on a different
branch at the time).
