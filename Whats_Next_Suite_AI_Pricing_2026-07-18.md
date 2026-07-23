# What's Next — Suite · Setnayan AI · Pricing · 2026-07-18

> Session handoff. Everything opened, decided, built, or parked across the 2026-07-17→18 Studio/Suite + Setnayan AI + pricing + personalization thread. Read this first before picking any of it back up. Companion docs are indexed in §7.
>
> **Legend:** ✅ shipped · 🟡 spec'd, not built · 🔵 designed/prototyped only · ⚠️ owner decision open · 🔒 counsel/DPO/NPC-gated.

---

## 1 · Do-now (the short list)

1. **✅ RESOLVED 2026-07-22 — the Silid→Suite rename SHIPPED; the surface is Suite and it is LIVE.** The shipped code on `origin/main` is now fully **Suite** — route `/dashboard/[eventId]/suite`, `SUITE_NAME='Suite'`, flag reader **`NEXT_PUBLIC_SUITE`** — and `NEXT_PUBLIC_SUITE="true"` is set in Vercel **production** (verified 2026-07-22). No functional "Silid" remains in code (only two lineage comments). *(History, do not act on: the surface was FIRST built as "Silid" in PR #3395 — route `/silid`, `SILID_NAME`, `NEXT_PUBLIC_SILID` — and this line previously (2026-07-19) said "code reads NEXT_PUBLIC_SILID, don't rename the var." That was true only in the window before the rename merged. The rename has since merged; `NEXT_PUBLIC_SUITE` is the live switch now. `NEXT_PUBLIC_SILID` reads nothing anymore.)*
2. **Watch [PR #3395](https://github.com/iscasasola/setnayan-platform/pull/3395)** (Suite surface) — auto-merge armed; confirm CI green.
3. **Decide the Suite nav doorway** (§2.A) — replace Studio, or sit alongside. Until then Suite is live-but-doorless (reachable only by URL).
4. **Answer the pricing open-questions** (§3) so Pricing.md § 00 can be finalized.

---

## 2 · Suite (the guided services surface)

### ✅ Shipped — PR #3395 (flag-dark)
New route `/dashboard/[eventId]/suite`. Reuses the Studio data layer (live admin-catalog prices — never hardcoded; bundle/co-host-aware `eventActiveSkus` ownership; roadmap-aware recs; 0053 surface gating) + `StudioAppRow`. Structure: **Setnayan AI recs lead → Yours (owned) → Add to your day (sellable, outcome-grouped) → Free to use** (Date Finder featured helper + every free tool a real tappable doorway). Free-SKU list sourced from `tier==='free'` so the paid Custom QR does NOT show as free. Flag-dark in prod (`NEXT_PUBLIC_SUITE`), visible on all previews (`VERCEL_ENV==='preview'`). Name in the single `SUITE_NAME` constant. tsc + lint clean; route compiles + auth-guards; `/studio` untouched.

- **Name LOCKED = "Suite"** (owner, after rejecting Studio/Atelier/Silid + the Filipino options Hiyas/Mutya). Standard product term for a collection of an app's services (G Suite, Creative Suite, Office Suite); premium + non-transactional. Runners-up on record (don't re-litigate): The Collection · The Edit · Signature · Hiyas · Mutya.

### ⚠️ Open decisions
- **A · Nav doorway** — Suite is on but has NO nav entry (only reachable by typing `/suite`). Per the wayfinding rule it's an orphan until wired. **Replace** the Studio tab (Suite *is* the new Studio) or **sit alongside** for an A/B period, then retire Studio. *Recommendation: alongside first — keep proven Studio while Suite is still PR-1, flip to replace once the follow-up PRs (§2.C) land.*

### 🔵 Follow-up build (next PRs — PR-1 is the structure only)
- **PR-2 · Vignette service-cards** — ✅ **SHIPPED 2026-07-20 flag-dark ([PR #3413](https://github.com/iscasasola/setnayan-platform/pull/3413))**: the "Add to your day" sellables render as animated CSS-only vignette cards (9 bespoke outcome scenes + fallback; personalized names/initials/date from one `events` select; new `suite/_components/suite-vignette-card.tsx` + colocated module CSS; radii on `--m-r-*`; `/studio` + globals.css untouched; still behind `NEXT_PUBLIC_SUITE`). *(Original ask, for lineage: each sellable feature becomes an animated poster card — vignette of the outcome, personalized to the couple's names/monogram/palette — instead of a plain row. Prototype: artifact `showcase-v1`.)*
- **PR-2 · Personalized secretary brief** — the AI lead becomes a real personalized "here's where you are + next steps" (phase + taste-profile + owned state), not the current recs strip.
- **Free-layer honesty fixes (from the 2026-07-18 doorway audit):**
  - **Photo Delivery** — page real but Drive backend is stubbed (`TODO(0009)`, `web_v1`). Mark **`coming_soon`** so it doesn't sit in the free layer as if it works. *(Load-bearing SKU status change — surface for owner OK.)*
  - **Custom QR** — the `/studio/custom-qr-guest` surface is the PAID SKU (buy wall); the FREE per-guest QR is on the Invitation tab. Point the free-layer doorway at the Invitation QR (or ensure the catalog price is truly ₱0). Reconcile with the owner's Custom-QR-free call (2026-06-29).
  - **7 doorway guardrail tests** (audit output) — hrefs from `routes.*` only; no nav href starts with a retired prefix (`/design`, `/vendors/compare`); `addOnHref()` resolves to a real route; always-free tools carry no `surface`; auth-guard is the only legal redirect out of a tool page; smoke server binds `localhost` dual-stack + warm-compile; "always free" label ≠ paid SKU.

---

## 3 · Pricing (owner's 2026-07-17 sheet — PENDING answers before Pricing.md § 00 rewrite)

Reconciled worksheet recorded; canonical Pricing.md § 00 **held** until these are answered. Reprices confirmed: Live Stream Mobile ₱1,500 · Desktop ₱2,500 · Pakanta ₱2,500 · 3D Plan ₱3,000 (replaces retired Indoor Blueprint; built on free Mood Board + Guest List + 2D/List Seat Plan). Structural bundles: **Website Upgrade ₱3,500** (renamed from Website PRO ₱4,999) = STD cinematic reveal + background music + STD video + Editorial PRO; **Monogram Pro ₱1,000** now includes Live Background. Papic free tier = **3 Papic Mini** + paid ladder. Setnayan AI stays per-event-type. **Editorial clarified:** free = auto editorial, PRO = the customization unlock on it.

### ⚠️ Open questions (answer these → Pricing.md § 00 finalizes)
1. **Editorial PRO** — bundle-only (via Website Upgrade ₱3,500) or also standalone (was ₱2,999)?
2. **Save-the-Date cinematic reveal** — bundle-only or also standalone (was ₱999)?
3. **Live Background** — Monogram-Pro-only or also standalone (was ₱499)?
4. **Papic paid ladder** — confirm Mini ₱30 / Ltd ₱50 / Unli ₱100 per cam·day (per the GBB memory)?
5. **Preserve High Res Data** — the storage-tier ranges (size → annual price), and where on Home it lives (Alaala vs account settings). *(This is PER-ACCOUNT, not per-event — lives on Home, NOT in Suite. Rule locked: scope decides the surface — per-event → Suite, per-account → Home.)*
6. **Hold as-is?** Patiktok ₱1,499/day · Photo Delivery free · the free 4-in-1 website base + RSVP free.
7. **Music Creator** — the orphan card (its "browse cleared music" promise has no surface, routes to Pakanta). Delete + 301 to Pakanta / build a real music-browse surface (the ~400-track `songs.ts` catalogue is unused) / fold into Playlist?

---

## 4 · Studio replot (the design that became Suite)

The 2026-07-17 council verdict (journey-ordered · free-led · upgrade-adjacent · no hidden prices) is the design substrate Suite implements. Its dupe-fixes still apply to the **existing** `/studio` catalog if you keep it running alongside Suite:

- ⚠️ **Card-deletions A–D** (still under discussion — sign-off #1 tab-composition already YES):
  - **A** Whole-website → one "Your Website" card + Event/Editorial chips (5→3).
  - **B** Event + Editorial standalone cards → chips (discoverability trade-off).
  - **C** Editorial PRO card → inclusion line inside Website Upgrade (revenue-sensitive — metric-watch or keep standalone).
  - **D** Music Creator → see §3.7.
- These are moot if Suite fully replaces Studio (Suite already resolves them structurally). Decide alongside the §2.A doorway call.

---

## 5 · Setnayan AI — per-type pricing + gap build (🟡 spec'd, not built)

Full spec: `Setnayan_AI_Gap_Leaves_Travel_Dinner_Date_2026-07-17.md`. Verified: wedding gets the full 11-item roadmap/plotting; other types get matching + generic guards + a coarse date-peak sort only. Price AI per type by **load** (coverage window × category breadth × plotting depth); AI is deterministic (~99% margin) so "cost" = service load. Tiers: **A** Wedding ₱1,499 · **B** Debut/Corporate ~₱899 · **C** Christening/Birthday/Celebration/Travel/Tournament ~₱499 · **D** Gender-reveal/Dining ~₱199 · **Free** Simple Event ₱0.

### The build (post owner sign-off)
- **14 gap leaves** → `service_categories` + `canonical_service_taxonomy` + `VendorCategory` enum: referee_official · event_medic · tour_activity · tour_guide · travel_insurance · av_production · speaker_talent · **performers** · kids_entertainer · **choreographer** (wedding ritual + debut cotillion) · reveal_element · restaurant_reservation · **event_insurance** · **personal_accident** (join `travel_insurance` as the Insurance family). *(Magicians/clowns homed in kids_entertainer + performers.)*
- **Populate `applicable_event_types`** from the confirmed leaf-by-type matrix — **this is the #1 event-isolation guardrail** (today mostly NULL=universal, so a birthday can currently pull wedding categories; writing the matrix closes it so smaller events can't become weddings).
- **Travel** — ✅ SHIPPED 2026-07-20 (PR #3417): multiple hotels (night-blocks) + multiple tours (time-blocks) on one conflict-checked itinerary; reused the schedule spine + the GRD-06 clash guard verbatim (save-time double-book reject + a Guard panel on the travel schedule page); travel `multi_day=true` asserted by migration `20270825683668`; engine = pure `lib/schedule-travel.ts`. *(Note: `schedule-matrix.ts` turned out to be the date-FINDER engine, not a span engine — the per-day expansion idiom came from `schedule-ros.ts`'s pure-filter discipline instead.)*
- **The AI cost rule (owner-locked, GOVERNING):** digital-services-only (no vendors) → AI ₱0; vendors included → AI present + priced.
- **Dinner Date** = roaming restaurant-reservation event (composable model) — breakfast/lunch/dinner = meal-timeslot attribute (one type); barkada = occasion attribute + community_eligible. Opens **restaurant-table reservation** as a real surface.

### ⚠️ Open sign-offs
- **Dinner Date as a NEW `event_type` vs a roaming sub-mode** (composable model owner-locked "don't proliferate — reuse travel/simple_event"). Recommendation applied pending review: new type.
- **Build the gap leaves** confirmed YES; **event-isolation** (populate `applicable_event_types`) confirmed intent.

---

## 6 · Two features designed, gated on dependencies

- **Date Finder guest poll → top 3** (🟡 spec `Date_Finder_Guest_Poll_2026-07-18.md`). Extends the existing Schedule Matrix so key people (sponsors/family/entourage) poll their date availability, combined with vendor availability, → the 3 best dates. Free tool. **Blocked** on the onboarding Phase-4 candidate-date capture (`date_candidates[]`/`date_window`, migration `20260719000000`) landing — no dates to rank without it. 🔒 poll collects voters' availability (minimal PI, ROPA line). Wire the Suite secretary's "Lock your date" → this; surface it as a featured free helper (done in the Suite prototype).
- **Planning-style personalization** (🔵 mockup + spec `Setnayan_AI_Planning_Style_Personalization_2026-07-17.md`). Account-level deterministic taste profile (cuisine/photo-style/moods/vendors) persisting across events → the AI-secretary "knows you." Owner governance locked: ordinary-PI only (religion from the faith profile, never inferred from food), self-scoped, opt-in, granular-delete + full-wipe + download + turn-off. 🔒 **ships behind DPO + counsel + an NPC ROPA + PIA entry** — do NOT flip on real-user profiling before that. Activation reuses the existing `preference-match` + INF templates.

---

## 7 · Document index (this session)

| Doc | Covers |
|---|---|
| `Event_Studio_Replot_Council_Verdict_2026-07-17.md` | The Studio→Suite arrangement, dupes, pill grammar, presentation (§8), pricing corrections (§9), AI framing (§10) |
| `Setnayan_AI_Gap_Leaves_Travel_Dinner_Date_2026-07-17.md` | Per-type AI pricing, 14 gap leaves, Travel scheduling, Dinner Date, insurance, AI cost rule, event-isolation |
| `Setnayan_AI_Planning_Style_Personalization_2026-07-17.md` | Account taste profile + RA 10173 governance |
| `Date_Finder_Guest_Poll_2026-07-18.md` | Key-person date poll + vendor availability → top 3 |
| `Pricing.md § 00` + `DECISION_LOG.md` (2026-07-17/18 rows) | Canonical prices (pending §3 answers) + the full decision trail |

**Prototypes (Claude artifacts, owner's account):** council replot (current-vs-proposed), showcase (poster cards), category matrix, planning-style settings, Suite guided surface, Date-Finder top-3, pricing worksheet.

---

## 8 · Execution plan (for the orchestrator — schema per `Whats_Next_MASTER_Orchestration.md` §3)

| id | title | bucket | depends-on | parallel-safe | conflict-zone | safety | gate / note |
|---|---|---|---|---|---|---|---|
| `suite-guardrail-tests` | 7 doorway guardrail tests (routes helper, no retired prefix, addOnHref resolves, free≠surface, auth-only redirect, smoke localhost, free≠paid) | **RUN** | — | yes | tests | additive | — |
| `suite-photo-delivery-comingsoon` | Photo Delivery → `coming_soon` (Drive backend stubbed) | **HOLD-OWNER** | — | yes | Suite/catalog | prod-affecting | owner ack — load-bearing SKU status |
| `suite-customqr-free-doorway` | Free-layer "Custom QR" → the Invitation free-QR, not the paid SKU page | **HOLD-OWNER** | — | yes | Suite/catalog | prod-affecting | owner confirm + reconcile ₱0 |
| `suite-pr2-vignette-cards` | ✅ SHIPPED 2026-07-20 ([PR #3413](https://github.com/iscasasola/setnayan-platform/pull/3413) flag-dark) — sellable features → animated vignette service-cards | **DONE** | — | — | Suite surface | flag-dark | shipped in Suite flag |
| `suite-pr2-secretary` | Personalized secretary brief (phase + taste + owned) | **HOLD-DEP** | `personalization-profile` | no | Suite surface | flag-dark | needs the taste profile (counsel-gated) |
| `suite-nav-doorway` | Wire Suite into nav (replace Studio vs alongside) | **HOLD-OWNER** | — | no | nav | prod-affecting | owner decision A |
| `ai-gap-leaves` | ✅ SHIPPED 2026-07-20 ([PR #3414](https://github.com/iscasasola/setnayan-platform/pull/3414)) — 14 gap leaves → `service_categories`+`canonical_service_taxonomy`+`VendorCategory` | **DONE** | — | — | vendor-taxonomy | additive (migration) | owner said "build the gaps" ✓ |
| `ai-applicable-event-types` | Populate `applicable_event_types` from the leaf-by-type matrix (event-isolation guardrail) | **HOLD-DEP** | `ai-gap-leaves` | no | vendor-taxonomy | prod-affecting | #1 isolation fix — needs leaves first + matrix sign-off |
| `ai-travel-scheduling` | ✅ SHIPPED 2026-07-20 ([PR #3417](https://github.com/iscasasola/setnayan-platform/pull/3417)) — multi-hotel night-blocks + multi-tour time-blocks + GRD-06 clash guard (save-time reject + schedule-page panel); travel `multi_day=TRUE` asserted (migration `20270825683668`); pure engine `lib/schedule-travel.ts`; inert for non-travel (no flag) | **DONE** | `ai-gap-leaves` ✓ | — | schedule/travel | additive | reused `schedule*.ts` + GRD-06 verbatim |
| `ai-per-type-pricing` | Per-type AI tier gate (A/B/C/D/Free) + AI cost rule (no vendors→₱0) | **HOLD-DEP** | `ai-gap-leaves` | yes | ai-pricing | prod-affecting | reads live catalog |
| `dinner-date-type` | Dinner Date event type + restaurant-table reservation surface | **HOLD-OWNER** | `ai-gap-leaves` | no | event-type-profile | prod-affecting | new-type vs roaming sub-mode |
| `pricing-finalize` | Rewrite Pricing.md § 00 from the 7 open answers | **HOLD-OWNER** | — | yes | pricing | corpus | the 7 §3 questions |
| `studio-card-deletions` | Studio dupe-fixes A–D (moot if Suite replaces Studio) | **HOLD-OWNER** | `suite-nav-doorway` | no | Suite surface | prod-affecting | owner discussion + doorway call |
| `date-finder-poll` | Key-person date poll → top 3 (combine with vendor availability) | **HOLD-DEP** | onboarding-phase4-candidate-dates | no | schedule | flag-dark + 🔒ROPA | needs candidate-date capture landed |
| `personalization-profile` | Account taste profile (activate preference-match + INF) | **HOLD-COUNSEL** | — | yes | privacy | 🔒 gated | DPO + counsel + NPC ROPA/PIA |

**Runnable now (no gate, deps met):** `ai-per-type-pricing` (dep `ai-gap-leaves` ✓). *(`suite-guardrail-tests` shipped earlier; `suite-pr2-vignette-cards` shipped 2026-07-20, PR #3413; `ai-gap-leaves` shipped 2026-07-20, PR #3414; `ai-travel-scheduling` shipped 2026-07-20, PR #3417.)* `ai-applicable-event-types` still needs the matrix sign-off. Everything else waits on an owner decision, a counsel gate, or the onboarding candidate-date dependency.
