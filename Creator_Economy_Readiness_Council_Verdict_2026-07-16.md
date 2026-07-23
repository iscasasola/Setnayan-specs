# Creator Economy — Readiness Council Verdict

## 1. Go / No-Go on P2

**GO-AFTER-FIXES.** The creator base and the P1 collab loop are architecturally sound and the "Setnayan never touches the money" invariant holds in both code and plan — but P1 (already merged as #3318) ships with a **confirmed reach-token revenue leak** and two reservation-integrity flaws, plus the whole funnel is gated behind an **orphaned authoring page** and **copy that tells creators publishing does nothing**. None of these is a redesign; all are bounded fixes. Close the four MONEY-seat integrity bugs and the two build-state lies, lock the attribution + anti-gaming rules on paper, and P2 is safe to write. Do **not** start P2 code until the P1 leak is fixed and the review commit is pinned — P2's tier/ROI numbers inherit P1's ledger.

## 2. What's solid (certified-ready)

- **The three-party money model is genuinely no-touch.** Creators paid in discounts + audience, never cash; discounts settle off-platform; Setnayan only gates with the vendor's own reach-token wallet and records attribution. No payout path, no couple-money escrow, no cash-to-creator column. Verified in P1 code and preserved by construction in the P2/P3 plan; the true-affiliate cash-cut path is correctly deferred out of scope.
- **P2 is reuse-first, not a parallel quote system.** `startServiceInquiry` (`app/v/[slug]/inquiry-actions.ts`) already converges on the single `chat_threads UNIQUE(event_id, vendor_profile_id)` row that feeds unlock → Proposal Maker (`app/_components/proposal-maker.tsx`, ~1081 LOC, verified) → `/proposals/[publicId]`. P2 needs only an attribution column + Book CTA + surfacing.
- **No fake doors on the built surfaces.** Chapter "Vendors — shoppable" cards are honest read-only `/v/[slug]` links (`app/u/[userSlug]/c/[chapterId]/page.tsx`, explicit "read-only surfacing, no new inquiry flow here" comment), not a broken Book button. The absent P2 Book CTA is a clean gap, not a broken promise.
- **User-native refactor + embed safety are complete.** `is_creator` / `creator_applications` fully retired (migration `20270815042234`, zero dangling refs); embeds strictly allowlisted + normalized (`lib/creator-chapters.ts`) and mounted through one sandboxed iframe; `/u/[userSlug]/c/[chapterId]` route is non-colliding and gated on public + published.
- **Audience layer is privacy-safe.** Aggregate BIGINT counters with no per-viewer rows, SECURITY DEFINER RPCs self-gated to published+public and revoked from anon/authenticated; Pattern-A private follow graph; consent-gated notify-on-publish reusing the 0028 pipeline. Cron-free.
- **P1 RPC authorization is sound and double-consume is guarded.** `offer_creator_reach_hold` gates on `vendor_team_members` + self-offer guard + free-tier block + creator-eligibility; `respond_/link_` gate on `creator_user_id = auth.uid()`; sweep is service_role-only. `respond_creator_offer` does `SELECT … FOR UPDATE` and no-ops if `status <> 'pending'` (idempotent); the expiry sweep only flips `pending → expired` with no debit. No cross-tenant action path and no double-refund.

## 3. BLOCKING — must fix before P2 (ranked)

**B1. Reach-token revenue leak — swallowed consume in `respond_creator_offer` — CONFIRMED.**
The token debit (`consume_vendor_assets_per_voucher` / `consume_member_purchased_tokens`) is wrapped in `BEGIN … EXCEPTION WHEN OTHERS THEN RAISE NOTICE`, yet the offer still flips to accepted/declined. On any consume failure (chiefly `INSUFFICIENT_WALLET_BALANCES`) the reach happens, the offer resolves, and **no token is charged = free vendor outreach**. This deviates from the reused lead-hold pattern, which *raises and rolls back*. It also silently corrupts telemetry: the RPC returns `tokens_consumed = reach_tokens_held` even when nothing was debited, so the leak is invisible to the vendor and to ops. *Why it blocks:* the entire honesty filter for the P2 tier metric is "a vendor actually spent a token" — if reach can be free, the tier signal is poisoned at the root. *Fix:* make the debit authoritative — hard-reserve (escrow-decrement) at send so consume is always satisfiable, OR raise-and-rollback like `consume_lead_token_hold`. Never swallow. File: `supabase/migrations/20270817214733_…p1.sql §3`; return value in `lib/creator-offers.ts` / `offer-actions.ts`.

**B2. Cross-ledger double-reserve of the same token — CONFIRMED.**
P1 built a **separate** reach-hold ledger on `vendor_creator_offers` (this correctly resolved the "hold shape-mismatch" the plan flagged — a creator offer has no event/thread, so verbatim lead-hold reuse was impossible). But the two ledgers are blind to each other: `offer_creator_reach_hold` subtracts both lead holds and pending reach holds, while the older `unlock_vendor_event_hold` (`20270726988829:165-169`) subtracts **only** lead holds and never sees reach holds. A vendor can reserve the same token as a reach hold *and* a lead hold; whichever settles first debits it, the second hits `INSUFFICIENT` — and on the creator side that failure is swallowed (B1) → free reach. *Fix:* make `unlock_vendor_event_hold`'s available-calc also subtract outstanding pending `reach_tokens_held` (symmetric), or unify the ledgers.

**B3. Missing wallet-row lock on the reach-hold path — CONFIRMED.**
`offer_creator_reach_hold` reads `v_avail` from the wallet tables with **no `FOR UPDATE`**. The lead-hold hardening migration (`20270727563372` FIX 1) added exactly this lock to stop two concurrent accepts over-holding; the reach path reintroduces the race — two concurrent sends can both pass and over-reserve, then over-consume (leaking via B1). *Fix:* add `FOR UPDATE` on the wallet row inside the reservation, mirroring the hardened lead path.

**B4. Orphaned authoring surface — the whole funnel has no doorway — CONFIRMED.**
`/dashboard/creator` is reachable only by typing the URL (or via a post-solicitation notification `relatedUrl` that lands on the *offers* tab, not authoring). It is absent from the launcher, the `AccountSwitcher`, the command bar, `nav-registry-defaults`, and even the `(account)/layout.tsx` spoke list (`:14`). *Why it blocks:* being a creator is the entire funnel — no one can onboard. This is the recurring wayfinding disease the corpus has an explicit rule against. *Fix:* add a launcher tile + account-menu entry to `/dashboard/creator`.

**B5. Reverse-fake-door copy tells creators publishing is inert — CONFIRMED.**
`app/dashboard/(account)/creator/page.tsx:435-436, 571` prints "The public timeline itself ships in a later update" and "shoppable in a later update" — but `ChapterTimeline` renders on `/u/[slug]` and `resolveShoppableVendors` renders on the chapter page **today**. A creator publishes, is told it does nothing, and never checks their live page. *Fix:* correct the copy to state publishing goes live.

**B6. Dormant vendor "audience rate" field with no consumer — CONFIRMED.**
P1's send-offer form collects and stores `audience_rate_terms`, but nothing viewer-facing consumes it (the Book CTA is P2). A vendor configures a viewer discount on day one that silently does nothing. *Fix:* label it "activates when the viewer promo ships" (or defer the field) so it isn't a live-looking promo.

**B7. Pin the review commit / resolve the branch-state contradiction — CONFIRMED (seat disagreement).**
One audit pass certifies P1 as merged (PR #3318, commit `e58d93841`, migration `20270817214733` + `lib/creator-offers.ts`) and reviewed it line-by-line; the token-integration pass found **zero trace** of any of it on disk, in worktrees, refs, or stashes (latest migration `20270728339269`). *Resolution — the "merged" reviewers win:* the MONEY and SECURITY seats cite specific P1 internals (the `EXCEPTION WHEN OTHERS` block, the cross-ledger subtraction, `offer_creator_reach_hold`'s wallet read) that cannot be invented — P1 code demonstrably exists in a reviewable branch. The token-integration auditor was pointed at a stale checkout (`main` at #3149). *Fix before P2:* pin the exact commit containing creator base + P1 so P2 is sequenced onto a verified ledger, not a phantom one.

**B8. Tier anti-gaming rules absent (load-bearing, not the band numbers) — PLAUSIBLE (P2 design).**
The tier keys off all-time vendor-unlocked attributed inquiries with token-spend as the "honesty filter," but at ₱200/unlock a creator who co-owns or colludes with one vendor self-funds a public badge (Micro = 10 unlocks = ₱2,000). P1's self-offer guard protects *offers*, not the *tier count*. *Why it blocks P2:* the tier badge becomes a gameable public money signal the moment it computes. *Fix (spec before P2 code):* self-owned-vendor exclusion, distinct-couple dedup, distinct-vendor requirement, collusion throttle, and time decay.

**B9. Attribution rule undefined before the column exists — PLAUSIBLE (P2 design).**
First-touch vs last-touch vs windowed credit is unspecified, yet it feeds the tier count and vendor ROI. *Fix:* lock the rule before writing `referring_chapter_id` onto `chat_threads` (the real convergence point, cleaner than `event_vendors`).

**B10. No deliverable-fulfillment state / clawback — PLAUSIBLE (P2 design).**
The offer state machine (`pending|accepted|declined|expired`) has no `accepted → fulfilled` path and no link between discount-granted and chapter-published (`deliverable_chapter_id` is optional at accept). A creator can accept, take the off-platform discount on their own booking, and never publish the crediting chapter. *Fix:* add the fulfilled state + a discount↔chapter link.

## 4. Must plan before launch (design/abuse/privacy — not P2-code-blocking)

- **Minimal admin / exception desk for the collab marketplace.** The data model grants admin-override RLS on `vendor_creator_offers` but the surface map has **no admin screen** to moderate collabs, act on a dishonored-discount dispute, review a reported creator/vendor, or audit tier inflation. For a one-person "approve exceptions" operator, an unmoderated three-party marketplace with public badges and off-platform money promises is the single biggest solo-op risk. This one needs its own small surface — it does not reuse existing machinery.
- **Creator opt-out from vendor solicitation (RA 10173).** Flipping a profile public silently auto-enrolls the user into a vendor-offer inbox. Ship an "accept vendor offers on/off" toggle + per-vendor block/mute before the inbox reaches real users.
- **Viewer-side attribution disclosure (RA 10173).** A viewer booking through a chapter silently increments a third-party creator's public metric. Disclose at the Book CTA before P2 attribution goes live; keep the booker's identity aggregate-only — it must never cross the tenant boundary to the creator.
- **Creator-rate vs audience-rate visibility rule.** `creator_rate_terms` (private personal discount) must never render on the public chapter; only `audience_rate_terms` may. Whitelist explicitly in the P2 public read path.
- **Dishonored-discount recourse.** Setnayan will advertise a vendor's discount on its own hosted Book CTA; if the vendor reneges off-platform there is no report/dispute channel (PH misleading-advertising exposure). Add a report route (feeds the admin desk above) or a disclaimer posture.
- **Relabel "bookings driven" → "inquiries/leads driven"** on every public and vendor-facing surface (plan line 42 explicitly measures inquiries). Vendors will over-trust "bookings" as closed weddings.
- **Vanity counters stay out of every money/trust signal.** `increment_chapter_view/profile_view` are cookie-deduped and trivially inflatable — the tier must key off token-spent unlocks, never views.
- **Update `/privacy`** to cover the new processing: aggregate view counts, follow graph, notify-on-publish emails, and the P2 chapter→lead attribution.
- **Feature-flag isolation for P1.** `CreatorInfluence` (on `/u`) + `OfferInbox` are hard-wired with no flag/kill switch — decide staged-rollout gating before P2 entangles them further.

## 5. Owner decisions still open

1. **Badge label:** shipped constant is `'Creator'`; brief said "Storyteller"; council floated Tagalog "Kwentista." Unlocked.
2. **Reach-token price/count per offer** and the **creator response window** (code default `expires_at` = 14 days) — parameterize the hold + sweep.
3. **Decline-vs-ghost refund:** code went beyond the plan — accept **and** decline both **consume**; only expiry/no-response releases. Confirm the intended rule (a creator saying "no" still costs the vendor a token).
4. **Vendor Creators surface: Pro-and-up or all tiers?** P1 currently gates only on `tier != 'free'`.
5. **Teaser render:** listed as built but is a deferred stub (`teaser_r2_key` carried, never written/rendered). Confirm whether a separate teaser merge is expected before ship.
6. **Confirm the orphaned `/dashboard/creator`** is a regression (not an intentional pre-launch hide) and approve the doorway.

## 6. Recommended build order from here

1. **Pin the P1 commit (B7)** and confirm the creator base + P1 live in one reviewable branch. Nothing else proceeds until this is settled.
2. **Fix the P1 token-integrity trio in one migration (B1 → B2 → B3):** make the debit authoritative (raise-and-rollback or escrow at send), fix the return value, make `unlock_vendor_event_hold` reach-hold-aware, add the `FOR UPDATE` wallet lock. This hardens the ledger P2's metrics inherit.
3. **Fix the two build-state lies (B4, B5)** and label the dormant discount field (B6) — small, ship immediately so the already-merged funnel is honest and discoverable.
4. **Lock the P2 design on paper before any P2 code:** attribution rule (B9), tier anti-gaming rules (B8), deliverable/clawback state (B10). These are cheap now and expensive after the column exists.
5. **Ship consent + disclosure surfaces** (creator offer opt-out, viewer disclosure, rate-visibility rule) and the **minimal admin/dispute desk** — these gate exposing P1 to real users and must precede the viewer-facing P2 promo.
6. **Then build P2 connectors** in dependency order: `referring_chapter_id` on `chat_threads` → thread the referral param through `startServiceInquiry` + `/v/[slug]` composer → vendor thread/clients attribution + discount surface → Proposal Maker viewer-discount line → `/proposals/[publicId]` reflection → tier badge (last — needs a real unlocked-inquiry count).
7. **Relabel "bookings driven"** wherever it appears before any of these surfaces go public.

Seat disagreements resolved: on P1 existence, the **MONEY/SECURITY seats win** over the token-integration audit (they cite unforgeable P1 internals). On overall readiness, the **SEQUENCING seat's "not-ready" is downgraded to GO-AFTER-FIXES** — its blocker was the unresolved branch contradiction and the shape-mismatch, both of which are resolvable (the mismatch was in fact already resolved in code by a separate reach-hold ledger), leaving the MONEY seat's concrete, bounded integrity bugs as the true gate.