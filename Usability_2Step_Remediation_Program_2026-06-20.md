# Setnayan — Usability "Down 2 Steps" Remediation Program
Date: 2026-06-20 · Source: `USABILITY_DIFFICULTY_HEATMAP_2026-06-18.md` · Goal: bring every surface down up to 2 difficulty steps (floor = 1)

Method: 65-agent code-grounded pass against `apps/web` @ origin/main — one planning agent + one adversarial verifier per surface (32 surfaces), then synthesis. The verifiers capped each surface's *achievable* score, so the scorecard below is honest, not optimistic. Seating's "Build my seating" cold-start fix already shipped (PR #1875, wave 0).

---

# Setnayan 32-Surface Remediation — Execution Program

This is the build roadmap. It honors the adversarial verdicts: where verification said a 2-step drop is real, the program ships it; where verification capped the achievable score, the program targets that cap and names the floor. Effort tags are S/M/L per the dataset.

---

## 1. Cross-cutting levers (do these first)

These are the patterns that each repair MULTIPLE surfaces from ONE shared piece of work. Ordered by (#surfaces × cheapness). Build/harden these primitives first, then apply them everywhere — most of the program is "instantiate a cross-cutting lever," not bespoke work.

### A. ConfirmForm + consequence-on-the-button guard — **~16 surfaces, cheapest, highest leverage**
The single most-reused lever. A shared `ConfirmForm` already exists (`app/_components/confirm-form.tsx:41`) and is proven on 7–10 sibling admin pages. The work is: (1) wrap every irreversible/cascading single-click action in it, and (2) put the plain-English consequence + cost ON the trigger label before commit.

Lowers: `admin/user-ops`, `admin/payment-reconciliation`, `admin/content`, `admin/vendor-verif-disputes`, `admin/pricing-catalog`, `admin/real-stories`, `admin/taxonomy`, `vendor/messages` (accept-cost), `vendor/calendar` (token import), `vendor/clients-hub` (free-the-date remove), `vendor/services-builder` (delete), `couple/seating` (lock take-over), `couple/budget` (no destructive but cost-on-button), `couple/orders-checkout` (copy/ref), `vendor/marketing-ads` (start-subscription cost), `couple/explore-profile` (auto-create confirm).

**Two hardening prerequisites the verdicts flagged — do once, benefits all consumers:**
- **Widen `ConfirmForm.message` from `string` → `ReactNode`** (or expose `ConfirmDialog` directly). Multiple levers (`admin/payment-reconciliation`, `admin/content`, `admin/taxonomy`) need a structured before/after diff in the body. Today `message:string` blocks it. One prop change unblocks ~5 surfaces.
- **Never bake literal peso figures into confirm copy.** `admin/vendor-verif-disputes` and `admin/pricing-catalog` both tried to hard-code "₱2,500" / VAT into dialog strings. Pull all amounts from the admin catalog/DB at render. This is a rule, not code.

Why first: it is pure UI on an existing component, it removes the highest-severity class of defect (accidental irreversible commits — live FB posts, hard account deletes, sold-date frees, payout cascades), and it is the prerequisite that makes several "two-step" drops legitimate.

### B. default-then-disclose (native `<details>`) — **~14 surfaces, S each**
Collapse monoliths to the common case + an accordion for the rest. No new component — native `<details>/<summary>` is already used across the codebase.

Lowers: `vendor/registration` (25 compat checkboxes + contact block + slug), `vendor/services-builder` (advanced pricing rules), `vendor/verification` (admin-run slots), `vendor/calendar` (3+ pool reshuffle), `couple/studio` (monogram method), `couple/guests` (filter facets + "more ways to add"), `admin/taxonomy` (queue/deadlines behind tabs), `admin/user-ops` (danger zone), `admin/content` (manual lane + library), `couple/website-editorial` (sub-editors as sheets), `public/pricing-public` (coming-soon SKUs), `guest/join-claim` (ceremonial roles), `couple/orders-checkout` (resubmit-only payment form), `couple/explore-profile` (ceremony picker).

### C. never-dead-empty-state — **~13 surfaces, S each**
Every empty/blocked branch must show what IS available + one concrete next action. No paywalled dead-ends, no "come back later" terminals.

Lowers: `couple/budget` (EmptyBudget + NoFinalizedVendors), `couple/guests` (EmptyState → draft rows), `couple/website-editorial`, `public/explore-search-anon` (no-results → broadened pool, labeled), `public/pricing-public` (CTA), `couple/studio` (seeded board), `guest/find-table-seat` (4 dead-ends), `vendor/clients-hub` (3 empty buckets), `vendor/registration` (completion checklist), `vendor/calendar` (first-run banner), `admin/real-stories` (already good — keep), `guest/day-of-mode` (owned-but-not-started states), `vendor/marketing-ads`.

### D. pre-fill / draft-don't-blank from data we already hold — **~9 surfaces, S–M**
Seed forms from data the platform already stores; user confirms instead of types into blanks.

Lowers: `vendor/verification` (portfolio/website/contact slots), `couple/studio` (palette from onboarding feel-palette — **seed the `initial` prop ONLY, never write `role_palette`**), `vendor/registration` (contact_email + event_types=['wedding'] — **business_name has no source until signup wiring lands**), `couple/budget` (payment amount pre-fill), `vendor/reviews` (reply starter — **with a "personalize this" nudge, not silent post**), `admin/payment-reconciliation` (admin_notes), `couple/seating` (already shipped — DONE), `vendor/calendar` (capacity=1 default), `couple/onboarding-wizard` (monogram auto-finalize — **must also pin the 30s cycler**).

### E. read-only cost/price preview helper — **3 surfaces, M, HIGH-RISK**
A render-time helper that mirrors a server pricing RPC so the cost shows before commit. **The verdicts caught real fidelity bugs here — this lever ships ONLY with exact parity or it makes things worse.**

Lowers: `vendor/messages` (`resolveAcceptCost` — **must include the founder-bypass=0 branch AND the looser-resync predicate via its own SECURITY DEFINER read; reusing `resync_flat` over-states cost**), `admin/pricing-catalog` (VAT "customer pays" line — **must read the SAME rate the order path charges, currently the hardcoded `DEFAULT_VAT_RATE_PCT=12` constant, not `platform_settings`**), `admin/payment-reconciliation` (amount-match pill — **`amount_php` is post-voucher pre-VAT, `confirmed_total_php` is NULL at reconcile time; a naive base×1.12 compare flags a phantom 12% mismatch on every clean payment — rebuild against the real schema or do not ship**).

### F. wizard-not-monolith — **3 surfaces, L each**
Split first-run mega-pages into sequenced steps, route returning users to an edit surface. Reuses the shipped `onboarding-shell.tsx` step pattern.

Lowers: `vendor/registration` (3-step), `vendor/verification` (instant-slots → uploads → submit), `admin/taxonomy` (?tab= sections). These are the L-effort items — they land in later waves.

---

## 2. Wave plan

### Wave 1 — ConfirmForm + consequence-on-button blitz (admin safety) · all S
The cheapest, highest-severity work: stop accidental irreversible commits.

- **admin/user-ops** (S): split row actions into safe pills + red "Danger zone ▾" `<details>`; pass `title`/`confirmLabel` to all 3 destructive ConfirmForms; rank Delete (outline) vs Blacklist (solid). Banks **3→2**.
- **admin/content** (S): wrap "Post now" + both "Pull" in ConfirmForm with `firstLine(body)` preview; live "Post now → FB + IG" label driven by config-aware chip logic (not raw enabled booleans). Banks **3→2**.
- **admin/real-stories** (S): wrap Feature/Unfeature in ConfirmForm (move hidden inputs inside ConfirmForm's own `<form>`); Cover/Most-loved position chips. Banks **2→1.5**.
- **vendor/clients-hub** (S): wrap outside-client Remove in ConfirmForm ("their date opens back up"); fix the 3 empty buckets. Banks **3→2**.
- **vendor/services-builder** (S): wrap Delete-service in ConfirmForm. (Partial — full surface lands Wave 4.)
- **Prereq:** widen `ConfirmForm.message` to ReactNode in this wave so later diff-body consumers are unblocked.

### Wave 2 — default-then-disclose + never-dead-empty + pre-fill (couple/vendor self-serve) · S–M
- **couple/budget** (S+M): collapse the two "Remaining" numbers to ONE (Lever A/C); default-then-disclose payment log; disclose price-basis via existing `PriceSourceChip`. **Do NOT ship the bride/groom auto-seed** (no structured source; mislabel footgun) — inline-add + "Paste your list" only. Banks **3→2**.
- **couple/guests** (S+M): one "Add guests" affordance, demote 4 paths behind "More ways"; demote mind-map; progressive filters; inline-add empty state (drop the display_name split). Banks **3→2**.
- **couple/studio** (S+M): seed palette editor `initial` prop from onboarding feel-palette (display-time only); demote monogram upload behind disclosure; skip /about hop for free tools; inline how-it-works hint. Banks **2→3 is wrong — this is 4→3** (verified cap).
- **vendor/calendar** (S): plain-language header/legend rewrite; capacity default 1 + tier ceiling inline; token import balance + ConfirmForm; first-run orienting banner. **Add a confirm to the merge toggle** (it silently deactivates a pool + orphans capacity). Banks **4→3**.
- **vendor/marketing-ads** (S): correct the stale baseline; mark Pro recommended with per-current-tier delta copy (**not the wrong "1→3 categories" example**); cost-on-button; verification upsell link. Banks **3→2**.
- **public/help-center** (M): client-side instant-filter search over `ALL_HELP_ARTICLES` (read `entry.article.*`); role tiles → soft sort not hard gate; delete the dead empty branch. **Adding Help to primary nav needs owner sign-off** (IA lock) — use a `?` button instead. Banks **3→2**.
- **public/pricing-public** (S): split couple/vendor lanes (move vendor blocks to /for-vendors); drop Token chip from couple cards; collapse non-live SKUs behind accordion (**keep full data arrays in JSON-LD**); add "Start planning free" CTA; merge duplicate free messaging. Banks **3→2**.

### Wave 3 — gated-cost surfaces + search/discovery · M (cost-helper fidelity critical)
- **vendor/messages** (M): build `resolveAcceptCost` **with founder-bypass + looser-resync SECURITY-DEFINER read for parity**; cost-on-button + list-badge cost (net-new batched RPC, not a UI tweak); blocked-before-tap disable. Banks **4→3** (cap — name-only minority + preview-fidelity ceiling).
- **public/explore-search-anon** (S+M): flip `browseMode` default-true for anon; honest inventory cue in hero; no-results → **labeled** broadened pool + notify capture (net-new action + table, not a "generalize"); hide faith filter for anon. Banks **4→2** (floor-bound — real inventory is 1 founder vendor).
- **guest/join-claim** (S+M): **OAuth/magic-link ALREADY EXISTS** (`oauth-actions.ts` + `OAuthButtonRow` mounted on /login + /signup) — the work is enabling the env flag (owner action) + routing through the exact-email fast path; collapse the 18-role select; pre-fill + one-tap "Join as <Name>"; honest-but-actionable /verify error. Banks **4→2 IF OAuth enabled, else ~3**.
- **guest/find-table-seat** (S+M): collapse to ONE `/find-seat` route; auto-route by session/assignment (**resolve the publication-gate fork — keep gate or exempt session-holders, a real design choice**); fold the paid map in as progressive enhancement; 301 the old route + reconcile couple-side copy. Banks **3→2**.
- **couple/explore-profile** (S+M): always-render Inquire CTA (**only after auto-create lands — coupled, not independent**); auto-create event on no_event with one-tap ceremony confirm (**re-introduces a silent default Task #44 outlawed — owner sign-off**); next-preserved cold path; swap to `resolvePrimaryHostEvent` FIRST. Banks **2→2** (floor: account+email-verify gate is irreducible).

### Wave 4 — full-surface restructures · M–L
- **vendor/services-builder** (L): collapse the 3 sibling forms into ONE client form + combined server action — **MUST wrap the 3 writes in a Postgres transaction/function or it degrades reliability** (partial-write + lost links); inline tier-cap preview (`is_founder` is net-new prop); slots-override note. Banks **5→3** (ceiling, not expected landing).
- **vendor/registration** (L): 3-step wizard (reuse `onboarding-shell.tsx`); pre-fill contact_email + event_types; security block → Settings; completion checklist; inline validation (**slug uniqueness still round-trips — DB unique index**). Needs a first-run-vs-edit signal (net-new). Banks **4→2** (optimistic end; 2.5 honest).
- **vendor/verification** (S+M+L): **fix the denominator bug** (vendor measured against 8 not 12 — realign BOTH the page denominator AND the `actions.ts` gate's counting basis); two-section checklist; pre-fill 3 held slots (**copy vs reference decision for the secured audit bucket**); live post-submit progress; optional wizard. Banks **5→3** (legit 2-step — the 5 is inflated by a UI bug).
- **admin/taxonomy** (M+L): ConfirmForm + diff on the 3 live cascades; vendor-count via `fetchVendorCountsByService` (**net-new import, not the cited `vendor_services` read**); folder-scope confirm; ?tab= IA split (L); legend strip; conservative fuzzy pre-select. Banks **5→4** (cap — 15 look-alike forms persist).
- **couple/seating** (M, reduced scope): cold-start is DONE (Build my seating shipped). Remaining: **acquire-on-first-edit lock** (needs acquire-then-replay queue across ~15 mutation sites — bigger than M, do carefully or net difficulty rises); persistent gesture/mode chip bar; explain the view-only banner + List-view escape; collapse save model (**4 dirty scopes, not 1**); rewrite the wrong MiniTour. Banks **5→4**.

### Wave 5 — admin pricing/reconciliation/verif (cost-helper rebuilds) · M–L
- **admin/payment-reconciliation** (S+M): ConfirmForm on Approve/Reject/Refund with cascade diff; copy-ready bank-search block + deliberate "I confirmed in inbox" checkbox; **REBUILD the amount-match pill against the real schema (post-voucher pre-VAT amount_php, NULL confirmed_total_php, voucher delta) or omit it**. Banks **4→3** (cap — off-console bank glance never disappears without inbox ingestion).
- **admin/pricing-catalog** (S+M): live "customer pays incl VAT" line (**read the order path's actual rate**); confirm-with-changed-rows-diff (net-new client island tracking dirty rows); split into 3 independently-saveable catalog cards (**re-home the orphaned platform-fee field; isolate at form boundary not JS gate**); per-row rule hints. Banks **3→2**.
- **admin/vendor-verif-disputes** (M+L): render the docs (6-shape union narrowing); ConfirmForm + diff on Reject/Demote/Archive; reason presets; **per-vendor 30-day dispute rollup is net-new (M-L, not a reuse)**; drop the synthesized application_id hack. Banks **3→2** (4 of 12 slots stay external/manual).
- **couple/orders-checkout** (M+S): GCash/BDO deep-link + copy-amount + copy-ref; pre-mint reference code (**needs an early order-row lifecycle state + abandoned-order expiry — non-trivial, not "tiny action"**); status timeline (couple-facing notify ALREADY EXISTS — build only the front-end timeline); de-dup the second payment form. Banks **4→2** (floor: out-of-band transfer + human reconcile).
- **couple/website-editorial** (S+M): autosave-on-navigate (kill "save first" footgun); real deep-link cards replacing "Coming soon"; live-phase pill (**import `getLifecyclePhase` from `invitation-widgets.ts`, the one /[slug] uses**); collapse high-traffic sub-editors into studio sheets (**net-new server reads, M-L not light-M**). **Demoting the hub risks trapping users in chrome-less studio** — keep a calm exit. Banks **3→2**.

### Wave 6 — couple home + onboarding + guest-day-of polish · S–M
- **couple/dashboard-home** (S+M): collapse 3 (really 4 — includes "Needs you") task-nudges into ONE ranked checklist with a hero top-row; **the hero pulls from the vendor-lock resolver, a data-source switch with its own Done action — reconcile roadmap_completed migration**; delete 7 dead imports (**keep EventMetaLine — it IS rendered**). Banks **2→2**.
- **couple/onboarding-wizard** (M+S): fold ~6 interstitials into eyebrows; drop `monogramFinalized` gate (+pin cycler); collapse AI-fork to AI=Yes review (**`applyBudgetHighlight` doesn't exist — net-new seeding**); delete dead `FLOW_TOTAL`. Account de-gate needs anonymous-draft persistence (Wave 7). Banks **3→2**.
- **guest/rsvp** (S+M): path-gate meal block (hide for declined); collapse selfie to disclosure/below-Save (**only safe on Papic events — non-Papic has no day-of fallback**); one-tap optimistic confirm (**RsvpWidget is a server component — needs a client island, +confirmation toast which is out of scope**). Banks **2→2**.
- **guest/day-of-mode** (S+M): always-present "Live now" scaffold + owned-but-not-started states; warm guest seat/QR/schedule into offline cache (**needs a NEW guest-scoped cache, not IMAGE_CACHE LRU — gate the "saved offline" banner on a write-ack**); inline QR/seat data; reconnecting chip. Banks **2→2**.

### Wave 7 — structural / roadmap (auth, schema, integration) · L
The floor-breakers. Out of scope for UI waves; sequence last.
- **couple/orders-checkout**: automated Maya (Branch B + **net-new webhook + return/cancel pages + status-machine wiring** — not "flip the gate"). Removes screenshot + reconciliation → reaches 1.
- **couple/onboarding-wizard**: anonymous-draft server persistence + claim/merge → gate-free → reaches 1.
- **guest/join-claim**: owner enables OAuth env flag (external action) → unlocks the Wave 3 2/5.
- **public/explore-search-anon**: real third-party vendor onboarding → reaches 1.
- **vendor/verification**: owner-side DTI/BIR registry lookups → reduces the irreducible doc-gather floor.
- **admin/payment-reconciliation**: `payment_inbox_messages` table + `match_inbox_to_order` RPC (spec'd 0034, never built) → removes off-console glance → reaches 1.

---

## 3. Honest floors (cannot reach the 2-step target by UI alone)

| Surface | Target | Real ceiling | Hard blocker | What it actually needs |
|---|---|---|---|---|
| **couple/orders-checkout** | 2 | 2 (UI) / 1 needs roadmap | Out-of-band bank transfer + human reconcile is inherently async/self-unconfirming | Automated Maya: webhook + return pages + status-machine wiring |
| **admin/payment-reconciliation** | 2 | **3** | "Did the money land?" lives in the BDO/GCash inbox; no bank-feed ingestion exists | `payment_inbox_messages` + `match_inbox_to_order` RPC (spec'd, never built) |
| **public/explore-search-anon** | 2 | 2 (floor-bound) | Marketplace owner-locked at ONE founder vendor | Real third-party vendor onboarding (supply, not UI) |
| **guest/join-claim** | 2 | **3 unless OAuth enabled** | OAuth path is built but gated behind an unset env flag (owner Supabase + Vercel config) | Owner enables `NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED` + Supabase creds |
| **couple/explore-profile** | 1 | **2** | Inquiry hard-requires authed user + event_id; no anon-lead model | Account-creation + email-verify is irreducible on the cold path |
| **couple/onboarding-wizard** | 1 | **2** | Account gate is a hard wall; all pre-gate state is localStorage-only | Server-side anonymous-event creation + later claim/merge |
| **vendor/verification** | 3 | 3 | 6–8 real PH business docs are external artifacts; 3–5 BD human SLA | Owner-side DTI/BIR registry lookups (roadmap) |
| **vendor/services-builder** | 3 | 3 | Genuine domain breadth (pricing + bundle + capacity + tier gates) | Nothing — but the combined-write MUST be transactional or reliability drops |
| **admin/taxonomy** | 3 | **4** | 15 near-identical live-cascade forms; 4-level mental model | Only ?tab= IA split touches structure; the rest is stated-not-taught |
| **admin/vendor-verif-disputes** | 1 | **2** | 4 of 12 verification slots are external (Persona/Veriff/AMLC) / manual | Third-party ID-verification signups (owner-pending) |
| **couple/seating** | 3 | **4** | Irreducible spatial-canvas complexity (drag/zoom/rotate to seat) | Nothing removes it for Map-view users; lock-on-first-edit is risky |
| **couple/studio** | 2 | **3** | Mood-board's per-role palette is a learned abstraction even when seeded | Nothing — the abstraction is inherent |

---

## 4. Scorecard

| Surface | Role | Now | 2-step target | Realistically achievable | Blocker (if any) |
|---|---|---|---|---|---|
| vendor/verification | vendor | 5 | 3 | **3** | doc-gather + human SLA (modest) |
| vendor/services-builder | vendor | 5 | 3 | **3** | transactional combined-write required |
| couple/seating | couple | 5 | 3 | **4** | spatial-canvas complexity; lock-on-edit risk |
| admin/taxonomy | admin | 5 | 3 | **4** | 15 look-alike live-cascade forms |
| couple/orders-checkout | couple | 4 | 2 | **2** | (1 needs automated Maya) |
| couple/studio | couple | 4 | 2 | **3** | per-role palette abstraction |
| vendor/registration | vendor | 4 | 2 | **2** | slug uniqueness + content burden (2.5 honest) |
| vendor/calendar | vendor | 4 | 2 | **3** | merge/split mental model + multi-schedule reality |
| vendor/messages | vendor | 4 | 2 | **3** | name-only minority + preview fidelity |
| public/explore-search-anon | public | 4 | 2 | **2** | real inventory (floor-bound) |
| guest/join-claim | guest | 4 | 2 | **2** (3 if OAuth off) | OAuth env flag (owner) |
| admin/payment-reconciliation | admin | 4 | 2 | **3** | off-console bank glance |
| couple/onboarding-wizard | couple | 3 | 1 | **2** | anonymous-draft persistence |
| couple/guests | couple | 3 | 1 | **2** | desktop+mobile twinning + CSV two-phase commit |
| couple/budget | couple | 3 | 1 | **2** | two-mode (on/off-platform) nature |
| couple/website-editorial | couple | 3 | 1 | **2** | split save scopes persist |
| admin/user-ops | admin | 3 | 1 | **2** | irreversible-by-nature actions |
| admin/vendor-verif-disputes | admin | 3 | 1 | **2** | external/manual verification slots |
| admin/pricing-catalog | admin | 3 | 1 | **2** | confirm-diff + multi-form-save complexity |
| admin/content | admin | 3 | 1 | **2** | inherent external-publish irreversibility |
| vendor/clients-hub | vendor | 3 | 1 | **2** | Event Brief composite density |
| vendor/marketing-ads | vendor | 3 | 1 | **2** | native IAP 1.5x price gap |
| public/homepage-nav | public | 3 | 1 | **2** | locked-scrub model + owner UX locks |
| public/pricing-public | public | 3 | 1 | **2** | no pre-auth checkout by design |
| public/help-center | public | 3 | 1 | **2** | substring-search ceiling + nav IA lock |
| guest/find-table-seat | guest | 3 | 1 | **2** | name-match data quality + paid-map branch |
| couple/dashboard-home | couple | 2 | 1 | **2** | 4th nudge panel + two-engine reconcile |
| couple/explore-profile | couple | 2 | 1 | **2** | authed-user + event_id requirement |
| vendor/reviews | vendor | 2 | 1 | **1.5** | review permanence (policy) |
| admin/real-stories | admin | 2 | 1 | **1.5** | zero eligible rows until Jan 2027 |
| guest/rsvp | guest | 2 | 1 | **2** | server-component + missing confirm toast |
| guest/day-of-mode | guest | 2 | 1 | **2** | first-load-offline cache architecture |

---

## Bottom line

"Everything down 2 steps" is **mostly reachable, but not literally**. Of 32 surfaces, the program reliably banks a **two-step drop on 9** (the high-difficulty 4s/5s where a real UI defect — a dead progress bar, a no-confirm cascade, an invisible CTA, a hidden catalog — was inflating the score). For the remaining ~23, the honest landing is a **clean one-step drop to a floor of 2 (or 1.5)**, because a genuine residual always survives UI work: irreducible domain breadth (services-builder, vendor calendar), inherent irreversibility (admin destructive actions, content publishing), learned abstractions (mood-board palette, seating canvas), or look-alike form sprawl (taxonomy). The hard limits cluster in four places the verdicts named precisely and this program does NOT paper over: **(1) money** — apply-then-pay checkout and admin reconciliation cannot become instant/self-confirming without the automated-Maya webhook and the never-built `payment_inbox_messages` ingestion; **(2) identity** — accountless inquiry and gate-free onboarding need a real anonymous-draft/lead model that doesn't exist; **(3) marketplace supply** — anon explore can't satisfy a targeted search against one founder vendor; and **(4) external verification** — vendor docs and AMLC/ID slots depend on owner-side registry/KYC integrations. Equally important, the program flags three cross-cutting **footguns** that would make surfaces *worse* if shipped naively: the cost/VAT preview helpers (E) must hit exact charge-parity or they train admins/vendors to distrust the number; the combined services-builder write must be transactional or it loses links; and the seating lock-on-first-edit must queue-and-replay or the user's first action silently no-ops. Build the cross-cutting levers (A–D) first — they are cheap, they carry most of the program, and they are the prerequisites that make the legitimate two-step drops legitimate.