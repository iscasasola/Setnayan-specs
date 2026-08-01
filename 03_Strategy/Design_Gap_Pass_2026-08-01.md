# Design Gap Pass — turning "401 pages" into a finite work list
### 2026-08-01 · owner: *"we want to fix all pages"*

> **Verified against `origin/main` @ `41b3552b3` (2026-08-01)** by enumerating every `page.tsx`, not by
> reading a spec. Companion to [`Public_Website_Design_Foundation_2026-08-01.md`](Public_Website_Design_Foundation_2026-08-01.md)
> and the five archetype prototypes committed the same day.

---

## 0 · The headline

**401 routes. But not 401 designs — roughly 40 design units, and most are already covered.**

Three reductions do the work, in order:

| Reduction | From | To | Why |
|---|---|---|---|
| **Colour is already fixed everywhere** | 401 | 401 ✅ done | The palette merged in PR #3988 resolves from CSS variables, so all **1,263 `bg-cream` call sites** turned over with **zero component edits**. Every page in the app already wears the new colour. |
| **190 routes are dynamic** | 401 | 211 static | `[eventId]`, `[slug]`, `[addon]`, `[vendorId]` — one design serves every instance. |
| **The big groups repeat one shape** | 211 | **~40 units** | `studio`'s 35 routes are ~20 instances of a single SKU-setup page. `website`'s 16 are sub-sections of one editor. `(account)`'s 14 are spokes off one pattern. |

**So "fix all pages" is a ~40-item job, not a 401-item job — and the 12 archetypes + 7 overlays already
answer most of them structurally.**

---

## 1 · What is genuinely DONE

- ✅ **Colour, on every route.** Shipped and live. Locked by `apps/web/lib/palette-lock.test.ts`.
- ✅ **12 screen archetypes + 7 overlay types** — drafted, verified, committed to `prototypes/`.
- ✅ **The overlay grammar** — the one layer that is genuinely complete: 7 types covering all ~55
  ad-hoc dialog call sites.
- ⛔ **Home `/`** — excluded by owner approval (ELN cinematic reskin, 2026-06-29). Not a gap.
- ⛔ **Guest event sites `/[slug]` (11 routes)** — excluded. They run the couple's own mood-board theme
  system, deliberately outside the app palette. Not a gap.
- ⛔ **Seat plan 2D/3D (3 routes)** — the most-built subsystem in the product, with its own locked
  coordinate contract and parity suite. Extend only; never redraw.

---

## 2 · The ~40 units, by surface

Status legend: **P** = a per-surface prototype already exists (old palette — reconcile, don't redraw) ·
**A** = an archetype covers it structurally · **∅** = nothing exists.

### A · Couple dashboard — 126 routes → ~15 units

| Unit | Routes | Status | What it needs |
|---|---|---|---|
| Event overview / "The Big Day" | 1 | **P** `event_dashboard_v2_2026-07-15.html` | Reconcile to terracotta + shell |
| Four-surface user home | 1 | **P** `user_home_final_2026-07-15.html` | ⚠ Owner-approved (#3240) — re-skin only |
| **Studio · SKU setup page** | ~20 | **A** Detail + Wizard | ONE pattern serves all ~20 add-ons |
| Studio · add-on catalog | 2 | **A** Comparison | — |
| **Website editor · sub-section** | 16 | **A** Detail + Sheet | ONE pattern; 16 instances |
| **Account spokes** | 11 | **A** Detail + Roster | `library` and `people` need Gallery/Roster |
| Guests | 10 | **A** Roster | The named offender `guest-list-multiselect.tsx` |
| Vendors | 6 | **A** Roster + Comparison | Kills `build-compare.tsx` |
| Budget | 1 | **A** Ledger | Kills `plan-budget-accordion.tsx` |
| Schedule · Today · Suite · Progress | 4 | **A** Roster/Detail | — |
| Orders · Contracts · Paperwork | 6 | **A** Ledger + Detail | — |
| Messages | 2 | **A** Detail | — |
| Alaala | 2 | **A** Gallery | Obsidian surface |
| Invitation · Monogram · QR | 4 | **A** Detail | — |
| Long tail (manpower, sponsors, refer, pabuya, more) | ~6 | **A** | Inherit from the archetypes |

### B · Vendor dashboard — 62 routes → ~8 units

Four prototypes already exist (`vendor_dashboard_v2`, `Vendor_Dashboard_AllScreens`,
`Vendor_Dashboard_Reorg`, `Vendor_MyShop_Actual`, `Vendor_Overview_Actual`). **Extend, do not redraw.**

| Unit | Routes | Status |
|---|---|---|
| Vendor home / overview | 1 | **P** — reconcile |
| Clients | 8 | **A** Roster |
| Services · Packages | 4 | **A** Detail + Comparison |
| Contracts · Proposals | 3 | **P** `vendor_proposal_maker_2026-07-10.html` |
| Calendar · Booking fees | 4 | **A** Ledger |
| On-the-day desks | 3 | **A** Shell + Roster |
| Subscription · Tokens | 3 | **A** Comparison |
| Long tail (verify, track-record, theft-watch, website, messages) | ~6 | **A** |

### C · Admin console — 107 routes → ~6 units

Internal-only, zero customer impact. **Ships last.** One archetype does nearly all of it.

| Unit | Routes | Status |
|---|---|---|
| **Console table** | ~95 | **A** Admin console table — the single biggest win in the app |
| Admin shell / nav | 1 | **P** `admin_hq_v2` + `Admin_Console_Nav_Redesign` |
| Settings | 3 | **A** Detail |
| Ugat map console | 2 | **P** `Entity_Map_Console_Prototype` |
| Compliance · Force majeure | 4 | **A** Detail |
| Editorial review | 2 | **A** Detail |

### D · Public marketing — 106 routes → ~12 units · **the biggest real gap**

| Unit | Routes | Status | Note |
|---|---|---|---|
| Home `/` | 1 | ⛔ | Excluded — approved |
| Guest event sites `/[slug]` | 11 | ⛔ | Excluded — couple's own theme |
| **Service doorway pattern** | ~10 | **A** Editorial | `/papic` `/panood` `/pawebsite` `/pa3d` `/palogo` `/alaala` `/pakanta` `/patiktok` `/setnayan-ai` |
| Papic sub-pages | 11 | **∅** | Deepest public tree; no composition |
| `/pricing` | 1 | **A** Comparison | ⚠ The Free→AI step still isn't framed as a delta |
| `/features` | 1 | **A** Comparison | — |
| `/explore` | 3 | **∅** | Search-first marketplace; no design |
| Onboarding | 3 | **A** Wizard | ⚠ Wizard gives the chassis; the persona-quiz **content** is undesigned |
| Guided tour | 5 | **∅** | Driver.js overlay scripts |
| Help · Blog · Real Stories | 6 | **A** Editorial | — |
| Legal (privacy, terms, refunds, cookies, acceptable-use) | 5 | **A** Editorial | ⚠ Legal copy is **opened, never auto-merged** |
| Auth (login, signup, reset, claim, join) | ~8 | **∅** | Small but high-traffic; no design |

---

## 3 · The honest gaps — what has NO design at all

Everything else is either done, prototyped, or inherits from an archetype. **This is the actual list:**

1. **`/explore`** (3 routes) — the vendor/service marketplace. Search-first, dense result list. No design.
2. **Papic public sub-tree** (11 routes) — the deepest public branch.
3. **Auth screens** (~8 routes) — login, signup, reset, claim, join. Low complexity, high traffic.
4. **Onboarding content** (3 routes) — the Wizard archetype is the chassis; the questions, order, and
   persona reveal are a separate content design.
5. **Guided tour** (5 routes) — overlay scripts per surface, 11 mini-tours.

That is **five items**, not four hundred.

---

## 4 · Order of work

| Phase | What | Why |
|---|---|---|
| ✅ **0** | Palette | **Done.** Every route already recoloured. |
| **1** | Port archetypes 1 · 2 · 10 · 12 (shell · command · sheet · states) behind a flag | Nothing else can land without the shell. Prod is pre-launch-empty, so the state matrix **is** today's product. |
| **2** | Reconcile the ~10 existing per-surface prototypes to terracotta + the archetypes | Cheapest real progress — composition already decided, only the skin and shell change. |
| **3** | Couple dashboard — Roster · Ledger · Comparison · Gallery | The paying customer. Kills the named offenders. |
| **4** | Public doorway pattern + `/pricing` delta framing | Acquisition-visible. `/` stays excluded. |
| **5** | The five genuine gaps (§3) | Real drawing work, but a short list. |
| **6** | Vendor dashboard — extend the four existing prototypes | Retention. |
| **7** | Admin console table | ~95 routes from one archetype. Internal-only, ships last. |

---

## 5 · The rule that keeps this finite

**Design the archetype, never the screen.** A route is *archetype + that route's content*. When a session
is tempted to draw a 401st page, the question is which of the ~40 units it belongs to — and if the answer
is "none", that is the finding worth reporting, not a reason to draw.

⚠ **The 28 pre-existing prototypes carry the OLD palette** (gold or obsidian CTAs, warm alabaster page).
They are still correct about *composition*. Reconcile them; do not treat their colour as current, and do
not redraw their layout. See [[feedback_start_from_existing_code]] — the owner has paid twice for one page.
