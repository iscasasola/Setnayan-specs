# Event type × religion audit — 2026-09-30

**Step 6 of the owner's plan: "Adaptation to all Events and Religion".** READ-ONLY audit, no code changed.
Read from a fresh worktree of `origin/main` @ `15df3c142` (never from `~`). Prod rows were NOT queried:
`event_type_profiles` / `event_type_vocab` / `service_categories` are admin-editable, so every
"profile says X" below is **what the migrations seed** — re-measure in prod with
`select event_type, role_set_key, enabled_surfaces, terminology from event_type_profiles order by 1;`
before building on it.

Anchors are greppable symbols, never line numbers (CLAUDE.md rule 7). ⚠ A handoff is not evidence —
including this one.

**Verdict in one line:** the words engine (`EventWords` / `terminology` / `register:'solemn'`) is real
and mostly honoured on the guest Event Hub, but **everything around it is still one wedding-shaped
list**: one role set for 14 types, one group list with "Officiant" for all 17, sides on every guest,
"digital money dance" on every gift card, wedding Your Team cards for every type, and religion that is
asked only for weddings and mostly reaches only /paperwork. **None of the five approved profile fields
exist yet.**

---

## 0. The inventory

### 0.1 Event types (17) — `event_type_vocab`, all `enabled` (migration `20270726622326_enable_all_event_types`)

wedding · birthday · debut · christening · graduation · corporate · anniversary · reunion · gala_night ·
travel · tournament · hangout · date · gender_reveal · celebration · simple_event · wake.
(`public.event_type` enum is legacy — `events.event_type` is FK'd to `event_type_vocab` since
`20261205000000_event_type_vocab_dynamic`.)

**Create-event picker** — `create-event/_components/event-type-picker.tsx` `EventTypePicker`, roster
from `getCreatableEventTypes` (`lib/event-types-db.ts`). No type is hidden outright. Folded behind
**"Show all event types"** only by the subject step (`hiddenTypesForSubject`, `lib/create-subjects.ts`):
"You" with a saved birthday folds **debut / christening** unless age fits and **wedding** under marriage
age; a pet/business/item subject folds `PERSON_ONLY_TYPES` (wedding, debut, christening, graduation,
gender_reveal). ⚠ An adult choosing "You" never sees debut/christening on the first screen (the owner
complained about exactly these two on 2026-08-16 — `hiddenMeasuredTypes` docblock).

**Card image** — `eventTypePhotoSrc`: admin `hero_photo_url` else `/event-types/{key}.webp`, else an
emoji gradient via `onError`. **`public/event-types/wake.webp` does not exist** (16 of 17 present) and the
wake vocab row was copied from `funeral` with no `hero_photo_url` → the Wake card is a 🕊️ gradient unless
an admin uploaded one in prod.

**Label** — `simple_event` reads **"Simple Event"** (vocab seed `20270307127948…`, `/onboarding/simple`
title "Create a Simple Event"). "Get-together" appears nowhere in code or migrations.

### 0.2 The profile spine — `event_type_profiles` (+ code fallbacks in `lib/event-type-profile.ts`)

Columns that exist: `terminology` (JSONB: organizer_noun, person_a/b, seat_word, event_word,
vip_tier_label, register, occasion_noun, host_noun, celebrant_noun, celebrant_shape) ·
`enabled_surfaces` · `onboarding_flow_key` · `role_set_key` · 6 pack keys (all NULL except wedding) ·
`marketplace_enabled` · `event_class` · `layer_mode` · `multi_day`.

**The five owner-approved fields (`guest_word · gifts_mode · team_first · look_set · camera_default`)
— NOT FOUND in any migration or in `lib/event-type-profile.ts`.** 0 of 5 built. Roles + default groups
per type: 0 of 17 beyond wedding (see §2).

| Type | organizer_noun / event_word | role_set_key (seeded) | Notable surfaces |
|---|---|---|---|
| wedding | couple / wedding | `wedding` (→ `wedding_muslim` when ceremony_type muslim) | all 11 incl. save_the_date, monogram |
| debut | celebrant / debut | generic | no STD, no monogram |
| christening | host / christening ("Godparents" tier) | generic | 〃 |
| birthday | celebrant / birthday | generic | 〃 |
| graduation | graduate / graduation | generic | 〃 |
| gender_reveal · celebration · reunion · anniversary · tournament | host/celebrant / own word | generic | 〃 |
| corporate | organizer / **event** | generic | 〃 |
| gala_night | organizer / gala | generic | 〃 |
| travel | organizer / trip | generic | no seating/livestream/song; roaming, multi-day |
| date · hangout | host / date · hangout | generic | no seating/livestream/song; `person_b` NULL |
| simple_event | host / event | `simple` | no rsvp, no budget; marketplace off |
| wake | family / wake · register **solemn** · occasion **gathering** | **NULL** → generic | no STD; `WAKE_PROFILE` code fallback keeps it solemn |

---

## 1. The matrix — type × surface

Legend: **OK** · **LEAK** (wedding / celebratory words or parts reach this type) · **MISS** (the owner
asked for something per type that does not exist) · *part* (partly right).

| Surface ↓ / Type → | Wedding | Birthday | Hangout · Date | Get-together (simple_event) | Wake | Corporate | Debut | Christening | Others¹ |
|---|---|---|---|---|---|---|---|---|---|
| Picker + photo | OK | OK | OK | *part* (label "Simple Event") | **MISS** photo | OK | *part* (folded for adults) | *part* (folded) | OK |
| Onboarding flow | own flow | generic + type Qs | **LEAK** party quiz² | name+date only | *part* — 3 leaks³ | generic + "Which business?" | generic + type Qs | generic + type Qs | generic (gala: no Qs) |
| 7 essentials (photo·look·who-replies·guests) | *part* | **MISS** | **MISS** | **MISS** | **MISS** | **MISS** | **MISS** | **MISS** | **MISS** |
| Hub stages | OK | OK (no STD) | OK | **LEAK** RSVP shown though profile has none⁴ | OK (STD skipped: `solemnAdjustedPhase`) | OK | **MISS** court scene | **MISS** godparents | OK |
| Hub words | OK | **LEAK** sides⁵, money dance⁶ | **LEAK** 〃 | **LEAK** 〃 | **LEAK** sides, "E-Gifts" title, 🎉 arrival⁷ | **LEAK** sides, money dance, "invites you to celebrate" | **LEAK** 〃 | **LEAK** 〃 | **LEAK** 〃 |
| Maker (host) | OK | **LEAK** "Our Love Story" page + empty scene⁸, "your monogram"⁹ | 〃 | 〃 | 〃 + STD stage guests can't reach | 〃 | 〃 | 〃 | 〃 |
| Guest roles | OK (24) | *part* generic 6 | **LEAK** celebrant/vip/family/helper (asked: host·guest) | OK (guest) | **LEAK** "Celebrant" offered; **MISS** family of the departed, pallbearers | **MISS** speaker·staff·attendee | **MISS** court (roses·candles·treasures) | **MISS** godparents | *part* generic |
| Default groups | **LEAK**-ish (Officiant ok here) | **LEAK** Officiant; **MISS** per-type | 〃 | 〃 | **LEAK** Officiant; **MISS** Family·Friends·Parish·Work·Other | **MISS** Team·Client·Partner·Press·Other | 〃 | 〃 | 〃 |
| Sides (dashboard) | OK | **LEAK**¹⁰ | **LEAK** | **LEAK** | **LEAK** | **LEAK** | **LEAK** | **LEAK** | **LEAK** |
| +1s | OK | OK | OK | OK | OK | OK | OK | OK | OK |
| RSVP words | OK | OK | OK | n/a | OK "Will be there / Unable to come" | *part* "Will you celebrate with us?" | OK | OK | OK |
| Check-in / arrival | OK | **LEAK** side on desk | 〃 | 〃 | **LEAK** side + "So glad you made it" 🎉¹¹ | **LEAK** side; "Only the couple…" error¹² | 〃 | 〃 | 〃 |
| Ticket / "You're joining us as" | OK | **LEAK** "· Both sides" | 〃 | 〃 | **LEAK** 〃 | **LEAK** 〃 | 〃 | 〃 | 〃 |
| Your Team | OK | **LEAK** Bridal car, Rings, Marriage papers, Honeymoon¹³ | 〃 | n/a (marketplace off) | **LEAK** photobooth / mobile bar etc. still open; OK has funeral home | **LEAK** cards; OK AV in checklist | 〃 | 〃 | 〃 |
| Your Team copy | OK | **LEAK** "for your wedding"¹⁴ | 〃 | 〃 | **LEAK** | **LEAK** | 〃 | 〃 | 〃 |
| Papic / face default | OK (face off) | *part* not MINOR_HEAVY¹⁵ | OK | OK | **MISS** camera "quiet" (family review) | OK | OK (MINOR_HEAVY) | OK (MINOR_HEAVY) | *part* (graduation, gender_reveal not MINOR_HEAVY) |
| Papic challenges | OK | OK | OK | OK | **LEAK** dance/"First On The Floor"/Budots pass `fitsEventType`¹⁶ | OK | OK | OK | OK |
| Prints | OK | **LEAK** table sign "Scan to visit our wedding"¹⁷ | 〃 | 〃 | **LEAK** "The celebration of" + same sign; all pieces offered | 〃 | 〃 | 〃 | 〃 |
| Emails | OK | **LEAK** footer "Filipino wedding planning" (fix in open PR #6199), supplier invite "planning their wedding"¹⁸ | 〃 | 〃 | **LEAK** 〃; anniversary mail correctly off | 〃 | 〃 | 〃 | 〃 |
| E-Gifts (guest) | OK | **LEAK** "digital money dance" | 〃 | 〃 | OK "A gift of sympathy" (card title still "E-Gifts") | **LEAK** (concept: no gifts for corporate) | 〃 | 〃 | 〃 |
| E-Gifts (host) | OK | **LEAK** host page title "The digital money dance"; newlywed message templates¹⁹ | 〃 | 〃 | **LEAK** 〃 — "starting our life together" offered to a bereaved family | 〃 | 〃 | 〃 | 〃 |
| Dress code | OK (per role/group; INC + Muslim advisories) | OK generic | OK | OK | **MISS** sober/dark advisory (falls back to "Dress with us") | OK | OK | OK | OK |
| AI tier | A | ✓ | ✓ | ✓ | C (offer-at-all is open) | ✓ | ✓ | ✓ | ✓ (`AI_TIER_BY_EVENT_TYPE` covers 17) |

¹ Others = graduation · gender_reveal · anniversary · reunion · gala_night · celebration · tournament · travel.

### Footnotes (file · symbol)

2. `lib/onboarding/type-questions.ts` `PER_TYPE_QUESTIONS` has no date/hangout/gala_night entry → generic quiz
   "About how many guests?", "Grand & full-house — the more the merrier" (`lib/onboarding/generic-content.ts`).
3. Wake onboarding: `generic-onboarding.tsx` placeholder `` `e.g. ${label} of the Year` `` → "Wake of the Year";
   `app/onboarding/_shared/services-step.tsx` never checks `register` → "right through to your wake",
   "Papic is live on this wake", "Your memories are already being kept". Short form: "Our celebration".
   Intro/quiz/reveal/closing ARE solemn (`const solemn = register === 'solemn'`).
4. The hub reads only `website` and `seating` from `enabled_surfaces`; `rsvp`, `day_of`, `gallery`,
   `schedule`, `livestream` are never read by the hub (stages come from `getLifecyclePhase` + `STAGE_SCENES`).
5. `app/[slug]/_components/site-body.tsx` `sideLabel` — "Bride's side / Groom's side / Both sides", no type
   check; `guests.side` is NOT NULL so every guest gets one; also `hideable-widget-render.tsx` `Detail label="Side"`.
   `resolveWeddingOnlyParts().side_labels` exists but nothing reads it.
6. `guest-doorway-strip.tsx` `GiftDoorCard` and `app/[slug]/hub/page.tsx` "The digital money dance — straight
   to …"; `app/[slug]/pabuya/page.tsx` "The pabuya · digital money dance" (solemn arm only).
7. `app/[slug]/_components/arrival-greeting.tsx` `ArrivalGreeting` "So glad you made it." (party-popper, via
   `your-seat-block.tsx`); `seat/_components/arrival-bloom.tsx` "So glad you made it!".
8. `lib/maker-guest-pages.ts` `guestBarForStage` passes `hasStory: true` constant; trigger
   `populate_default_invitation_widgets` seeds `our_love_story` for every event; `lib/maker-scene-list.ts`
   `MAKER_EMPTY_DRAWN` draws "Empty — add your story."
9. `lib/public-site-pages.ts` `PUBLIC_SITE_PAGES` — "your monogram", "The live wedding-day surface";
   `editorial/data.ts` fallback `'The Wedding'`.
10. `guest-card-body.tsx` `SIDE_LABELS`, `guest-list-multiselect.tsx` `SideChipEditor` + "Assign side…",
    `lib/roster-arrangement.ts` `'side'` ArrangeKey, `mobile-guest-carousel.tsx` `SegRow label="Side"`,
    `groups-sidebar.tsx` `TEAM_SIDE_LABELS` ("Team Bride/Groom"), `checkin-desk.tsx` own `SIDE_LABELS`.
    The add forms are correct (`eventHasSides` in `lib/guest-side-question.ts`) — reuse that gate everywhere.
11. See 7. The hub's own seat chip already avoids it for wakes — two surfaces disagree.
12. `checkin/actions.ts` "Only the couple or a coordinator can check guests in."; `mobile-guest-carousel.tsx`
    hint "Wedding party, sponsors, family…".
13. `lib/vendors-plan-budget.ts` `const orderedGroups = [...PLAN_GROUPS]` — no type filter.
    Two same-named functions: `lib/plan-groups-by-event-type.ts` (DB `applicable_event_types`, used only by
    `event-dashboard.tsx` counts) vs `lib/wedding-plan-groups.ts` (only `eventTypes` field, set by 3 funeral
    cards; used by Services page, `lib/event-costs.ts`, `lib/upcoming-items.ts`). Migration
    `20271174521331_a_wake_has_its_own_suppliers.sql` deferred "hide celebration services from a wake".
14. `accordion-lock.tsx` "holds for your wedding date", `cancel-booking-button.tsx`, `category-search-overlay.tsx`
    "Your wedding is close", `vendors/categories/page.tsx`, `unlock-categories-list.tsx`.
15. `lib/papic-face-mode.ts` `MINOR_HEAVY_EVENT_TYPES = ['christening', 'debut']`. All types default
    `papic_face_mode = 'mode_b'` (tagging off), so the list only adds an admin confirmation. No
    `camera_default` anywhere.
16. `lib/papic-challenge-pool.ts` `fitsEventType` — dance/selfie/food blocks open to any type. (Board-build SQL
    filter not checked.)
17. `lib/print-seating-pack.ts` "Scan to visit our wedding"; `seating/print/route.ts` fallback `'Our Wedding'`;
    `lib/print-set.server.ts` `eyebrow: isWedding ? 'The wedding of' : 'The celebration of'`;
    `lib/print-pieces.ts` no type gate.
18. `lib/email-template.ts` footer "Setnayan · Filipino wedding planning + verified vendors" (still on main —
    PR #6199 carries the owner's new line, OPEN at time of audit); `lib/email.ts` `sendVendorInviteEmail`
    "is planning their wedding on…"; `lib/daily-email-jobs.ts` fallback `'your wedding'`;
    `lib/vendor-email-triggers.ts` "Real Wedding Story". Latent (off / uncalled): `buildInvitationGuestEmail`
    "celebrate with them" + `'Our wedding'`, `guest-reminder-emails-core.ts` "The couple" (flag off).
19. `app/dashboard/[eventId]/pabuya/page.tsx` `PageMasthead title="The digital money dance"`;
    `lib/pabuya-message.ts` `PABUYA_TEMPLATES` ("our new home", "starting our life together", "dance with us");
    `studio/page.tsx` blurb "digital money dance". `sponsors/page.tsx` ("Ninong & ninang") reachable by URL for
    any type (only Muslim redirected).

---

## 2. Guest list — roles and groups in detail

- `resolveRoleSet` (`lib/role-sets.ts`): NULL / `generic` / unknown → `GENERIC_ROLE_SET` = celebrant, guest,
  host, vip, family, helper. `ROLE_SETS` has only wedding · wedding_muslim · generic · simple.
- **Wake (role_set_key NULL)** is offered **"Celebrant"** first, filed under the "Celebrant" heading
  (`ROLE_GROUP_LABELS.honoree`, `lib/role-groups.ts`) and seated in "Guests of honor".
- The `guest_role` enum (`ROLE_LABELS`, `lib/guests.ts`) has **no** pallbearer, speaker, staff, attendee,
  court/rose/candle/treasure, godparent value → per-type roles need an enum migration
  (`ALTER TYPE … ADD VALUE`, no BEGIN/COMMIT) + `ROLE_LABELS`, `ROLE_TO_GROUP`, `ROLE_IMPORTANCE`, a `ROLE_SETS` entry.
- Pattern to copy: `HOST_ROLES_BY_EVENT_TYPE` (`lib/host-roles.ts`) already does per-type **co-host** roles
  (wake has no celebrant there).
- **Default groups:** `GROUP_OPTIONS = ['family','friends','work','school','officiant','other']` duplicated in
  `guests/new/page.tsx` and `guest-card-body.tsx`; neither reads the type. Move to the profile.
- 2026-09-14 row still stands: Debut and Christening roles are **the owner's to state** — "must not be
  invented". The 2026-09-30 row gives birthday/wake/corporate/hangout/date sets verbatim; debut "court" and
  christening "godparents" are named but not enumerated.

---

## 3. Religion / rite

**Known rites (18):** `events.ceremony_type` CHECK — catholic, civil, inc, christian, muslim, cultural,
chinese, jewish, born_again, mixed, aglipayan, lds, sda, jw, hindu, sikh, buddhist, orthodox
(`20261120000000_faith_worldwide_expansion.sql`); `faith_vocab` title-case mirror for the marketplace.
**Active:** catholic, civil, christian, inc, muslim, cultural, chinese, born_again. **Coming soon:** jewish +
the 8 of the worldwide expansion. `mixed` has no launch row.

**Where picked:** only `/onboarding/wedding` faith chips (the only place that honours launch status via
`fetchActiveCeremonyTypes`). Create-event has no faith picker; non-weddings store `ceremony_type = null`.
Details (`governed-fields.tsx` `CEREMONY_OPTIONS`) and date flow (`four-question-flow.tsx`) list all 18 and
**bypass the launch gate**.

| Rite | Guide (/paperwork `WEDDING_TRADITIONS_GUIDE`) | Checklist | Schedule | Dress advisory | Supplier filter | Hub |
|---|---|---|---|---|---|---|
| Catholic | OK | OK (Pre-Cana, banns, sponsors) | **dead**²⁰ | — | OK + parish officiant | — |
| Civil | OK | *part* — Ninong/Ninang, cord/veil still seeded | dead | — | OK + registrar | — |
| INC | OK (modest, one non-member sponsor pair, no entourage) | *part* — candle/veil/cord + entourage tasks still seeded | dead | **OK** `MODEST_GUIDANCE.inc` | OK + `inc_chapel` | — |
| Muslim (Nikah) | OK (wali, mahr, witnesses, halal) | OK + `NikahEssentialsCard` on Home; `MUSLIM_ROLE_SET` | dead | **OK** + gender-separation note | OK + mosque imam | — |
| Chinese (tea ceremony) | OK (tea order, lucky date, red) | universal only | dead | — | OK | **OK** `TeaCeremonyCard` + serving-order page + table-4 warning |
| Christian / Born Again / Cultural | OK | *part* (Catholic sponsor tasks) | dead | — | OK | — |
| Jewish, Aglipayan, Orthodox, LDS, SDA, JW, Hindu, Sikh, Buddhist (coming soon) | OK | *part* (Ninong, cord/veil; Aglipayan/Orthodox miss parish/banns — `isChurchCeremony` Catholic-only) | dead | — (LDS modest, Sikh head covering only in guide) | OK | — |
| Mixed | generic (+2nd guide only if Chinese) | Pre-Cana dropped even with a Catholic side | dead | — | *part* (one rite kept) | — |

20. `buildScheduleSeed` (`CEREMONY_PARTS`, `INC_RECEPTION_PARTS`, `TEA_CEREMONY_PART`) is imported in
    `schedule/actions.ts` but **never called** (`seedDefaultScheduleBlocks` deleted 2026-09-03). Empty wedding
    schedules fill from `SCHEDULE_TEMPLATES` — same for every faith, with "Cocktail hour" and
    "Dancing & open floor" for INC / Muslim / LDS / SDA couples.

**Religion gaps**
- **Onboarding promises what nothing does:** `faith-registry.ts` says Muslim couples get "pre-set halal
  catering" and INC receptions "pre-set alcohol-free"; `PrefChip` is never rendered, halal saved only if tapped.
- **Ninong/Ninang to faiths that don't use them:** `invite_sponsors`, `sponsors`, `choose_secondary_sponsors`
  skipped only for `isMuslimCeremony`; `sponsors/page.tsx` shows INC 4 pairs + cord/veil/coin (guide says one pair).
- **Mixed loses a rite:** `deriveMixedColumns` stores `mixed` + one secondary; `isIncCeremony`,
  `isMuslimCeremony` and the modest-dress note read only the primary.
- **Raw keys on screen:** `CEREMONY_TYPE_READABLE_LABEL` (`wedding-plan-groups.ts`) has 8 entries → chip prints
  "born_again", "hindu"…
- **Non-wedding religion is captured and ignored:** wake specialty `rite_type` (catholic_mass, inc_service,
  muslim_rite…) is read by nothing; `WAKE_TEMPLATE` is one 7-day runway for all (nothing for Muslim janazah /
  burial within 24h; "service or mass"); `pasiyam_start` help text promises "We will keep the nine in your
  schedule" — nothing reads it; babang luksa not found. `CHRISTENING_TEMPLATE` is Catholic-only even for
  `rite_type = infant_dedication`. `buildCoupleFaithSet` returns empty for non-weddings (no supplier narrowing).
- **Profiles can't hold most rites:** `users.religion` / `dependents.religion` allow only catholic, muslim,
  inc, christian, other.
- **Dead code:** `faith-rites.ts` `RITE_LADDER` (no importers), `notifyWhenWeddingTypeLaunches` (no callers).
- `wedding_tradition_items` is unseeded until an admin runs "load starter" (/paperwork falls back to the code guide).

---

## 4. Prioritized fix list

Order per DECISION_LOG 2026-09-30 **"BUILD ORDER FOR THE SIMPLIFICATION"**: (1) Wedding + simple types
(Birthday, Hangout, Date, Get-together) → (2) Wake + Corporate → (3) the rest. Always extend the existing
piece (`event_type_profiles`, `EventWords`, `eventHasSides`, `HOST_ROLES_BY_EVENT_TYPE`); never a second
registry. Items map to the Oct-1 cloud prompts G1 (tier 1) and G5 (tiers 2–3).

### Tier 1 — Wedding + Birthday · Hangout · Date · Get-together (G1)
1. **Add the five profile fields** on `event_type_profiles` (`guest_word`, `gifts_mode`, `team_first`,
   `look_set`, `camera_default`) with code fallbacks in `lib/event-type-profile.ts`; seed values from the
   approved concept's matrix M. Nothing else in this list can read them until this lands.
2. **Sides only where the type has two principals** — gate every side surface (footnotes 5, 10) on the
   existing `eventHasSides(roleSet)` / `resolveWeddingOnlyParts().side_labels`. Biggest single leak: every
   non-wedding guest reads "· Both sides".
3. **Gift words from `gifts_mode`**, not a wedding constant — `GiftDoorCard`, hub/page, pabuya pages (guest +
   host masthead), studio blurb, `PABUYA_TEMPLATES` filtered per mode.
4. **Per-type role sets + default groups** for birthday (celebrant·host·family·guest), hangout/date
   (host·guest), simple_event (keep guest); move `GROUP_OPTIONS` onto the profile (birthday
   Family·Friends·Classmates·Work·Other; "Officiant" wedding-only).
5. **Onboarding engine essentials** — photo, look/theme, who-can-reply, guests are missing from the generic and
   simple flows; Yes/No list lacks logo · questions · gifts. Give date/hangout their own short set (concept H1:
   four cards) instead of the party quiz.
6. **Maker leaks** — `hasStory: true` constant, empty love-story scene, "your monogram", "wedding-day surface"
   blurbs.
7. **Your Team filter** — make `vendors-plan-budget.ts` / `wedding-plan-groups.ts` honour
   `applicable_event_types` (collapse the two same-named `planGroupsForEventType`); de-wedding the five Your
   Team strings (footnote 14).
8. **Prints + emails** — table sign "Scan to visit our wedding", `'Our Wedding'` fallback, supplier invite
   "planning their wedding", "Real Wedding Story"; land #6199's footer.
9. **Simple event label** — rename vocab label to **"Get-together"** (owner concept item 2; data only).
10. **Wedding religion wiring (wedding is tier 1):** revive or delete `buildScheduleSeed` so INC/Muslim don't
    get Cocktail hour / Dancing / Money dance; stop seeding sponsor/cord/veil tasks for INC/Civil/JW/LDS/etc.;
    honour the launch gate in Details + date flow; fix `CEREMONY_TYPE_READABLE_LABEL`; halal / alcohol-free
    promises either render (`PrefChip`) or are removed; mixed weddings keep both rites.

### Tier 2 — Wake + Corporate (G5)
11. **Wake photo** — add `public/event-types/wake.webp` (or admin `hero_photo_url`).
12. **Wake role set** — set `role_set_key`, add enum values family-of-the-departed / pallbearer; no
    "Celebrant"; groups Family·Friends·Parish·Work·Other.
13. **Wake solemn sweep** — `ArrivalGreeting` + `arrival-bloom` quiet arm; "E-Gifts" card title → abuloy;
    services-step solemn copy; "Wake of the Year" placeholder; printed eyebrow "The celebration of" →
    in-memoriam wording; Maker's unreachable STD stage; Papic challenge pool excludes dance/party blocks;
    `camera_default = quiet`; a sober dress-code advisory; hide celebration categories (photobooth, mobile bar…)
    from a wake's Your Team (the deferred half of `20271174521331`).
14. **Wake religion** — read `rite_type`: Muslim janazah (burial within 24h, short runway), INC service,
    Catholic mass + pasiyam (the promised "nine in your schedule") ; babang luksa stays a separate event.
15. **Corporate** — `guest_word = attendees`; roles host·speaker·VIP·staff·attendee (enum values needed);
    groups Team·Client·Partner·Press·Other; company name + logo in onboarding/hub (event FOR a business
    pre-fills from the shop); `gifts_mode = none`; RSVP "Will you celebrate with us?" / "invites you to
    celebrate" → neutral.

### Tier 3 — the rest (reuse the patterns)
16. **Debut** court scene + roles (roses·candles·treasures) and **Christening** godparent roles — ⚠ the
    2026-09-14 row says these roles are the owner's to state; ask for the list, do not invent.
17. **Christening** checklist by `rite_type` (infant dedication ≠ Catholic baptism).
18. **Anniversary / Date** two-person shape (`person_b` NULL today → one name, no Story; concept allows Story
    for a renewal).
19. **gala_night** own type questions; tournament guest_word players + registration; travel travellers +
    ambag; reunion ambag + batch groups.
20. **MINOR_HEAVY** — consider birthday (kids), gender_reveal, graduation per concept ("Turning 7th/kids →
    Camera quiet + face opt-in") — needs owner yes.
21. **simple_event hub** shows RSVP though its profile has none — make the hub read `rsvp` / `day_of` /
    `gallery` / `livestream` from `enabled_surfaces`.
22. Religion housekeeping: widen `users.religion` / `dependents.religion` to all 18; delete or wire
    `RITE_LADDER` and `notifyWhenWeddingTypeLaunches`; seed `wedding_tradition_items` or keep code guide as
    source of truth (one, not both).

### Owner questions this audit surfaces (not decided here)
- Debut court roles and Christening godparent roles — the exact list (2026-09-14: "must not be invented").
- Birthday / gender reveal / graduation as MINOR_HEAVY (face opt-in by default)?
- Setnayan AI offered to a wake at all (tier C today; code comment leaves it open)?
- Papic on a wake stays offered (2026-08-24 "offer Papic everywhere") — with camera "quiet"?
