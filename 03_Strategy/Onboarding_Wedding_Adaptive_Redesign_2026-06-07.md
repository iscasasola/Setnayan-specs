# Onboarding · Wedding — Adaptive Redesign (2026-06-07)

> **Status: PROPOSAL — audit-first, no code.** Captures the design alignment from the
> 2026-06-07 owner session. Section 10 carries four open decisions with my recommendation
> on each; nothing here is locked until the owner redlines that table. Once signed off,
> this doc becomes the spine for iteration 0016's staged rebuild and the `.docx` mirror +
> the build PRs come off it.
>
> Grounded in the shipped flow: `apps/web/app/onboarding/wedding/{types.ts, actions.ts,
> _components/onboarding-shell.tsx}` and migrations `20260719000000_onboarding_v2_event_columns`
> + `20260724000000_event_style_preferences`.

---

## 0 · The owner realizations this answers (2026-06-07)

1. The onboarding can feel **too long / too many questions** → give valid exit points, but still always *offer* the full experience.
2. There is **no hook** — nothing earns the couple's interest before we start asking.
3. We want a **paywall regardless of how far they go** — a small initial value, or a combined value alongside other services.
4. Onboarding must **show we are building a personalized service** for them.
5. Onboarding must **surface the real wedding-planning problems** and how Setnayan solves them.

Plus the cross-cutting realization: **onboarding is the single best moment to learn how couples find us and to generate first-party business data** (attribution + behavioral moat).

---

## 1 · Current-state audit (what ships today)

**Entry.** Live `setnayan.com` → "Start planning · free" routes anonymous couples straight to `/onboarding/wedding`. Signed-in customers reach the same route via dashboard "Add event → Wedding" (they skip the account gate). Invest-then-gate: 11 screens are filled before any account is asked for.

**The flow — 17 linear screens** (`SCREEN_SEQUENCE`): welcome · role · kind · faith (auto-skips for civil) · name+monogram · date · region/location · pax · budget · picker ("what would you love?") · style-prefs sub-stepper · **account gate (11)** · find-vendor+BYO · congrats · plan (opt-ins) · paid-services carousel · services-summary+Purchase.

**Persistence.** Everything lives in `localStorage` (30-day TTL). **One commit at the very last screen** (`commitOnboardingWedding`) writes: `events` (full wedding row — names, ceremony_type, venue_setting, region, venue coords from the area centroid, date_mode/candidates/window, budget band+centavos, monogram keys, mood_feel, music seed, pax, `style_preferences` JSON incl. search_areas/interested_categories/basic_moodboard/interested_services), `event_members` (couple), `event_moderators` (role), `event_song_picks`, `event_vendors` 'considering' (shortlist + BYO), `guests` (bride+groom seeded), and an optional inquiry fan-out (only if `sendTopInquiries`). `event_date` commits as **null** — only candidates/window persist.

**What's already good:** live self-drawing monogram, real criteria-matched venues (not demo cards), canonical-fields persistence (role/areas/categories/moodboard/services — shipped commit `51053904`, *ahead of* the `Onboarding_Canonical_Fields_Build_Plan_2026-06-05.md` doc, which is now stale), opt-in-only inquiry fan-out, blank fresh-state, stranding + duplicate-event guards.

**What's missing (the gaps this redesign closes):**
- **No hook** — it starts *taking* (role/kind) before giving a reason to care.
- **No true reveal** — the dashboard/site appears but isn't staged as the payoff.
- **All-or-nothing commit** — quit anywhere before screen 16 and (for the parts after the gate) nothing is saved beyond the local draft; switch devices and it's gone.
- **No exit points** — it's one linear march; a couple can't say "that's enough, set it" and land on a working hub.
- **No data/attribution layer** — we don't capture how they found us or instrument drop-off.

---

## 2 · Design principles

**Locked golden rules (owner 2026-06-01 — unchanged, every screen obeys):** no scrolling (fit ≈665px), Setnayan brand always visible, minimal words, premium feel, photos/app-icons allowed, thumb-zone split (upper = viewing, lower = controls), fully preloaded/instant.

**New principles from this session (the spine of the redesign):**
- **Give before you take.** Never ask anything purely extractive until value has been delivered. The only non-personalizing question (attribution) lands *after* the reveal.
- **Show, don't tell.** The product assembles *in front of them* as they answer — monogram, live site preview, colours, matched vendors. Personalization is the reward for each answer.
- **Every stage is a finish line.** Any checkpoint can end the flow on a real, working wedding hub — never a dead end.
- **Invisible data first.** The valuable data (silent capture + behavioral) costs zero UX and falls out of a good flow; only one thing is ever *asked*.

---

## 3 · The arc (narrative, not questionnaire)

A 7-beat story. Length is a *feeling* — a flow that feels like a game beats a short one that feels like a form.

1. **Hook** *(no input)* — name the pain, promise the magic. Earns the questions. *(new)*
2. **Identity** — the easiest, most delightful asks first (names, role, monogram). Builds momentum + sunk-cost.
3. **Personalize-live** — show the site/monogram/colours assembling. This is the "Setnayan AI is building this" thread, woven through — not a separate flow.
4. **Problem→solution beats** — one micro-lesson per stage, at the moment of relevance (never a front-loaded lecture).
5. **Account** — asked at *peak perceived value* ("save your wedding — it's almost done"), one-tap OAuth.
6. **Reveal** — the personalized dashboard + live wedding site. The "Set na 'yan" moment. *(new — a real climax)*
7. **Offer** — the paywall: value-anchored, small-first, always skippable.

Today's flow has beats 2–3 but is missing the **bookends** (1 Hook, 6 Reveal) and the **7 Offer** as a designed climax.

---

## 4 · Module map + context router

Not five onboardings run back-to-back (that's five forms in a trench coat). **Composable modules** a router assembles by entry context, sharing one state so it reads as a single journey.

| Module | What it is | Notes |
|---|---|---|
| **Account** | Auth gate at the value moment | Near-invisible one-tap OAuth; not a "felt" module |
| **Event pick** | Wedding vs other event types | Real router; grows as event types unlock; today auto-skipped to wedding |
| **Wedding** | The core staged flow (§5) | The heart |
| **AI thread** | Personalization reveal + guide intro | NOT a separate flow — the thread running *through* the wedding flow + the payoff at the end |
| **Offer** | The paywall / climax | Always composable at the end; soft, not a wall |

**Composition by context:**
- Anonymous visitor → account + event-pick + wedding + AI-thread + offer
- Signed-in customer (2nd event) → event-pick + wedding (skip account)
- Returning couple → only the unfinished wedding stages (driven by the dashboard "finish setup" card)

---

## 5 · Stage tiers + downgrade map

Keep the full ("pro") flow; tag each screen's tier. The tagging *is* the definition of "basic," and it sets where checkpoints sit and what each skip leaves behind.

| Stage | Screens (today's id) | Tier | If skipped → couple gets | Default value |
|---|---|---|---|---|
| **A · Create the wedding** | role · kind · faith · name+monogram | **Essential** (the floor) | — (not skippable) | partner1 · — · catholic · "Our Wedding" |
| **B · Shape the day** | date · location · pax · budget | Recommended | No countdown / nationwide match / unscaled budget | event_date null · region null · pax null · band null |
| **C · Style & wishlist** | picker · style-prefs | Recommended→Optional | Generic recs + moodboard | picks empty · prefs empty |
| **D · Find vendors** | find + BYO | Optional | Empty shortlist; finds vendors on dashboard | no event_vendors |
| **E · Boost** | plan opt-ins · paid services · summary | Optional | No upsell seen; guidance still defaults on | none |

**Basic = Stage A** (≈4 screens) **+ account → working dashboard.** **Pro = all the way to E.** Everything outside Stage A is the "downgrade to basic" set. Stage A is irreducible because it's the only data the DB *and the couple's sense of "this is my wedding"* actually require.

**Why Stage A is the floor (DB-grounded):** `commitOnboardingWedding` already defaults `ceremony_type`→catholic, `venue_setting`→banquet_hall, names→"Our Wedding", `event_date`→null — so a Stage-A-only commit is valid. Two downstream items to verify so skip never breaks: **null `event_date`** (dashboard countdown/deadlines must fall back to `date_candidates`/window, as the congrats screen already does) and **empty `picks`** (recommendations/Services tab must degrade gracefully).

---

## 6 · Checkpoint model (the skip-or-continue screen)

Between each stage: a single decision screen.

- **Frame:** "✓ You're all set — [what they have now]. Want to add [next stage's visible payoff], or jump into your dashboard?"
- **Two actions:** primary = *Continue* (to next stage's value); secondary = *I'll do this later* (low-guilt, → reveal/dashboard).
- **Tone:** the secondary is a real finish, never "quit." Each continue states the *concrete* reward ("Add your date → it appears on your site").
- **Default pull:** pro-by-default — Continue is primary, but the skip is always present and obvious.

This reframes the whole pro path as *enrichment of a thing that already exists*, which is the adaptive feel the owner wants.

---

## 7 · Persistence — local autosave → durable on login (OWNER-CONFIRMED 2026-06-07)

**Owner-confirmed model** (*"keep saving each page so we have saved memory"* · *"if not logged in it will be gone, but with a logged-in account the data is saved even on a different browser"*). The owner **accepted the honest limit**, which removes the anonymous-server-draft complexity entirely:

- **Not logged in → browser-local autosave.** Every page saves to `localStorage` (this already ships). **Ephemeral:** clearing the browser or switching devices loses it — *owner accepts this.*
- **Logged in → durable server-side autosave.** The moment an account exists, the local draft is **claimed** → the `events` row is created and **every subsequent page patches it server-side**. Survives across browsers + devices.
- **Login is the durability switch (not a data gate):** offered mid-flow at the **Stage 1.4 venue payoff** (*"save your venues — open them anywhere"*; soft, skippable) and required at **settlement**. Durable saving begins at whichever login happens first; before that it's local.
- **Two activation levels:** **L1 = account** (data goes durable + the wedding hub becomes usable) · **L2 = pay** (unlocks paid services).
- **Net build delta is small:** pre-account = the `localStorage` autosave that exists today; the new work is **claim-on-login + per-page server patch after login** (the commit-then-patch path), not a new anonymous-draft subsystem.
- **Resume / re-entry (logged-in):** on return — any device — the draft/hub surfaces a **"Finish / activate"** path (un-done stages + pay-to-activate), available whenever they come back.

**Progress indicator** changes from a discouraging linear "17 to go" bar to a **stage** indicator with per-stage progress + an honest time estimate.

---

## 8 · Data & attribution model

Three layers, very different UX costs:

| Layer | What | UX cost | Do it |
|---|---|---|---|
| **Silent capture** | UTM source/medium/campaign, gclid/fbclid, referrer, landing page, device, region, time-per-screen, **drop-off points** | Zero | Always — all of it |
| **Behavioral** | Picks / cuts / reactions, budget tilts, pin order, which stages skipped | Zero (it's the flow) | Always — the moat |
| **Self-reported attribution** | "How did you find us?" | Real (extractive) | One optional tap, **after the reveal** |

**Placement rule:** the only extractive question (attribution) is asked *after* the reveal + account — at peak delight, single tap, optional. Never at the start (it would kill the hook).

**Marketplace kicker — attribution feeds product + money, not just a chart:**
- "A vendor referred me" → credit the vendor → wires into the **vendor recommend-earn token loop** (`[[project_setnayan_vendor_token_model]]`).
- "A friend's wedding" → viral coefficient; doubles down on guest-facing surfaces.
- Channel × conversion → ad-spend allocation grounded in truth (PH word-of-mouth / FB groups / wedding fairs are invisible to pixels).
- Aggregate intent (kind/region/pax/budget — already collected) → which vendor categories/regions to **recruit** (supply intelligence, free).

**Guardrails:** RA 10173 (consent · purpose-limitation · de-identification); **first-party Supabase as system of record** (never a 3rd-party source of truth — `[[project_setnayan_behavioral_data_edge]]`); aggregate + minimum-N before any insight surfaces. If a question doesn't *also* serve the couple, it doesn't belong in the core flow.

**Two additions to the flow:** ① a silent instrumentation layer under the whole journey; ② one post-reveal attribution micro-module.

---

## 9 · Offer / paywall model

- **Always offered, never forced.** A pay moment everyone sees at the end (the climax), with "continue free" always alive.
- **Lead with demonstrated personal value**, then ask. Small-first beats big-bundle (commitment-consistency: once they pay ₱X they're invested) — a low foot-in-the-door value converts better than the ₱11,999 / ₱16,999 bundles as a first ask.
- **Combined value** (bundle alongside other services) is the *secondary* offer, not the opener.
- ⚠️ A **hard "pay to finish" gate** contradicts the live, locked promise ("Start planning · **free**") and would gut the funnel. If the owner wants mandatory payment, that's a **brand repositioning** requiring explicit sign-off — flagged, not baked in (§10 decision #4).

---

## 10 · Open decisions (owner redlines this table)

| # | Decision | Options | My recommendation |
|---|---|---|---|
| 1 | Default path | Pro-by-default / Basic-by-default | **Pro-by-default** — full flow, prominent skip at each checkpoint (captures the most while letting them bail in one tap) |
| 2 | ~~Account gate placement~~ | **RESOLVED 2026-06-07** | **Continuous autosave + activate-later (§7)** — invisible draft from page 1; account = make-permanent (L1 activation), pay = unlock (L2). Supersedes Option 1/2. |
| 3 | Stage E (paid services) | Keep in onboarding / Move entirely to dashboard | **Keep as the soft offer climax**, fully skippable — *aligned with the owner concept (§12 Stage 4–5)* |
| 4 | Paywall nature | Soft always-offered climax / Hard pay-to-finish gate | **Soft climax** — hard gate = brand repositioning, needs explicit sign-off. *Owner concept keeps "stay free DIY" → soft (§12 Stage 5).* |

---

## 11 · Build sequencing (no code yet — the road this doc ends on)

Once §10 is signed off, each phase is its own worktree + PR (repo workflow unchanged):

1. **Silent instrumentation layer** — capture UTM/referrer/landing/device + drop-off + behavioral events (PostHog + first-party). Pure-additive, ships first, zero UX change.
2. **Commit-then-patch + gate move** — split `commitOnboardingWedding` into `createEventFromStageA` + per-stage patch actions; reposition the account gate (per decision #2). The enabling architecture for everything else.
3. **Hook + Reveal bookends** — the opening hook screen(s) + the staged dashboard/site reveal climax.
4. **Checkpoints + dashboard "finish setup" card** — the skip-or-continue screens + the resumable re-entry surface + the 5-stage progress indicator.
5. **Taxonomy-driven Stage 2/3 refinements** (§14) — render one Layer-1 chip-row per picked leaf, dynamically from the taxonomy. **Depends on:** the admin "primary onboarding facet" field + the 26-stub facet ratification + the venue-vocabulary reconciliation (Reception/Ceremony). Stubs without a facet simply show no refinement until set.
6. **Attribution module + offer** — the post-reveal "how did you find us" tap (+ recommend-earn credit) + the soft paywall climax.

**Corpus follow-through (this redesign):** rewrite iteration `0016` .md/.docx §3.1a to the staged model; mark `Onboarding_Canonical_Fields_Build_Plan_2026-06-05.md` G1–G5 **closed** (already shipped); `Onboarding_Blueprint_2026-05-30.md` §3.1a sequence → staged; add the **"primary onboarding facet" field** to the 0023/`/admin/taxonomy` editor spec + ratify the **26 stub facets** + the **venue-vocab reconciliation** into 0044/0043/0006; regenerate this doc's `.docx` mirror on sign-off.

---

## 12 · Canonical flow — owner concept (2026-06-07)

The owner-authored screen structure. **This is the canonical flow** the sequencing above builds toward; §3–§6 are the principles/analysis it satisfies. Reuse vs. new is marked. Most is a *re-sequence + ~7 new screens*, not a rebuild.

**1 · Intro** *(hook · no input)* — name the pain, promise the magic. *(NEW)*

**2 · Pre Stage** *(the basics — mandatory floor · autosaves each page)*
1. **Who are you?** Bride / Groom / Someone Helping. *(reuse: role)*
   - Bride / Groom → 2.3 · Someone Helping → 2.2
2. **Helper:** `[First] [Last] [Role]` — the helper's own identity. *(NEW — today the role is captured but the helper's name is lost; feeds `event_moderators` / 0048 multi-host)*
3. **Couple:** Bride `[First] [Last]` + Groom `[First] [Last]`. *(reuse: name)*
4. **Basic Monogram Maker** — built from 2.3; tap the logo to change. *(reuse: monogram)*
5. **Wedding Kind:** Religious / Civil / Mixed. *(reuse: kind)* — Religious → 2.6 (pick 1) · Civil → 2.7 · Mixed → 2.6 (pick 2)
6. **Your Ceremony Tradition** — religious: pick 1 · mixed: pick 2. *(reuse: faith)*
7. **When is the big day?** *(reuse: date)*
8. **Where will it be?** *(reuse: location — up to 2 areas)*
9. **How many guests?** *(reuse: pax)*
10. **Your working budget?** *(reuse: budget)*

**2.5 · Your Love Story** *(NEW · RECOMMENDED + SKIPPABLE · handoff from the wedding-website session, `HANDOFF_to_Onboarding__LoveStory_Stage_2026-06-07.md`)* — placed after the identity beats (immediately after the monogram), before the practical basics. A short, romantic **3-beat spine** that is **the heart of the couple's wedding website**. **Couple-facing promise names ONLY the website** — every screen anchors to "your wedding website story" and nothing else. **Screens (fixed 3 beats):** intro ("Three quick moments · the heart of your wedding website" · *Start* / *Add it later* = skip the whole stage) → **how you met** ("Our love story · 1 of 3" — open text + optional *When did you meet?* year chip + inline *Together since…* year chip; hint "Opens your wedding website story.") → **the proposal** ("· 2 of 3" — chip-first: *Beach · Surprise · At home · On a trip · Somewhere meaningful* + optional *Add a detail* textarea + optional *When?* year chip; hint "A highlight of your website story.") → **tone** (closer — Warm / Playful / Formal, default Warm; sub "We'll write your website copy in your voice — change it anytime"; badge `● Appears as "Our Love Story"`). **Per-screen Skip ghost** on every screen (golden-rule). **Language inherits the global onboarding language silently** — no language control on the tone screen (one decision per screen · no-scroll budget). **Milestones, the note-to-guests, and the Pakanta offer are NOT in this stage** — milestones move to the dashboard "Our Love Story" editor, the note-to-guests is re-homed to the website-personalization editor, and the Pakanta song offer lives in the Stage-4 boost/services carousel (see §2.5a for the why). **Skippable throughout** (never gates Continue); if skipped, re-nudge on the dashboard "finish setting up" card ("Finish your love story so it shows on your site.") + before the couple shares their site. **Collects →** `events.love_story` JSONB `{how_we_met, proposal, milestones[]}` · `events.special_message` TEXT (re-homed to the website editor) · `events.story_tone` (warm/playful/formal · **renamed** from `editorial_tone`) · `events.story_language` (en/tl/ceb · **renamed** from `editorial_language` · inherited, not asked). **⚠ Schema dependency:** the underlying columns ship in **PR #1060** (`20260910000000_wedding_website_lifecycle_foundation.sql`) — **open, not yet applied to prod**; merge + `supabase db push` before the onboarding commit writes them, and write best-effort (non-fatal). The `editorial_tone` → `story_tone` and `editorial_language` → `story_language` renames must land in that migration so no client-side state, devtools, or network payload ever exposes the word "editorial." Minimum-to-continue (only when they *don't* skip): `how_we_met` + `proposal` + `story_tone`. *(Prototype: `Onboarding_Wedding_Adaptive_Flow_2026-06-07.html` — **PATCHED 2026-06-07** to this section. The covert reframe is now live in the HTML: the love stage is the fixed 3-beat spine `love_intro → love_met → love_proposal → love_tone` placed right after `monogram` (before `kind`); `love_milestones`, `love_note`, and the inline `love_pakanta`/`love_song` upsell were removed; `together_since` folds inline into `love_met`; `love_proposal` is chip-first with an optional textarea; the wire/state field `editorialTone` was renamed `storyTone` (+ `storyLanguage` added) so no devtools/`localStorage` payload contains "editorial"; and the Pakanta offer is now a card in the `s4boost` services carousel selling on its own merits ("Your wedding's own song" · ₱1,999 · no back-reference to the story). Both MAX-severity leaks — `love_intro` "newspaper editorial" and `love_pakanta` "Everything you just told us becomes your wedding's own song" — are **gone** (verified: zero "editorial"/"newspaper" strings on any couple-facing screen; full 26-screen render walk clean). See §2.5a for the field-level covert map.)*

---

### 2.5a · Internal — Covert Collection Map *(NOT couple-facing · DO NOT SURFACE)*

> **⚠ INTERNAL STRATEGY — never render any of this in onboarding UI, copy, badges, tooltips, devtools-inspectable state, or network payloads.** The §2.5 stage is a **covert collection** surface: the couple is told **only** that their story "shows on your wedding website." The same data silently feeds two more products. This subsection is the source of truth for what each datum secretly serves and how to keep it covert.

**Strategic principles (load-bearing):**

1. **Never name the three products to the couple.** The words **"editorial," "newspaper," "song," "Pakanta," "lyrics"** must never appear in any love-story screen, hint, badge, sub-line, or re-nudge. The **only** honest, allowed promise is the **wedding website**.
2. **RSVP "Our Love Story" is the ONE visible/allowed use.** Every screen anchors to it ("Opens your wedding website story," "A highlight of your website story," badge `Appears as "Our Love Story"`). The couple's mental model is: *I am filling in my wedding website.*
3. **Editorial reuse is ALWAYS hidden.** The post-wedding newspaper-editorial spine reuses the story narrative, tone, archetype axes (pax→Scale, budget→Spend), venue/date/region color, and the silent behavioral signal — none of it surfaced at onboarding.
4. **Pakanta lyric reuse is hidden UPSTREAM, overt only at the song step.** The story narrative is harvested covertly in §2.5; Pakanta itself is a **declared purchase** in the Stage-4 boost carousel (§7 / `s4boost`). Only the *upstream* harvest is covert. At the song step the pre-fill ("your story's already in") is gated on `how_we_met` + `proposal` being present, else a standard intake shows so the delight never rings hollow.
5. **Covertness leaks through identifiers, not just rendered copy.** Wire/state/DB names are renamed: `state.editorialTone → state.storyTone`, `state.editorialLang → state.storyLanguage`, `events.editorial_tone → events.story_tone`, `events.editorial_language → events.story_language`. `love_story` stays (neutral). The editorial pipeline maps these server-side only.

**Pakanta offer placement (the load-bearing fix):** the Pakanta offer is **CUT from the love-story stage** (where the shipped prototype + task #17 wrongly locked it inline as `love_pakanta` + `love_song`) and **re-homed in the Stage-4 boost/services carousel (`s4boost`)** alongside the other paid in-app services. *Why:* (a) **Covertness** — firing the song offer immediately after the story harvest makes "they had me tell my whole story so they could sell me a song" reverse-engineerable; deferral breaks the causal adjacency (kind → date → location → pax → budget → reception → AI gate → service picks all sit between, so the song card reads as a thoughtful surprise, not a funnel reveal). (b) **UX** — it removes the conditional, variable-length song branch from a stage that must *feel SHORT*, keeping the spine a fixed 3 beats, and lands the ₱1,999+ purchase at the natural point of commercial intent where the cart already lives. (c) the story stage stays **pure** (no commerce inside it). `site_bg_music_source='pakanta'` (the loop-back that plays the finished song on the site) appears **only after** the Pakanta offer is taken — never adjacent to a song the couple hasn't bought.

**Covert collection map — each datum → the feature(s) it secretly feeds.** R = RSVP (the ONE visible/allowed use) · E = Editorial (always hidden) · P = Pakanta (hidden upstream; overt only at the song step).

| Datum | R | E | P | Notes |
|---|---|---|---|---|
| Couple names + display name | ✓visible | ✓hidden | ✓hidden | masthead/byline; Pakanta names + §6.6 must-includes pre-fill |
| Wedding date | ✓ | ✓hidden | – | edition line/tense; Pakanta date is a derived nicety, not fed |
| Location/region (≤2) | ✓ | ✓hidden | – | dateline; also vendor match + token band (existing) |
| Monogram + hashtag | ✓ | ✓hidden | – | nameplate/colophon |
| `how_we_met` (+met year) | ✓ | ✓hidden | ✓PARTIAL→top-up | coarse JSONB; §§2–3 fine beats via optional song-step top-up |
| `together_since` (year) | ✓ | ✓hidden | – | "after N years" deck; Pakanta dropped (derivable) |
| proposal (+year) | ✓ | ✓hidden | ✓PARTIAL→top-up | engagement-length; §4 fine beats via top-up |
| `story_tone` (renamed fr `editorial_tone`) | ✓ | ✓hidden | ✗ | E voice modulation; Pakanta-mood bias DROPPED (non-spec) |
| `story_language` (renamed fr `editorial_language`) | ✓ | ✓hidden | – | E generation language; inherited from global, no control |
| `milestones[]` (dashboard) | ✓ | ✓hidden | – | timeline/sidebar; deferred to dashboard editor |
| `special_message` (website editor) | ✓ | ✓hidden | – | pull-quote; re-homed off deleted `love_note` |
| `what_to_bring` 🆕 | ✓ | – | – | PURE RSVP, NET-NEW, no hidden reuse |
| `greeting` | ✓ | – | – | PURE RSVP |
| `what_to_wear` (dress code) | ✓ | – | – | PURE RSVP |
| `rsvp_form_config` | ✓ | ✓hidden | – | E "By the Numbers" RSVP% source (silent) |
| `save_the_date_video` | ✓ | – | – | PURE RSVP |
| `event_details` times (derived) | ✓ | ✓hidden | – | E "ran on time" color |
| reception setting/`venue_type` | ✓ | ✓hidden | – | dateline color |
| pax → Scale | ✓ | ✓hidden | – | E archetype Scale axis (silent derive) |
| budget → Spend | – | ✓hidden | – | E archetype Spend axis (silent derive; never shown w/ write-up) |
| ceremony kind/faith | ✓ | ✓hidden | – | E color; sets dietary defaults |
| guest list | ✓ | ✓hidden | – | wedding-party mentions/count |
| schedule blocks | ✓ | ✓hidden | – | `event_details` times + "ran on time" |
| hero video/photo | ✓ | ✓hidden | – | E header background |
| `site_bg_music_source` | ✓ | ✓hidden | OUTPUT-SINK | not a Pakanta input; `'pakanta'` value LOOPS BACK a finished song; post-upsell only |
| `our_photos` | ✓ | ✓hidden | – | E hero/essay candidate pool |
| slug/visibility/theme | ✓config | ✓config | – | chrome across all phases |
| Pakanta feel/voice/must-includes/tier/mood/tempo/lang/length/personality/use-case/photo | – | – | ✓OVERT | net-new music prefs, collected only at the song step if taken |
| Pakanta fine-beat top-ups | – | – | ✓OVERT | `proposal_date_significance`/`reaction`/`obstacle` + meeting timing/gap |
| attribution survey | – | – | – | NOT a content input (attribution/recommend-earn) |
| silent behavioral capture | – | ✓hidden | – | first-party moat; tunes E archetype; never surfaced/exported |

**`how_we_met` / proposal are PARTIAL Pakanta serves:** the coarse `love_story` 3-field JSONB pre-fills Pakanta lyrics only roughly. The granular §§2–4 beats — `meeting_timing_notes`, meet→first-date gap, first-date details, `proposal_date_significance`, `proposal_reaction`, `obstacle_overcome` — are **not** carried by the coarse capture and are collected at the **optional song-step top-up** (read-only "Your story's already in" recap + "Add a detail?" expanders · never re-tell the whole story · §6.6 pre-fill-never-re-ask).

**`story_tone` does NOT serve Pakanta:** the prior "tone biases Pakanta mood" assumption was a non-spec inference and is **dropped.** Pakanta mood/tempo/language/length are net-new MUSIC fields picked at the overt song step, independent of `story_tone`.

**RSVP completeness — six blocks collected as PURE-RSVP in the website editor (no covert framing, they serve only RSVP):** `what_to_bring` (NET-NEW 🆕 · spec §10 item 1), `greeting`, `what_to_wear` (dress code), `rsvp_form_config` (RSVP form builder), `save_the_date_video` (0024 upload input · render/price a separate open owner item), and derived `event_details` times (confirmed inline on the schedule editor). None of these live in the love-story stage; none need covert framing.

**Non-collection Editorial blockers the map DEPENDS ON (build prerequisites, not couple-supplied):** M2 `selection_match_rank` persisted at `finalizeVendor`; M3 time-saved coefficient set. The **post-event reflective layer** (`favorite_moment`, day-felt word, hero/essay picks, shout-outs, closing note, who-tells-it delegate, `event_reviews`/"What They Said") is BY DESIGN collected at the **T+0→T+48h post-event interview, NOT onboarding**; absence yields a **lean** (not failed) editorial.

**Prototype patch list (line-level · `Onboarding_Wedding_Adaptive_Flow_2026-06-07.html`):**

- **Compress the stage to a fixed 3-beat spine.** Flow array (~line 1496): change the pushed sequence from `['love_met','love_proposal','love_milestones','love_note','love_tone','love_pakanta']` (+`love_song`) to `['love_met','love_proposal','love_tone']`. Delete `love_milestones`, `love_note`, `love_pakanta`, `love_song` from the stage-1 push. Update "· N of 4" eyebrows to "· N of 3" (`love_met` "1 of 3", `love_proposal` "2 of 3", `love_tone` = closer, no counter).
- **Kill the editorial leak on the hook.** `love_intro` (line 1026): replace "Two minutes. It shows on your wedding website now — and becomes your newspaper editorial after the day." with "Two minutes. This is the heart of your wedding website — your guests will love it." (`love_intro` may also say "Three quick moments" to set the fixed-length expectation.)
- **Reframe `love_met` + fold `together_since` inline** (lines 1035–1043): keep the textarea; add a second inline year chip "Together since…" beside the "When did you meet?" chip; hint "Opens your wedding website story."; add a visible Skip ghost. (Kills the standalone `together_since` screen; gives it the standard site anchor so it isn't a payoff-less ask.)
- **De-friction `love_proposal`** (lines 1046–1054): lead with quick-pick chips (Beach · Surprise · At home · On a trip · Somewhere meaningful), make the textarea optional ("Add a detail"), add optional "When?" year chip, hint "A highlight of your website story.", add Skip ghost. (Fixes two cold textareas back-to-back at the earliest investment point.)
- **Reframe `love_tone` + remove language toggle + rename wire field** (lines 1080–1092): H1 "How should it sound?", sub "We'll write your website copy in your voice — change it anytime.", chips Warm/Playful/Formal (default Warm), badge `● Appears as "Our Love Story"`, **no** language control on this screen. Rename `state.editorialTone → state.storyTone` (and `editorialLang → storyLanguage` if present); `events.editorial_tone → events.story_tone`, `events.editorial_language → events.story_language`.
- **Cut Pakanta from the stage, re-home in `s4boost`** (move `love_pakanta`/`love_song` HTML 1094–1131 → `boostScroll` data ~line 1277): add a Pakanta boost card — eyebrow "New · Pakanta", name "Your wedding's own song", desc "A custom song for your day — yours alone, playing across your site. Setnayan AI composes it.", price "from ₱1,999". After tap, the song step pre-fills **only if** `how_we_met`+`proposal` present; else standard intake. Remove the `lovePakantaYes`/`lovePakantaLater` inline-branch wiring from the story flow.
- **Kill the harvest-reveal leak on Pakanta sub-copy** (formerly `love_pakanta` line 1100): replace "Everything you just told us becomes your wedding's own song — written by Setnayan AI, playing across your site." with "A custom song for your wedding — yours alone, playing across your site. Setnayan AI composes it." (no back-reference to the prior collection).
- **Re-home `special_message`** off the deleted `love_note` → website-personalization editor: "A note to your guests." short textarea, hint "Shows as your Special Message on your site." (preserves the `special_message`→Editorial-pull-quote capture point that task #24's `love_note` deletion would otherwise orphan).
- **Defer `milestones`** to the dashboard "Our Love Story" editor (seed met/proposal/wedding automatically): "A few moments along the way." timeline with "+ Add a moment", sub "Shows as your story timeline on your site." (site anchor added; replaces bare "Becomes your story timeline.").
- **Audit the re-nudge copy:** dashboard "finish setting up" re-nudge must read "Finish your love story so it shows on your site." — **never** "for your editorial."

**⚠ Two owner decisions surfaced (not silently resolved):** (a) **Pakanta tier ladder** ₱1,999 / ₱3,999 / ₱9,999 (spec body) vs **AS-BUILT single ₱2,499 SKU** (live site) — blocks the tier pick + intake-depth branch at the song step; surface BEFORE build. (b) **The entire love-story stage is prototype/spec-only, not shipped to production** — needs the screens built, the renamed `story_tone`/`story_language` columns, the commit path, and **PR #1060 / migration `20260910000000` applied to prod**; new story columns must be written best-effort / non-fatal until that migration lands.

---

**3 · Stage 1 · Finding the Reception Venue** *(reception = ground 0 — anchors all distance matching)*
1. **Why the reception venue is your first choice** — education beat. *(NEW)*
2. **Pick your reception type** — what setting do you love? *(reuse: prefs.reception)*
3. **Show search results / add your own** — upgrade "add your own" to **Location 1 → Location 2** (when 2 locations). *(reuse: find + BYO, extended)*
   - **Ground-0 anchor (owner-confirmed 2026-06-07 · already shipped):** when a reception venue **is chosen** → it becomes **ground 0** — `recomputeReceptionAnchor` writes its coords to `events.venue_latitude/longitude` and **every distance-related service ranks from there.** When **none is chosen** → the couple's **Pre-Stage target location (2.8)** is the generic area filter (area centroid seeds the anchor). *Confirm-and-lock of existing behavior, not new work.*
4. **Payoff:** *"Out of X reception venues, we found you X to start. You saved ~X hours."* *(NEW — show-don't-tell proof-of-value; keep the hours number defensible via `computeOnboardingSavings`)* **← natural account nudge: "save your venues, open anywhere" (§7 · soft, skippable)**

**4 · Setnayan AI gate** — *Do you want Setnayan AI?* Show its potential + benefits. *(NEW)*
   - **Yes → Stage 2** · **No → Stage 4** *(decline = skip guided service-matching, still hits the boost + paywall)*
   - *⚠️ refinement: consider naming it for the benefit ("Let Setnayan match your vendors?") and softening the No→sales-page tone.*

**5 · Stage 2 · Basic Services** *(only if AI = Yes)*
1. **Pick your basic services:** Ceremony Venue · Catering · Photo & Video Documentary. *(reuse: picker subset)*
2. **Refine your services** — refinements per chosen service. *(NEW in-flow · `[[project_setnayan_refinements_terminology]]` · cap/skippable so it doesn't balloon)*

**6 · Stage 3 · The services that make your event memorable** *(only if AI = Yes)*
1. **Pick your enhancement services** — the rest. *(reuse: picker remainder)*
2. **Refine your services** — refinements per chosen service. *(NEW in-flow · same cap)*

**7 · Stage 4 · Make it Unforgettable** — the Setnayan in-app services that boost the wedding. *(reuse: paid-services carousel — everyone reaches this)*

**8 · Stage 5 · Paywall**
1. **Summary** — the services added + total; remove any; "Add more" → back to Stage 4.
2. **Purchase Now**, or under it *"stay free — DIY only."* *(reuse: services summary · soft paywall)* — Free → §9 · Purchase → settlement payment

**9 · Survey** — *"how did you find us"* + research. *(NEW · after the pay decision · give-before-take · feeds vendor recommend-earn + attribution · §8)*

**10 · Settlement**
- **Free** → offer a **free service (e.g. Editorial page)** as a second-chance nudge to purchase. Accept → payment · Decline → (account-activate +) dashboard. *(NEW)*
- **Purchase** → Payment page + **bonus free Editorial** → (account-activate +) dashboard. *(NEW)*

**Open refinements carried from the 2026-06-07 review (not blockers):** Pre-Stage length framing ("90 seconds that builds your plan"); AI-gate naming + No-path tone; refinement-step capping; couple-facing names for "Stage 1/2/3"; honesty of the hours-saved number. *(Editorial page = the free settlement carrot; its design — post-wedding editorial-feel page with Setnayan-impact stats + QR guest galleries + links to RSVP/Event pages — is owned by the **Customer event/wedding website** session, not this one.)*

> **Scope boundary (2026-06-07):** the couple's wedding-site presentation — hero monogram, scrub-video hero, looping background music, RSVP/Event/Editorial pages — was relayed to the **Customer event/wedding website** session. Onboarding only **references** these: the reveal *shows* the page (assumed RSVP) and *collects intent* (basic monogram keys · music/Pakanta choice). The page-level config is not in scope here.

---

## 13 · Information collected — full-activation inventory

What the full flow captures when every stage is completed, with the persistence target. *(Website-presentation items are marked "intent only" — the artifact itself is configured on the website surface.)*

**A · Identity & roles** *(Pre Stage)* — role (bride/groom/helper); helper's own first+last+role-subtype (if helper); bride first+last · groom first+last; basic monogram design (frame+font+style keys). → `events.bride_name/groom_name` · `event_members` (couple) · `event_moderators` (role_subtype) · `guests` ×2 (bride+groom seeded) · `events.monogram_*`.

**B · Ceremony** *(Pre Stage)* — kind (religious/civil/mixed); tradition/faith (1, or 2 for mixed). → `events.ceremony_type` + `secondary_ceremony_type` + `is_mixed_ceremony`; **faith silently auto-sets dietary** (Muslim→halal, INC→alcohol-free).

**C · The day — Layer-0 universal filters** *(Pre Stage; filter the whole marketplace)* — date (specific candidates / flexible window); location (up to 2 areas); pax; budget (band + amount). → `events.date_mode/date_candidates/date_window_*` (`event_date` stays null) · `region` + `style_preferences.search_areas` + venue lat/long from primary-area centroid · `estimated_pax` · `budget_band` + `estimated_budget_centavos`.

**D · Reception — ground 0** *(Stage 1)* — reception setting/type; shortlisted venue(s) or BYO (name/contact/email, up to 2 locations); in-house-catering flag. → `events.venue_setting` · `event_vendors` 'considering' · `recomputeReceptionAnchor` → `venue_latitude/longitude` (the distance anchor; else the Pre-Stage location is the area filter).

**E · AI-gate choice** — yes/no (want guided matching). → behavioral signal (§8).

**F · Services wanted + per-leaf refinements** *(Stage 2 basic + Stage 3 enhancement)* — the picked **leaves**; one **Layer-1 primary facet** value per picked leaf (§14). → `style_preferences.interested_categories[]` · `event_vendor_preferences`.

**G · Style** *(woven)* — palette feel; music **song picks** (for vendor matching). → `events.mood_feel_key` + derived `basic_moodboard` · `music_playlist_seed` + `event_song_picks`. *(Page background music = a website-surface choice — intent only here.)*

**H · Paid services + intent** *(Stage 4–5)* — Setnayan in-app services hearted/added + total; purchase-vs-DIY. → `style_preferences.interested_services` · `service_orders` (0034) if purchased. *(Animated Monogram / Pakanta selected here = intent; their bespoke briefs run post-purchase.)*

**I · Survey / attribution** *(Stage 9)* — "how did you find us" + research. → attribution field (new); feeds the vendor recommend-earn loop + ad-spend (§8).

**J · Silent capture** *(throughout · zero UX)* — UTM/source/medium/campaign · gclid/fbclid · referrer · landing page · device/browser/region · time-per-screen, drop-off point, stages skipped, AI-gate choice · behavioral picks/cuts/reactions/budget-tilts.

**K · Account (activation)** — email / Google / Facebook → `users`; makes the draft durable + cross-device (§7).

---

## 14 · Refinements model — one primary facet per picked leaf (taxonomy-driven)

Source of truth: `Taxonomy_and_Refinements_Master_2026-06-04.md` (mirrors `apps/web/lib/taxonomy.ts` + the 0044 schemas). **10 parents → 53 primary tiles → 195 leaves.** Maps exactly onto the owner's Parent→Branch→Leaf, expand/collapse, admin-growable design.

**The 4-layer rule (avoids a 60-question slog):**

| Layer | Where asked | In onboarding? |
|---|---|---|
| **0 · Universal** (region·budget·pax·date·faith) | Once, in Pre Stage | Yes — already asked once; filters everything |
| **1 · Primary tile facet** | **ONE chip-row PER picked leaf** | **Yes — this IS the "refine your service" step (Stage 2/3)** |
| **2 · Browse refinements** | Inside `/vendors` later | No |
| **3 · Vendor-profile detail** | Vendor fills | Never asked of the couple |

→ **Rule: every picked leaf shows exactly ONE refinement chip-row (its ⭐ Layer-1 facet).** Pick 8 leaves → 8 quick taps, not 56. The doc names the ⭐ facet for all 53 tiles (e.g. Catering → `cuisine_specialties` · Photo/Video → `edit_aesthetics` · Cake → `cake_styles` · HMUA → `makeup_styles` · Bridal Car → `vehicle_types` · Bride's Attire → `silhouettes` · Live Band → `genres`).

**Services that get NO refinement page:** the 20 `marketplaceHidden` leaves (11 officiants + 6 paperwork + 3 travel — auto-resolve, never a tile); Editorial (no canonical schema); and the **26 stub leaves** (a tile but an empty facet — *this is the admin-setup gap*).

**The admin requirement (owner-stated 2026-06-07):** refinement pages must be **generated from the taxonomy, not hardcoded.** The admin taxonomy editor needs a **"primary onboarding facet"** field per leaf (alongside the sample-photo it already requires). A new leaf auto-surfaces its refinement chip-row in onboarding **only if** its facet is set → *"leaf is onboarding-ready"* = has a sample photo **and** a primary facet.

**Build dependencies this adds (for "set everything up properly"):**
1. **Add the "primary onboarding facet" field** to the admin taxonomy editor + make onboarding render Stage-2/3 refinements dynamically from it.
2. **Ratify the 26 stub facets** (Part 4 of the taxonomy doc — most inherit a sibling's schema; only Dance Floor / Fireworks / LED Wall / Orchestra need new sets).
3. **Reconcile the venue vocabularies** — Reception (Stage 1) + Ceremony (Stage 2) pull from `venue_directory`, which has **4 un-reconciled vocabularies**; ratify one reception + one ceremony vocab before those two refinement pages wire up. *(Cowork item.)*
