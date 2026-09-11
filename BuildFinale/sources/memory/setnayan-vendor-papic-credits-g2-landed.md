---
name: setnayan-vendor-papic-credits-g2-landed
description: "G2 (vendor-portfolio Papic ledger + price) built 2026-09-05; owner's two gating answers; SUPERSEDED 2026-09-06 — pack is 100 credits not 25, video-800 question is CLOSED (see setnayan-vendor-papic-portfolio-g3-landed); 50-pt Lite gift question still open; corpus repo had other sessions' uncommitted rows so nothing was committed there"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5a838614-9ba4-4543-8763-ab49412f2153
  modified: 2026-09-06T09:46:16.536Z
---

⚠ **UPDATED 2026-09-06 — see [[setnayan-vendor-papic-portfolio-g3-landed]] first.** The ₱500 pack
now grants **100 credits, not 25** (repriced same day, commit `76688d9a6`, before G3 built on it),
and the video-at-800 question below is **CLOSED** (threshold unchanged, re-priced). Only the 50-pt
Lite gift question is still open. The numbers in the body below (25 credits, "three open questions")
are the ORIGINAL 2026-09-05 state — read them as history, not current fact.

G2 of `build-sessions/GIFTS-PLAN.md` landed on 2026-09-05 (branch `claude/vendor-portfolio-papic-ledger`,
fragment `changelog.d/vendor-portfolio-papic-ledger.md`). Owner answers, verbatim, same day:
cap — *"yes. that is the maximum from booking fee."* (1,000); host lane — *"base it all from the
supplier's shots per event not from what the host gives them."* → one meter per (vendor, event),
the supplier's own ledger `vendor_papic_portfolio_credit_grants`; the couple's pool is a separate
ledger. The 2026-08-26 ₱5/point rate is RETIRED (reversal recorded in DECISION_LOG).

**Why:** the next sessions (G3 surface, any Papic pricing work) must not re-ask these two, and must
not re-derive a price from code — `vendor_papic_portfolio_pack` ₱500 lives in `vendor_billing_catalog`.

**How to apply:** G3 calls `fetchVendorPapicPortfolioCredits` (lib/vendor-papic-grants.ts) and mints
pack orders with `service_key = vendor_papic_portfolio_pack`, `orders.event_id` and
`orders.vendor_profile_id` set. Still OWNER-OPEN, do not assume: (a) video-at-800 threshold was
priced against the retired rate and is unchanged; (b) the 50-point Lite on-the-day gift still floors
the allowance — "no floor" was said of the 5% formula only. The spec corpus at
`~/Documents/Claude/Projects/Setnayan` carried ~12 uncommitted DECISION_LOG rows from other sessions
on 2026-09-05, so this session edited the corpus but did not commit it — check `git status` there
before committing anything. See [[setnayan-shared-checkout-is-switched-by-other-sessions]].
