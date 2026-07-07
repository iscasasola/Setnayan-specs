# Setnayan — Usability Difficulty Heatmap (RE-ASSESSED) (1=easy .. 5=hard)
Date: 2026-06-20 · Expert-heuristic, code-grounded re-score vs origin/main (post 2-step program + anon-draft/slug-privacy session) · supersedes the 2026-06-18 baseline
Method: 4 code-grounded cluster verifiers re-checked each surface against current `apps/web` and confirmed whether each planned lever ACTUALLY shipped (not just planned), then synthesis. One owner correction applied (see Onboarding note).

## Distribution: before → after
- diff-5 (hardest): **4 → 2**
- diff-4: **8 → 7**
- diff-3: **14 → 11**
- diff-2 (easiest): **6 → 12**
- 32 surfaces · **10 improved · 0 regressed** · only Join/claim banked a full 2-step.

## Movers (score changed)
| Surface | Account | Was | Now | What moved it |
|---|---|---|---|---|
| Join / claim flow | guest | 4 | 2 | One-tap "Guest" (18 roles behind a disclosure) + accountless QR self-join (#1907). The only true 2-step — a signup wall was the rare in-code-removable blocker. |
| Onboarding wizard | couple | 3 | 2 | Anon-draft removes the mid-flow account wall; finish with NO signup → land in dashboard. LIVE in prod via the Vercel flag (see note). |
| Seating editor | couple | 5 | 4 | "Build my seating" one-tap cold-start (#1875) — recommends tables, lays them out, seats confirmed guests by role tier. |
| Verification | vendor | 5 | 4 | 8-vs-12 denominator fix — VENDOR_DOC_SLOTS (8) split from 4 admin-run slots; "upload your 8, we run the other 4". |
| Calendar | vendor | 4 | 3 | Import-outside-client button reads "Import · 1 token" (cost before tap); capacity field defaults to pool capacity. |
| Payment reconciliation | admin | 4 | 3 | Paste-and-match InboxMatcher above the queue + ConfirmForm on Approve/Reject/Refund (#1909/#1897). |
| User ops | admin | 3 | 2 | Force-sign-out / delete / blacklist moved into a collapsed "Danger zone", each behind ConfirmForm. |
| Content (social) | admin | 3 | 2 | Post-now/Pull wrapped in ConfirmForm with a post preview + channel list. |
| Help center | public | 3 | 2 | Full-text instant search over title+body+topic (client-side filter). |
| Guest find-table / seat | guest | 3 | 2 | Free, no-login, no-paid-SKU seat finder at /[slug]/find-seat (name search → public_seat_lookup RPC). |

## Unmoved — the real floors
| Surface | Account | Score | Why it held |
|---|---|---|---|
| Services / Packages builder | vendor | 5 | Consolidation did NOT ship — each card still has 3+ separate forms + saves. Biggest un-pulled win. |
| Taxonomy / vocab | admin | 5 | Per-tile cascade confirms did NOT land; deep tree + remap/move/merge inherently dense. |
| Orders / checkout | couple | 4 | Copy-buttons shipped, but the manual cross-app transfer + screenshot + ≤1-business-day human reconcile is a structural floor (V1.5 auto-reconcile). |
| Studio | couple | 4 | Palette-seed eased mood-board cold-start; the 3-creator monogram fork + role-palette abstraction remain learned. |
| Registration | vendor | 4 | event_types prefill shipped; contact_email prefill did NOT. |
| Messages / threads | vendor | 4 | Token-cost-on-Accept did NOT ship (general case) — Accept still reads "Accept inquiry" with no peso/token figure. |
| Explore (logged-out) | public | 4 | Search-first hero shipped but supply is founder-only (1 vendor) — a real-category search hits empty. |
| Guests · Budget · Website · Clients · Marketing/Ads · Vendor-verify&disputes · Pricing · Marketing-homepage · Pricing-public | mixed | 3 | Eased-but-still-3 (breadth, irreversibility, learned abstractions) or lever not built. |
| Dashboard · Explore+profile · Reviews · Real-Stories · RSVP · Day-of | mixed | 2 | Already at the floor; no change needed. |

## Remaining opportunity (un-pulled 1-step descents, all shippable)
- **Vendor Services save-consolidation** — the headline 5→4; unify the 3+ per-card save buttons (must be transactional or it loses links).
- **Vendor Messages token-cost-on-Accept** — show "Accept · 2 tokens (₱200)" before the irreversible tap.
- **Couple Budget + Orders payment-amount prefill** — selecting an installment should push its amount into the field.
- **Admin Pricing before/after-VAT diff** — confirm body is generic; show computed "was ₱X → now ₱Y incl. VAT".
- **Vendor Registration contact_email prefill** — still defaults to ''.
- **Admin Taxonomy per-tile cascade confirms** — per-tile delete/move/rename are still bare forms.
- **Explore inquiry-gate** — cold high-intent visitor still gated behind sign-in + "create your event first" (now softened by anon-draft once flag-on).

## Verdict
A 1-step program, not a 2-step one — and honestly so. Wherever a self-contained UI lever existed (cold-start seeders, denominator honesty, cost-on-button, paste-and-match, ConfirmForm danger-gating, full-text search, a free seat finder, the removable signup wall) the score dropped exactly one notch; the only true 2-step (Join 4→2) was the case where the structural blocker was itself code. The four hard limits the original audit named held exactly as predicted: **money rails, marketplace supply, external KYC, and learned spatial tools**. The biggest remaining wins are the two unmoved 5s (Services consolidation, Taxonomy confirms) and the un-pulled cost/prefill/diff levers.

## Note — Onboarding correction
The code-only re-score marked Onboarding unchanged (3=3) because `NEXT_PUBLIC_ANON_ONBOARDING_ENABLED` defaults OFF in the repo. That env var lives in **Vercel** (set by the owner 2026-06-20) + the Supabase anonymous-sign-ins toggle was enabled + both migrations applied — so in **production the account wall is gone** and the surface is a real **3→2**. A repo read can't see a Vercel deployment var; pending the owner's incognito smoke test to confirm end-to-end.

## Lineage
Baseline: `USABILITY_DIFFICULTY_HEATMAP_2026-06-18.md` (09ec9601). Program: `Usability_2Step_Remediation_Program_2026-06-20.md`. This re-score reflects PRs through #1931 (merged) + the anon-draft go-live toggles.
