# Dashboard Page Masthead — Density Council Verdict (2026-07-21)

> **18-agent council**: 5 repo-grounding readers → 6 seats (density · the couple · brand · accessibility · design systems · mobile) → 6 hostile cross-examiners → chair.
>
> **Owner brief (verbatim), pointing at the Live Studio page header:** *"the page still doesn't maximize the space. image 2 is still there when all of our pages should not have these anymore. what do you call these parts? is it possible to remove all of those on the dashboards so we can maximize the space and use of the screen?"*
>
> ## ✅ Hand-verified before adopting (the claims that decide the ruling)
>
> | Claim | Verified? | Evidence |
> |---|---|---|
> | `.sn-eye` is a **card token**, not the page identity | ✅ | `globals.css:2559` — its own spec comment reads *"**Tile** eyebrow"* |
> | Serif was already retired from dashboards | ✅ | `globals.css:2577` — *"Hanken w800; **m-serif is retired from dashboards**"* |
> | `.sn-eye` barely exists outside the dashboards | ✅ | Only **2** `.tsx` files outside the three trees |
> | There is **no** shared page-header component | ✅ | `grep 'export function PageHeader\|PageMasthead\|PageHero\|SectionHeader'` → **nothing**. All ~80 are hand-rolled |
> | The 10 custom lint scripts are **not** wired into CI | ✅ | Zero references in any `.github/workflows/*.yml` |
>
> **Consequence:** the "but it's the atelier brand" objection does not survive. The dashboard masthead is a **tile token that drifted onto ~71 page headers by copy-paste**, and the absence of a shared component is exactly why it drifted. The real atelier masthead lives on the public marketing tree, guest sites and `/u/[slug]` — which this ruling explicitly does not touch.

---

# Dashboard Page Masthead — Council Verdict
**2026-07-21 · Chair ruling · repo `wt-audio` · supersedes nothing; establishes the rule**

---

## 1. Direct answer to the owner

Yes, we can remove them, and yes we should — but not all four parts equally, and not by deleting the page name. The eyebrow and the standalone back-link row go **everywhere, at every screen size**; the lede stays on desktop (where it costs 48px of 900) and goes on phones (where it costs 96–240px of a 671px window); the title stays visible on every page at every size, because on a phone in the installed app it is literally the only thing on screen that says which page you are on — there is no sidebar below 1024px, no breadcrumb anywhere in the product, no browser tab, and on 47 of 102 event routes the bottom nav lights up nothing. Net: **~72px back on desktop, ~177px back on a phone (+44% visible content above the fold), on ~94 pages, from one component.**

---

## 2. What these parts are called

Collectively the block is the **page masthead** (print term; also "page furniture"). Its four parts, precisely:

| Part | Name | Class | Cost |
|---|---|---|---|
| `‹ Back to add-ons` | **back-link row** (breadcrumb stub) | hand-rolled `<Link>` + `ArrowLeft` | 48px (24px line box + 24px `space-y-6` gap) |
| `BROADCAST` | **eyebrow** — a.k.a. kicker, overline | `.sn-eye` | 24px of layout for 10.5px of type |
| Couple names / page title | **page title** (the `<h1>`) | `.sn-h1` | 36.7px, no media query anywhere |
| The 1–3 line paragraph | **lede** — a.k.a. dek, standfirst | plain `<p>` | 48px desktop / 96px phone median, 240px worst |
| The 640ms fade-and-rise over all of it | **reveal / entrance stagger** | `.sn-reveal` | 720ms stacked on `.sn-page-enter`, 30px of travel |

Two evidentiary findings that settle the "but it's the brand" objection: `.sn-h1`'s own comment in `globals.css:2578` reads *"m-serif is retired from dashboards"*, and `.sn-eye`'s spec comment calls it a **"Tile eyebrow"**. `.sn-eye` appears in exactly **two** `.tsx` files outside the three dashboard trees. **The dashboard masthead is not the atelier identity — it is a card token that drifted onto 71 page headers by copy-paste.** Nobody has to defend it on brand grounds. The atelier masthead lives on the public marketing tree, guest sites and `/u/[slug]`, which this ruling does not touch.

---

## 3. The rule

> **The masthead collapses to one row: `[back chevron] + page title`. The eyebrow dies at every breakpoint. The lede survives on desktop only. The title is never invisible.**
>
> Every `page.tsx`, `_surfaces/*.tsx` and `_components/*.tsx` under `app/dashboard/**`, `app/vendor-dashboard/**`, `app/admin/**` that currently hand-rolls a masthead imports `<PageMasthead>` and passes: `title` (defaults to the page's own `metadata.title` string — backfill the 16 pages that lack one **first**), `back?` (the old back-link href), `lede?` (the old lede string, verbatim), `actions?` (any `<Link>`/`<button>` that was a sibling inside the old `<header>`), `id?` (any id the old header or h1 carried), `titleNode?` (for the 13 runtime-composed titles). The component renders **one row**: a 44×44 back chevron (when `back` is set) beside `<h1 className="sn-h1 text-[22px] leading-[1.15] lg:text-[36px] lg:leading-[1.02]">`, with `actions` right-aligned on `sm:` and wrapped below on phones; then `lede` as `hidden max-w-prose lg:block`. **No eyebrow prop exists.** No `.sn-reveal` on the masthead. If the old `<h1>` string differs from `metadata.title`, that string becomes the **first sentence of `lede`** — which resolves the `/website/*` family (eyebrow `Dress code` / h1 *"Tell your guests what to wear"*) mechanically, with no judgement call: the surface name becomes the title, the sentence becomes desktop prose.

Everything in that paragraph is derivable by grep plus the file's own `metadata` export. The only human input is copy-pasting an existing `<Link>` into the `actions` prop on 25 files.

---

## 4. Page-by-bucket ruling

Three buckets. Not four.

**Bucket A — apply the rule (94 files, ~99% of the work).**
All `page.tsx` under the three trees containing `.sn-h1`, **plus** the 12 non-`page.tsx` files that carry a masthead and would otherwise escape both the codemod and the lint: `dashboard/[eventId]/_components/event-dashboard.tsx:1139` (the event Overview — the most-visited authenticated page in the product, and invisible to every seat's `page.tsx`-scoped sweep), `_components/checklist/checklist-full.tsx`, the 4 `admin/app-performance/_surfaces/*`, the 4 `admin/studio/_surfaces/*`, `admin/ugat/_surfaces/onboarding-surface.tsx`, `admin/queues/_components/queues-triage-feed.tsx`. Examples: `dashboard/[eventId]/budget/page.tsx:247`, `studio/mood-board/page.tsx:316`, `website/dress-code/page.tsx:84`, `orders/page.tsx:48`, `admin/fraud/page.tsx`, `vendor-dashboard/subscription/page.tsx`.
Of these, **25 headers contain an interactive control** (measured, not estimated) — `orders/page.tsx:57` holds the only doorway to `/orders/new`; `guests/page.tsx:584` holds the only desktop doorways to `/guests/invite` and `/seating`. These go into `actions`. **A codemod that deletes `<header>` wholesale destroys them; that is why the component has an `actions` slot and why no version of this ruling permits a `sed`.**

**Bucket B — do not touch (6 named surfaces).**
`guests/page.tsx` (desktop-only header, owner directive 2026-06-03, plus `.shell-topbar{display:none}` at :561), `seating/page.tsx` (sr-only h1 + 100dvh `SeatingFrame`, council 2026-07-15), `vendors/page.tsx` + `_components/services-takeover.tsx` (already headerless), `studio/panood/broadcast/**` (PR #3451's 44px status strip). Each is already denser than this rule and each has a dated directive behind it. Re-migrating them would **add** pixels to the two busiest planning surfaces in the app.

**Bucket C — out of scope, permanently (everything outside the three trees).**
Public marketing, `/u/[slug]`, guest sites, `/papic`, `/blog`. These are crawled, they sit inside the hard Lighthouse a11y+SEO ≥0.90 gate (`.lighthouserc.json:26`), and the full eyebrow/title/lede masthead **is** the product's voice there. Any codemod that touches them is a bug.

The bucket everyone wanted and nobody can have: **"planning vs. operator" is not a rule.** `lib/customer-menu.ts:157-165` puts `/schedule` and `/seating` in the day-of tab bar while both are also eleven-month planning surfaces. A route-keyed bucket gets one of their two jobs wrong on every single event. Rejected.

---

## 5. The mechanism — one place, cannot drift

There is **no** shared page-header component today (`grep 'export function PageHeader|PageHero|SectionHeader'` → nothing). That absence is the entire reason a card token ended up on 71 page headers, and it is why the Guests directive (2026-06-03) and the seating `sr-only` trick (2026-07-15) each still have exactly one user.

1. **`apps/web/app/_components/page-masthead.tsx`** — the single render site. Density lives here forever; changing it changes 94 pages.
2. **`apps/web/scripts/lint-page-masthead.mjs`**, scoped to the three trees, over `page.tsx` **and** `_surfaces/*.tsx` **and** `_components/*.tsx`. Predicate: *fail if a file contains a literal `className="sn-h1"` or an `.sn-eye` element that is a descendant of a `<header>` also containing `.sn-h1`.* It is a **"do not hand-roll"** guard, **not** a "must have an h1" guard — the latter red-builds 101 of 278 files on day one, including the control room and the Vendors index, and gets deleted in week two.
3. **Wire it into `.github/workflows/ci.yml`.** Today CI runs `typecheck` + `next lint` + unit tests and invokes **none** of the 10 existing custom lint scripts, and Lighthouse collects only `/`, `/pricing`, `/login`. Nothing in the pipeline can currently catch a masthead regression in either direction. Without this step, page 95 copy-pastes page 12 inside a sprint and we hold this council again.

---

## 6. What must survive for accessibility — concretely

- **Exactly one visible `<h1>` per page, always.** Not `sr-only`, not relocated to the top bar. 69 dashboard pages have the masthead h1 as their only h1; `sidebar-shell.tsx` renders no heading at any level, so there is no fallback. The top bar is a rejected relocation target on measured grounds: at 390px its right cluster (two `h-9` badges + a `max-w-[120px]` AccountSwitcher + three `gap-3`) consumes ~298–342px of the 358px content column, leaving room for roughly six characters — and it hides on scroll-down (`use-hide-on-scroll.ts:16`), and it is `display:none` on Guests and Merkado, the two busiest mobile surfaces.
- **`export const metadata = { title }` on all 94, backfilled BEFORE any header is touched** — 16 have none, including `dashboard/[eventId]/page.tsx`. This is also the `title` prop's default value, so the backfill is load-bearing twice.
- **Carry both ids.** `id="vendor-workspace-header"` → `vendors/[vendorId]/workspace/page.tsx:973` is the app's **only** `aria-labelledby` that resolves to an `<h1>` (:965); lose it and that `<section>` becomes an unnamed region. `id="budget-overview"` → `budget/page.tsx:247` is a live deep link from `lib/nav-registry-defaults.ts:1170` and carries `scroll-mt-24`; it must land on a real, box-generating element. **Do not use `display:contents` on the masthead wrapper** — a boxless element has an empty `getClientRects()` and the fragment anchor silently scrolls nowhere.
- **Never touch the `.sn-eye` class.** Only the instance inside a `<header>` that also contains `.sn-h1`. Of ~203 dashboard occurrences, 11 are `<h2>` section heads (three of them `aria-labelledby` targets: `budget:405`, `messages:209`, `disputes:141`), 4 are `<label>`, 3 are `<legend>`, 2 are `<dt>`, and `_components/nav/sidebar-section.tsx` uses it for the rail's own group labels.
- **Keep the back affordance and give it a real target.** `globals.css:168-173` scopes `min-height:44px` to `button, [role='button'], a.button, input[type='submit']`, so today's 57 hand-rolled back `<Link>`s sit in a 24px line box and fail the app's own touch rule. The component's 44×44 chevron **fixes** an existing defect. On the ~47 mobile / ~49 desktop routes where no nav item lights up, it is the only "up" — and the installed PWA (`manifest.json:7 display: standalone`) has no browser back button at all, so mobile is the surface that needs it *most*.
- **Declare the mobile lede loss honestly:** `hidden` removes content from the accessibility tree, not just from layout. Screen-reader users on phones lose it too. That is accepted for 75 of 77 pages and refused for two — see Owner Decision 3.

---

## 7. Mobile, ruled separately

One fork only, and it is a fact about the viewport, not a theory about the user: **`lede` is `hidden lg:block`.** It is the single largest line item and it is exactly 2× worse on a phone (median 155 chars → 4 lines / 96px at 44 chars per line, p90 6 lines, worst page 10 lines / 240px) than on desktop (2 lines / 48px of a 900px canvas). Everything else in the rule applies identically at both widths.

| | today | after | reclaim |
|---|---|---|---|
| **390×812 phone** — first content | y=329.7px (40.6%) | y=153px with back link, 134.3px without | **176–195px; visible content 402→579px, +44%** |
| **1280×900 desktop** — first content | y=281.7px (31.3%) | y=209.7px | **72px (42% of the removable band)** |

Desktop reclaim comes entirely from the eyebrow (24px) and the folded back-link row (48px). The `.sn-h1` size on desktop is untouched by default — see Owner Decision 1.

The Live Studio precedent is cited correctly only once: PR #3451 **relocated** identity into a 44px strip and kept its metadata title. It did not delete identity. This rule does the same thing on the same 44px budget — it just refuses to relocate the one part that has nowhere on a phone to go.

---

## 8. Build plan — ordered PRs

**PR-0 · Free wins, ships today, independent of everything below.**
`globals.css:2562` `.sn-eye { display: inline-flex }` → `display: flex`. The declaration contradicts the class's own `line-height: 1`, inflating a 10.5px label into a 24px line box; the fix measures 10.5px with zero visual change. 13.5px × 104 files. All six seats reached this independently. Verified safe: `.sn-eye` appears in only two `.tsx` files outside the three trees, and all 17 `<span className="sn-eye">` sites are block-level children of flex-column containers where the change is a no-op.

**PR-1 · Metadata backfill.** `export const metadata = { title }` on the 16 pages with none — `dashboard/[eventId]/page.tsx`, `manpower`, `progress`, `activity`, `for-you`, `orders/new`, `website/hero-photo`, `website/living-hero`, `studio/playlist`, `studio/[addon]`, `studio/animated-monogram`, `studio/papic/recap`, `studio/papic/crew`, `vendors/packages/[bookingId]`, `design`, `today`. Blocking prerequisite: the rule's `title` default reads from here.

**PR-2 · The component + the guard.** `page-masthead.tsx`, `lint-page-masthead.mjs`, CI wiring in `ci.yml`. Migrate 5 pages by hand to prove the shape, including one of the 25 with an `actions` control and one with a runtime `titleNode`.

**PR-3 · The sweep, ~60 clean files.** Codemod the mastheads whose `<header>` contains only eyebrow + h1 + lede. Carry `#budget-overview` and `#vendor-workspace-header`.

**PR-4 · The 34 manual files.** 25 with controls → `actions`; the ~13 with the back link *inside* `<header>` (the whole `/website/*` family, e.g. `dress-code/page.tsx:75-82`); the 4 with no `<header>` wrapper at all (`refer`, `admin/verify`, `admin/discount-codes/new`, `admin/discount-codes/[id]/edit`); the 12 non-`page.tsx` mastheads from Bucket A. Budget a day; each is a 30-second call, not a design decision.

**PR-5 · Cleanup.** Delete the ~78 now-dead `ArrowLeft` imports and hand-rolled back `<Link>`s; retire `_components/back-button.tsx` (7 users) into the component; strip `.sn-reveal` from mastheads only (**not** from content tiles — `studio/page.tsx:445,491` and `schedule/page.tsx:511` legitimately use it) and re-check the `:nth-child` stagger on files whose child indices shift.

---

## 9. Owner decisions

1. **Desktop `.sn-h1` stays 36px?** The rule as written leaves desktop type untouched and reclaims 72px from the eyebrow and back-link row alone. Dropping desktop to 28px would reclaim ~8px more and make the page feel materially tighter on the surface you were actually looking at. This changes a locked type token, so it is yours, not mine. **Default if you don't answer: 36px stays.**
2. **Mobile `.sn-h1` at 22px** — `.sn-h1` has no media query anywhere in `globals.css` today, so a 390px phone renders the identical 36px a 27-inch monitor does. The rule gives it its first one. Confirm 22px, or name a size.
3. **Two ledes I am carving out of the mobile hide, by name.** `orders/page.tsx:53-57` is the only customer-facing explanation of apply-then-pay in the product, and it sits on the page people pay from. `studio/panood/cameras/page.tsx:108-118` is the only explanation of app-less operator join *and* carries a conditional free-camera entitlement disclosure that exists nowhere else. I am ruling these two render at all breakpoints as body copy inside the first card, not as ledes. Every character-count threshold proposed to detect them automatically failed on the very pages it was written for. **Two named exceptions, hard-coded, is a rule; a 220-character gate is a coin flip.** Confirm, or tell me to eat the loss.
4. **Bucket B stays frozen.** Guests, seating, Vendors index and the control room keep their bespoke treatments and are excluded from the sweep. If you want them normalized to the component later, that is a separate ask — migrating them today would *add* pixels to Guests and Merkado.
5. **CI wiring.** PR-2 adds the first custom lint script ever invoked by `ci.yml`. That makes hand-rolled mastheads a red build for everyone, including you. Say yes explicitly — without it this decision decays by copy-paste, exactly as the 2026-06-03 and 2026-07-15 density directives already did.
