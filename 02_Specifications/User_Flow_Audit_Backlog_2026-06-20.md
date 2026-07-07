# Product-Wide User-Flow Audit — Backlog (2026-06-20)

> **Method:** 69-agent code-grounded audit of `apps/web` @ origin/main — one mapping agent + one adversarial verifier per surface, across **34 surfaces** (couple dashboard, vendor, admin, guest, public, onboarding, 4 cross-surface journeys, popups/modals, global back-buttons). 5.8M tokens. Findings below survived adversarial verification. Raw per-finding detail (with `file:line`, userImpact, suggestedFix, effort) is in the workflow output `tasks/w412ahmbm.output` (`.result.perSurface`).
>
> _The workflow's own synthesis step returned null (250 findings exceeded one context) — this backlog is derived **deterministically** from the verified findings (group-by dimension → levers, group-by severity → ranking)._

## Severity (250 findings)
| Severity | Count |
|---|---|
| 🔴 Critical | 6 |
| 🟠 High | 63 |
| 🟡 Medium | 121 |
| ⚪ Low | 60 |

## The 6 CRITICAL findings (must-fix dead-ends)
1. **couple/studio** — Pakanta "Continue to payment" silently loops back to Studio (retired `/orders/new`). *Couple literally can't buy Pakanta.* → wire `InlineCheckoutDrawer` like its sibling add-ons. *(queued wave C, payment-adjacent)*
2. **vendor/registration** — Profile save redirects to HOME, dropping all feedback. → redirect to `…/profile?saved=1`.
3. **vendor/verification** — Rejected state has no CTA to start a new application (dead-end). → show "Start a new application" on `rejected`.
4. **vendor/messages** — Accept-inquiry token errors crash to the error boundary instead of an inline message. → typed result + `useActionState`.
5. **journey/onboarding→dashboard** — Account gate has **no "Sign in" path** for returning users (only "Create account") — they hit a duplicate-email wall. → add "Already have an account? Sign in →".
6. **journey/vendor-inquiry→pay** — `no_event` error dead-ends with no path to create an event. → link to `/onboarding`.

## Cross-cutting LEVERS (ranked by reach — fix many surfaces from one piece of work)
Findings by dimension — the higher the count, the more surfaces one shared fix repairs:

| Lever | Findings | What it is | Maps to |
|---|---|---|---|
| **1. Feedback** | **79 (32%)** | actions that silently succeed/fail — no success toast, no inline error, no pending state; raw `throw` → page crash | **PR2 toast system + inline action-error pattern** — the single highest-leverage fix. Overlaps stale #1733 |
| **2. Empty/error/loading** | 37 | empty/blocked/error branches that dead-end instead of guiding | never-dead-empty lever (extends the existing one) |
| **3. Entry/exit + transition** | 47 (26+21) | dead-ends, no cancel/exit, actions that navigate somewhere surprising or lose entered state | per-surface, but several share "redirect-drops-feedback" + "no exit path" patterns |
| **4. Back buttons** | 24 | inconsistent/missing/redundant back; `ArrowLeft`×80 vs `ChevronLeft`×15, no shared primitive | **PR4 shared `<BackButton>`** |
| **5. Popups/modals** | 22 | no Escape, no focus-trap, `window.prompt`/`window.confirm`, can't dismiss | shared modal primitive (Escape + focus-trap + brand voice) |
| 6. Skip/optional | 12 | required-looking steps with no skip / "none" escape | per-flow |
| 7. Redundant | 12 | duplicate controls/steps | per-surface |
| 8. Search/filter | 10 | long lists with no find | per-surface (mostly low-value, e.g. budget was marginal) |
| 9. Cross-surface continuity | 7 | journey hand-offs lose context | the 4 journeys |

**Headline:** the dominant defect class is **feedback (32% of all findings)** — Setnayan does pending-state well (`SubmitButton`) but has **no success confirmation and inconsistent error handling**, app-wide. The toast/inline-error lever (PR2) is the highest-ROI work and repairs dozens of surfaces at once.

## Findings per surface (top contributors)
clients-hub 10 · vendor-inquiry-pay journey 10 · guest-invite-seat journey 10 · onboarding-wizard 10 · admin/content 10 · vendor/registration 9 · guest/day-of 9 · budget 9 · messages 8 · marketing-ads 8 · global-back-buttons 8 · website-editorial 8 · seating 8 · explore-profile 8 · admin/taxonomy 8 …

## Proposed wave plan
- **Wave C (in progress, uncontended surfaces)** — ✅ #1914 supplies-404 · ✅ #1917 budget delete-confirm + crash-guard · next: Pakanta critical (#1, payment-adjacent), onboarding "Sign in" path (#5).
- **Wave D — the Feedback lever (PR2)** — build the shared toast + inline action-error/`useActionState` pattern, then sweep the 79 feedback findings. **Gated on / coordinated with #1733** (the stale button sweep touches the same files). Highest reach.
- **Wave E — Back-button (PR4) + Modal (lever 5) primitives** — one `<BackButton>` + one modal primitive (Escape/focus-trap), sweep 24 + 22 findings. Also overlaps #1733.
- **Wave F — Empty/error states (lever 2)** — 37 findings; extends the existing never-dead-empty work.
- **Wave G — per-surface tail** — entry/exit, transition, skip, redundant, continuity (the remaining ~80).

## Sequencing reality
- **Feedback + back + modal levers (Waves D/E) all overlap the stale #1733** button sweep → resolving #1733 (revive or take over) is the gating decision for the largest chunk. (See `UI_UX_Polish_Remediation_2026-06-20.md` overlap map + `feedback_setnayan_watch_parallel_sessions`.)
- Wave C continues on uncontended surfaces (studio/budget/onboarding-login) meanwhile.
