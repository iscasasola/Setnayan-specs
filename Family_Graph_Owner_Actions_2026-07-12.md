# Family Graph — Owner Actions (the human-in-the-loop list)

**Authored:** 2026-07-12 — owner directive ("do everything and if there is human intervention, let me do that after"). This is the running list of steps only YOU can take. All code is built flag-off and auto-applies to prod on merge; nothing here is blocking the build.

> ## ✅ ALL GATES CLEARED — 2026-07-13
> Owner confirmed: **§1 (G1 review + `NEXT_PUBLIC_DEPENDENT_PEOPLE`) and §2c (`PABUYA_PUBLIC_ROUTE_ENABLED`) are long done** (flags already set in prod), and **§2b household consent is GRANTED** ("2 yes i consent" — both joint-children auto-share and co-parenting-persists-after-dissolution). The family graph + Pabuya guest page are therefore **LIVE** in production. Because the dependent flag was already on, the session's #3202 merge (godparents · cron-free godchild reminders · married household) is NOT staged — it goes live on the next deploy, incl. the household RLS widening (now consented) and real godchild-birthday emails to godparents. Everything below is retained as history.

## 1. Before the family graph goes live (the ONE real gate) — ✅ DONE
The dependent People layer stores a **child's birthdate + religion + sex** — the most sensitive data on the platform (RA 10173 minors + §3(l)). It's built **flag-off** and stores NOTHING in production until you:

- [x] **Complete the batched DPO / counsel review (G1)** — covers: dependents' data, faith rites for children, godparent links + third-party birthday reminders, gender-reveal due dates, the household layer, and the BSP-OPS opinion on QR-display e-gifts. You are the DPO ([[dpo-designation-owner]]); external counsel for the items flagged in `Faith_Aware_Person_Graph_2026-07-12.md`. **(owner: "long done" 2026-07-13)**
- [x] **Flip the flag on**: `NEXT_PUBLIC_DEPENDENT_PEOPLE=1` set as a Vercel project env var. This is the deliberate DPO act that turns the whole graph live. **(owner: "long done" 2026-07-13)**

## 2. Not blocking — optional / later
- [ ] **Membership**: does NOT need PayMongo/GCash. It can ship on the existing apply-then-pay flow + the cron-free renewal reminder (already built for anniversaries). A real recurring-billing gateway (PayMongo card-on-file) is a *later* card-auto-renew optimization only — needs your PayMongo/GCash merchant account + keys **if** you ever want silent card renewal.
- [ ] **Holiday set** (Year view): Christmas + Valentine's are in; confirm whether to add Mother's/Father's Day + New Year (§ B5, master plan). Non-blocking — a small config change.
- [ ] **e-gifts (when built)**: confirm the BSP-OPS opinion (part of G1) before flipping any e-gift flag.

## 2b. Household consent model — ✅ CONSENTED 2026-07-13 (PR-G · #3204/#3202)
The married-household layer widens RLS on the **minors** table (`dependents`). Owner consented ("2 yes i consent"):
- [x] **Joint children auto-shared** with the co-parent — the *full* record (name, dates, sex, religion), read-only, no re-consent. (Owner rule B6; each spouse's *own* relatives stay private/opt-in.) **GRANTED.**
- [x] **Co-parenting access persists after dissolution** — `current_spouse_user_ids()` is deliberately NOT archived-filtered, so if the marriage event is later archived (annulment/separation) both co-parents KEEP access to shared kids. **GRANTED.**

## 2c. E-gifts = Pabuya — ALREADY BUILT (no new work; BSP gate removed 2026-07-13)
Owner clarified (2026-07-13): **"we do not offer transaction on e-gifts; they just share their own QR codes… pabuya is the same, that is just plain QR Code for the guests."** With no transaction flowing through Setnayan there is **no money-transmission** — the earlier BSP OPS / Circular 1049 gate does **not** apply.

**This already ships on `main` as Pabuya** — do NOT rebuild:
- `event_egift_methods` table (per-event; method_kind GCash/Maya/bank/PayPal · label · handle · uploaded QR image `qr_r2_key` · enabled · sort_order — **no amount, no order, no ledger**).
- Couple manager: `dashboard/[eventId]/pabuya`. Guest surface: `[slug]/pabuya` (renders enabled rows, "Setnayan never holds the money" trust note, handles noindexed).
- `lib/egift.ts` (`fetchEgiftMethods`, `isPabuyaPublicRouteEnabled`).

> _(A redundant per-user duplicate I started (PR #3205, `users.egift_qr_ref`) was **closed** once this existing feature was found — built off a stale note that said Pabuya wasn't in `apps/web`. The per-event feature above is the correct one.)_

- [x] **Flip `PABUYA_PUBLIC_ROUTE_ENABLED=1`** (Vercel env) — the guest `[slug]/pabuya` route is now live. **(owner: "long done" 2026-07-13)**

## 3. What is ALREADY handled automatically (no action needed)
- DB migrations auto-apply to prod on merge (CI `supabase-migrations.yml`) — no manual `db push`.
- Every family-graph PR ships flag-off and merges clean; the schema is in place, storing nothing.

## 4. Phase-3 build progress (all flag-off · auto-merging)
| Item | PR | State |
|---|---|---|
| Dependent People layer (foundation + capture UI) | #3197 · #3199 | merged |
| Dependents' milestones on the Year view | #3200 | merged |
| Faith rites for children | #3201 | merged |
| Godparents (ninong/ninang) edges | #3202 | auto-merge |
| Godchild birthday reminders (cron-free) | #3203 | auto-merge |
| **Married household** — shared dependents + joint Year view | #3204 | auto-merge |
| E-gifts = Pabuya (QR-display, no transaction) | already on `main` | DONE — only owner flag flip `PABUYA_PUBLIC_ROUTE_ENABLED` remains (#3205 duplicate closed) |
| Gender-reveal due-date | — | already covered by the anchor model (`expected_due_date` stamped on create) |

**All of the above is now LIVE** (owner 2026-07-13: flags on + household consent granted). The dependent flag being on means #3202 activates on the next deploy — including live godchild-birthday emails to godparents.

---
*Update this list as pieces land. The build continues without any of the above; these are only for go-LIVE.*
