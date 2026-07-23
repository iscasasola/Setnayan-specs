# Social Sharing — Follow-Through Build Plan (2026-07-16)

> Owner approved all 10 items in the [Social Share & Settings Council Verdict](Social_Share_Settings_Council_Verdict_2026-07-16.md) on 2026-07-16. This doc is the **build-ready plan for the design-heavy items** that need schema / new surfaces before code: **#2 recap-post opt-out**, **#7 public-profile system**, **#8 invitation one-tap share + report path**, **#10 privacy-notice update**. (The clean fixes #1/#5/#6 and the growth feature #3/#4 are already in-flight as separate PRs. The creator item #9 has its own doc: [Creator Adventure Chapter Build Plan](Creator_Adventure_Chapter_Build_Plan_2026-07-16.md).)
>
> All file paths are from the shipped audit @ `origin/main` (1864d7ac4 / c38b82c4a). Every item keeps the repo's worktree + PR + auto-merge workflow. Owner is the DPO, so owner sign-off = DPO sign-off for the RA-10173 gates below.

---

## Item #2 — Recap re-post to Setnayan's social: default public, one-tap opt-out

**Owner's ruling:** "Ask permission if they want it shared in public. We can set everything public initially, then they can set it private." → Interpretation: keep the current default (Setnayan *may* feature a published recap), but give the couple an explicit, discoverable toggle to opt their recap out of Setnayan's own FB/IG re-post, and honor it before dispatch.

**The gap being closed:** `lib/social/recap-post.ts` composes a `social_posts` row when a couple publishes their recap, with **no `landing_page_visibility` check and no per-event opt-in**. Today it's inert (Meta creds env-dark), so this must land **before** those creds are ever armed.

**Build:**
1. **Schema** — reuse the existing consent architecture rather than inventing one. The cleanest fit is `marketing_share_consents` (per-event, per-artifact, `credit_mode`, revocable). Add artifact type `recap` (or a dedicated `events.recap_social_optout_at timestamptz` column if a per-event boolean is simpler than a consent row — pick the boolean; it's a single opt-out, not a per-artifact grant). Default = opt-in (NULL = allowed), matching "everything public initially."
2. **Dispatch gate** — in `lib/social/recap-post.ts` (compose step) AND `lib/social/flush.ts` (dispatch step), refuse to compose/dispatch a recap post when (a) the event's `recap_social_optout_at` is set, OR (b) `landing_page_visibility != 'public'`. A private-site couple must never be composed into the public queue (unanimous red line #2).
3. **UI** — on the recap manager (`dashboard/[eventId]/studio/papic/recap/page.tsx`) and/or `website/privacy`, a single clear control: *"Let Setnayan feature this recap on our Facebook & Instagram"* (checked by default), with copy that it only ever posts after the event and can be turned off anytime. When unchecked → stamp `recap_social_optout_at`, and if a post already went live, route to the existing admin Social Queue take-down (24h SLA, already built).
4. **Verify:** with the flag set, `composeRecapSocialPost` produces no row; with visibility private, likewise.

**Watch-out:** don't conflate this with `public_summary_consent_at` (that gates the `/realstories` *index*, a different surface). This opt-out is specifically the Setnayan-owned-social re-post channel.

---

## Item #7 — Public profile `/u/[slug]`: make it a real, safe share surface

**Owner's ruling:** "Build what is needed." The council said keep it dormant *until* three prerequisites exist. This item builds those three, then lights the doorway. Ships as **3 sequenced PRs**, not one.

Current state: every account has a live `/u/[slug]` page (slug auto-backfilled from the real display name), but **no rename UI, no public/hidden toggle, no in-app doorway, no report path**, and the empty state renders the holder's real name for any enumerable slug (existence + name oracle). OG is the generic brand card.

**PR 7a — Vanity slug editor (close the name-leak).**
- Surface: new "URL & Slug" section on `dashboard/(account)/profile` (`#settings` area).
- Action: `updateUserSlug(newSlug)` — validate 3–32 chars, Crockford-safe/lowercase, unique CI; RLS `user_owns_row` already permits self-set (`migration 20270424889744`). Log renames to the existing `slug_change_log` ('user' entity already supported). Rate-limit renames.
- Result: the public identity is user-controllable (RA-10173 requirement for a public identifier derived from the person's name).

**PR 7b — Per-account public/hidden toggle + empty-state fix.**
- Schema: `users.public_profile_enabled boolean default false` (dormant-by-default; the owner opts in to being a public showcase). *(Note: this is a per-account gate distinct from per-event `landing_page_visibility`. The `/u` page still only ever lists per-event-public events; this toggle governs whether the `/u` shell itself is shareable/indexable at all.)*
- Enforce in `app/u/[userSlug]/page.tsx`: when `public_profile_enabled = false`, the page 404s for strangers (owner sees a preview). When true but zero public chapters, render a neutral brand state that does **NOT** print `display_name` (kill the existence/name oracle). `robots noindex` unless enabled + ≥1 public chapter.
- Settings UI: a toggle on the profile page, off by default.

**PR 7c — Report path + share doorway + personal OG.**
- Report path: extend `user_reports.target_type` to include `user_profile` (and, shared with item #8, `event`). Add a "Report this page" affordance on public `/u` and `/[slug]`. All reports route into the single existing `/admin/user-reports` queue (hide/block/escalate/dismiss) — **do NOT stand up a second moderation surface** (solo-op red line).
- Doorway: a copy-link + native-share control in the profile settings and/or `/u` owner-preview, **gated on `public_profile_enabled = true` AND ≥1 public chapter**. Never offer sharing on the empty state.
- OG: build `app/api/og/u/[slug]/route.ts` — a personalized card (name + hero from the most recent public chapter), not the generic brand card. Below-bar generic card only as the fail-safe.

**Sequencing:** 7a → 7b → 7c. Don't expose the doorway (7c) before rename (7a) and the toggle (7b) exist. This is also the substrate the creator Adventure Chapter (#9) builds on.

---

## Item #8 — Invitation page `/[slug]`: one-tap public share + event report target

**Owner's ruling:** "Yes. Let us have that one-button share." The council gated this on an abuse-report path existing first — so this ships as **one PR that does both**.

**Build:**
1. **Event report target (prerequisite):** extend `user_reports.target_type` with `event` (shared with 7c). Add a discreet "Report this page" entry point on the public `/[slug]` invitation page. Routes into `/admin/user-reports`.
2. **One-tap share button on `/[slug]`:** today the couple copies the URL from the address bar (no in-page control). Add a single share affordance — native share sheet (`navigator.share({title,url})`) with copy-link fallback — visible only when the event is effectively **public** (`resolveEffectiveVisibility == 'public'`, i.e. the couple has launched their Save-the-Date). Never render it on a private/unlisted page.
3. **Brand rule (from #4):** the invitation is the couple's sacred aesthetic — the share button is chrome, and the shared artifact is the couple's page **UNBRANDED** (no "made with Setnayan" watermark on the hero/monogram). URL-share only here; the OG card already exists.
4. **Verify:** button absent on private/unlisted; present + working (native sheet on mobile, copy on desktop) on a launched public event; report entry point files into the admin queue.

---

## Item #10 — Update the public `/privacy` notice to match what the app actually does

**Owner's ruling:** "Yes, update it." The live notice (`app/privacy/`) omits processing the app genuinely performs — an RA-10173 transparency exposure in itself. This overlaps the existing [privacy reconciliation gap register](project_setnayan_privacy_reconciliation.md).

**Add / correct these disclosures (all are shipped or about-to-ship processing):**
- **Biometric face data** — per-event face enrollment for auto-tagging (RSVP selfie, day-of, guest camera), with the consent + revocation model; note the account-level face profile is flag-off pending DPO. (The live notice currently *denies* biometrics while face-enroll is built.)
- **Geolocation capture** on photos/clips (`geo_lat/geo_lon`), and the new outbound geo-strip (item #1) — state that originals retain geo, outbound shares strip it.
- **Social featuring** — that Setnayan may feature published recaps/consented artifacts on its own FB/IG/TikTok, the per-artifact consent + the recap opt-out (item #2), first-names/anonymous credit, and post-event-only timing.
- **Guest photo consent** — the guest capture-time + couple-approval double gate, FaceBlock, opt-out.
- **Minors/dependents & religion** — that these are collected only behind consent (People layer flag-off/counsel-gated; religion stamp-on-change) and never surfaced publicly.
- **Data-subject rights** — export (`/api/profile/export`), deletion request, face-forget — already partly present; verify complete.

**Process:** because the owner is the DPO, owner review of the copy = DPO sign-off. Draft the copy, land it as a PR, and tick the corresponding items in the privacy reconciliation gap register.

---

## Suggested execution order (waves)

1. **In-flight now (separate PRs):** #1 geo strip · #5 library-share fix · #6 vendor price flag (investigation-gated) · #3+#4 story share cards.
2. **Next wave:** #2 recap opt-out (small, unblocks arming Meta creds safely) · #10 privacy notice (copy).
3. **Then:** #8 invitation share + `event` report target (single PR) — this also delivers the report-queue extension #7c needs.
4. **Then:** #7 profile system 7a → 7b → 7c (reuses the report target from #8).
5. **Parallel track:** #9 creator Adventure Chapter (own build plan; builds on #7's `/u` surface).

*Provenance: derived from council run `wf_1a7ff6d9-88e` + owner approvals 2026-07-16. Cross-refs: [[project_setnayan_privacy_reconciliation]], [[project_setnayan_creator_program]], [[project_setnayan_solo_admin_plan]] (single report queue), [[project_setnayan_public_url_scheme]].*
