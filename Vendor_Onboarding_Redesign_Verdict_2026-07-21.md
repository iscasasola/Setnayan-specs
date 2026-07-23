# Vendor onboarding redesign — council verdict

**Date:** 2026-07-21 · **Status:** VERDICT — not built. Two OWNER-GATED slices (§5) block half the value.
**Trigger:** owner — *"we will do this onboarding process to make the vendors register smoother"*, following the expo-taxonomy audit.
**Method:** grounding pass over the live `/open-shop` flow, picker, verification and drop-off surface → 7 parallel design lenses (welcome · picker · progressive disclosure · multi-service · non-wedding · friction · trust) → synthesis judge instructed to reject a majority. Run `wf_318ffacb-be4`, 9 agents, 0 errors, 256 tool calls.

---

## 0a · ⚠ CORRECTION 2026-07-21 (later same day) — §0 and §0b below are WRONG. The wall is a non-problem.

`vendor_profiles` was counted **without filtering demo rows**. Re-measured with `demo_batch_id IS NULL`:

| Metric | §0b claimed | **Actual** |
|---|---|---|
| Vendor profiles | 50 | 50 (**46 are demo seed** — 41 in batch `a1a1a1a1-…a01`, 5 in `00000000-…c9`) |
| **Real vendors** | — | **4** |
| Verified + visible on `/explore` | 6 | **1** |
| **Actually waiting on an admin** | **43 (88%)** | **3** |

**Consequences.** The "43 blocked", the "88%", and the ≈8-vendors/day throughput alarm all describe **demo data**. There is no queue. **The constraint is SUPPLY, not the gate** — sign-off #2 ("does the verification wall open?") must not block PRs 1–9, and PR 10 should not be built to relieve a three-vendor backlog. The §0 warning ("a faster path to a shop nobody can see") is therefore **retracted**: with 4 real vendors, onboarding polish is not competing with the wall for impact — it is the only lever that touches supply at all.

*Every future measurement of this table must filter `demo_batch_id IS NULL`. This is the second figure in this document invalidated by an unfiltered count.*

**Build status:** PRs 1–2 shipped as **#3457** (merged). PR 3's regression guard shipped as **#3460**; PR 3's data seed remains owner-gated.

---

## 0 · ~~Read this first~~ (⚠ superseded by §0a) — smoothing the door does not open the wall

> ### The destination is gated, not the path.
> `/explore` filters `.eq('verification_state', 'verified')`, and that state is written **only** by `app/admin/verify/actions.ts`. **A vendor can complete a perfect onboarding and still be invisible to every couple** until an admin acts.

**If the owner declines the gated slices, PRs 1–9 deliver a faster, cleaner path to a shop nobody can see** — and that is a *worse* emotional beat than today's, because the flow will have promised speed. The council's own words: *"say this to the owner before building, not after."*

Throughput is also human-capped: a mandatory review call against a solo-operator admin is ≈**8 vendors/day**, with no slack.

---

## 0b · MEASURED IN PROD 2026-07-21 — the numbers that resize this whole plan

| Metric | Value |
|---|---|
| Vendor profiles | **50** |
| Pass the visibility predicate (`public_visibility ∈ {coming_soon, verified}` + non-empty name) | **49** |
| **Actually visible on `/explore`** (the above **AND** `verification_state='verified'`) | **6** |
| Blocked purely by the verification wall | **43 of 49 — 88%** |
| `vendor_coverages` rows, whole platform | **1** — and its canonical is `pabati` (first-party) |
| `vendor_services` rows / vendors / distinct canonicals | **45 / 42 / 22** |
| Canonicals carrying `applicable_event_types` | **14 of 244** (NULL = universal) |
| Vendors with `event_types = ['wedding']` | **49 of 50** |

**Three consequences:**

1. 🚨 **The wall is not a future risk — it is the current state, and it is quantified.** 43 of 49 otherwise-eligible vendors are invisible to every couple. Onboarding polish cannot move this number; only §7 sign-off 2 can.
2. **Defect A's fix path is NOT what the plan assumed.** `vendor_coverages` has **one row**, so there is nothing to propagate *from* — "coverage is the source" describes an architecture that was never adopted. The live record of what a vendor does is **`vendor_services.category`** (42 vendors, 22 real canonicals: catering, photography, bridal_hmua, mobile_bar, live_band…).
3. **And the semantics mean the fix is a visibility EXPANSION, not a correction.** Only 14 of 244 canonicals are event-type scoped; NULL means *universal*. So deriving `event_types` from services would make ~42 vendors visible to **all 14 event types** — defensible (a photographer can shoot a birthday) but a real change to what couples see, on live data. It must be **additive** — never remove `wedding` from an existing row — or it un-publishes the base.

*(Correction: an earlier pass of mine reported `published_and_verified = 0`. That used `is_published`, which is **not** the explore predicate — `public_visibility` + `verification_state` are. The true figure is 6.)*

## 1 · Three live defects found on the way (all verified in-repo)

| # | Defect | Evidence |
|---|---|---|
| **A** | 🚨 **Every non-wedding vendor is invisible to every non-wedding host.** `vendor_profiles.event_types` is `NOT NULL DEFAULT ARRAY['wedding']`; `/explore` filters `query.contains('event_types', [filters.eventType])`; and `vendor-dashboard/actions.ts:406/630` say event_types is **deliberately not written** ("coverage is the source") — **but nothing propagates coverage → profile.** The only trigger on `vendor_coverages` is a *validation* trigger. So the column never leaves `['wedding']`. | `explore/page.tsx:1489` · `20260521090000` · `20270426250948:69` |
| **B** | **Forced re-login at peak intent.** An auto-confirmed vendor signup ends in `redirect('/login?ready=<email>')` — the vendor retypes the password they chose 15 seconds earlier, on a phone, after the password manager has closed. | `app/signup/actions.ts:424` |
| **C** | 🚨 **`ceremony_venue` renders empty** (from the taxonomy verdict — a picker would advertise a dead tile on day one). | `Taxonomy_Expo_Gap_Verdict_2026-07-21.md` |

**Defect A is the one that matters most for this project**: the entire non-wedding taxonomy — referees, medics, speakers, AV, kids entertainers — is unreachable regardless of how good onboarding gets.

## 2 · The target flow

**Today:** 4–5 screens · 8 required fields · 1 mandatory upload · 1 forced re-login → then 11 more screens to visibility.
**Target:** **3 screens · 5 fields · 0 uploads · 0 re-logins** → then one gate.

**Screen 1 — "What do you do?" · ONE field, no auth.** Type-ahead over the **214 marketplace-visible** leaves (of 244), each row carrying a `Parent › Branch` breadcrumb so ambiguous labels disambiguate in place. Picks become chips; cap 3, min 1. **Results are filtered through the same resolution the marketplace uses**, so the picker can never place a vendor on a tile couples cannot reach. Zero-results captures the phrase into a **miss log** and writes *no* coverage — a fake coverage is worse than absence.

**Event types are INFERRED here, never asked** — derived from the picked leaves' `applicable_event_types`. One line: *"Serving: Weddings · Change"*. A referee reads *"Serving: Tournaments"*. **This is the fix for defect A**, at zero extra clicks on the 98% path.

**Screen 2 — city + shop name (2 fields).** City becomes **required** (a city-less listing cannot be ranked or filtered).
**Screen 3 — email + password (2 fields), then sign in directly.**

Screens 1–2 run **logged out** in a 7-day signed cookie — deliberately *not* the anon-draft DB rail, which is blocked on DPO items.

**Deferred out of the door:** logo (⚠ **the "43 of 50 have none" figure is CONTAMINATED — 46 of the 50 are demo rows; see §0a and the correction in §2.1. Owner-settled regardless.**), contact email (currently the *third* email typed in one flow), owner name (moved to the reply composer, since hybrid anonymity hides it until reply anyway), phone (moved to "Turn on inquiries").

**And the dashboard's first impression changes** from a 75% ring + an orange "0 of 2" pill + six zeroed tiles — three failures and an upsell 20 seconds after signup — to a four-stop rail: **Listed → Found → Bookable → Verified**, where *Found* shows a **live count of tiles the vendor resolves into**. If it reads 0, the taxonomy bug becomes visible instead of shipping silently.

### 2.1 ✅ OWNER-SETTLED 2026-07-21 — the three-stage shop lifecycle, and the logo moves to the verification gate

> **Owner, verbatim:** *"shop logo is only required before verification. starting your shop can start as name, next is completing the profile, then verification."*

**This confirms §2's proposal and goes further — it makes the staging explicit and canonical:**

| Stage | What the vendor must supply | Logo |
|---|---|---|
| **1 · Start the shop** | **A name.** That is the door. | ❌ Not asked |
| **2 · Complete the profile** | The rest of the profile surface, at the vendor's pace | ❌ Not asked |
| **3 · Verification** | Verification requirements — **the logo is required HERE** | ✅ **Required, and only here** |

**What this settles:**
- ✅ **The deferred-logo call in §2 is now owner-backed**, not merely recommended — on the owner's say-so, which is sufficient on its own.
  🚨 **EVIDENCE CORRECTED 2026-07-21 — the "43 of 50" statistic is CONTAMINATED and must not be re-cited.** It counted `vendor_profiles` **without filtering demo rows**, and **§0a of this same file** establishes that **46 of the 50 are demo seed**. A statistic about 50 rows of which 46 are fixtures says nothing about vendor behaviour — it describes what the seed script chose to populate. **The real denominator is 4 real vendors** (§0a), which is far too small to establish that a requirement is "empirically unmet" in either direction.
  **What survives, and it is enough:** the owner decided it (§2.1, verbatim), and the *design* argument is independent of the count — a logo is an asset a business may not have to hand on a phone at signup, and blocking shop creation on it converts a missing file into a lost vendor. ⚠ **What does NOT survive:** any claim that live data proves existing vendors don't supply logos. **Re-measure with `demo_batch_id IS NULL` before citing a logo figure anywhere.**
- ✅ **It supersedes the standing "mandatory logo upload at registration" rule** — corpus `CLAUDE.md` iteration **0022** (*"Mandatory company logo upload at registration per § 2.1b"*) and iteration **0019**'s chat-masking dependency, which assumes a logo always exists because registration guaranteed one.
- 🚨 **CONSEQUENCE — the vendor-chat identity mask now has a hole.** Iteration 0019 § 3.10 requires vendor-side messages to display the **company logo, never a personal photo**. With the logo deferred to stage 3, a **stage-1 or stage-2 vendor can reach the inbox with no logo at all.** The masking rule needs a defined fallback (initials/monogram block? category glyph? no-reply-until-logo?) — **⚠ OPEN SIGN-OFF #6 below. Do not let it fall back to a personal photo**, which is the exact outcome § 3.10 exists to prevent.

⚠ **This does NOT answer sign-off #2 (the verification wall).** The owner staged *what is required when*; they did **not** say whether a stage-1 or stage-2 shop is **visible on `/explore`** before an admin verifies it. **Sign-offs #2 and #4 remain open and untouched.**

## 2.2 · Deep Search auto-fill at Stage 2 — "review what we found" (owner 2026-07-21)

> Threads the vendor Auto-Reply Assistant's **Deep Search** (`Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md` §7A) into onboarding as the **Stage-2 profile-completion accelerator**. Owner: *"deep search will try to gather data for the app to know all necessary information for the vendor."*

**Where it sits:** **Stage 2 (complete the profile), OPTIONAL — never in the 3-screen front door.** Screens 1–3 (§2) are untouched: name + one service + city + auth still get the shop *listed* fast. Deep Search is offered *after* listing, on the "complete your profile" surface, as *"Paste your website or Facebook page and we'll fill in the rest for you to review."*

**What it does:** reuses `lib/vendor-deep-search.ts` to crawl the vendor's OWN public footprint and **draft** their profile + store — detected services, price signals, coverage, portfolio/socials, summary — so completing the profile becomes *review-and-confirm* instead of a blank form. Directly attacks the Stage-2 drop-off (the "11 more screens to visibility" of §2's today-state).

**🔒 Propose, never auto-commit.** Everything Deep Search fills is a **confirmable draft**; only vendor-**confirmed** data goes live / becomes quotable — protects the chatbot's cannot-misquote guarantee and keeps the vendor owning their own prices. Matches build-plan §7A.

**Synergy with the headline risk (§6 wrong-canonical landing):** Deep Search's `category_match` proposes the right canonical leaf/leaves from what the vendor *actually* does on the web — a second signal against "approximately-right leaf → dead tile." It complements the screen-1 picker, it does not replace it.

**✅ RESOLVED 2026-07-22 — the cost trigger.** Deep Search = **₱500/search flat**; **Pro & Enterprise include 1 free per 28-day cycle**, Solo pays each. The supply tension is handled a different way than first proposed: **manual onboarding stays free** (the 3-screen flow), and Deep Search is the *paid auto-fill accelerator* — **never required to onboard**. So a Solo vendor either starts free manually or pays ₱500 for the shortcut; Pro/Ent can spend their free cycle-run on it. (⚠ Launch nuance still open: whether launch vendors get a free Deep Search as an acquisition hook.)

**Depends on:** the self-serve Deep Search surface (chatbot **Phase 5** — `vendor-deep-search.ts` is admin-only today; needs vendor-read RLS on `vendor_web_dossiers` + a vendor-triggered action). NOT built. So this is a Stage-2 enhancement that lands **with/after chatbot Phase 5**, not part of PRs 1–10 here.

## 3 · The alias model — and the measurement that reshaped it

**`display_name_tl` is populated for 15 of 243 rows.** Only the top-15 seed carries Tagalog; the full seed passed NULL. **So "match on the Tagalog name" matches an empty column, and the entire vernacular burden falls on aliases.** `pg_trgm` is also not installed, and installing an extension to fuzzy-search a 244-row table is not justified.

**Shape:** one column, no new table — `canonical_service_schemas.search_aliases TEXT[] NOT NULL DEFAULT '{}'` + a GIN index, inheriting the existing read policy. Curated/learned synonyms only; derived tokens are computed at index-build time and deliberately not stored. **Match-only, never rendered.**

**Plus the miss log** — the table that actually earns its keep, because it turns every failed search into the next alias.

## 4 · The 10 slices

1. **Stop losing vendors to two bugs** — the forced re-login and the step-2 wipe
2. Un-wall the logo; stop asking for the same email three times
3. **Seed the three dead tiles** — the picker would otherwise advertise them on day one
4. **The search core** — derived index + curated aliases + miss log, shipped into Coverage *first*
5. The picker swap — canonical multi-pick that actually indexes the vendor
6. The three-screen restructure
7. Fix `/vendors` — delete the scroll lock (a page that will not scroll reads as broken on mobile), lead with the commercial model, collapse the 90-row matrix behind a disclosure (*a pricing table is a retention object, not an acquisition object*)
8. Delete the VALIDATE email + SMS ritual
9. **[OWNER-GATED]** Reconcile the free tier with the stated commercial model
10. **[OWNER-GATED]** The `listed` state — the only thing that makes finishing the wizard *mean* anything

## 5 · Rejected — including my own recommendation

**The 244/69 generated per-trade landing pages I proposed were REJECTED** as *"thin content by construction"* — 69 hand-written noun/example rows masquerading as generated, at real SEO risk. Recorded because I recommended it in conversation and the council overruled it.

Also rejected: per-event-type vendor landing pages · re-keying hybrid anonymity off `name_revealed_at` (reverses a shipped owner lock) · a second verification lane (reverses the 2026-07-03 government-ID retirement) · deferring bank-account proof (weakens the fake-inquiry design) · a self-serve admin booking table. **16 rejections in total.**

## 6 · Risks

- **WRONG-CANONICAL LANDING — the headline risk, because it fails silently.** A vendor picks an approximately-right leaf, lands in a tile couples never open, and neither side gets an error.
- **No demand behind the non-wedding taxonomy.** Measured in prod: **63 events = 62 wedding + 1 birthday.** Zero tournament, corporate or travel.
- **The `listed` state admits fraud into `/explore`** — the cost of a fake shop drops from 8 fields + a logo + 4 government documents to almost nothing.
- **Predicate/cap changes can un-publish the live vendor base** — two near-misses were caught only by measurement.

## 7 · Owner sign-offs

| # | Decision |
|---|---|
| 1 | 🚨 **Fix defect A** (coverage → `event_types`). Independent of this redesign; the non-wedding taxonomy is dead without it. |
| 2 | **PR 10 — does the verification wall open?** If no, say so *before* PRs 1–9 are built. |
| 3 | PR 9 — reconcile the free tier with "free to join, free to be found, pay only when booked". |
| 4 | Is `listed`-before-verified an acceptable fraud surface? |
| 5 | Ship PRs 1–2 now regardless — they are pure bug fixes. |
| ~~6a~~ | ~~Is the logo required at registration?~~ ✅ **SETTLED 2026-07-21 (§2.1)** — **no.** Name → complete profile → verification; the logo is required **only before verification**. Supersedes the 0022 "mandatory logo at registration" rule. |
| **6** | 🚨 **NEW, created by 6a — what masks a logo-less vendor in chat?** Iteration 0019 § 3.10 mandates the company logo on vendor messages; a stage-1/2 vendor now has none. Needs a defined fallback (initials block · category glyph · no-reply-until-logo). **Must not fall back to a personal photo.** §2.1 |
| ~~7~~ | ✅ **RESOLVED 2026-07-22 (§2.2).** Deep Search = ₱500/search flat; **Pro/Ent include 1 free/28-day cycle, Solo pays each.** Manual onboarding stays free — Deep Search = optional paid auto-fill accelerator, never required. Lands with chatbot Phase 5. |
