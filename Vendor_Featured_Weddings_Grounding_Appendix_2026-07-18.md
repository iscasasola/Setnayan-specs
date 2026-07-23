

====================
I have everything needed. Returning findings.

---

# Vendor Commercial Republishing of Wedding + Guest Photos — RA 10173 Compliance Findings

## 1. Prior posture & precedents (what already exists — build on these, don't reinvent)

**This scenario is one step beyond every existing precedent.** In all prior approved flows Setnayan stays the host/controller and its technical controls (geo-strip, NSFW, private-by-default, takedown SLA) remain enforceable. Your new scenario pushes PI *off Setnayan's infrastructure onto the vendor's own commercial site*, so those controls stop binding the republished copy and the vendor becomes an unambiguous independent controller. That is the whole compliance problem.

**Closest precedent — the vendor Papic-capture counsel gate** (`Vendor_On_The_Day_App_Council_Verdict_2026-07-16.md` §5, §8; memory `project_setnayan_vendor_on_the_day`):
- Council ruling: "A vendor collecting guest images for its own commercial portfolio is a **third-party controller the guest never consented to** … no vendor capture surface until counsel rules on the guest→vendor consent chain and the controller/processor split."
- Owner **overrode** the cut and authorized building *behind the consent gate*, explicitly owning the reopened NPC exposure — but **go-live/flag-flip still requires the DPO/NPC ruling**. Schema (`vendor_papic_captures`, `vendor_guest_deliveries`) exists in prod, **empty, flag-OFF**.
- Activation is gated by the **Data Privacy control board**, not env flags: `/admin/data-privacy`, table `data_privacy_controls`, control key `vendor_papic_capture`, default **inactive/fail-closed** (`apps/web/lib/data-privacy-controls.ts:43-50`). Its own riskNote already states the exact issue: *"The vendor becomes a third-party controller of guest images — a consent basis for guest capture is required. NSFW filter on, geo stripped on share."*

**Showcase-consent precedent — R-13** (`NPC_Creator_Economy_Processing_Addendum_2026-07-17.md` §1, §3(a)): Setnayan-hosted teaser from face-tagged Papic gallery. Rated **HIGH inherent → MED→LOW after the double-gate fix**. The key legal finding to carry over verbatim:
- Event-scoping = the **proportionality/purpose-limitation** control (§11). It constrains scope but **does NOT supply the lawful basis**.
- Explicit consent = the **lawful-basis** control (§13). Biometric/face-tag-derived media is **sensitive PI (§3(l))**; the R-01 Face-Vector DPIA already found RSVP-photo-upload implicit consent *"likely insufficient — explicit, separate, evidenced face-recognition opt-in required."*
- Putting face-tag-derived media into a *public/secondary* purpose is a **"new, incompatible purpose"** where purpose-limitation cuts *against* re-use.

**The existing consent primitive** (`marketing_share_consents`, `apps/web/app/dashboard/[eventId]/_actions/share-consent.ts`): per-artifact, couple-granted, credit modes `first_names`/`anonymous`, revocable (`revoked_at`) with a **24-hr admin takedown SLA**. **Critical limitation:** it authorizes only **Setnayan** to feature on the **Setnayan** Facebook page — it is NOT a grant to a vendor, and revocation only works because Setnayan hosts the copy. It cannot be silently reused for vendor-site republishing.

**The enforced double-gate (guest photos)** — `apps/web/lib/papic-gallery.ts:223-261`: public showcase requires `consent_to_public = TRUE` (guest opted in) **AND** `couple_approved_for_showcase = TRUE` (couple picked it) **AND** `hidden_at IS NULL`, plus moderation exclusion (`moderation_state NOT IN nsfw_blocked/consent_withheld/faceblock_withheld`). This is the pattern any vendor-showcase flow must inherit or exceed.

**Vendor Agreement** (`01_Contracts/Setnayan_Vendor_Agreement.md`) currently has **no clause** letting a vendor republish couple/guest media on the vendor's own site. §3.10 (logo masking) and the §6.2 "marketing samples with separate written opt-in" only cover Setnayan's internal-account case studies. A new controller-to-controller clause is required.

## 2. RA 10173 Compliance Checklist — what the new consent flow MUST meet

**A. Consent quality (§ 3(b), § 12(a), § 13(a))**
- [ ] **Informed** — names the *specific vendor* (not "vendors" generically), the *destination* (that vendor's commercial site + any of its social channels), and that this is **marketing/promotional** use.
- [ ] **Specific & granular** — separate opt-in for (i) event details/couple names/story vs. (ii) **guest photos**; the two must be independently grantable/deniable. Never a single bundled checkbox.
- [ ] **Freely given** — must NOT be a precondition of booking or of using any paid SKU (no service withheld for declining). Default **OFF**. Not buried in the Vendor Agreement the couple never signs.
- [ ] **Evidenced** — timestamped consent row per (event, vendor, artifact/scope), mirroring `*_consent_at` and `marketing_share_consents` patterns; retained as proof-of-consent.
- [ ] **Explicit (§13)** for any guest-photo path, because the Papic source gallery is **face-tagged (biometric-linked)** → treated as sensitive PI per R-13/R-01. Implicit/bundled consent is insufficient.

**B. Purpose limitation & transparency (§ 11, § 12, § 16(a))**
- [ ] Declares a **new purpose** = third-party vendor marketing, distinct from the primary event-delivery purpose. This is an *incompatible secondary purpose* — cannot ride on the original event contract basis.
- [ ] Add a new **ROPA row** (continue the R-## sequence; this is the natural **R-14**) and a **DPIA** (HIGH inherent risk: third-party likeness + biometric linkage + data leaving Setnayan's envelope).
- [ ] Update the public `/privacy` notice AND the guest-facing RSVP notice to disclose that couple-approved media may be republished by a named vendor as an independent controller.

**C. Guest data-subject rights (§ 16)** — the hard part, see §3.

**D. Minors (§ 3(l), guardian consent)**
- [ ] Any photo containing an identifiable **minor guest** cannot be republished for marketing on guardian-absent couple approval. Either exclude minors from vendor-showcase-eligible frames, or require guardian consent — parallels the standing dependents/`signature_details` minors gate.

**E. Retention & withdrawal (§ 11(e), § 16(e))**
- [ ] Withdrawal mechanism that reaches the vendor's copy — a couple/guest revocation must trigger a **contractual takedown obligation on the vendor** (Setnayan's own 24-hr SLA can't reach the vendor's server). Define the SLA in the vendor clause.
- [ ] Retention limit on the vendor's marketing use (e.g. tied to vendor's active listing / a fixed term), not indefinite.

**F. Security controls carried to the outbound copy (§ 20)**
- [ ] **Geo/EXIF stripped** on anything handed to the vendor — reuse the existing outbound-share strip (`apps/web/lib/papic-gallery.ts:223-229`, `guest-live-gallery.ts:107-108`); never hand over the geo-bearing R2 original.
- [ ] **NSFW always-on** pre-filter (`apps/web/lib/nsfw-screen.ts`, `moderation_state`) — non-disableable, per corpus hard constraint.
- [ ] Only **couple-approved + guest-consented** frames leave (double-gate above); private-by-default; couple's 7-day review window respected before any eligibility.
- [ ] Activation gated on `/admin/data-privacy` (new control key, fail-closed) — do not re-introduce env-flag gating.

## 3. The GUEST-consent risk (the crux) + mitigation options

**The risk, stated precisely:** The couple is **not the controller of the guests' personal data** and cannot consent on guests' behalf. **Couple approval alone is NOT a lawful basis** to give a *guest's* likeness to a vendor for *commercial marketing*. Two aggravating factors: (1) the Papic gallery is **face-tagged → biometric-linked SPI**, so guest images need **explicit** consent (R-01/R-13 finding); (2) once republished on the vendor's own site, the guest loses Setnayan's technical protections and revocation can't propagate automatically. Guest RSVP `photo_consent` today is scoped to *event/paparazzi capture and delivery* — it is **not** consent to a **third-party vendor's marketing** (a new controller + new purpose).

**Mitigation options (ranked):**
1. **Best — direct guest consent gate (mirror R-13 double-gate + add vendor-marketing scope).** Only frames where the **guest** has explicitly opted into *vendor-marketing republishing* (a new, separate flag beyond `consent_to_public`) **AND** the couple approved are eligible. Zero eligible → vendor gets nothing. This is the only option that cleanly supplies the §13 basis for guest images.
2. **Good — couple/event data only; NO guest faces.** Vendor may republish couple names/story/event details and **only couple-featuring or de-identified** frames; identifiable guests excluded (face-detection already exists to gate this). Sidesteps the guest-consent problem entirely for V1.
3. **Acceptable fallback — face-blur non-consenting guests.** Reuse `apps/web/lib/face-blur.ts`; only guests who explicitly opted into vendor-marketing appear un-blurred. Higher engineering + residual re-identification risk.
4. **Reject — "couple approval is enough."** Do not ship this. It is the exact position both the vendor-Papic council and the R-13 addendum flagged as the unresolved counsel gate.

## 4. Controller / Processor recommendation

**Recommendation: the vendor is an INDEPENDENT third-party CONTROLLER for the republished copy — NOT a processor.** Once the vendor republishes on its own commercial site for its **own** marketing purpose and determines the means/purpose of that use, it is by definition a separate PIC under RA 10173. Setnayan is **not** in a controller→processor relationship here (a processor acts only on the controller's instructions and doesn't use the data for its own ends).

Consequences to build/document:
- **Setnayan → vendor is a controller-to-controller disclosure/transfer**, not an outsourcing. Setnayan's role is the *transferring controller* that must have a valid basis to disclose and must bind the recipient.
- **The vendor needs its own lawful basis and its own notice** on its site (its own privacy notice covering the republished images). Setnayan cannot supply the vendor's basis for it.
- **Bind the vendor by contract** — a new Vendor Agreement clause (controller-to-controller / data-sharing terms): permitted purpose (its own marketing only), no onward transfer, geo/EXIF-stripped inputs only, honor withdrawal within a defined takedown SLA, delete on couple/guest revocation or listing termination, indemnify Setnayan for its own misuse. Contrast with the vendor-verification subprocessors (Persona etc.) which *are* processors — the framing is deliberately different.
- **Do NOT frame Setnayan's existing controls as covering the vendor's copy.** Geo-strip/NSFW/private-by-default/24-hr takedown protect the *Setnayan-held* copy and the *outbound artifact at hand-off*; they do not govern what the vendor does afterward. That's precisely why the contractual controller obligations are load-bearing.

How the app posture factors in (all *reduce* risk but none *cures the basis*): geo/EXIF strip + always-on NSFW + private-by-default + couple 7-day review window + face-tag double-gate = strong proportionality/minimization controls that lower **residual** risk (MED→LOW, per R-13's own trajectory) — but per the R-13/R-01 finding they are **scope controls, not the lawful basis**; explicit guest consent still supplies the basis.

## 5. Exact counsel / DPO sign-off items to list for the owner

Frame these the way the existing packets do (`Counsel_Review_Packet_NPC_Privacy_2026-07-13.md` §3; addendum §3):

1. **(Counsel) Guest-consent basis.** Is **explicit guest opt-in** required before any guest likeness (face-tagged, SPI-adjacent) is republished by a vendor for marketing, or can a couple-approval-only path ever be lawful? Confirm this resolves *alongside* the R-01 Face-Vector DPIA and R-13.
2. **(Counsel) Controller/processor characterization.** Confirm the vendor is an **independent controller** for the republished copy and that a **controller-to-controller data-sharing clause** (not a DPA/processor addendum) is the correct instrument; approve the disclosure basis for Setnayan handing the data over.
3. **(Counsel) Minors.** Rule on republishing photos containing identifiable minor guests — guardian consent vs. mandatory exclusion.
4. **(Counsel) Withdrawal reach + retention.** Confirm the contractual takedown SLA + retention cap on the vendor is adequate to satisfy §16(e) erasure once data has left Setnayan's control.
5. **(Counsel) NPC filing impact.** Confirm this adds a **new HIGH-risk processing activity + DPIA** to the mid-flight filing and whether it must be declared before lodging (it widens the open filing, exactly as the vendor-Papic exposure did).
6. **(DPO / owner) Data Privacy control + notice.** New `data_privacy_controls` key (fail-closed, default inactive); add the ROPA row (R-14) + DPIA; update `/privacy` and the RSVP guest notice; confirm the scope decision (guest faces in vs. out — §3 option 1 vs 2). Keep flag-OFF until counsel signs, same as `vendor_papic_capture`.
7. **(Owner) Vendor Agreement amendment** — draft and lock the new controller-to-controller clause (parallels §6.2 marketing-samples-opt-in but for third-party republishing).

## 6. Retired / rejected nearby ideas — do NOT re-propose

- **0039 Display Ads (Google AdSense) — RETIRED 2026-05-19** (CLAUDE.md decision log; `DECISION_LOG.md:181`). Third-party ad monetization on public pages was killed (yield two orders of magnitude below Boosted Ads; brand cost). Don't attach ad monetization to guest-facing/showcase surfaces.
- **Vendor Papic free-capture "portfolio pool"** — council **CUT** as a designed feature (economics cannibalization of the ₱2,999 PAPIC_SEATS ladder + the controller/consent gap); reopened only by explicit owner override and still counsel-gated. Don't design a vendor-showcase pipeline that quietly re-creates the cut portfolio-pool product.
- **Vendor attribution "shoppable card"** (addendum §3(d)) — locked to render only when a **real collab/booking exists**, else plain text, to avoid **unconsented endorsement**. Any vendor-showcase crediting must respect this (no implied endorsement of a vendor by the couple without a real relationship).
- **Cross-event vendor recall / degree recommendation** — separate counsel-first gates (`cross_event_vendor_recall`, R-02); don't let a showcase flow become a backdoor to cross-person/cross-event linkage.
- **"Event-scoping is enough"** — explicitly rejected reasoning in both R-13 and the vendor-Papic gate. Scoping ≠ basis.

## Key file paths

Corpus (`/Users/icecasasola/Documents/Claude/Projects/Setnayan/`):
- `NPC_Privacy_Compliance_Dossier_2026-07-12.md` (v2.0 — ROPA §3, SPI §5, subprocessors §7, open items §11)
- `NPC_Creator_Economy_Processing_Addendum_2026-07-17.md` (**R-13 showcased guest media — the closest legal analysis**, §1 + §3(a))
- `Vendor_On_The_Day_App_Council_Verdict_2026-07-16.md` (**vendor-as-third-party-controller precedent** §5, §8 owner overrides)
- `Counsel_Review_Packet_NPC_Privacy_2026-07-13.md` (sign-off-item format)
- `Privacy_Reconciliation_Home_and_Data_Flows_2026-07-13.md` + memory `project_setnayan_privacy_reconciliation.md`
- `01_Contracts/Setnayan_Vendor_Agreement.md` (§3.10, §6.2 — no republishing clause exists today)
- `DECISION_LOG.md:181` (0039 AdSense retirement)
- DPO designation: proprietor **Indalecio S. Casasola II**, `dpo@setnayan.com`, 15-business-day SLA (memory `dpo-designation-owner`)

Code (`/Users/icecasasola/setnayan-wt-papic-onday/apps/web/`):
- `lib/data-privacy-controls.ts:43-50` (control catalog + `vendor_papic_capture` riskNote — the exact framing; fail-closed gate)
- `lib/papic-gallery.ts:223-261` (the enforced double-gate + geo-strip pattern to inherit)
- `lib/nsfw-screen.ts` (always-on NSFW), `lib/face-blur.ts` (blur option for non-consenting guests)
- `app/dashboard/[eventId]/_actions/share-consent.ts` + `lib/social-sharing.ts` (`marketing_share_consents` — the revocable, per-artifact consent primitive; Setnayan-host-only, needs extension for vendor scope)


====================
Investigation complete. Findings below.

---

# Consented photo-source map for the vendor "feature my wedding" rich layer

Repo: `/Users/icecasasola/setnayan-wt-papic-onday` (branch `claude/vendor-past-events-gallery`). Read-only; nothing written.

## 1. The exact double-gate expressions

### `fetchTeaserFrames` — the public consent read (`apps/web/lib/papic-gallery.ts:238-296`)

Two different gates, one per table:

**SEAT captures (`papic_photos`) — moderation gate ONLY, no per-subject consent flag:**
```
.from('papic_photos')
.select('photo_id, display_r2_key, thumb_r2_key, captured_at, moderation_state, hidden_at')
.eq('event_id', eventId)
.eq('photo_type', 'photo')
.is('hidden_at', null)
.not('moderation_state', 'in', '("nsfw_blocked","consent_withheld","faceblock_withheld")')
```

**GUEST captures (`papic_guest_captures`) — the double consent gate:**
```
.from('papic_guest_captures')
.select('capture_id, display_r2_key, thumb_r2_key, captured_at')
.eq('event_id', eventId)
.eq('media_type', 'photo')
.eq('consent_to_public', true)              // guest opted in
.eq('couple_approved_for_showcase', true)   // couple picked it
.is('hidden_at', null)
```

The couple-RECAP path (`apps/web/app/[slug]/_components/editorial/data.ts:958-1019`) uses the **identical** guest-capture double gate (`consent_to_public=true AND couple_approved_for_showcase=true AND hidden_at IS NULL`), and the same seat-photo moderation-only filter (lines 855-880). The teaser deliberately mirrors the recap ("EXACTLY", per the docstring at lines 213-236).

### CRITICAL finding: do PHOTOS carry a public-consent flag?

**No — not usably.** The consent columns physically exist on both tables, but they have **no writer for photo rows**:

- `couple_approved_for_showcase` has exactly **two** producers in the whole app (`apps/web/app/dashboard/[eventId]/studio/papic/actions.ts`):
  - `setClipShowcaseApproval` (line 359) → `papic_photos` **`.eq('photo_type','clip')`** (line 362)
  - `setGuestClipShowcaseApproval` (line 414) → `papic_guest_captures` **`.eq('media_type','clip')`** (line 417)
  - Both are **clip-only**. No path ever sets `couple_approved_for_showcase = true` on a PHOTO row.
- `papic_photos.consent_to_public` — the `alaala_clip_consent` migration comment states seat `consent_to_public` "is the appearing-guest's consent, **a separate follow-up**"; the `guest_capture_public_consent` migration reconfirms "Paparazzi-seat clips… need a different consent model and stay out of scope." The `fetchPapicGallery` reader sets `showcaseConsent`/`showcaseApproved` `isClip ? … : undefined` and comments "**Photos never carry a showcase gate**" (lines 36-37, 149-151).
- `papic_guest_captures.consent_to_public` **is** wired for photos: set at capture time by the `papic_record_guest_capture` RPC opt-in (`guest_capture_public_consent` migration), default FALSE.

**Consequence:** the GUEST-photo branch of `fetchTeaserFrames`/recap requires `couple_approved_for_showcase = true`, but no producer ever sets that on a guest **photo** → that branch **returns zero rows in practice today** (fail-closed). The teaser/recap guest imagery you actually see is **clips only** (the Alaala orb path), plus **seat photos** which pass on moderation alone.

## 2. Geo-strip / display derivatives

`apps/web/lib/papic-derivatives.ts`:
- `r2_object_key` = full-res **original, geo-bearing** (EXIF/GPS intact on R2 by design; CLAUDE.md "original on R2 retains it").
- `display_r2_key` (1280px AVIF) / `thumb_r2_key` (320px AVIF) = derived server-side via `toAvif()`, which calls `sharp(...).rotate().resize().avif()` — sharp **drops all metadata by default** (no `withMetadata()`), so derivatives are **geo-stripped** (lines 83-99, 101-122). `stripPhotoMetadata()` is the outbound full-res fallback.

Every public surface resolves **only** the stripped derivative and **never falls through to the original**:
- `fetchTeaserFrames`: `ref = display_r2_key ?? thumb_r2_key ?? null` — **null ref drops the frame** (lines 276, 285). The docstring: "A frame with no such derivative is SKIPPED (no fall-through to the original), so the teaser can only ever ship geo-free bytes."
- Precedent: the couple-RECAP editorial + the creator teaser (`lib/creator-teaser.ts:88-93`) both follow this. The governing note is **DECISION_LOG 2026-07-17 "Creator teaser … guest showcase-consent, geo-strip"** and CLAUDE.md "geo is stripped on outbound shares."
- ⚠️ Note the recap's OTHER reads (gallery/timeline/hero in `data.ts`) presign `r2_object_key` directly (e.g. lines 857, 1072, 1120) — those are the geo-bearing originals. Only `fetchTeaserFrames` is strictly derivative-only. **A vendor-hosted surface must use the derivative-only pattern, not the recap gallery pattern.**

## 3. `vendor_papic_captures` (counsel-gated, flag OFF)

Migration `supabase/migrations/20270811377742_vendor_papic_capture_counsel_gated.sql` — **⚠️ committed but NOT pushed to prod** ("DO NOT `supabase db push` until the DPO/NPC ruling"). App surface gated by `isVendorPapicCaptureEnabled()` (`vendor_papic_capture` admin control, default OFF); route `apps/web/app/api/vendor/papic-capture/route.ts:47-49` 403s when off.

Consent columns on `public.vendor_papic_captures`:
- `consent_basis TEXT NOT NULL DEFAULT 'pending_dpo_ruling'` CHECK in `('pending_dpo_ruling','event_consent','guest_optin')`. The capture route inserts `consent_basis: 'event_consent'` (route line 195) — but that is an **asserted** basis, not a per-guest opt-in artifact.
- `nsfw_checked BOOLEAN NOT NULL DEFAULT FALSE` — set TRUE in a background `after()` pass (route lines 195-227); a capture "only surfaces once nsfw_checked=TRUE."
- Geo **intentionally not stored** (schema comment). `hidden_at` for takedowns. RLS: vendor reads/writes own captures on booked events only.

Viability: this is the **only vendor-OWNED** photo lane, and its schema was purpose-built for exactly this ("vendor's own capture lane"). But it is **not a viable source until counsel clears it** — the migration itself flags that a vendor collecting guest PI makes the vendor a third-party controller, widening the live NPC filing. `consent_basis='event_consent'` is a placeholder assertion; there is **no per-guest consent snapshot actually captured** (the `guest_consent_snapshot` mentioned in the header comment is not a column in the shipped schema — only `consent_basis` is).

## 4. Couple editorial hero (`events.landing_page_hero_image_url`)

- Writer: `apps/web/app/dashboard/[eventId]/website/hero-photo/actions.ts:90-97` — a **couple/host** uploads it (host-membership gated), stamps `landing_page_hero_image_uploaded_at` + `_by_user_id`. It is the couple's deliberately-chosen public landing-page cover.
- Consent posture: it is **already couple-published to their own public page** (`/[slug]`, `/u/[userSlug]`, OG cards). Strongest COUPLE consent of any source (explicit, self-chosen, host-authored).
- ⚠️ Two gaps for vendor reuse: (a) it carries **no guest consent** — if it depicts guests, only the couple approved it; (b) it is stored/served as `landing_page_hero_image_url` presigned **directly** (e.g. `app/[slug]/page.tsx:511`), i.e. the **raw uploaded ref** — no guaranteed geo-strip derivative exists for it. A vendor surface would need to run it through `stripPhotoMetadata`/derivative resolution, not presign it raw. It also respects `landing_page_visibility` (the new vendor SAFE layer already excludes `'private'`).

## 5. The creator-teaser / recap consented-frame precedent

`apps/web/lib/creator-teaser.ts` (`buildChapterTeaserPlan`) is the reference implementation of "source only cleared frames": it calls `fetchTeaserFrames` under the **caller's RLS-bound client** (so a creator can only pull from galleries they can access), takes back only frames already filtered to the recap public gates and already geo-stripped, and degrades to `canRender:false` on zero frames — **never falls back to unapproved/geo-bearing media** (lines 57-125). This is the pattern any vendor-hosted display should copy verbatim.

---

## Per-source table

| Source | Exact gate that a public read applies today | Safe to host on vendor page? | Why |
|---|---|---|---|
| **`papic_photos` (seat) PHOTOS** | `hidden_at IS NULL` + `moderation_state NOT IN (nsfw_blocked, consent_withheld, faceblock_withheld)` — **no per-subject opt-in** | ⚠️ **Partial / opt-OUT only** | Moderation-screened, but consent model is opt-OUT (guest RSVP opt-out / faceblock verdict), not opt-in. `consent_to_public` exists but has no photo writer. NOT guest-affirmative-consented. |
| **`papic_photos` (seat) CLIPS** | `consent_to_public=true AND couple_approved_for_showcase=true AND photo_type='clip' AND hidden_at IS NULL` | ⚠️ consent producer weak | Couple-approval producer exists (actions.ts:359); but seat-clip `consent_to_public` has no clean producer (photographer shot it, not the appearing guest) — migration calls appearing-guest consent "a separate follow-up." |
| **`papic_guest_captures` PHOTOS** | `consent_to_public=true AND couple_approved_for_showcase=true AND media_type='photo' AND hidden_at IS NULL` | ✅ **posture is correct** but ⚠️ **unsatisfiable today** | Double gate is the right RA 10173 shape (guest opt-in + couple pick). `consent_to_public` IS wired (capture-time opt-in). BUT **no producer sets `couple_approved_for_showcase` on guest PHOTOS** (toggle is clip-only) → returns 0 rows until that writer is added. |
| **`papic_guest_captures` CLIPS** | same double gate, `media_type='clip'` | ✅ Best-consented, but clips not photos | Fully wired both gates (guest self-records + opts in; couple approves via actions.ts:414). Cleanest consent chain, but these are 5s clips, not stills. |
| **`vendor_papic_captures`** | `nsfw_checked=true AND hidden_at IS NULL` + `consent_basis` (default `pending_dpo_ruling`) | ⛔ **Not until counsel** | Vendor-OWNED lane, purpose-built, geo-free by schema. But migration unpushed, flag OFF, and `consent_basis='event_consent'` is an asserted placeholder with no per-guest consent snapshot. DPO/NPC controller ruling governs go-live. |
| **`events.landing_page_hero_image_url`** | host-uploaded; served if event not `private` | ✅ **for couple consent**; ⚠️ guest + geo | Couple explicitly chose + already published it publicly. No guest consent if it depicts guests; served as raw ref (needs geo-strip before vendor reuse). |

## Recommended source(s) for vendor-hosted display

1. **Primary: `papic_guest_captures` PHOTOS via the `fetchTeaserFrames` double-gate + derivative-only pattern.** It is the only stills source whose consent shape already satisfies "guest opt-in AND couple approval" and it already yields geo-stripped derivatives. It needs one missing writer (below) to become non-empty.
2. **Secondary (couple-consent-only): `events.landing_page_hero_image_url`**, run through `stripPhotoMetadata`, gated on `landing_page_visibility != 'private'` + a new per-event vendor-feature opt-in. Good for a single "cover" tile where the couple's own consent is sufficient (or where guests aren't identifiable).
3. **Do NOT** use seat `papic_photos` PHOTOS as-is (opt-out only, no affirmative guest consent) or `vendor_papic_captures` (counsel-gated) for a public rich layer without new consent plumbing.

The new SAFE layer this branch just shipped (`apps/web/lib/vendor-venue-events.ts`) explicitly reserves the "couple-identified, photo-bearing rich layer" as a "separate, consent-gated follow-up (a new per-event 'let booked vendors feature my wedding' opt-in + DPO sign-off) … NOT built here" — so the plumbing below is that follow-up.

## New consent / plumbing each source still requires

- **A new event-level, vendor-scoped opt-in is mandatory and does NOT exist.** All current gates authorize display on the **couple's own** surfaces (Alaala orb, recap, creator teaser the couple/creator controls). None authorize a **third-party vendor** to host the couple's/guests' images on the vendor's page. Reusing `couple_approved_for_showcase` for this would be **scope-creep of consent** — that flag means "show on OUR showcase," not "let vendor X feature it." Add a distinct `events.vendor_feature_opt_in` (per-event, default FALSE, RA 10173 explicit opt-in) and ideally per-vendor scoping.
- **`papic_guest_captures` PHOTOS:** add the missing **couple-approval producer for photos** (today `setGuestClipShowcaseApproval` is `media_type='clip'` only). Without it the double gate is永 unsatisfiable for stills. Guest `consent_to_public` is already captured — but confirm the capture-time opt-in copy actually covers **third-party vendor** display, not just "public showcase on the couple's page" (likely needs re-consent).
- **Seat `papic_photos` PHOTOS:** would need a real **affirmative per-guest opt-in producer** (currently opt-out via moderation verdicts only) before they could feed a vendor page — i.e. build the "appearing-guest consent" follow-up the migrations defer.
- **`landing_page_hero_image_url`:** add geo-strip on the vendor read path (it's served raw today) + the vendor-feature opt-in; acceptable on couple-consent alone only where no identifiable guest appears.
- **`vendor_papic_captures`:** requires the DPO/NPC controller-vs-processor ruling, then push migration `20270811377742` + flip `vendor_papic_capture` flag, AND replace the placeholder `consent_basis='event_consent'` with a real captured per-guest consent snapshot before any of it surfaces publicly.
- **Across all sources — reuse, don't reinvent:** copy `buildChapterTeaserPlan`/`fetchTeaserFrames` exactly — caller's RLS-bound client, derivative-only URLs (null-ref → drop), fail-closed to empty. That guarantees geo-free bytes and access scoping for free.

**Bottom line:** the only stills source with a correct consent *shape* is `papic_guest_captures` photos, and even it is (a) currently empty for photos due to a missing couple-approval writer, and (b) still short one new consent artifact — a per-event "let booked vendors feature my wedding" opt-in — because every existing gate authorizes the couple's own surfaces, not third-party vendor hosting. Guest photos need guest consent, not just couple approval, and neither existing flag was authored to mean "vendor may republish."


====================
All confirmed. Here are the findings.

---

# Couple-facing "let booked vendors feature my wedding" — where it lives + what to mirror

## 1. Where couples set privacy/consent today (three precedents, three toggle patterns)

**A. Landing-page visibility + Real Weddings showcase consent** (per-event page, form-based)
- Page: `apps/web/app/dashboard/[eventId]/website/privacy/page.tsx`
- Actions: `apps/web/app/dashboard/[eventId]/website/privacy/actions.ts` — `updateLandingPageVisibility` + `setShowcaseConsent`.
- Pattern: plain `<form action={...}>` with hidden inputs, a host-membership gate (`requireHostMembership` → `event_moderators` accepted-row OR legacy `event_members.member_type='couple'`), then `revalidatePath(...)` + `redirect(?saved=1)`. The page reads `?saved=1` and renders a non-dismissible `role="status"` confirmation. This is the **saved-indicator** pattern (no optimistic UI).
- `setShowcaseConsent` writes the **per-user** flag `users.public_summary_consent_at` via the **admin client** (the `users` self-update path isn't exposed to the auth client) after gating on host membership.

**B. Real Stories opt-in inside the editorial editor** (optimistic client toggle — the one to mirror for a snappy switch)
- Component: `apps/web/app/dashboard/[eventId]/website/editorial/_components/editorial-editor.tsx` (toggle `toggleFeatured`, lines ~453–474; markup ~1092–1140).
- Action: `setStoryShowcase(eventId, optIn)` in `apps/web/app/dashboard/[eventId]/website/editorial/actions.ts` — returns `{ ok: true } | { ok: false; error }`, gated by `hostUserId(eventId)`, writes the same `users.public_summary_consent_at` via admin client, wedding-gated on opt-IN.
- **Optimistic pattern to copy verbatim:**
```ts
const [featured, setFeatured] = useState(showcaseOptedIn);
const toggleFeatured = async () => {
  if (featuring) return;
  const next = !featured;
  setFeatured(next);            // optimistic
  setFeaturing(true);
  try {
    const r = await setStoryShowcase(eventId, next);
    if (!r.ok) throw new Error(r.error);
    toast.success(next ? '…on' : '…off');
  } catch (e) {
    setFeatured(!next);        // rollback
    toast.error(e instanceof Error ? e.message : 'Could not update.');
  } finally { setFeaturing(false); }
};
```
The switch UI is an `aria-pressed` `<button>` with a sliding pill (`bg-burgundy` when on), plus an amber caveat line when `featured && landingVisibility === 'private'`.

**C. Profile → Privacy & data tab (0025)** — the settings home for cross-event data rights
- Page: `apps/web/app/dashboard/(account)/profile/page.tsx`, section `Privacy & data (RA 10173)` (lines ~941–1255). Note: 0025 is anchor-based (`#settings`), not a separate route.
- **Most-relevant precedent — the "Featured on Setnayan's pages" block (lines ~1092–1164):** lists live `marketing_share_consents` rows and offers a per-row **Revoke** form (`revokeShareConsent`). This is the existing "third-party-ish featuring, with per-row withdrawal" surface a new vendor-featuring consent should slot beside.

## 2. RA 10173 wiring a NEW consent must honor

The canonical, already-shipped consent primitive to clone is **`marketing_share_consents`** (migration `supabase/migrations/20261203000000_social_sharing_program.sql`; couple actions in `apps/web/app/dashboard/[eventId]/_actions/share-consent.ts`). A new "booked vendors may feature my wedding" consent must honor **all four** of these, or it will silently violate the platform's RA-10173 guarantees:

1. **Withdrawable via status-flip, never hard-delete.** `revokeShareConsent` sets `revoked_at = now()` on an RLS-scoped UPDATE and leaves the row (audit trail; a post-`posted_at` revoke still fires a take-down). New consent needs a `revoked_at` column + a revoke action, and a live-uniqueness index `WHERE revoked_at IS NULL` (re-grant makes a fresh row).
2. **RLS-scoped to the couple.** Policy `marketing_share_consents_couple`: `USING/WITH CHECK (event_id IN (SELECT public.current_couple_event_ids()))` — no extra ownership probe needed in the action. RLS at `CREATE TABLE` time (per CLAUDE.md lock).
3. **Exportable.** `apps/web/app/api/profile/export/route.ts` bundles the subject's own rows. ⚠️ **Gap to fix: `marketing_share_consents` is currently NOT in the export** (`grep` count = 0). A new vendor-featuring consent MUST be added to the `Promise.all` bundle there (self-scoped read of the couple's own consent rows incl. `consented_at`/`revoked_at` stamps) — do not repeat the omission.
4. **Cascade-safe on account deletion.** Deletion is a hard-delete of `auth.users` → DB cascade (`apps/web/app/admin/account-deletions/actions.ts` → `deleteUser`). `marketing_share_consents` FKs use `ON DELETE CASCADE` on both `event_id` and `customer_id`; the new table must do the same so approval purges it automatically. (Face-data revocation — a separate right — lives at `profile/face-profile-actions.ts` `forgetMyFaceEverywhere`; not needed here, but it's the erasure precedent.)

Table shape to mirror: `event_id`+`customer_id` (both `ON DELETE CASCADE`), `consented_at NOT NULL DEFAULT now()`, `revoked_at`, `created_at/updated_at`, plus whatever grain column (see §3), + couple RLS + admin RLS.

## 3. Granularity — the data supports per-vendor, but per-event is the right default

**The couple CAN see exactly which booked vendors they have.** `event_vendors` (`supabase/migrations/20260519200000_vendor_invites_foundation.sql`) carries **`marketplace_vendor_id UUID → vendor_profiles(vendor_profile_id) ON DELETE SET NULL`** (NULL = off-platform, couple-encoded). So a per-vendor consent is fully expressible: `event_vendors WHERE event_id = X AND marketplace_vendor_id IS NOT NULL`.
- **Surface that lists booked vendors:** `apps/web/app/dashboard/[eventId]/vendors/page.tsx` (reads `event_vendors` → `marketplace_vendor_id`, `vendor_name`, `status`; status enum `considering → shortlisted → contracted → deposit_paid → delivered → complete`).
- Only on-platform vendors (`marketplace_vendor_id != NULL`) even *have* a `/v/[slug]` profile to feature on, so the addressable set is already bounded.

**Recommendation: ship a per-EVENT opt-in ("Let the vendors I booked feature this wedding on their Setnayan profile"), backed by a per-event consent row.** Reasons grounded in the code:
- The rich layer attaches to the **per-event cards already produced by the safe layer** (`buildVendorVenueEvents` in `apps/web/lib/vendor-venue-events.ts`, rendered by `VenueMatchedEvents`). Those cards are keyed on `event_id`; a per-event consent lookup drops in with zero new join logic.
- The "which vendor" is already answered server-side: the vendor page only ever shows events from `vendor_completed_events` (receipts-backed, self-review/team/comp-excluded). So "all booked vendors" is really "the pros who actually delivered my event through Setnayan" — a bounded, trustworthy set, not "anyone."
- Couple mental model + friction: one "feature my wedding" decision vs. N per-vendor toggles. Matches the grain of the two existing per-event levers (`landing_page_visibility`, showcase consent).

**Keep per-vendor as a progressive enhancement, not v1.** Because `event_vendors.marketplace_vendor_id` gives the exact list, a later "hide from this one vendor" override (an extra `vendor_profile_id`-scoped revoke row) is cheap to add without reshaping the table — store the consent as `(event_id, [vendor_profile_id NULL = all booked], revoked_at)` so per-vendor withdrawal is a future insert, not a migration.

## 4. How `/v/[slug]/page.tsx` gets the viewer event + threads `venueEvents` (where the rich layer plugs in)

- **Viewer's event (`coupleEventId`)** — `apps/web/app/v/[slug]/page.tsx` lines ~1060–1093: `supabase.auth.getUser()` → `fetchUserEvents(supabase, user.id, 'couple')` → `coupleEventId = events[0]?.event_id` (+ `coupleEventDate`). It's the viewer's *first* couple event, resolved only when signed in.
- **Safe-layer threading** — lines ~1101–1105:
  ```ts
  const viewerVenue  = coupleEventId ? await fetchViewerVenue(admin, coupleEventId) : null;
  const venueEvents  = await buildVendorVenueEvents(admin, completedEvents, viewerVenue, { limit: 12 });
  const venueMatchCount = venueEvents.filter((e) => e.atViewerVenue).length;
  ```
  `completedEvents` comes from `fetchVendorCompletedEvents` (view `vendor_completed_events`, type `VendorCompletedEventRow` in `apps/web/lib/reviews.ts`). `buildVendorVenueEvents` enriches with venue facts and **already drops `landing_page_visibility === 'private'` events** (`apps/web/lib/vendor-venue-events.ts` line ~161).
- **Passed into `ReviewsSection`** (call site ~2134–2153): props `venueEvents={venueEvents} hasVenueMatch={venueMatchCount > 0}`. Inside `ReviewsSection` (def ~2772) it renders `<VenueMatchedEvents events={venueEvents} hasMatch={hasVenueMatch} />` (`apps/web/app/v/[slug]/_components/venue-matched-events.tsx`) — currently venue name · month/year · event type · "Your venue" chip, **no photos**.

**Where the rich layer adds per-card photos:**
1. Extend `VendorVenueEvent` (`vendor-venue-events.ts`) with e.g. `photoUrls: string[]` and `coupleConsented: boolean`.
2. In `buildVendorVenueEvents`, for events whose couple gave the new consent **AND** where this vendor is a booked vendor of that event, load a small set of couple/gallery photos (resolve via `displayUrlsForStoredAssets`, mirroring `api/profile/export/route.ts`). The vendor↔event booking link to assert is `event_vendors.marketplace_vendor_id = vendor.vendor_profile_id` (the same vendor whose page is being viewed) — combined with the existing receipts-backed `completedEvents` gate, that's belt-and-suspenders proof the vendor actually worked the event.
3. `VenueMatchedEvents` conditionally renders the thumbnails when `photoUrls.length > 0`.

Note the docstring in `vendor-venue-events.ts` (lines 8–11) already scopes this exact follow-up: *"the couple-identified, photo-bearing 'rich layer' is a separate, consent-gated follow-up (a new per-event 'let booked vendors feature my wedding' opt-in + DPO sign-off) and is NOT built here."* — i.e., this consent is the documented, owner-anticipated unlock for the rich layer.

---

### File index (all absolute, worktree `/Users/icecasasola/setnayan-wt-papic-onday`)
- Per-event consent page + actions: `apps/web/app/dashboard/[eventId]/website/privacy/page.tsx`, `.../privacy/actions.ts`
- Optimistic toggle to mirror: `apps/web/app/dashboard/[eventId]/website/editorial/_components/editorial-editor.tsx`; action `.../editorial/actions.ts` (`setStoryShowcase`)
- Settings Privacy & data tab: `apps/web/app/dashboard/(account)/profile/page.tsx`
- Data export (must add new consent): `apps/web/app/api/profile/export/route.ts`
- Account deletion (cascade path): `apps/web/app/admin/account-deletions/actions.ts`
- Closest consent precedent (mirror this): `apps/web/app/dashboard/[eventId]/_actions/share-consent.ts`, `apps/web/lib/social-sharing.ts`, migration `supabase/migrations/20261203000000_social_sharing_program.sql`
- Booked-vendor data: `event_vendors.marketplace_vendor_id` (migration `supabase/migrations/20260519200000_vendor_invites_foundation.sql`); couple surface `apps/web/app/dashboard/[eventId]/vendors/page.tsx`
- Rich-layer insertion points: `apps/web/app/v/[slug]/page.tsx` (~1060–1105, 2134–2153, 2772+), `apps/web/lib/vendor-venue-events.ts`, `apps/web/lib/reviews.ts` (`fetchVendorCompletedEvents`/`VendorCompletedEventRow`), `apps/web/app/v/[slug]/_components/venue-matched-events.tsx`


====================
I have everything needed. Here are the findings.

---

# Rich-layer consent primitive — codebase map

Repo: `/Users/icecasasola/setnayan-wt-papic-onday`. All paths below are relative to it.

## 1. The existing showcase/publish consent chain

### 1a. The consent column — per-USER, blanket, Setnayan-owned showcase only

`users.public_summary_consent_at TIMESTAMPTZ NULL` — shipped in `supabase/migrations/20260519000000_phase_a_event_editorial_consent.sql:24`. It is a **per-user** flag (the migration comment explicitly says "only customers/couples write to it"; vendors never use it). NULL = no consent; a non-NULL timestamp = consent receipt.

This is **not vendor-scoped** — it is a single blanket opt-in for the Setnayan-owned `/realstories` index. That is the key gap the rich layer must fill: the rich layer needs consent scoped to *a specific booked vendor's commercial profile*, which this column cannot express.

### 1b. The full eligibility expression (`lib/showcase-db.ts`)

`loadPublishedShowcases()` (`apps/web/lib/showcase-db.ts:118-403`) is a 3-query chain, all via the **admin/service-role client** (`createAdminClient()`, line 121) because `/realstories` is anonymous and the rows sit behind RLS:

- **Consent gate** (`showcase-db.ts:131-136`): `users` where `public_summary_consent_at IS NOT NULL` AND `deleted_at IS NULL` → `userIds`.
- **Roster** (`:144-152`): `event_members` where `member_type = 'couple'` AND `user_id IN userIds` → `eventIds`.
- **Event gate** (`:191-206`, the consented branch):
  - `event_type = 'wedding'`
  - `landing_page_visibility <> 'private'` (`.neq(...,'private')`, `:199` — private-by-default defense-in-depth, owner 2026-06-20)
  - `event_id IN eventIds`
  - `event_date <= cutoff` where `cutoff = today − 30 days` (`GRACE_DAYS = 30`, `:92`, `:126-128`)
  - `slug IS NOT NULL`
  - ordered `showcase_feature_rank ASC NULLS LAST` → `showcase_featured_at DESC NULLS LAST` → `event_date DESC`.
- **Sample branch** (`:232-260`): `is_sample = true` events bypass G4 grace + G5 consent entirely (a sample represents no real person), same visibility/slug/order gates.
- Pre-migration fallback (`:208-222`): if `showcase_featured_at`/`showcase_feature_rank` don't exist yet (42703), it re-runs without those columns.

Vendor credit chips (`:288-372`) join `event_vendors.linked_vendor_profile_id` → `vendor_profiles`, capped at 4/card, hybrid-anonymity-safe.

### 1c. The vendor-facing variant (`lib/realstories-vendor.ts`)

`loadVendorFeaturedStories(bookedEventIds)` (`apps/web/lib/realstories-vendor.ts:64-132`) applies the **same** gate but scoped to the vendor's own booked event ids (passed in by the caller):
- events: `event_id IN bookedEventIds` AND `event_type='wedding'` AND `slug IS NOT NULL` AND `event_date <= cutoff` (`:83-89`)
- roster: `event_members` `member_type='couple'` for those events (`:95-99`)
- consent: `users` `public_summary_consent_at IS NOT NULL` AND `deleted_at IS NULL` (`:104-109`)
- returns only events whose couple member consented (`:117-118`).

Note it does **not** check `landing_page_visibility <> 'private'` (a minor asymmetry vs `showcase-db.ts`). Also reads via admin client (`:70`).

### 1d. Where `public_summary_consent_at` is SET / revoked

Fully revocable (it's set to `null` on opt-out). Write sites:
- **Signup** (`apps/web/app/signup/actions.ts:137`, `:293`): stamped `new Date().toISOString()` when the consent checkbox is ticked at account creation.
- **Privacy dashboard** — `setShowcaseConsent()` (`apps/web/app/dashboard/[eventId]/website/privacy/actions.ts:148-174`): `public_summary_consent_at: optIn ? new Date().toISOString() : null` (`:164`). Gated by `requireHostMembership(eventId)` (`:158`), then writes the caller's OWN `users` row via admin client. **Revocation = passing `opt_in != '1'` → NULL**, which immediately drops the couple from the showcase.
- **Editorial dashboard** — mirror write at `apps/web/app/dashboard/[eventId]/website/editorial/actions.ts:381`.
- Read-back for the toggle UI: `privacy/page.tsx:97-100`, `editorial/page.tsx:67-70`.

### 1e. The `events` showcase/landing columns

| Column | Type | Migration |
|---|---|---|
| `slug` | `TEXT` | `20260513050000_iteration_0002_invitation.sql:24` |
| `landing_page_visibility` | `TEXT NOT NULL DEFAULT 'public' CHECK (IN 'public','unlisted','private')` | `20260605050000_events_landing_page_visibility.sql:34-35` |
| `showcase_featured_at` | `TIMESTAMPTZ NULL` | `20261221000000_realstories_featuring.sql:40` |
| `showcase_feature_rank` | `INTEGER NULL` | `20261221000000_realstories_featuring.sql:41` |
| `is_sample` | `BOOLEAN NOT NULL DEFAULT FALSE` | `20270203791173_sample_event_and_demo_service_flags.sql:31` |
| `landing_page_hero_image_url` | `TEXT` | `20260605020000_events_landing_page_hero_image.sql:25` |

`showcase_featured_at`/`showcase_feature_rank` are **admin-curation** columns (which consented weddings get pinned on `/realstories`), written from `/admin/real-stories` — not couple consent.

---

## 2. The vendor↔event join: "which vendor may feature THIS event"

### 2a. Two FK columns on `event_vendors` (both → `vendor_profiles`) — do not confuse them

- **`marketplace_vendor_id UUID` → `vendor_profiles(vendor_profile_id) ON DELETE SET NULL`** — `20260519200000_vendor_invites_foundation.sql:37-39`. Comment (`:45-50`): "populated atomically when an invite is claimed or a Connect happens." This is the **booking link**.
- **`linked_vendor_profile_id UUID` → `vendor_profiles(vendor_profile_id) ON DELETE SET NULL`** — `20260515020000_public_stats_exclusion.sql:61-63`. This is the **marketplace-attribution link** used by the completed-events view, style-twin credits, and editorial "Team Behind the Day."

They are meant to agree; the sample seed backfills one from the other: `SET linked_vendor_profile_id = ev.marketplace_vendor_id` (`20270331300000_realstory_sample_maria_jose_seed.sql:64-71`). Attribution/showcase code reads `linked_vendor_profile_id`; the RLS booked-helper reads `marketplace_vendor_id` (see §3b). **A new consent primitive should treat the (event, vendor_profile) identity via `linked_vendor_profile_id`, matching the attribution surfaces it will elevate.**

### 2b. The booked-status enum

`public.vendor_status` ENUM = `'considering','shortlisted','contracted','deposit_paid','delivered','complete'` (`20260513100000_iteration_0006_vendors.sql:65-74`). `event_vendors.status` defaults `'considering'` (`:88`).

- The completed-events VIEW counts only `status IN ('delivered','complete')` (see 2c).
- `current_vendor_booked_event_ids()` treats "booked" as `status IN ('contracted','deposit_paid','delivered','complete')` (`20261130003000_shared_timeline_suggestions.sql:25`).

### 2c. How the safe layer attributes an event to a vendor — the `vendor_completed_events` VIEW

`fetchVendorCompletedEvents()` (`apps/web/lib/reviews.ts:580-594`) selects from the `public.vendor_completed_events` VIEW, filtered `.eq('vendor_profile_id', …)`, ordered `completed_at DESC NULLS LAST`. Type `VendorCompletedEventRow` (`reviews.ts:562-569`): `vendor_profile_id, vendor_id, event_id, event_type, event_date, completed_at`.

The VIEW is defined in `supabase/migrations/20270321252758_receipt_backed_reviews.sql:159-238`:
- `WITH (security_invoker = false)` + `GRANT SELECT … TO anon, authenticated` (`:161`, `:238`) — anon-readable despite RLS on base tables.
- JOIN `event_vendors ev ON ev.linked_vendor_profile_id = vp.vendor_profile_id AND ev.status IN ('delivered','complete')` (`:173-175`).
- JOIN `events e … AND e.archived = FALSE` (`:176-178`).
- `completed_at = COALESCE(ev.updated_at, e.event_date::timestamptz)` (`:171`).
- **Four anti-fraud `NOT EXISTS` exclusions** (`:179-226`): (1) vendor owner on the event's couple roster; (2) any vendor team member on the roster; (3) any internal account that owns/sits on the vendor team on the roster; (4) an active `comp_grants` row with `source='vendor_self_comp'` tied to the booking. This prevents a vendor padding their track record with self-bookings.

---

## 3. Conventions a new consent column/table must follow

### 3a. RLS canonical patterns
The canonical doc is `02_Specifications/RLS_Policy_Pattern.md` in the **spec corpus** (not this repo) — 8 patterns + 4 helper functions, RLS enabled at `CREATE TABLE` time (per CLAUDE.md). In-repo, RLS is enabled inline at table creation (e.g. `event_vendors`: `ALTER TABLE … ENABLE ROW LEVEL SECURITY` immediately after `CREATE TABLE`, `20260513100000_iteration_0006_vendors.sql:106`).

### 3b. Helper functions (SECURITY DEFINER STABLE, `SET search_path = public`)

| Function | Returns | Location | Semantics |
|---|---|---|---|
| `is_admin()` | BOOLEAN | `20260512000000_setnayan_base.sql:164-176` | `users.account_type='admin'` for `auth.uid()` |
| `current_event_ids()` | SETOF UUID | `…base.sql:178-187` | all events the caller is a member of |
| `current_couple_event_ids()` | SETOF UUID | `20260513040000_fix_rls_infinite_recursion.sql:23` | events where caller is `member_type='couple'` |
| `current_vendor_ids(min_role)` | SETOF UUID | full defn `20260514010000_iteration_0022_vendor_dashboard_expansion.sql:166` | vendor orgs where caller holds ≥ role |
| `current_vendor_profile_ids()` | SETOF UUID | `20260821000000_vendor_role_aware_rls.sql:23-35` | owner-direct ∪ `current_vendor_ids('admin')` |
| `current_vendor_booked_event_ids()` | SETOF UUID | `20261130003000_shared_timeline_suggestions.sql:18-31` | events where caller's vendor org holds a `marketplace_vendor_id` booking with `status IN ('contracted','deposit_paid','delivered','complete')` |

`current_vendor_booked_event_ids()` is the **exact primitive** a vendor-side RLS read policy for the new consent should reuse — it already answers "which events did MY vendor org book."

### 3c. S89 public-id convention

`public.generate_public_id(type_letter CHAR(1))` — `20260512000000_setnayan_base.sql:26-40`. Emits `S89<TYPE>-<10-char Crockford base32>` (alphabet `0123456789ABCDEFGHJKMNPQRSTVWXYZ`, no I/L/O/U). Usage pattern: `public_id TEXT UNIQUE NOT NULL DEFAULT public.generate_public_id('X')` alongside a hidden `bigserial`/`uuid` PK (e.g. `event_vendors.public_id … generate_public_id('V')`, `iteration_0006_vendors.sql:82`; `events` uses `'E'`, `users` `'U'`).

### 3d. Migration timestamp/prefix rules (the guard)

`scripts/check-migration-timestamps.mjs` (run by CI, `.githooks/pre-push`, `pnpm migration:check`) enforces two rules:
- **RULE 1 (unique):** no two files share a 14-digit prefix (`duplicatePrefixes`, `:28-38`).
- **RULE 2 (allocated):** a NEW migration (not on `origin/main`) must NOT use a hand-typed `YYYYMMDD000000` round prefix — last 6 digits all-zero is rejected (`isHandTypedRoundPrefix`, `:41-43`). Existing round-prefix files are grandfathered.

**You must create the file via `pnpm migration:new "<name>"`** (`scripts/new-migration.mjs`), which allocates a collision-resistant, non-round, monotonic prefix. Do not hand-type the timestamp.

### 3e. How existing per-event consent columns are shaped (the direct precedent)

The closest analog to what the rich layer needs is `events.bazi_birthdata_consent_at timestamptz` (`20270311811312_events_partner_birth_data.sql:37`). Its shape is the template:
- **Timestamptz, NULL = no consent, non-NULL = fresh-consent receipt** stamped server-side (`now()`) only on explicit opt-in (comment `:47-48`).
- **No new RLS policy** — plain columns on `public.events` inherit the existing `couple_can_update_event` policy (`base.sql:255-263`: `member_type='couple' OR is_admin()`); comment `:22-25` documents this.
- **Dark-ship / flag-gated** (`NEXT_PUBLIC_BAZI_BIRTHDATA_ENABLED`), idempotent `ADD COLUMN IF NOT EXISTS`, "purged on account hard-delete (right to erasure)."

Other consent shapes for reference: `guests.photo_consent BOOLEAN NOT NULL DEFAULT TRUE` (`iteration_0001_guests.sql:118`); `guest_face_enrollments.consent_at TIMESTAMPTZ NOT NULL` + `revoked_at` (biometric, `20260901000000…:40`); Alaala `consent_to_public boolean NOT NULL DEFAULT false` (`20270215602618…:32`, fail-closed).

The host-write server-action convention is `requireHostMembership(eventId)` (e.g. `privacy/actions.ts:26-66`) — accepts an accepted `event_moderators` row OR a legacy `event_members` couple row — then writes via admin client.

---

## 4. How the safe layer reads today (extension point for the rich layer)

Chain in `apps/web/app/v/[slug]/page.tsx`:
1. `fetchVendorCompletedEvents(admin, vendor.vendor_profile_id, { limit: 60 })` → `completedEvents` (`page.tsx:771`).
2. Resolve the viewing couple: `coupleEventId = (await fetchUserEvents(supabase, user.id, 'couple'))[0]?.event_id` (`page.tsx:1074-1075`).
3. `viewerVenue = coupleEventId ? await fetchViewerVenue(admin, coupleEventId) : null` (`page.tsx:1101`).
4. `venueEvents = await buildVendorVenueEvents(admin, completedEvents, viewerVenue, { limit: 12 })` (`page.tsx:1102-1104`); `venueMatchCount = venueEvents.filter(e => e.atViewerVenue).length` (`:1105`).
5. Rendered by `<VenueMatchedEvents events={venueEvents} hasMatch={hasVenueMatch} />` (`page.tsx:2832`; component `apps/web/app/v/[slug]/_components/venue-matched-events.tsx`).

`buildVendorVenueEvents()` (`apps/web/lib/vendor-venue-events.ts:117-181`):
- Takes the anti-fraud-clean `completed` list (no extra round-trip for it).
- Batch-reads `events(event_id, venue_name, venue_setting, landing_page_visibility)` + `event_vendors(event_id, source_venue_directory_id)` (`:127-137`).
- **Drops `landing_page_visibility === 'private'`** (`:161`).
- Emits `VendorVenueEvent` = `{ eventId, eventType, eventDate, completedAt, venueName, venueSetting, venueDirectoryId, atViewerVenue }` (`:27-37`) — **facts only, no couple names/photos**.
- Sorts venue-matched-first then most-recent (`orderVenueMatchedFirst`, `:72-80`), slices to `limit`.

**This is the exact place the rich layer plugs in.** The card is currently facts-only (`venue-matched-events.tsx:38-69` renders venue name + type + month + "Your venue" chip). To elevate a card to photo-rich when consent exists, add a per-event consent lookup inside `buildVendorVenueEvents` (or alongside it), keyed by `(event_id, vendor_profile_id)`, and extend `VendorVenueEvent` with e.g. `coupleNames`, `heroImageUrl`, `galleryPhotos[]`, `featureConsented: boolean`. All reads already go through the admin client, so RLS won't block a server-side consent read on the public page.

---

## 5. Recommended shape for the new consent primitive

A single per-user timestamp cannot express "couple → *this specific booked vendor* may feature our full wedding." The consent is inherently **per (event × vendor_profile)**, revocable, and must carry a scope (does it authorize photos, or just identified details?). Two viable shapes; I recommend the table.

### Recommended: a dedicated join table `event_vendor_feature_consents`

```
CREATE TABLE public.event_vendor_feature_consents (
  id                  BIGSERIAL PRIMARY KEY,
  public_id           TEXT UNIQUE NOT NULL DEFAULT public.generate_public_id('F'),  -- pick an unused type letter
  event_id            UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
  vendor_profile_id   UUID NOT NULL REFERENCES public.vendor_profiles(vendor_profile_id) ON DELETE CASCADE,
  -- scope: how rich a feature the couple authorized (fail-closed default)
  allow_identified    BOOLEAN NOT NULL DEFAULT FALSE,   -- couple names + event detail
  allow_photos        BOOLEAN NOT NULL DEFAULT FALSE,   -- gallery photos on the vendor's commercial page
  consented_at        TIMESTAMPTZ NOT NULL DEFAULT now(),  -- fresh-consent receipt
  consented_by_user_id UUID NOT NULL,                   -- the host who granted it (audit)
  revoked_at          TIMESTAMPTZ,                      -- non-NULL = withdrawn (RA 10173 one-click opt-out)
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, vendor_profile_id)
);
ALTER TABLE public.event_vendor_feature_consents ENABLE ROW LEVEL SECURITY;
```

RLS (reuse existing helpers verbatim — no invented patterns):
- **Host write/manage:** `USING/WITH CHECK (event_id IN (SELECT public.current_couple_event_ids()) OR public.is_admin())` — mirrors `event_vendors_couple_write` and `couple_can_update_event`.
- **Vendor read (own booked + this event):** `FOR SELECT USING (event_id IN (SELECT public.current_vendor_booked_event_ids()) AND vendor_profile_id IN (SELECT public.current_vendor_profile_ids()))` — both helpers already exist (§3b).
- Admin read via `is_admin()`; the public `/v/[slug]` render reads through the service-role client (as the safe layer already does), so no anon grant is required.

Why a table over a column:
- **Per-vendor scope** — one wedding can consent to its photographer but not its caterer; a column on `events` can't express that. A column on `event_vendors` *could*, but `event_vendors` rows are couple-authored booking records with `ON DELETE SET NULL` FKs and moderator-write policies — overloading them with a legal consent receipt muddies audit and erasure. A dedicated table gives a clean receipt (`consented_at`, `consented_by_user_id`, `revoked_at`), a stable `public_id`, and its own RLS surface.
- **Revocation + audit** parity with `guest_face_enrollments` (`consent_at` + `revoked_at`) and the bazi consent receipt — the NPC-filing posture wants an explicit, timestamped, revocable, erasable record.

### Alternative (lighter): two columns on `event_vendors`
`ADD COLUMN feature_consent_at TIMESTAMPTZ`, `ADD COLUMN feature_consent_scope TEXT CHECK (IN 'identified','photos')`. Cheaper, but no vendor-read RLS separation (the vendor can't currently SELECT `event_vendors` at all — there's no vendor-read policy, `20260513100000_iteration_0006_vendors.sql:108-119` + moderator policies only), and it conflates a consent receipt with the couple's private booking ledger. Only choose this if the rich layer will read consent exclusively via the service-role client and never needs a vendor-authenticated read.

### Non-negotiables to honor regardless of shape
- Fail-closed defaults (`FALSE`/NULL), server-stamped `now()` receipt, one-click revoke (set `revoked_at`).
- The read gate must AND-in the existing safe-layer gates already proven in `buildVendorVenueEvents`: `landing_page_visibility <> 'private'` and the `vendor_completed_events` anti-fraud exclusions (only truly-booked, non-self-dealt events are elevatable).
- Create the migration with `pnpm migration:new` (guard RULE 2); `ADD COLUMN/CREATE TABLE IF NOT EXISTS` for idempotency; enable RLS at `CREATE TABLE` time; ensure the rows purge on event/account hard-delete (`ON DELETE CASCADE` handles event deletion; add to the erasure sweep for right-to-erasure).
- Dark-ship behind a flag with DPO/counsel sign-off — the changelog fragment (`changelog.d/vendor-past-events-gallery.md:21-31`) already flags this consent column as owner+DPO-gated, and the repo is mid-NPC-filing.

### Key file:line index
- Consent column: `supabase/migrations/20260519000000_phase_a_event_editorial_consent.sql:24`
- Showcase gate: `apps/web/lib/showcase-db.ts:131-206`
- Vendor showcase gate: `apps/web/lib/realstories-vendor.ts:64-132`
- Consent write/revoke: `apps/web/app/dashboard/[eventId]/website/privacy/actions.ts:148-174`; `apps/web/app/signup/actions.ts:137,293`
- Two FK columns: `20260519200000_vendor_invites_foundation.sql:37-39` (`marketplace_vendor_id`); `20260515020000_public_stats_exclusion.sql:61-63` (`linked_vendor_profile_id`)
- Booked status enum: `20260513100000_iteration_0006_vendors.sql:65-74`
- Completed-events VIEW + 4 anti-fraud exclusions: `20270321252758_receipt_backed_reviews.sql:159-238`
- Helper fns: `is_admin`/`current_event_ids`/`current_vendor_ids` `20260512000000_setnayan_base.sql:164-217`; `current_couple_event_ids` `20260513040000_fix_rls_infinite_recursion.sql:23`; `current_vendor_profile_ids` `20260821000000_vendor_role_aware_rls.sql:23-35`; `current_vendor_booked_event_ids` `20261130003000_shared_timeline_suggestions.sql:18-31`
- `generate_public_id`: `20260512000000_setnayan_base.sql:26-40`
- Migration guard: `scripts/check-migration-timestamps.mjs` (allocator `scripts/new-migration.mjs`)
- Per-event consent precedent: `20270311811312_events_partner_birth_data.sql:37,47-48`
- Safe-layer read + extension point: `apps/web/lib/vendor-venue-events.ts:117-181`; `apps/web/app/v/[slug]/page.tsx:1095-1105,2832`; `apps/web/app/v/[slug]/_components/venue-matched-events.tsx`
